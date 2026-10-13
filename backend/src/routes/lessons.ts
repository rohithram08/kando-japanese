import { Router } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import {
  getLessonsByLevel,
  getLessonDetail,
  isValidJLPTLevel,
} from '../services/lessonContentService.js';

export const lessonsRouter = Router();

// GET /api/lessons?level=N5 (Public)
lessonsRouter.get('/', (req, res, next) => {
  try {
    const levelQuery = req.query.level;

    if (!levelQuery || typeof levelQuery !== 'string') {
      throw new AppError(400, 'Query parameter "level" is required and must be one of N1, N2, N3, N4, N5', 'INVALID_LEVEL');
    }

    const level = levelQuery.toUpperCase();
    if (!isValidJLPTLevel(level)) {
      throw new AppError(400, `Invalid JLPT level "${levelQuery}". Must be one of N1, N2, N3, N4, N5`, 'INVALID_LEVEL');
    }

    const lessons = getLessonsByLevel(level);
    res.json({ lessons });
  } catch (err) {
    next(err);
  }
});

// GET /api/lessons/:level/:day (Public)
lessonsRouter.get('/:level/:day', (req, res, next) => {
  try {
    const { level: rawLevel, day: rawDay } = req.params;

    if (!rawLevel || !isValidJLPTLevel(rawLevel)) {
      throw new AppError(400, `Invalid JLPT level "${rawLevel}". Must be one of N1, N2, N3, N4, N5`, 'INVALID_LEVEL');
    }

    const dayNumber = parseInt(rawDay, 10);
    if (isNaN(dayNumber) || dayNumber < 1) {
      throw new AppError(400, `Invalid day parameter "${rawDay}". Must be a positive integer`, 'INVALID_DAY');
    }

    const lesson = getLessonDetail(rawLevel, dayNumber);
    if (!lesson) {
      throw new AppError(404, `Lesson not found for level "${rawLevel}" day "${rawDay}"`, 'LESSON_NOT_FOUND');
    }

    res.json({
      lesson,
    });
  } catch (err) {
    next(err);
  }
});
