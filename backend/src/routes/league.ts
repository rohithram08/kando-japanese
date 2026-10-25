import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getGlobalBoard, getHistory, getLeagueView, setLeagueOptOut } from '../services/leagueService.js';

export const leagueRouter = Router();

/**
 * GET /api/league/me
 * The learner's current league, rung, countdown and cohort standings (padded with labelled bots).
 */
leagueRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    res.json(await getLeagueView(req.user!.userId));
  } catch (err) {
    next(err);
  }
});

/** GET /api/league/history - results of previous weeks (rank, XP, promoted/demoted/stayed). */
leagueRouter.get('/history', requireAuth, async (req, res, next) => {
  try {
    res.json({ weeks: await getHistory(req.user!.userId) });
  } catch (err) {
    next(err);
  }
});

/** GET /api/league/global - all-time top learners by total XP. */
leagueRouter.get('/global', requireAuth, async (req, res, next) => {
  try {
    res.json(await getGlobalBoard(req.user!.userId));
  } catch (err) {
    next(err);
  }
});

const settingsSchema = z.object({
  body: z.object({ optOut: z.boolean() }).strict(),
  query: z.any(),
  params: z.any(),
});

/** PUT /api/league/settings { optOut } - hide from (or rejoin) leagues and leaderboards. */
leagueRouter.put('/settings', requireAuth, validate(settingsSchema), async (req, res, next) => {
  try {
    await setLeagueOptOut(req.user!.userId, req.body.optOut);
    res.json({ optOut: req.body.optOut });
  } catch (err) {
    next(err);
  }
});
