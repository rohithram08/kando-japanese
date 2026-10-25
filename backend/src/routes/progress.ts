import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { db } from '../db/index.js';
import {
  users,
  userLessonProgress,
  userKanjiProgress,
  userVocabularyProgress,
  userGrammarProgress,
  userReadingProgress,
  srsCards,
  userStreaks,
  userBadges,
  senseiConversations,
  senseiTourProgress,
} from '../db/schema.js';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';
import {
  calculateStreak,
  recordActivity,
  getLocalDateString,
  getPreviousDayString,
  resolveTimezone,
} from '../services/streakService.js';
import {
  getJLPTLevel,
  getUserLevel,
  calculateLessonXP,
  calculateQuizXP,
  calculateSRSReviewXP,
  calculateStreakBonus,
  ALL_BADGES,
  XP_REWARDS,
} from '../services/progressCalculator.js';
import { isValidLessonId } from '../services/lessonContentService.js';
import { isValidGrammarId } from '../services/grammarContentService.js';
import { assertContentUnlocked } from '../services/levelService.js';

export const progressRouter = Router();

interface AwardedBadge {
  id: string;
  userId: string;
  badgeType: string;
  badgeName: string | null;
  awardedAt: Date;
}

/**
 * Helper to check and award badges for a user.
 */
async function checkAndAwardUserBadges(
  userId: string,
  stats: {
    lessonsCompleted: number;
    kanjiLearned: number;
    vocabLearned: number;
    streak: number;
    totalXP: number;
    cardsReviewed?: number;
    cardsMastered?: number;
  }
): Promise<AwardedBadge[]> {
  const existingBadges = await db.query.userBadges.findMany({
    where: eq(userBadges.userId, userId),
  });

  const existingTypes = new Set(existingBadges.map((b) => b.badgeType));
  const newlyEarned = ALL_BADGES.filter((b) => !existingTypes.has(b.id) && b.check(stats));

  const awarded: AwardedBadge[] = [];

  for (const b of newlyEarned) {
    const badgeId = uuidv4();
    const now = new Date();
    try {
      await db.insert(userBadges).values({
        id: badgeId,
        userId,
        badgeType: b.id,
        badgeName: b.name,
      });

      awarded.push({
        id: badgeId,
        userId,
        badgeType: b.id,
        badgeName: b.name,
        awardedAt: now,
      });
    } catch {
      // Ignore unique constraint collision if concurrent
    }
  }

  return awarded;
}

const getProgressSummary = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user!.userId;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) throw new AppError(404, 'User not found');

    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, user.timezone || undefined);
    const today = getLocalDateString(new Date(), tz);
    const streakResult = await calculateStreak(userId, tz);

    // Query aggregated counts
    const [completedLessons, kanjiRows, vocabRows, grammarRows, masteredCards, dueCards, kanjiReviews, vocabReviews] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(userLessonProgress)
        .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.status, 'completed'))),

      db.select({ count: sql<number>`count(*)` })
        .from(userKanjiProgress)
        .where(and(eq(userKanjiProgress.userId, userId), gte(userKanjiProgress.recognitionLevel, 1))),

      db.select({ count: sql<number>`count(*)` })
        .from(userVocabularyProgress)
        .where(and(eq(userVocabularyProgress.userId, userId), gte(userVocabularyProgress.masteryLevel, 1))),

      db.select({ count: sql<number>`count(*)` })
        .from(userGrammarProgress)
        .where(and(eq(userGrammarProgress.userId, userId), sql`${userGrammarProgress.status} != 'not_started'`)),

      db.select({ count: sql<number>`count(*)` })
        .from(srsCards)
        .where(and(eq(srsCards.userId, userId), eq(srsCards.isMastered, true))),

      db.select({ count: sql<number>`count(*)` })
        .from(srsCards)
        .where(and(
          eq(srsCards.userId, userId),
          lte(srsCards.nextReviewDate, new Date(today)),
          eq(srsCards.isMastered, false)
        )),

      db.select({ total: sql<number>`coalesce(sum(${userKanjiProgress.reviewCount}), 0)` })
        .from(userKanjiProgress)
        .where(eq(userKanjiProgress.userId, userId)),

      db.select({ total: sql<number>`coalesce(sum(${userVocabularyProgress.reviewCount}), 0)` })
        .from(userVocabularyProgress)
        .where(eq(userVocabularyProgress.userId, userId)),
    ]);

    const cardsReviewed = Number(kanjiReviews?.[0]?.total ?? (kanjiReviews?.[0] as any)?.count ?? 0) +
                          Number(vocabReviews?.[0]?.total ?? (vocabReviews?.[0] as any)?.count ?? 0);
    const cardsMastered = Number(masteredCards[0]?.count || 0);
    const grammarLearned = Number(grammarRows[0]?.count || 0);

    const totalXP = user.xpPoints || 0;
    const jlptInfo = getJLPTLevel(totalXP);
    const userLevel = getUserLevel(totalXP);

    // Evaluate badges including SRS review badges
    await checkAndAwardUserBadges(userId, {
      lessonsCompleted: Number(completedLessons[0]?.count || 0),
      kanjiLearned: Number(kanjiRows[0]?.count || 0),
      vocabLearned: Number(vocabRows[0]?.count || 0),
      streak: streakResult.currentStreak,
      totalXP,
      cardsReviewed,
      cardsMastered,
    });

    const statsData = {
      totalXP,
      totalXp: totalXP,
      streakDays: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      isActiveToday: streakResult.isActiveToday,
      userLevel,
      jlptLevel: user.currentLevel || jlptInfo.level,
      lessonsCompleted: Number(completedLessons[0]?.count || 0),
      kanjiLearned: Number(kanjiRows[0]?.count || 0),
      vocabLearned: Number(vocabRows[0]?.count || 0),
      grammarLearned,
      cardsReviewed,
      cardsMastered,
      srsReviewsDue: Number(dueCards[0]?.count || 0),
    };

    res.json({
      ...statsData,
      stats: statsData,
    });
  } catch (err) {
    next(err);
  }
};

