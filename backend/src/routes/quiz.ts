import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

export const quizRouter = Router();

const lessonIdParams = z.object({
  params: z.object({
    lessonId: z.string(),
  })
});

quizRouter.get('/:lessonId', validate(lessonIdParams), (req, res) => {
  // TODO: get quiz for lesson
  res.json({ quiz: {} });
});

const submitQuizSchema = z.object({
  params: z.object({
    lessonId: z.string(),
  }),
  body: z.object({
    answers: z.record(z.string(), z.any()),
    score: z.number(),
  })
});

quizRouter.post('/:lessonId/submit', requireAuth, validate(submitQuizSchema), (req, res) => {
  // TODO: submit quiz results
  res.json({ message: 'Quiz submitted stub' });
});
