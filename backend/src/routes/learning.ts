import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { and, desc, eq, gte } from 'drizzle-orm';
import { db } from '../db/index.js';
import { learningAttempts } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { computeInsights, EVIDENCE, THRESHOLDS } from '../services/learningInsights.js';
import { getLocalDateString, resolveTimezone } from '../services/streakService.js';
import { recordAttempts } from '../services/attemptService.js';

export const learningRouter = Router();

const attemptSchema = z.object({
  itemType: z.enum(['kanji', 'vocabulary', 'grammar', 'reading', 'kana']),
  itemId: z.string().min(1).max(100),
  correct: z.boolean(),
  quality: z.number().int().min(0).max(5).optional(),
  responseMs: z.number().int().min(0).max(600_000).optional(),
  modality: z.enum(['recall', 'recognition', 'listening', 'writing', 'reading']).optional(),
});

const batchSchema = z.object({
  body: z.object({ attempts: z.array(attemptSchema).min(1).max(50) }),
});

/** POST /api/learning/attempts - log answered items (reading quizzes, kana drills, ...). SRS reviews are logged server-side. */
learningRouter.post('/attempts', requireAuth, validate(batchSchema), async (req, res, next) => {
  try {
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    await recordAttempts(req.user!.userId, req.body.attempts, tz);
    res.status(201).json({ recorded: req.body.attempts.length });
  } catch (err) { next(err); }
});

/** GET /api/learning/insights - measured (not guessed) learning profile + a daily plan. */
learningRouter.get('/insights', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const tz = resolveTimezone(req.headers?.['x-timezone'] as string, undefined);
    const since = new Date(Date.now() - THRESHOLDS.leechWindowDays * 86_400_000);
    const rows = await db.select({
      itemType: learningAttempts.itemType, itemId: learningAttempts.itemId, correct: learningAttempts.correct,
      responseMs: learningAttempts.responseMs, modality: learningAttempts.modality,
      localHour: learningAttempts.localHour, createdAt: learningAttempts.createdAt,
    }).from(learningAttempts)
      .where(and(eq(learningAttempts.userId, userId), gte(learningAttempts.createdAt, since)))
      .orderBy(desc(learningAttempts.createdAt))
      .limit(5000);
    res.json({ insights: computeInsights(rows, new Date(), (d) => getLocalDateString(d, tz)), evidence: EVIDENCE });
  } catch (err) { next(err); }
});
