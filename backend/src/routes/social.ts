import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { socialLimiter } from '../middleware/rateLimit.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  clampPage, followUser, getFollowCounts, listFollowers, listFollowing, searchPeople, unfollowUser,
} from '../services/socialService.js';

export const socialRouter = Router();

socialRouter.use(requireAuth, socialLimiter);

const idSchema = z.string().uuid();

function targetId(raw: string): string {
  const parsed = idSchema.safeParse(raw);
  if (!parsed.success) throw new AppError(400, 'Invalid user id', 'VALIDATION_ERROR');
  return parsed.data;
}

/** GET /api/social/people?q=&limit=&offset= - global learner directory (opted-out learners hidden). */
socialRouter.get('/people', async (req, res, next) => {
  try {
    const { limit, offset } = clampPage(req.query.limit, req.query.offset);
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    res.json(await searchPeople(req.user!.userId, q, limit, offset));
  } catch (err) { next(err); }
});

/** GET /api/social/summary - my follower / following counts. */
socialRouter.get('/summary', async (req, res, next) => {
  try { res.json(await getFollowCounts(req.user!.userId)); } catch (err) { next(err); }
});

/** GET /api/social/following and /followers - my own lists. */
socialRouter.get('/following', async (req, res, next) => {
  try {
    const { limit, offset } = clampPage(req.query.limit, req.query.offset);
    res.json(await listFollowing(req.user!.userId, req.user!.userId, limit, offset));
  } catch (err) { next(err); }
});

socialRouter.get('/followers', async (req, res, next) => {
  try {
    const { limit, offset } = clampPage(req.query.limit, req.query.offset);
    res.json(await listFollowers(req.user!.userId, req.user!.userId, limit, offset));
  } catch (err) { next(err); }
});

/** POST /api/social/follow/:userId - idempotent. */
socialRouter.post('/follow/:userId', async (req, res, next) => {
  try {
    await followUser(req.user!.userId, targetId(req.params.userId));
    res.status(200).json({ isFollowing: true, ...(await getFollowCounts(req.params.userId)) });
  } catch (err) { next(err); }
});

/** DELETE /api/social/follow/:userId - idempotent. */
socialRouter.delete('/follow/:userId', async (req, res, next) => {
  try {
    await unfollowUser(req.user!.userId, targetId(req.params.userId));
    res.json({ isFollowing: false, ...(await getFollowCounts(req.params.userId)) });
  } catch (err) { next(err); }
});
