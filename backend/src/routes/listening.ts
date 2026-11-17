import { Router } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { db } from '../db/index.js';
import { userListeningProgress } from '../db/schema.js';
import {
  LISTENING_SCENARIOS,
  getScenariosByLevel,
  getScenarioById,
} from '../services/listeningContentService.js';
import { recordStudySession } from '../services/studySessionService.js';
import { AppError } from '../middleware/errorHandler.js';

export const listeningRouter = Router();

const logListeningProgressSchema = z.object({
  body: z.object({
    scenarioId: z.string().min(1, 'Scenario ID is required'),
    durationSeconds: z.number().int().min(1).max(3600),
    completed: z.boolean().default(true),
    score: z.number().int().min(0).max(100).nullable().optional(),
    wordsCheckedCount: z.number().int().min(0).optional(),
  }),
});

/**
 * GET /api/listening/scenarios
 * Returns scenarios for a given JLPT level (or all), augmented with user progress.
 */
listeningRouter.get('/scenarios', optionalAuth, async (req, res, next) => {
  try {
    const levelQuery = req.query.level as string | undefined;
    const scenarios = getScenariosByLevel(levelQuery);
    const userId = req.user?.userId;

    if (!userId) {
      return res.json({
        scenarios: scenarios.map((s) => ({
          ...s,
          userProgress: null,
        })),
      });
    }

    const progressRecords = await db
      .select()
      .from(userListeningProgress)
      .where(eq(userListeningProgress.userId, userId));

    const progressMap = new Map(progressRecords.map((p) => [p.scenarioId, p]));

    const augmented = scenarios.map((s) => {
      const p = progressMap.get(s.id);
      return {
        ...s,
        userProgress: p
          ? {
              listenedCount: p.listenedCount,
              bestScore: p.bestScore,
              totalSeconds: p.totalSeconds,
              lastListenedAt: p.lastListenedAt,
            }
          : null,
      };
    });

    res.json({ scenarios: augmented });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/listening/scenarios/:id
 * Returns a specific scenario by ID.
 */
listeningRouter.get('/scenarios/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const scenario = getScenarioById(id);
    if (!scenario) {
      throw new AppError(404, 'Listening scenario not found', 'NOT_FOUND');
    }

    const userId = req.user?.userId;
    let userProgress = null;

    if (userId) {
      const p = await db.query.userListeningProgress.findFirst({
        where: and(
          eq(userListeningProgress.userId, userId),
          eq(userListeningProgress.scenarioId, id)
        ),
      });
      if (p) {
        userProgress = {
          listenedCount: p.listenedCount,
          bestScore: p.bestScore,
          totalSeconds: p.totalSeconds,
          lastListenedAt: p.lastListenedAt,
        };
      }
    }

    res.json({
      scenario,
      userProgress,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/listening/progress
 * Records completion of listening audio, Choukai exam score, and updates verified study hours.
 */
listeningRouter.post(
  '/progress',
  requireAuth,
  validate(logListeningProgressSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { scenarioId, durationSeconds, completed, score, wordsCheckedCount } = req.body;

      const scenario = getScenarioById(scenarioId);
      if (!scenario) {
        throw new AppError(404, 'Listening scenario not found', 'NOT_FOUND');
      }

      const result = await recordStudySession(userId, {
        activityType: 'listening',
        level: scenario.level,
        itemId: scenarioId,
        durationSeconds,
        completed,
        score,
        metadata: {
          scenarioTitle: scenario.titleJa,
          wordsCheckedCount: wordsCheckedCount || 0,
        },
      });

      res.json({
        success: true,
        scenarioId,
        awardedXp: result.awardedXp,
        message: 'Listening progress recorded and verified study time updated!',
      });
    } catch (err) {
      next(err);
    }
  }
);