progressRouter.get('/', requireAuth, getProgressSummary);
progressRouter.get('/stats', requireAuth, getProgressSummary);

/**
 * GET /api/progress/lessons
 * Get lesson progress list for authenticated user.
 */
progressRouter.get('/lessons', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const progressList = await db.query.userLessonProgress.findMany({
      where: eq(userLessonProgress.userId, userId),
    });

    res.json({
      progress: progressList.map((p) => ({
        lessonId: p.lessonId,
        status: p.status,
        score: p.score ?? 0,
        timeSpentSeconds: p.timeSpentSeconds ?? 0,
        lastAccessedAt: p.lastAccessedAt?.toISOString() || new Date().toISOString(),
        completedAt: p.completedAt?.toISOString() || null,
      })),
    });
  } catch (err) {
    next(err);
  }
});
progressRouter.get('/lesson', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const progressList = await db.query.userLessonProgress.findMany({
      where: eq(userLessonProgress.userId, userId),
    });

    res.json({
      progress: progressList.map((p) => ({
        lessonId: p.lessonId,
        status: p.status,
        score: p.score ?? 0,
        timeSpentSeconds: p.timeSpentSeconds ?? 0,
        lastAccessedAt: p.lastAccessedAt?.toISOString() || new Date().toISOString(),
        completedAt: p.completedAt?.toISOString() || null,
      })),
    });
  } catch (err) {
    next(err);
  }
});

const lessonProgressSchema = z.object({
  body: z.object({
    lessonId: z.string().min(1),
    status: z.enum(['in_progress', 'completed']).default('completed'),
    score: z.number().min(0).max(100).default(100),
    timeSpentSeconds: z.number().int().min(0).default(0),
  }),
});

const handleLessonProgress = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user!.userId;
    const { lessonId, status, score, timeSpentSeconds } = req.body;
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const todayStr = getLocalDateString(new Date(), tz);

    if (!isValidLessonId(lessonId)) {
      throw new AppError(400, `Invalid lesson ID: ${lessonId}`, 'INVALID_LESSON_ID');
    }

    // Check if lesson was already completed by this user
    const existing = await db.query.userLessonProgress.findFirst({
      where: and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.lessonId, lessonId)
      ),
    });

    const isNewlyCompleted = status === 'completed' && (!existing || existing.status !== 'completed');
    const xpGained = isNewlyCompleted ? calculateLessonXP(score) : 0;

    // Upsert lesson progress
    await db.insert(userLessonProgress)
      .values({
        userId,
        lessonId,
        status,
        score,
        timeSpentSeconds,
        completedAt: status === 'completed' ? new Date() : null,
      })
      .onDuplicateKeyUpdate({
        set: {
          status,
          score,
          timeSpentSeconds: sql`${userLessonProgress.timeSpentSeconds} + ${timeSpentSeconds}`,
          lastAccessedAt: new Date(),
          completedAt: status === 'completed'
            ? sql`coalesce(${userLessonProgress.completedAt}, ${new Date()})`
            : sql`${userLessonProgress.completedAt}`,
        },
      });

    // Record activity in streaks
    const activityRecord = await recordActivity(userId, todayStr, {
      xp: xpGained,
      minutesStudied: Math.round((timeSpentSeconds || 0) / 60),
      isLesson: isNewlyCompleted,
      timezone: tz,
    });

    // Fetch updated streak
    const streakResult = await calculateStreak(userId, tz);
    // Award milestone streak bonus only on the first activity of the day AND only if new learning occurred (xpGained > 0)
    const isFirstActivityToday = activityRecord?.isFirstActivityToday ?? true;
    const streakBonus = (isFirstActivityToday && xpGained > 0)
      ? calculateStreakBonus(streakResult.currentStreak)
      : 0;
    const totalXpToAdd = xpGained + streakBonus;

    // Atomically increment XP only if positive XP was earned
    if (totalXpToAdd > 0) {
      await db.update(users)
        .set({
          xpPoints: sql`${users.xpPoints} + ${totalXpToAdd}`,
          streakDays: streakResult.currentStreak,
        })
        .where(eq(users.id, userId));
    } else {
      await db.update(users)
        .set({
          streakDays: streakResult.currentStreak,
        })
        .where(eq(users.id, userId));
    }

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const newTotalXP = updatedUser?.xpPoints || 0;
    const jlptInfo = getJLPTLevel(newTotalXP);
    const newUserLevel = getUserLevel(newTotalXP);

    // Auto-update JLPT level if changed
    if (updatedUser && updatedUser.currentLevel !== jlptInfo.level) {
      await db.update(users)
        .set({ currentLevel: jlptInfo.level })
        .where(eq(users.id, userId));
    }

    // Evaluate badges
    const [lessonCount, kanjiCount, vocabCount, kanjiReviews, vocabReviews, masteredCards] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(userLessonProgress)
        .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.status, 'completed'))),
      db.select({ count: sql<number>`count(*)` })
        .from(userKanjiProgress)
        .where(eq(userKanjiProgress.userId, userId)),
      db.select({ count: sql<number>`count(*)` })
        .from(userVocabularyProgress)
        .where(eq(userVocabularyProgress.userId, userId)),
      db.select({ total: sql<number>`coalesce(sum(${userKanjiProgress.reviewCount}), 0)` })
        .from(userKanjiProgress)
        .where(eq(userKanjiProgress.userId, userId)),
      db.select({ total: sql<number>`coalesce(sum(${userVocabularyProgress.reviewCount}), 0)` })
        .from(userVocabularyProgress)
        .where(eq(userVocabularyProgress.userId, userId)),
      db.select({ count: sql<number>`count(*)` })
        .from(srsCards)
        .where(and(eq(srsCards.userId, userId), eq(srsCards.isMastered, true))),
    ]);

    const cardsReviewed = Number(kanjiReviews?.[0]?.total ?? (kanjiReviews?.[0] as any)?.count ?? 0) +
                          Number(vocabReviews?.[0]?.total ?? (vocabReviews?.[0] as any)?.count ?? 0);
    const cardsMastered = Number(masteredCards[0]?.count || 0);

    const newBadges = await checkAndAwardUserBadges(userId, {
      lessonsCompleted: Number(lessonCount[0]?.count || 0),
      kanjiLearned: Number(kanjiCount[0]?.count || 0),
      vocabLearned: Number(vocabCount[0]?.count || 0),
      streak: streakResult.currentStreak,
      totalXP: newTotalXP,
      cardsReviewed,
      cardsMastered,
    });

    res.json({
      progress: {
        lessonId,
        status,
        score,
        timeSpentSeconds,
        lastAccessedAt: new Date().toISOString(),
        completedAt: existing?.completedAt ? (typeof existing.completedAt === 'string' ? existing.completedAt : existing.completedAt.toISOString()) : (status === 'completed' ? new Date().toISOString() : null),
      },
      xpResult: {
        xpGained: totalXpToAdd,
        totalXP: newTotalXP,
        newLevel: newUserLevel,
        badgesAwarded: newBadges.map((b) => ({
          id: b.id,
          badgeType: b.badgeType,
          badgeName: b.badgeName,
          awardedAt: b.awardedAt.toISOString(),
        })),
        streakDays: streakResult.currentStreak,
      },
    });
  } catch (err) {
    next(err);
  }
};

