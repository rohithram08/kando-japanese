import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, ne, sql } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { db } from '../db/index.js';
import { userReadingProgress, users } from '../db/schema.js';
import { recordActivity, resolveTimezone, getLocalDateString } from '../services/streakService.js';
import { calculateStoryRewards, getJLPTLevel, getUserLevel } from '../services/progressCalculator.js';
import { assertContentUnlocked } from '../services/levelService.js';
import { recordXpEvent } from '../services/xpLedger.js';

export const readingRouter = Router();

const saveProgressSchema = z.object({
  body: z.object({
    storyId: z.string().min(1, 'Story ID is required'),
    lastSentenceIndex: z.number().int().min(0, 'Sentence index must be >= 0'),
    status: z.enum(['in_progress', 'completed']).optional(),
    quizScore: z.number().min(0).max(100).optional(),
  }),
});

// ─── GET /api/reading/progress ────────────────────────────────────────────────
readingRouter.get('/progress', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const progressList = await db.query.userReadingProgress.findMany({
      where: eq(userReadingProgress.userId, userId),
    });

    res.json({ progress: progressList });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/reading/progress/:storyId ──────────────────────────────────────
readingRouter.get('/progress/:storyId', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { storyId } = req.params;

    const record = await db.query.userReadingProgress.findFirst({
      where: and(
        eq(userReadingProgress.userId, userId),
        eq(userReadingProgress.storyId, storyId),
      ),
    });

    if (!record) {
      return res.json({
        progress: {
          storyId,
          status: 'not_started',
          lastSentenceIndex: 0,
          quizScore: null,
          completedAt: null,
        },
      });
    }

    res.json({ progress: record });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/reading/progress ─────────────────────────────────────────────
//
// Single, server-authoritative path for Graded Reader progress & rewards.
//
//  • status 'in_progress'  → saves the reading position only (never downgrades a
//                            story that is already completed).
//  • status 'completed'    → the learner finished the story AND its quiz.
//      - Wave XP (story + quiz) is paid exactly once per story. The row is
//        claimed with a conditional UPDATE (status <> 'completed'), so refreshes,
//        double-submits, retakes and parallel tabs can never pay twice.
//      - Jelly Streak is credited for the learner's local calendar day on EVERY
//        completion (pass or fail). recordActivity is idempotent per day, so
//        several stories on the same day still count as one streak day.
//      - quizScore keeps the best score.
function affectedRows(result: unknown): number {
  const header: any = Array.isArray(result) ? result[0] : result;
  return Number(header?.affectedRows ?? header?.rowsAffected ?? 0);
}

readingRouter.post(
  '/progress',
  requireAuth,
  validate(saveProgressSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { storyId, lastSentenceIndex, status = 'in_progress', quizScore } = req.body;
      await assertContentUnlocked(userId, storyId);
      const now = new Date();
      const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
      const todayStr = getLocalDateString(now, tz);

      const existing = await db.query.userReadingProgress.findFirst({
        where: and(
          eq(userReadingProgress.userId, userId),
          eq(userReadingProgress.storyId, storyId),
        ),
      });

      const wasAlreadyCompleted = existing?.status === 'completed';
      const isCompletingNow = status === 'completed';
      const score = Math.max(0, Math.min(100, Math.round(quizScore ?? 0)));

      // 1) Persist reading position. Never downgrade an already-completed story.
      const baseStatus = wasAlreadyCompleted ? 'completed' : 'in_progress';
      await db
        .insert(userReadingProgress)
        .values({
          id: existing ? existing.id : uuidv4(),
          userId,
          storyId,
          status: baseStatus,
          lastSentenceIndex,
          quizScore: existing?.quizScore ?? 0,
          completedAt: existing?.completedAt || null,
          createdAt: now,
          updatedAt: now,
        })
        .onDuplicateKeyUpdate({
          set: {
            lastSentenceIndex,
            updatedAt: now,
          },
        });

      let storyXp = 0;
      let quizXp = 0;
      let firstCompletion = false;
      let streakRecorded = false;
      let streakDays: number | undefined;
      let isFirstActivityToday = false;

      if (isCompletingNow) {
        // 2) Best quiz score on every submission (retakes can only improve it).
        await db
          .update(userReadingProgress)
          .set({ quizScore: sql`greatest(coalesce(${userReadingProgress.quizScore}, 0), ${score})` })
          .where(and(eq(userReadingProgress.userId, userId), eq(userReadingProgress.storyId, storyId)));

        // 3) Atomically claim the one-time completion reward.
        if (!wasAlreadyCompleted) {
          const claim = await db
            .update(userReadingProgress)
            .set({ status: 'completed', completedAt: now })
            .where(
              and(
                eq(userReadingProgress.userId, userId),
                eq(userReadingProgress.storyId, storyId),
                ne(userReadingProgress.status, 'completed'),
              ),
            );
          firstCompletion = affectedRows(claim) > 0;
        }

        if (firstCompletion) {
          const rewards = calculateStoryRewards(score);
          storyXp = rewards.storyXp;
          quizXp = rewards.quizXp;
          await db
            .update(users)
            .set({ xpPoints: sql`${users.xpPoints} + ${rewards.total}` })
            .where(eq(users.id, userId));
          await recordXpEvent(userId, storyXp, 'reading', { refId: storyId });
          await recordXpEvent(userId, quizXp, 'reading_quiz', { refId: storyId });
        }

        // 4) Jelly Streak for today — completion of the quiz is what counts.
        const streak = await recordActivity(userId, todayStr, {
          timezone: tz,
          isLesson: firstCompletion,
          xp: storyXp + quizXp,
        });
        streakRecorded = true;
        streakDays = streak?.currentStreak;
        isFirstActivityToday = Boolean(streak?.isFirstActivityToday);
      }

      const xpAwarded = storyXp + quizXp;

      // 5) Keep level in sync with the Wave XP balance.
      let totalXP: number | undefined;
      let userLevel: number | undefined;
      if (isCompletingNow) {
        const updatedUser = await db.query.users.findFirst({ where: eq(users.id, userId) });
        totalXP = updatedUser?.xpPoints ?? 0;
        userLevel = getUserLevel(totalXP);
        const jlpt = getJLPTLevel(totalXP);
        if (updatedUser && updatedUser.currentLevel !== jlpt.level) {
          await db.update(users).set({ currentLevel: jlpt.level }).where(eq(users.id, userId));
        }
        streakDays = updatedUser?.streakDays ?? streakDays;
      }

      const updated = await db.query.userReadingProgress.findFirst({
        where: and(
          eq(userReadingProgress.userId, userId),
          eq(userReadingProgress.storyId, storyId),
        ),
      });

      res.json({
        progress: updated,
        xpAwarded,
        rewards: {
          storyXp,
          quizXp,
          totalXp: xpAwarded,
          firstCompletion,
          alreadyCompleted: isCompletingNow && !firstCompletion,
        },
        streak: isCompletingNow
          ? { recorded: streakRecorded, days: streakDays ?? 0, firstActivityToday: isFirstActivityToday }
          : undefined,
        totalXP,
        userLevel,
      });
    } catch (err) {
      next(err);
    }
  }
);
