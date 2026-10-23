// backend/src/routes/dictionary.ts
// ─────────────────────────────────────────────────────────────────────────────
// Express route for Bidirectional Multilingual Dictionary
// ─────────────────────────────────────────────────────────────────────────────

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { searchHybridDictionary } from '../services/dictionaryService.js';

export const dictionaryRouter = Router();

const dictionarySearchSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query cannot be empty').max(100),
    locale: z.string().max(10).optional().default('en'),
    jlpt: z.enum(['N1', 'N2', 'N3', 'N4', 'N5', 'n1', 'n2', 'n3', 'n4', 'n5']).optional(),
    pos: z.string().max(50).optional(),
  }),
});

dictionaryRouter.get(
  '/search',
  validate(dictionarySearchSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query.q as string;
      const locale = (req.query.locale as string) || 'en';
      const jlpt = req.query.jlpt as string | undefined;
      const pos = req.query.pos as string | undefined;

      const result = await searchHybridDictionary(q, locale, { jlpt, pos });

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);