progressRouter.post('/lesson', requireAuth, validate(lessonProgressSchema), handleLessonProgress);
progressRouter.post('/lessons', requireAuth, validate(lessonProgressSchema), handleLessonProgress);


const kanjiProgressSchema = z.object({
  body: z.object({
    kanjiId: z.string().min(1, 'kanjiId is required'),
    recognitionLevel: z.number().int().min(0).max(10).default(1),
    mastered: z.boolean().optional(),
  }),
});

/**
 * GET /api/progress/kanji
 * Get kanji progress list for authenticated user.
 */
progressRouter.get('/kanji', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const kanjiList = await db.query.userKanjiProgress.findMany({
      where: eq(userKanjiProgress.userId, userId),
    });

    res.json({
      kanji: kanjiList.map((k) => ({
        userId: k.userId,
        kanjiId: k.kanjiId,
        recognitionLevel: k.recognitionLevel,
        mastered: Boolean(k.mastered),
        reviewCount: k.reviewCount ?? 0,
        lastReviewedAt: k.lastReviewedAt ? (typeof k.lastReviewedAt === 'string' ? k.lastReviewedAt : (k.lastReviewedAt as Date).toISOString()) : null,
        createdAt: typeof k.createdAt === 'string' ? k.createdAt : (k.createdAt as Date).toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/progress/kanji
 * Record or update kanji progress, calculate XP, and evaluate badges.
 */
progressRouter.post('/kanji', requireAuth, validate(kanjiProgressSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { kanjiId, recognitionLevel, mastered } = req.body;
    await assertContentUnlocked(userId, kanjiId);
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const todayStr = getLocalDateString(new Date(), tz);

    // Check if this kanji was already learned
    const existing = await db.query.userKanjiProgress.findFirst({
      where: and(eq(userKanjiProgress.userId, userId), eq(userKanjiProgress.kanjiId, kanjiId)),
    });

    const isNewlyLearned = !existing || (existing.recognitionLevel === 0 && recognitionLevel > 0);

    // Calculate XP: 15 XP for newly learned
    let xpGained = 0;
    if (isNewlyLearned) {
      xpGained = XP_REWARDS.KANJI_LEARNED;
    }

    const isMasteredVal = mastered !== undefined ? mastered : (existing ? Boolean(existing.mastered) : false);

    // Upsert kanji progress
    await db.insert(userKanjiProgress)
      .values({
        userId,
        kanjiId,
        recognitionLevel,
        mastered: isMasteredVal,
        reviewCount: 1,
        lastReviewedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          recognitionLevel,
          mastered: isMasteredVal,
          reviewCount: sql`${userKanjiProgress.reviewCount} + 1`,
          lastReviewedAt: new Date(),
        },
      });

    let newTotalXP = 0;
    let newUserLevel = 1;
    let streakDays = 0;
    let newBadges: AwardedBadge[] = [];

    // If XP gained or first study of the day, record activity
    await recordActivity(userId, todayStr, { xp: xpGained, timezone: tz });
    const streakResult = await calculateStreak(userId, tz);
    streakDays = streakResult.currentStreak;

    await db.update(users)
      .set({
        xpPoints: xpGained > 0 ? sql`${users.xpPoints} + ${xpGained}` : sql`${users.xpPoints}`,
        streakDays: streakResult.currentStreak,
      })
      .where(eq(users.id, userId));

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    newTotalXP = updatedUser?.xpPoints || 0;
    const jlptInfo = getJLPTLevel(newTotalXP);
    newUserLevel = getUserLevel(newTotalXP);

    if (updatedUser && updatedUser.currentLevel !== jlptInfo.level) {
      await db.update(users)
        .set({ currentLevel: jlptInfo.level })
        .where(eq(users.id, userId));
    }

    // Evaluate badges
    const [lessonCount, kanjiCount, vocabCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(userLessonProgress)
        .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.status, 'completed'))),
      db.select({ count: sql<number>`count(*)` })
        .from(userKanjiProgress)
        .where(and(eq(userKanjiProgress.userId, userId), gte(userKanjiProgress.recognitionLevel, 1))),
      db.select({ count: sql<number>`count(*)` })
        .from(userVocabularyProgress)
        .where(and(eq(userVocabularyProgress.userId, userId), gte(userVocabularyProgress.masteryLevel, 1))),
    ]);

    newBadges = await checkAndAwardUserBadges(userId, {
      lessonsCompleted: Number(lessonCount[0]?.count || 0),
      kanjiLearned: Number(kanjiCount[0]?.count || 0),
      vocabLearned: Number(vocabCount[0]?.count || 0),
      streak: streakDays,
      totalXP: newTotalXP,
    });

    const currentReviewCount = existing ? (existing.reviewCount ?? 0) + 1 : 1;

    res.json({
      progress: {
        userId,
        kanjiId,
        recognitionLevel,
        mastered: isMasteredVal,
        reviewCount: currentReviewCount,
        lastReviewedAt: new Date().toISOString(),
        createdAt: existing?.createdAt ? (typeof existing.createdAt === 'string' ? existing.createdAt : (existing.createdAt as Date).toISOString()) : new Date().toISOString(),
      },
      xpResult: {
        xpGained,
        totalXP: newTotalXP,
        newLevel: newUserLevel,
        badgesAwarded: newBadges.map((b) => ({
          id: b.id,
          badgeType: b.badgeType,
          badgeName: b.badgeName,
          awardedAt: b.awardedAt.toISOString(),
        })),
        streakDays,
      },
    });
  } catch (err) {
    next(err);
  }
});

