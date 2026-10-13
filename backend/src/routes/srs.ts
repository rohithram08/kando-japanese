import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, lte, sql } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { db } from '../db/index.js';
import { srsCards } from '../db/schema.js';

export const srsRouter = Router();

// ─── GET /api/srs/due (requireAuth) ──────────────────────────────────────────
srsRouter.get('/due', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const limit = req.query.limit ? Math.min(Number(req.query.limit), 100) : 20;
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const cards = await db.query.srsCards.findMany({
      where: and(
        eq(srsCards.userId, userId),
        lte(srsCards.nextReviewDate, today),
        eq(srsCards.isMastered, false),
      ),
      limit,
    });

    res.json({ cards });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/srs/cards (requireAuth) ────────────────────────────────────────
srsRouter.get('/cards', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const cards = await db.query.srsCards.findMany({
      where: eq(srsCards.userId, userId),
    });

    res.json({ cards });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/srs/due/count (requireAuth) ────────────────────────────────────
srsRouter.get('/due/count', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const result = await db.select({ count: sql<number>`cast(count(*) as unsigned)` })
      .from(srsCards)
      .where(and(
        eq(srsCards.userId, userId),
        lte(srsCards.nextReviewDate, today),
        eq(srsCards.isMastered, false)
      ));

    res.json({ count: Number(result[0]?.count || 0) });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/srs/cards (requireAuth) ───────────────────────────────────────
const addCardSchema = z.object({
  body: z.object({
    cardType: z.enum(['vocabulary', 'kanji', 'kana']),
    cardRefId: z.string().min(1),
  }),
});

srsRouter.post('/cards', requireAuth, validate(addCardSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { cardType, cardRefId } = req.body;
    const today = new Date(new Date().toISOString().split('T')[0]);

    // Check if card already exists
    const existing = await db.query.srsCards.findFirst({
      where: and(
        eq(srsCards.userId, userId),
        eq(srsCards.cardType, cardType),
        eq(srsCards.cardRefId, cardRefId),
      ),
    });

    if (existing) {
      res.json({ card: existing, message: 'Card already exists in SRS' });
      return;
    }

    const newId = uuidv4();
    await db.insert(srsCards).values({
      id: newId,
      userId,
      cardType,
      cardRefId,
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
      nextReviewDate: today,
      isMastered: false,
    });

    const card = await db.query.srsCards.findFirst({
      where: eq(srsCards.id, newId),
    });

    res.status(201).json({ card, message: 'Card added to SRS' });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/srs/cards/:id/review (requireAuth) ────────────────────────────
const reviewSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    quality: z.number().min(0).max(5),
    intervalMode: z.enum(['relaxed', 'balanced', 'intense']).optional(),
  }),
});

srsRouter.put('/cards/:id/review', requireAuth, validate(reviewSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { quality, intervalMode = 'balanced' } = req.body;

    const card = await db.query.srsCards.findFirst({
      where: and(
        eq(srsCards.id, id),
        eq(srsCards.userId, userId),
      ),
    });

    if (!card) {
      throw new AppError(404, 'SRS card not found', 'CARD_NOT_FOUND');
    }

    let { easeFactor, intervalDays, repetitions } = card;

    if (quality >= 3) {
      if (repetitions === 0) intervalDays = 1;
      else if (repetitions === 1) intervalDays = 6;
      else intervalDays = Math.round(intervalDays * easeFactor);
      repetitions += 1;
    } else {
      repetitions = 0;
      intervalDays = 1;
    }

    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );

    const multipliers: Record<string, number> = { relaxed: 1.3, balanced: 1.0, intense: 0.65 };
    const intervalMultiplier = multipliers[intervalMode] || 1.0;
    intervalDays = Math.max(1, Math.round(intervalDays * intervalMultiplier));

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervalDays);
    const today = new Date(new Date().toISOString().split('T')[0]);
    const isMastered = repetitions >= 8 && easeFactor >= 2.0;

    await db.update(srsCards)
      .set({
        easeFactor,
        intervalDays,
        repetitions,
        nextReviewDate: nextReview,
        lastReviewDate: today,
        isMastered,
      })
      .where(eq(srsCards.id, id));

    const updated = await db.query.srsCards.findFirst({
      where: eq(srsCards.id, id),
    });

    res.json({ card: updated });
  } catch (err) {
    next(err);
  }
});
