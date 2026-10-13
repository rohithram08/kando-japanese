import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, sql } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { db } from '../db/index.js';
import { userReadingProgress, users } from '../db/schema.js';
import { recordActivity } from '../services/streakService.js';

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
readingRouter.post(
  '/progress',
  requireAuth,
  validate(saveProgressSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { storyId, lastSentenceIndex, status = 'in_progress', quizScore } = req.body;
      const now = new Date();
      let todayStr = now.toISOString().split('T')[0];
      try {
        const tz = (req.headers?.['x-timezone'] as string) || 'UTC';
        todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(now);
      } catch {
        todayStr = now.toISOString().split('T')[0];
      }

      // Check existing to see if already completed
      const existing = await db.query.userReadingProgress.findFirst({
        where: and(
          eq(userReadingProgress.userId, userId),
          eq(userReadingProgress.storyId, storyId),
        ),
      });

      const wasAlreadyCompleted = existing?.status === 'completed';
      const isCompletingNow = status === 'completed';

      const progressId = existing ? existing.id : uuidv4();
      const completedAt = isCompletingNow
        ? (existing?.completedAt || now)
        : existing?.completedAt || null;

      await db
        .insert(userReadingProgress)
        .values({
          id: progressId,
          userId,
          storyId,
          status,
          lastSentenceIndex,
          quizScore: quizScore !== undefined ? quizScore : (existing?.quizScore ?? 0),
          completedAt,
          createdAt: now,
          updatedAt: now,
        })
        .onDuplicateKeyUpdate({
          set: {
            status: isCompletingNow ? 'completed' : sql`values(${userReadingProgress.status})`,
            lastSentenceIndex,
            quizScore: quizScore !== undefined ? quizScore : sql`${userReadingProgress.quizScore}`,
            completedAt: isCompletingNow
              ? sql`coalesce(${userReadingProgress.completedAt}, ${now})`
              : sql`${userReadingProgress.completedAt}`,
            updatedAt: now,
          },
        });

      // Award XP if completed for the first time
      let xpAwarded = 0;
      if (isCompletingNow && !wasAlreadyCompleted) {
        xpAwarded = 50 + Math.round((quizScore ?? 100) * 0.25); // 50 base XP + up to 25 bonus
        await db
          .update(users)
          .set({
            xpPoints: sql`${users.xpPoints} + ${xpAwarded}`,
          })
          .where(eq(users.id, userId));

        // Record streak
        await recordActivity(userId, todayStr);
      }

      // Fetch the updated record
      const updated = await db.query.userReadingProgress.findFirst({
        where: and(
          eq(userReadingProgress.userId, userId),
          eq(userReadingProgress.storyId, storyId),
        ),
      });

      res.json({
        progress: updated,
        xpAwarded,
      });
    } catch (err) {
      next(err);
    }
  }
);