const vocabularyProgressSchema = z.object({
  body: z.object({
    vocabularyId: z.string().min(1, 'vocabularyId is required'),
    masteryLevel: z.number().int().min(0).max(10).default(1),
    mastered: z.boolean().optional(),
  }),
});

/**
 * GET /api/progress/vocabulary
 * Get vocabulary progress list for authenticated user.
 */
progressRouter.get('/vocabulary', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const vocabList = await db.query.userVocabularyProgress.findMany({
      where: eq(userVocabularyProgress.userId, userId),
    });

    res.json({
      vocabulary: vocabList.map((v) => ({
        userId: v.userId,
        vocabularyId: v.vocabularyId,
        masteryLevel: v.masteryLevel,
        mastered: Boolean(v.mastered),
        reviewCount: v.reviewCount ?? 0,
        lastReviewedAt: v.lastReviewedAt ? (typeof v.lastReviewedAt === 'string' ? v.lastReviewedAt : (v.lastReviewedAt as Date).toISOString()) : null,
        createdAt: typeof v.createdAt === 'string' ? v.createdAt : (v.createdAt as Date).toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/progress/vocabulary
 * Record or update vocabulary progress, calculate XP, and evaluate badges.
 */
progressRouter.post('/vocabulary', requireAuth, validate(vocabularyProgressSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { vocabularyId, masteryLevel, mastered } = req.body;
    await assertContentUnlocked(userId, vocabularyId);
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const todayStr = getLocalDateString(new Date(), tz);

    // Check if this vocabulary was already learned
    const existing = await db.query.userVocabularyProgress.findFirst({
      where: and(eq(userVocabularyProgress.userId, userId), eq(userVocabularyProgress.vocabularyId, vocabularyId)),
    });

    const isNewlyLearned = !existing || (existing.masteryLevel === 0 && masteryLevel > 0);

    // Calculate XP: 15 XP for newly learned
    let xpGained = 0;
    if (isNewlyLearned) {
      xpGained = XP_REWARDS.VOCAB_LEARNED;
    }

    const isMasteredVal = mastered !== undefined ? mastered : (existing ? Boolean(existing.mastered) : false);

    // Upsert vocabulary progress
    await db.insert(userVocabularyProgress)
      .values({
        userId,
        vocabularyId,
        masteryLevel,
        mastered: isMasteredVal,
        reviewCount: 1,
        lastReviewedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          masteryLevel,
          mastered: isMasteredVal,
          reviewCount: sql`${userVocabularyProgress.reviewCount} + 1`,
          lastReviewedAt: new Date(),
        },
      });

    let newTotalXP = 0;
    let newUserLevel = 1;
    let streakDays = 0;
    let newBadges: AwardedBadge[] = [];

    // If XP gained or first study of the day, record activity
    await recordActivity(userId, todayStr, { xp: xpGained, timezone: tz });
    const streakResult = await calculateStreak(userId, tz);
    streakDays = streakResult.currentStreak;

    await db.update(users)
      .set({
        xpPoints: xpGained > 0 ? sql`${users.xpPoints} + ${xpGained}` : sql`${users.xpPoints}`,
        streakDays: streakResult.currentStreak,
      })
      .where(eq(users.id, userId));

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    newTotalXP = updatedUser?.xpPoints || 0;
    const jlptInfo = getJLPTLevel(newTotalXP);
    newUserLevel = getUserLevel(newTotalXP);

    if (updatedUser && updatedUser.currentLevel !== jlptInfo.level) {
      await db.update(users)
        .set({ currentLevel: jlptInfo.level })
        .where(eq(users.id, userId));
    }

    // Evaluate badges
    const [lessonCount, kanjiCount, vocabCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(userLessonProgress)
        .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.status, 'completed'))),
      db.select({ count: sql<number>`count(*)` })
        .from(userKanjiProgress)
        .where(and(eq(userKanjiProgress.userId, userId), gte(userKanjiProgress.recognitionLevel, 1))),
      db.select({ count: sql<number>`count(*)` })
        .from(userVocabularyProgress)
        .where(and(eq(userVocabularyProgress.userId, userId), gte(userVocabularyProgress.masteryLevel, 1))),
    ]);

    newBadges = await checkAndAwardUserBadges(userId, {
      lessonsCompleted: Number(lessonCount[0]?.count || 0),
      kanjiLearned: Number(kanjiCount[0]?.count || 0),
      vocabLearned: Number(vocabCount[0]?.count || 0),
      streak: streakDays,
      totalXP: newTotalXP,
    });

    const currentReviewCount = existing ? (existing.reviewCount ?? 0) + 1 : 1;

    res.json({
      progress: {
        userId,
        vocabularyId,
        masteryLevel,
        mastered: isMasteredVal,
        reviewCount: currentReviewCount,
        lastReviewedAt: new Date().toISOString(),
        createdAt: existing?.createdAt ? (typeof existing.createdAt === 'string' ? existing.createdAt : (existing.createdAt as Date).toISOString()) : new Date().toISOString(),
      },
      xpResult: {
        xpGained,
        totalXP: newTotalXP,
        newLevel: newUserLevel,
        badgesAwarded: newBadges.map((b) => ({
          id: b.id,
          badgeType: b.badgeType,
          badgeName: b.badgeName,
          awardedAt: b.awardedAt.toISOString(),
        })),
        streakDays,
      },
    });
  } catch (err) {
    next(err);
  }
});

