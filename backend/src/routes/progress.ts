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
  srsCards,
  userStreaks,
  userBadges,
} from '../db/schema.js';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';
import {
  calculateStreak,
  recordActivity,
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
    const today = new Date().toISOString().split('T')[0];

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) throw new AppError(404, 'User not found');

    // Query aggregated counts
    const [completedLessons, kanjiRows, vocabRows, masteredCards, dueCards] = await Promise.all([
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
        .from(srsCards)
        .where(and(eq(srsCards.userId, userId), eq(srsCards.isMastered, true))),

      db.select({ count: sql<number>`count(*)` })
        .from(srsCards)
        .where(and(
          eq(srsCards.userId, userId),
          lte(srsCards.nextReviewDate, new Date(today)),
          eq(srsCards.isMastered, false)
        )),
    ]);

    const totalXP = user.xpPoints || 0;
    const jlptInfo = getJLPTLevel(totalXP);
    const userLevel = getUserLevel(totalXP);

    const statsData = {
      totalXP,
      totalXp: totalXP,
      streakDays: user.streakDays || 0,
      userLevel,
      jlptLevel: user.currentLevel || jlptInfo.level,
      lessonsCompleted: Number(completedLessons[0]?.count || 0),
      kanjiLearned: Number(kanjiRows[0]?.count || 0),
      vocabLearned: Number(vocabRows[0]?.count || 0),
      cardsReviewed: 0,
      cardsMastered: Number(masteredCards[0]?.count || 0),
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
    const todayStr = new Date().toISOString().split('T')[0];

    const xpGained = calculateLessonXP(score);

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
          completedAt: status === 'completed' ? new Date() : sql`${userLessonProgress.completedAt}`,
        },
      });

    // Record activity in streaks
    await recordActivity(userId, todayStr);

    // Fetch updated streak
    const streakResult = await calculateStreak(userId);
    const streakBonus = calculateStreakBonus(streakResult.currentStreak);
    const totalXpToAdd = xpGained + streakBonus;

    // Atomically increment XP
    await db.update(users)
      .set({
        xpPoints: sql`${users.xpPoints} + ${totalXpToAdd}`,
        streakDays: streakResult.currentStreak,
      })
      .where(eq(users.id, userId));

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
    const [lessonCount, kanjiCount, vocabCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(userLessonProgress)
        .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.status, 'completed'))),
      db.select({ count: sql<number>`count(*)` })
        .from(userKanjiProgress)
        .where(eq(userKanjiProgress.userId, userId)),
      db.select({ count: sql<number>`count(*)` })
        .from(userVocabularyProgress)
        .where(eq(userVocabularyProgress.userId, userId)),
    ]);

    const newBadges = await checkAndAwardUserBadges(userId, {
      lessonsCompleted: Number(lessonCount[0]?.count || 0),
      kanjiLearned: Number(kanjiCount[0]?.count || 0),
      vocabLearned: Number(vocabCount[0]?.count || 0),
      streak: streakResult.currentStreak,
      totalXP: newTotalXP,
    });

    res.json({
      progress: {
        lessonId,
        status,
        score,
        timeSpentSeconds,
        lastAccessedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
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
    const todayStr = new Date().toISOString().split('T')[0];

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
    await recordActivity(userId, todayStr);
    const streakResult = await calculateStreak(userId);
    streakDays = streakResult.currentStreak;

    if (xpGained > 0) {
      await db.update(users)
        .set({
          xpPoints: sql`${users.xpPoints} + ${xpGained}`,
          streakDays: streakResult.currentStreak,
        })
        .where(eq(users.id, userId));
    }

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
    const todayStr = new Date().toISOString().split('T')[0];

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
    await recordActivity(userId, todayStr);
    const streakResult = await calculateStreak(userId);
    streakDays = streakResult.currentStreak;

    if (xpGained > 0) {
      await db.update(users)
        .set({
          xpPoints: sql`${users.xpPoints} + ${xpGained}`,
          streakDays: streakResult.currentStreak,
        })
        .where(eq(users.id, userId));
    }

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

const xpEventSchema = z.object({
  body: z.object({
    event: z.enum([
      'lesson_completed',
      'quiz_completed',
      'srs_review',
      'kanji_learned',
      'vocab_learned',
      'grammar_studied',
      'daily_goal_complete',
    ]).optional(),
    amount: z.number().int().positive().optional(),
    score: z.number().min(0).max(100).optional(),
    quality: z.number().min(0).max(5).optional(),
    isMastered: z.boolean().optional(),
  }),
});

const handleXPIncrement = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user!.userId;
    const { event, amount, score, quality, isMastered } = req.body;

    let xpGained = 0;
    if (amount) {
      xpGained = amount;
    } else if (event === 'lesson_completed') {
      xpGained = calculateLessonXP(score ?? 100);
    } else if (event === 'quiz_completed') {
      xpGained = calculateQuizXP(score ?? 100);
    } else if (event === 'srs_review') {
      xpGained = calculateSRSReviewXP(quality ?? 4, isMastered ?? false);
    } else if (event === 'kanji_learned') {
      xpGained = XP_REWARDS.KANJI_LEARNED;
    } else if (event === 'vocab_learned') {
      xpGained = XP_REWARDS.VOCAB_LEARNED;
    } else if (event === 'grammar_studied') {
      xpGained = XP_REWARDS.GRAMMAR_LEARNED;
    } else if (event === 'daily_goal_complete') {
      xpGained = XP_REWARDS.DAILY_GOAL_COMPLETE;
    }

    if (xpGained > 0) {
      await db.update(users)
        .set({ xpPoints: sql`${users.xpPoints} + ${xpGained}` })
        .where(eq(users.id, userId));
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

    const newBadges = await checkAndAwardUserBadges(userId, {
      lessonsCompleted: 0,
      kanjiLearned: 0,
      vocabLearned: 0,
      streak: updatedUser?.streakDays || 0,
      totalXP,
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
    const streakResult = await calculateStreak(userId);
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
    const todayStr = new Date().toISOString().split('T')[0];
    await recordActivity(userId, todayStr);

    const streakResult = await calculateStreak(userId);
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

    const [streaks, streakInfo] = await Promise.all([
      db.query.userStreaks.findMany({
        where: (fields, { and, eq, gte }) => and(
          eq(fields.userId, userId),
          gte(fields.date, thirtyDaysAgo)
        ),
        orderBy: [desc(userStreaks.date)],
      }),
      calculateStreak(userId),
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
    await db.insert(userBadges).values({
      id: badgeId,
      userId,
      badgeType,
      badgeName: badgeName || badgeType,
    });

    res.json({
      badge: {
        id: badgeId,
        badgeType,
        badgeName: badgeName || badgeType,
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
      await tx.delete(srsCards).where(eq(srsCards.userId, userId));
      await tx.delete(userStreaks).where(eq(userStreaks.userId, userId));
      await tx.delete(userBadges).where(eq(userBadges.userId, userId));

      await tx.update(users)
        .set({ xpPoints: 0, streakDays: 0, currentLevel: 'N5' })
        .where(eq(users.id, userId));
    });

    res.json({ message: 'Progress reset successfully' });
  } catch (err) {
    next(err);
  }
});
