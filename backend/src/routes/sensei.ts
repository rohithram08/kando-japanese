import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { senseiService } from '../services/senseiService.js';
import { aiLimiter } from '../middleware/rateLimit.js';

export const senseiRouter = Router();

// Apply auth middleware to all sensei routes
senseiRouter.use(requireAuth);

/**
 * Chat with Sensei
 * POST /api/sensei/chat
 */
senseiRouter.post('/chat', aiLimiter, async (req, res, next) => {
  try {
    const { message, explanationLanguage } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await senseiService.chat(req.user!.userId, message, { explanationLanguage });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * Get chat history
 * GET /api/sensei/history
 */
senseiRouter.get('/history', async (req, res, next) => {
  try {
    const history = await senseiService.getHistory(req.user!.userId);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

/**
 * Get tour progress
 * GET /api/sensei/tour
 */
senseiRouter.get('/tour', async (req, res, next) => {
  try {
    const progress = await senseiService.getTourProgress(req.user!.userId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

/**
 * Complete onboarding tour
 * POST /api/sensei/tour/complete
 */
senseiRouter.post('/tour/complete', async (req, res, next) => {
  try {
    const result = await senseiService.completeTour(req.user!.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Skip onboarding tour
 * POST /api/sensei/tour/skip
 */
senseiRouter.post('/tour/skip', async (req, res, next) => {
  try {
    const result = await senseiService.skipTour(req.user!.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Get daily guidance and progress-grounded advice
 * GET /api/sensei/guidance
 */
senseiRouter.get('/guidance', async (req, res, next) => {
  try {
    const guidance = await senseiService.getDailyGuidance(req.user!.userId);
    res.json(guidance);
  } catch (error) {
    next(error);
  }
});