const grammarProgressSchema = z.object({
  body: z.object({
    grammarId: z.string().min(1, 'grammarId is required'),
    status: z.enum(['not_started', 'studied', 'mastered']).default('studied'),
    mastered: z.boolean().optional(),
  }),
});

/**
 * GET /api/progress/grammar
 * Get grammar progress list for authenticated user.
 */
progressRouter.get('/grammar', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const grammarList = await db.query.userGrammarProgress.findMany({
      where: eq(userGrammarProgress.userId, userId),
    });

    res.json({
      grammar: grammarList.map((g) => ({
        userId: g.userId,
        grammarId: g.grammarId,
        status: g.status,
        mastered: Boolean(g.mastered),
        studyCount: g.studyCount ?? 1,
        lastStudiedAt: g.lastStudiedAt ? (typeof g.lastStudiedAt === 'string' ? g.lastStudiedAt : (g.lastStudiedAt as Date).toISOString()) : null,
        createdAt: typeof g.createdAt === 'string' ? g.createdAt : (g.createdAt as Date).toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/progress/grammar
 * Record or update grammar progress, calculate XP idempotently, and return updated state.
 */
progressRouter.post('/grammar', requireAuth, validate(grammarProgressSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { grammarId, status, mastered } = req.body;
    await assertContentUnlocked(userId, grammarId);
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const todayStr = getLocalDateString(new Date(), tz);

    if (!isValidGrammarId(grammarId)) {
      throw new AppError(400, `Invalid grammar pattern ID: ${grammarId}`, 'INVALID_GRAMMAR_ID');
    }

    const existing = await db.query.userGrammarProgress.findFirst({
      where: and(
        eq(userGrammarProgress.userId, userId),
        eq(userGrammarProgress.grammarId, grammarId)
      ),
    });

    const isNewlyStudied = (!existing || existing.status === 'not_started') && status !== 'not_started';
    const isMasteredVal = mastered !== undefined ? mastered : (status === 'mastered' ? true : (existing ? Boolean(existing.mastered) : false));
    const effectiveStatus = isMasteredVal ? 'mastered' : status;

    // Idempotency: award XP only when transitioning from not_started to studied/mastered
    const xpGained = isNewlyStudied ? XP_REWARDS.GRAMMAR_LEARNED : 0;

    await db.insert(userGrammarProgress)
      .values({
        userId,
        grammarId,
        status: effectiveStatus,
        mastered: isMasteredVal,
        studyCount: 1,
        lastStudiedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          status: effectiveStatus,
          mastered: isMasteredVal,
          studyCount: sql`${userGrammarProgress.studyCount} + 1`,
          lastStudiedAt: new Date(),
        },
      });

    if (xpGained > 0) {
      await db.update(users)
        .set({ xpPoints: sql`${users.xpPoints} + ${xpGained}` })
        .where(eq(users.id, userId));

      await recordActivity(userId, todayStr, { xp: xpGained, timezone: tz });
    }

    const streakResult = await calculateStreak(userId, tz);
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const newTotalXP = updatedUser?.xpPoints || 0;
    const jlptInfo = getJLPTLevel(newTotalXP);
    const newUserLevel = getUserLevel(newTotalXP);

    if (updatedUser && updatedUser.currentLevel !== jlptInfo.level) {
      await db.update(users)
        .set({ currentLevel: jlptInfo.level })
        .where(eq(users.id, userId));
    }

    const currentStudyCount = existing ? (existing.studyCount ?? 1) + 1 : 1;

    res.json({
      progress: {
        userId,
        grammarId,
        status: effectiveStatus,
        mastered: isMasteredVal,
        studyCount: currentStudyCount,
        lastStudiedAt: new Date().toISOString(),
        createdAt: existing?.createdAt
          ? (typeof existing.createdAt === 'string' ? existing.createdAt : (existing.createdAt as Date).toISOString())
          : new Date().toISOString(),
      },
      xpResult: {
        xpGained,
        totalXP: newTotalXP,
        newLevel: newUserLevel,
        streakDays: streakResult.currentStreak,
      },
    });
  } catch (err) {
    next(err);
  }
});

const xpEventSchema = z.object({
  body: z.object({
    event: z.enum([
      'lesson_completed',
      'quiz_completed',
      'srs_review',
      'kanji_learned',
      'vocab_learned',
      'kana_learned',
      'grammar_studied',
      'daily_goal_complete',
    ]),
    amount: z.never({ message: 'Client-supplied amount is not permitted. XP calculation is strictly server-side.' }).optional(),
    lessonId: z.string().optional(),
    quizId: z.string().optional(),
    cardId: z.string().optional(),
    grammarId: z.string().optional(),
    score: z.number().min(0).max(100).optional(),
    quality: z.number().min(0).max(5).optional(),
    isMastered: z.boolean().optional(),
  }),
});

const handleXPIncrement = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user!.userId;
    const { event, lessonId, quizId, cardId, score, quality, isMastered } = req.body;
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const todayStr = getLocalDateString(new Date(), tz);

    let xpGained = 0;

    if (event === 'lesson_completed') {
      const targetLessonId = lessonId;
      if (!targetLessonId) {
        throw new AppError(400, 'lessonId is required for lesson_completed', 'LESSON_ID_REQUIRED');
      }
      if (!isValidLessonId(targetLessonId)) {
        throw new AppError(400, `Invalid lesson ID: ${targetLessonId}`, 'INVALID_LESSON_ID');
      }

      const existing = await db.query.userLessonProgress.findFirst({
        where: and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.lessonId, targetLessonId)
        ),
      });

      const isNewlyCompleted = !existing || existing.status !== 'completed';
      if (!isNewlyCompleted) {
        xpGained = 0;
      } else {
        xpGained = calculateLessonXP(score ?? 100);
        await db.insert(userLessonProgress)
          .values({
            userId,
            lessonId: targetLessonId,
            status: 'completed',
            score: score ?? 100,
            completedAt: new Date(),
          })
          .onDuplicateKeyUpdate({
            set: {
              status: 'completed',
              score: score ?? 100,
              completedAt: sql`coalesce(${userLessonProgress.completedAt}, ${new Date()})`,
            },
          });
      }
    } else if (event === 'quiz_completed') {
      const targetQuizId = quizId || lessonId;
      if (!targetQuizId) {
        throw new AppError(400, 'quizId or lessonId is required for quiz_completed', 'QUIZ_ID_REQUIRED');
      }

      const existing = await db.query.userLessonProgress.findFirst({
        where: and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.lessonId, targetQuizId)
        ),
      });

      const currentScore = score ?? 100;
      const prevScore = existing?.score ?? 0;
      // Idempotency: only award XP if user hasn't already passed with score >= 70 and achieved <= previous score
      if (existing && prevScore >= 70 && currentScore <= prevScore) {
        xpGained = 0;
      } else {
        xpGained = calculateQuizXP(currentScore);
        await db.insert(userLessonProgress)
          .values({
            userId,
            lessonId: targetQuizId,
            status: currentScore >= 70 ? 'completed' : (existing?.status || 'in_progress'),
            score: currentScore,
            completedAt: currentScore >= 70 ? new Date() : null,
          })
          .onDuplicateKeyUpdate({
            set: {
              score: sql`greatest(coalesce(${userLessonProgress.score}, 0), ${currentScore})`,
              status: currentScore >= 70 ? 'completed' : sql`${userLessonProgress.status}`,
              completedAt: currentScore >= 70
                ? sql`coalesce(${userLessonProgress.completedAt}, ${new Date()})`
                : sql`${userLessonProgress.completedAt}`,
            },
          });
      }
    } else if (event === 'srs_review') {
      if (cardId) {
        const card = await db.query.srsCards.findFirst({
          where: and(eq(srsCards.id, cardId), eq(srsCards.userId, userId)),
        });
        if (!card) {
          throw new AppError(404, 'Card not found', 'CARD_NOT_FOUND');
        }
        const lastReviewStr = card.lastReviewDate
          ? (card.lastReviewDate instanceof Date
              ? card.lastReviewDate.toISOString().split('T')[0]
              : String(card.lastReviewDate).split('T')[0])
          : null;
        if (lastReviewStr === todayStr) {
          xpGained = 0;
        } else {
          xpGained = calculateSRSReviewXP(quality ?? 4, isMastered ?? false);
        }
      } else {
        xpGained = calculateSRSReviewXP(quality ?? 4, isMastered ?? false);
      }
    } else if (event === 'kanji_learned') {
      if (cardId) {
        const existing = await db.query.userKanjiProgress.findFirst({
          where: and(eq(userKanjiProgress.userId, userId), eq(userKanjiProgress.kanjiId, cardId)),
        });
        if (existing && existing.recognitionLevel > 0) {
          xpGained = 0;
        } else {
          xpGained = XP_REWARDS.KANJI_LEARNED;
        }
      } else {
        xpGained = XP_REWARDS.KANJI_LEARNED;
      }
    } else if (event === 'vocab_learned') {
      if (cardId) {
        const existing = await db.query.userVocabularyProgress.findFirst({
          where: and(eq(userVocabularyProgress.userId, userId), eq(userVocabularyProgress.vocabularyId, cardId)),
        });
        if (existing && existing.masteryLevel > 0) {
          xpGained = 0;
        } else {
          xpGained = XP_REWARDS.VOCAB_LEARNED;
        }
      } else {
        xpGained = XP_REWARDS.VOCAB_LEARNED;
      }
    } else if (event === 'kana_learned') {
      // Dedicated Kana learned event - 4 XP, does NOT touch kanji tables
      xpGained = XP_REWARDS.KANA_LEARNED;
    } else if (event === 'grammar_studied') {
      const targetGrammarId = (req.body as any).grammarId || cardId;
      if (targetGrammarId) {
        if (!isValidGrammarId(targetGrammarId)) {
          throw new AppError(400, `Invalid grammar ID: ${targetGrammarId}`, 'INVALID_GRAMMAR_ID');
        }
        const existing = await db.query.userGrammarProgress.findFirst({
          where: and(
            eq(userGrammarProgress.userId, userId),
            eq(userGrammarProgress.grammarId, targetGrammarId)
          ),
        });
        if (existing && existing.status !== 'not_started') {
          xpGained = 0;
        } else {
          xpGained = XP_REWARDS.GRAMMAR_LEARNED;
          await db.insert(userGrammarProgress)
            .values({
              userId,
              grammarId: targetGrammarId,
              status: isMastered ? 'mastered' : 'studied',
              mastered: Boolean(isMastered),
              studyCount: 1,
              lastStudiedAt: new Date(),
            })
            .onDuplicateKeyUpdate({
              set: {
                status: isMastered ? 'mastered' : sql`${userGrammarProgress.status}`,
                mastered: isMastered ? true : sql`${userGrammarProgress.mastered}`,
                studyCount: sql`${userGrammarProgress.studyCount} + 1`,
                lastStudiedAt: new Date(),
              },
            });
        }
      } else {
        xpGained = XP_REWARDS.GRAMMAR_LEARNED;
      }
    } else if (event === 'daily_goal_complete') {
      xpGained = XP_REWARDS.DAILY_GOAL_COMPLETE;
    }

    if (xpGained > 0) {
      await db.update(users)
        .set({ xpPoints: sql`${users.xpPoints} + ${xpGained}` })
        .where(eq(users.id, userId));

      await recordActivity(userId, todayStr, { xp: xpGained, timezone: tz });
    }

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const totalXP = updatedUser?.xpPoints || 0;
    const jlptInfo = getJLPTLevel(totalXP);
    const newLevel = getUserLevel(totalXP);

    if (updatedUser && updatedUser.currentLevel !== jlptInfo.level) {
      await db.update(users)
        .set({ currentLevel: jlptInfo.level })
        .where(eq(users.id, userId));
    }

    const [lessonCount, kanjiCount, vocabCount, kanjiReviews, vocabReviews, masteredCards] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(userLessonProgress)
        .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.status, 'completed'))),
      db.select({ count: sql<number>`count(*)` })
        .from(userKanjiProgress)
        .where(eq(userKanjiProgress.userId, userId)),
      db.select({ count: sql<number>`count(*)` })
        .from(userVocabularyProgress)
        .where(eq(userVocabularyProgress.userId, userId)),
      db.select({ total: sql<number>`coalesce(sum(${userKanjiProgress.reviewCount}), 0)` })
        .from(userKanjiProgress)
        .where(eq(userKanjiProgress.userId, userId)),
      db.select({ total: sql<number>`coalesce(sum(${userVocabularyProgress.reviewCount}), 0)` })
        .from(userVocabularyProgress)
        .where(eq(userVocabularyProgress.userId, userId)),
      db.select({ count: sql<number>`count(*)` })
        .from(srsCards)
        .where(and(eq(srsCards.userId, userId), eq(srsCards.isMastered, true))),
    ]);

    const cardsReviewed = Number(kanjiReviews?.[0]?.total ?? (kanjiReviews?.[0] as any)?.count ?? 0) +
                          Number(vocabReviews?.[0]?.total ?? (vocabReviews?.[0] as any)?.count ?? 0);
    const cardsMastered = Number(masteredCards[0]?.count || 0);

    const newBadges = await checkAndAwardUserBadges(userId, {
      lessonsCompleted: Number(lessonCount[0]?.count || 0),
      kanjiLearned: Number(kanjiCount[0]?.count || 0),
      vocabLearned: Number(vocabCount[0]?.count || 0),
      streak: updatedUser?.streakDays || 0,
      totalXP,
      cardsReviewed,
      cardsMastered,
    });

    res.json({
      xpGained,
      totalXP,
      totalXp: totalXP,
      newLevel,
      badgesAwarded: newBadges.map((b) => ({
        id: b.id,
        badgeType: b.badgeType,
        badgeName: b.badgeName,
        awardedAt: b.awardedAt.toISOString(),
      })),
      streakDays: updatedUser?.streakDays || 0,
    });
  } catch (err) {
    next(err);
  }
};

progressRouter.post('/xp', requireAuth, validate(xpEventSchema), handleXPIncrement);
progressRouter.post('/award-xp', requireAuth, validate(xpEventSchema), handleXPIncrement);

/**
 * GET /api/progress/streak
 * Get current streak information.
 */
progressRouter.get('/streak', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const streakResult = await calculateStreak(userId, tz);
    res.json({
      streak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      lastActivityDate: streakResult.lastActivityDate,
      isActiveToday: streakResult.isActiveToday,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/progress/streak
 * Record today's activity for streak calculation.
 */
progressRouter.post('/streak', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const todayStr = getLocalDateString(new Date(), tz);
    await recordActivity(userId, todayStr, { timezone: tz });

    const streakResult = await calculateStreak(userId, tz);
    res.json({ streakDays: streakResult.currentStreak });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progress/streaks
 * Get streak activity history for the last 30 days.
 */
progressRouter.get('/streaks', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = getLocalDateString(thirtyDaysAgo, tz);

    const [streaks, streakInfo] = await Promise.all([
      db.query.userStreaks.findMany({
        where: (fields, { and, eq, gte }) => and(
          eq(fields.userId, userId),
          gte(fields.date, thirtyDaysAgoStr)
        ),
        orderBy: [desc(userStreaks.date)],
      }),
      calculateStreak(userId, tz),
    ]);

    const formattedStreaks = streaks.map((s) => ({
      date: typeof s.date === 'string' ? s.date : (s.date as Date).toISOString().split('T')[0],
      lessonsCompleted: s.lessonsCompleted ?? 0,
      minutesStudied: s.minutesStudied ?? 0,
      xp: s.xp ?? 0,
    }));

    res.json({
      streaks: formattedStreaks,
      streakInfo: {
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        lastActivityDate: streakInfo.lastActivityDate,
        isActiveToday: streakInfo.isActiveToday,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progress/badges
 * Get all earned badges.
 */
progressRouter.get('/badges', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const badges = await db.query.userBadges.findMany({
      where: eq(userBadges.userId, userId),
      orderBy: [desc(userBadges.awardedAt)],
    });

    res.json({
      badges: badges.map((b) => ({
        id: b.id,
        badgeType: b.badgeType,
        badgeName: b.badgeName,
        awardedAt: b.awardedAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

const awardBadgeSchema = z.object({
  body: z.object({
    badgeType: z.string().min(1),
    badgeName: z.string().optional(),
  }),
});

/**
 * POST /api/progress/badges
 * Award a specific badge if not already unlocked.
 */
progressRouter.post('/badges', requireAuth, validate(awardBadgeSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { badgeType, badgeName } = req.body;

    const badgeDef = ALL_BADGES.find((b) => b.id === badgeType);
    if (!badgeDef) {
      throw new AppError(400, 'Invalid badge type', 'INVALID_BADGE_TYPE');
    }

    const existing = await db.query.userBadges.findFirst({
      where: and(eq(userBadges.userId, userId), eq(userBadges.badgeType, badgeType)),
    });

    if (existing) {
      return res.json({
        badge: {
          id: existing.id,
          badgeType: existing.badgeType,
          badgeName: existing.badgeName,
          awardedAt: existing.awardedAt.toISOString(),
        },
      });
    }

    const badgeId = uuidv4();
    const effectiveName = badgeName || badgeDef.name || badgeType;
    await db.insert(userBadges).values({
      id: badgeId,
      userId,
      badgeType,
      badgeName: effectiveName,
    });

    res.json({
      badge: {
        id: badgeId,
        badgeType,
        badgeName: effectiveName,
        awardedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/progress/reset
 * Atomically reset all user learning progress across tables.
 */
progressRouter.delete('/reset', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    await db.transaction(async (tx) => {
      await tx.delete(userLessonProgress).where(eq(userLessonProgress.userId, userId));
      await tx.delete(userKanjiProgress).where(eq(userKanjiProgress.userId, userId));
      await tx.delete(userVocabularyProgress).where(eq(userVocabularyProgress.userId, userId));
      await tx.delete(userGrammarProgress).where(eq(userGrammarProgress.userId, userId));
      await tx.delete(userReadingProgress).where(eq(userReadingProgress.userId, userId));
      await tx.delete(srsCards).where(eq(srsCards.userId, userId));
      await tx.delete(userStreaks).where(eq(userStreaks.userId, userId));
      await tx.delete(userBadges).where(eq(userBadges.userId, userId));
      await tx.delete(senseiConversations).where(eq(senseiConversations.userId, userId));
      await tx.delete(senseiTourProgress).where(eq(senseiTourProgress.userId, userId));

      await tx.update(users)
        .set({ xpPoints: 0, streakDays: 0, currentLevel: 'N5' })
        .where(eq(users.id, userId));
    });

    res.json({ message: 'Progress reset successfully' });
  } catch (err) {
    next(err);
  }
});
