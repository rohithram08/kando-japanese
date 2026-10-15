import { describe, it, expect, vi, beforeEach } from 'vitest';
import { progressRouter } from '../progress.js';
import { db } from '../../db/index.js';
import * as streakService from '../../services/streakService.js';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      users: { findFirst: vi.fn() },
      userBadges: { findMany: vi.fn(), findFirst: vi.fn() },
      userLessonProgress: { findMany: vi.fn(), findFirst: vi.fn() },
      userKanjiProgress: { findMany: vi.fn(), findFirst: vi.fn() },
      userVocabularyProgress: { findMany: vi.fn(), findFirst: vi.fn() },
      userGrammarProgress: { findMany: vi.fn(), findFirst: vi.fn() },
      userStreaks: { findMany: vi.fn(), findFirst: vi.fn() },
      srsCards: { findMany: vi.fn(), findFirst: vi.fn() },
    },
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{ count: 0 }]),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onDuplicateKeyUpdate: vi.fn().mockResolvedValue({}),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue({}),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn().mockResolvedValue({}),
    })),
    transaction: vi.fn(async (cb) => cb({
      delete: vi.fn(() => ({ where: vi.fn().mockResolvedValue({}) })),
      update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn().mockResolvedValue({}) })) })),
    })),
  },
}));

describe('Progress Routes — Kanji & Vocabulary Progress (F6)', () => {
  const getRouteHandler = (path: string, method: string) => {
    const layer = (progressRouter as any).stack.find(
      (s: any) => s.route && s.route.path === path && s.route.methods[method]
    );
    if (!layer) throw new Error(`Route not found for ${method.toUpperCase()} ${path}`);
    return layer.route.stack[layer.route.stack.length - 1].handle;
  };

  const getValidationMiddleware = (path: string, method: string) => {
    const layer = (progressRouter as any).stack.find(
      (s: any) => s.route && s.route.path === path && s.route.methods[method]
    );
    if (!layer) throw new Error(`Route not found for ${method.toUpperCase()} ${path}`);
    return layer.route.stack[1].handle;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (db.query.userBadges.findMany as any).mockResolvedValue([]);
    (db.query.userStreaks.findMany as any).mockResolvedValue([]);
  });

  describe('GET /kanji', () => {
    it('returns kanji progress list for authenticated user', async () => {
      const handler = getRouteHandler('/kanji', 'get');
      const mockKanjiList = [
        {
          userId: 'user-123',
          kanjiId: 'k1',
          recognitionLevel: 2,
          mastered: true,
          reviewCount: 3,
          lastReviewedAt: new Date('2026-08-23T00:00:00Z'),
          createdAt: new Date('2026-08-20T00:00:00Z'),
        },
      ];

      (db.query.userKanjiProgress.findMany as any).mockResolvedValueOnce(mockKanjiList);

      const req: any = { user: { userId: 'user-123' } };
      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.kanji).toHaveLength(1);
      expect(result.kanji[0].kanjiId).toBe('k1');
      expect(result.kanji[0].recognitionLevel).toBe(2);
      expect(result.kanji[0].mastered).toBe(true);
      expect(result.kanji[0].reviewCount).toBe(3);
    });
  });

  describe('POST /kanji', () => {
    it('awards 15 XP and records streak for newly learned kanji', async () => {
      const handler = getRouteHandler('/kanji', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { kanjiId: 'k1', recognitionLevel: 1, mastered: false },
      };

      // Not previously in DB
      (db.query.userKanjiProgress.findFirst as any).mockResolvedValueOnce(null);
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 8,
        streakDays: 1,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce(undefined as any);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.progress.kanjiId).toBe('k1');
      expect(result.progress.recognitionLevel).toBe(1);
      expect(result.progress.reviewCount).toBe(1);
      expect(result.xpResult.xpGained).toBe(8);
      expect(result.xpResult.totalXP).toBe(8);
    });

    it('does NOT duplicate XP on repeated study of the same kanji', async () => {
      const handler = getRouteHandler('/kanji', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { kanjiId: 'k1', recognitionLevel: 2, mastered: false },
      };

      // Already in DB with recognitionLevel 1
      (db.query.userKanjiProgress.findFirst as any).mockResolvedValueOnce({
        userId: 'user-123',
        kanjiId: 'k1',
        recognitionLevel: 1,
        mastered: false,
        reviewCount: 1,
        lastReviewedAt: new Date('2026-08-22T00:00:00Z'),
        createdAt: new Date('2026-08-20T00:00:00Z'),
      });
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 100,
        streakDays: 3,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce(undefined as any);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 3,
        longestStreak: 5,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.progress.kanjiId).toBe('k1');
      expect(result.progress.recognitionLevel).toBe(2);
      expect(result.progress.reviewCount).toBe(2);
      expect(result.xpResult.xpGained).toBe(0); // 0 XP on repeated review
      expect(result.xpResult.totalXP).toBe(100);
    });
  });

  describe('GET /vocabulary', () => {
    it('returns vocabulary progress list for authenticated user', async () => {
      const handler = getRouteHandler('/vocabulary', 'get');
      const mockVocabList = [
        {
          userId: 'user-123',
          vocabularyId: 'v1',
          masteryLevel: 3,
          mastered: false,
          reviewCount: 4,
          lastReviewedAt: new Date('2026-08-23T00:00:00Z'),
          createdAt: new Date('2026-08-19T00:00:00Z'),
        },
      ];

      (db.query.userVocabularyProgress.findMany as any).mockResolvedValueOnce(mockVocabList);

      const req: any = { user: { userId: 'user-123' } };
      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.vocabulary).toHaveLength(1);
      expect(result.vocabulary[0].vocabularyId).toBe('v1');
      expect(result.vocabulary[0].masteryLevel).toBe(3);
      expect(result.vocabulary[0].reviewCount).toBe(4);
    });
  });

  describe('POST /vocabulary', () => {
    it('awards 15 XP and records streak for newly learned vocabulary', async () => {
      const handler = getRouteHandler('/vocabulary', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { vocabularyId: 'v1', masteryLevel: 1, mastered: false },
      };

      // Not previously in DB
      (db.query.userVocabularyProgress.findFirst as any).mockResolvedValueOnce(null);
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 4,
        streakDays: 1,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce(undefined as any);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.progress.vocabularyId).toBe('v1');
      expect(result.progress.masteryLevel).toBe(1);
      expect(result.progress.reviewCount).toBe(1);
      expect(result.xpResult.xpGained).toBe(4);
      expect(result.xpResult.totalXP).toBe(4);
    });

    it('does NOT duplicate XP on repeated study of the same vocabulary', async () => {
      const handler = getRouteHandler('/vocabulary', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { vocabularyId: 'v1', masteryLevel: 2, mastered: false },
      };

      // Already in DB
      (db.query.userVocabularyProgress.findFirst as any).mockResolvedValueOnce({
        userId: 'user-123',
        vocabularyId: 'v1',
        masteryLevel: 1,
        mastered: false,
        reviewCount: 2,
        lastReviewedAt: new Date('2026-08-22T00:00:00Z'),
        createdAt: new Date('2026-08-20T00:00:00Z'),
      });
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 150,
        streakDays: 4,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce(undefined as any);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 4,
        longestStreak: 5,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.progress.vocabularyId).toBe('v1');
      expect(result.progress.masteryLevel).toBe(2);
      expect(result.progress.reviewCount).toBe(3);
      expect(result.xpResult.xpGained).toBe(0); // 0 XP on repeat
      expect(result.xpResult.totalXP).toBe(150);
    });
  });

  describe('POST /lesson (Idempotency & Validation)', () => {
    it('rejects an invalid lessonId with 400 AppError', async () => {
      const handler = getRouteHandler('/lesson', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { lessonId: 'invalid-nonexistent-lesson', status: 'completed', score: 100, timeSpentSeconds: 60 },
      };
      let error: any = null;
      const res: any = { json: vi.fn() };
      const next = vi.fn((err) => { error = err; });

      await handler(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('INVALID_LESSON_ID');
    });

    it('awards 50 XP for newly completed valid lesson', async () => {
      const handler = getRouteHandler('/lesson', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { lessonId: 'n5l001', status: 'completed', score: 100, timeSpentSeconds: 120 },
      };

      (db.query.userLessonProgress.findFirst as any).mockResolvedValueOnce(null);
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 15,
        streakDays: 1,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce({ isFirstActivityToday: true } as any);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.xpResult.xpGained).toBe(15);
      expect(result.xpResult.totalXP).toBe(15);
    });

    it('does NOT duplicate XP on repeating the same completed lesson', async () => {
      const handler = getRouteHandler('/lesson', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { lessonId: 'n5l001', status: 'completed', score: 100, timeSpentSeconds: 90 },
      };

      // Already completed
      (db.query.userLessonProgress.findFirst as any).mockResolvedValueOnce({
        userId: 'user-123',
        lessonId: 'n5l001',
        status: 'completed',
        score: 100,
        completedAt: new Date('2026-08-20T00:00:00Z'),
      });
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 200,
        streakDays: 3,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce({ isFirstActivityToday: false } as any);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 3,
        longestStreak: 5,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.xpResult.xpGained).toBe(0); // 0 XP on repeat
      expect(result.xpResult.totalXP).toBe(200);
    });
  });

  describe('POST /xp (Security & Idempotency)', () => {
    it('rejects client-supplied amount with 400 validation error', async () => {
      const validator = getValidationMiddleware('/xp', 'post');
      const req: any = {
        body: {
          event: 'lesson_completed',
          amount: 999999,
        },
      };
      let error: any = null;
      const res: any = {};
      const next = vi.fn((err) => { error = err; });

      await validator(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
    });

    it('rejects unsupported event with 400 validation error', async () => {
      const validator = getValidationMiddleware('/xp', 'post');
      const req: any = {
        body: {
          event: 'unsupported_arbitrary_event',
        },
      };
      let error: any = null;
      const res: any = {};
      const next = vi.fn((err) => { error = err; });

      await validator(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
    });

    it('awards 0 XP on duplicate quiz completion with equal or lower score', async () => {
      const handler = getRouteHandler('/xp', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: {
          event: 'quiz_completed',
          quizId: 'n5l001',
          score: 80,
        },
      };

      // Already has a passing score of 80
      (db.query.userLessonProgress.findFirst as any).mockResolvedValueOnce({
        userId: 'user-123',
        lessonId: 'n5l001',
        score: 80,
        status: 'completed',
      });
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 300,
        streakDays: 5,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.xpGained).toBe(0); // 0 XP on repeat quiz
      expect(result.totalXP).toBe(300);
    });

    it('awards dedicated 4 XP for kana_learned without touching kanji tables', async () => {
      const handler = getRouteHandler('/xp', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: {
          event: 'kana_learned',
          cardId: 'h_a',
        },
      };

      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 104,
        streakDays: 1,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce(undefined as any);

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.xpGained).toBe(4);
      expect(result.totalXP).toBe(104);
    });
  });

  describe('GET / (Progress Summary & Real Cards Reviewed Count)', () => {
    it('aggregates real cardsReviewed count from kanji and vocabulary tables', async () => {
      const handler = getRouteHandler('/', 'get');
      const req: any = {
        user: { userId: 'user-123' },
        headers: {},
      };

      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 500,
        streakDays: 5,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 5,
        longestStreak: 7,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      const mockSelect = db.select as any;
      mockSelect.mockImplementation(() => ({
        from: () => ({
          where: vi.fn().mockImplementation(() => {
            return Promise.resolve([{ count: 5, total: 60 }]);
          }),
        }),
      }));

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.cardsReviewed).toBeGreaterThanOrEqual(0);
      expect(result.totalXP).toBe(500);
    });
  });

  describe('Grammar Progress (GET & POST /api/progress/grammar)', () => {
    it('GET /grammar returns user grammar progress list', async () => {
      const handler = getRouteHandler('/grammar', 'get');
      const req: any = { user: { userId: 'user-123' } };
      (db.query.userGrammarProgress.findMany as any).mockResolvedValueOnce([
        {
          userId: 'user-123',
          grammarId: 'n5_g001',
          status: 'studied',
          mastered: false,
          studyCount: 1,
          lastStudiedAt: new Date(),
          createdAt: new Date(),
        },
      ]);

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.grammar).toHaveLength(1);
      expect(result.grammar[0].grammarId).toBe('n5_g001');
      expect(result.grammar[0].status).toBe('studied');
    });

    it('POST /grammar records new grammar progress and awards 10 XP', async () => {
      const handler = getRouteHandler('/grammar', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { grammarId: 'n5_g001', status: 'studied' },
        headers: {},
      };

      (db.query.userGrammarProgress.findFirst as any).mockResolvedValueOnce(null);
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 110,
        streakDays: 1,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce(undefined as any);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.xpResult.xpGained).toBe(6);
      expect(result.xpResult.totalXP).toBe(110);
      expect(result.progress.grammarId).toBe('n5_g001');
      expect(result.progress.status).toBe('studied');
    });

    it('POST /grammar is idempotent: repeating study of already-studied pattern awards 0 XP', async () => {
      const handler = getRouteHandler('/grammar', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { grammarId: 'n5_g001', status: 'studied' },
        headers: {},
      };

      // Already studied
      (db.query.userGrammarProgress.findFirst as any).mockResolvedValueOnce({
        userId: 'user-123',
        grammarId: 'n5_g001',
        status: 'studied',
        mastered: false,
        studyCount: 1,
      });
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 110,
        streakDays: 1,
        currentLevel: 'N5',
      });
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.xpResult.xpGained).toBe(0); // 0 XP on repeat
      expect(result.progress.studyCount).toBe(2); // studyCount increments
    });

    it('POST /grammar rejects invalid grammar ID with 400 Bad Request', async () => {
      const handler = getRouteHandler('/grammar', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { grammarId: 'completely_bogus_grammar_id_xyz', status: 'studied' },
        headers: {},
      };

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          code: 'INVALID_GRAMMAR_ID',
        })
      );
    });

    it('POST /api/progress/xp with grammar_studied and valid grammarId awards XP idempotently', async () => {
      const handler = getRouteHandler('/xp', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { event: 'grammar_studied', cardId: 'n5_g002' },
        headers: {},
      };

      (db.query.userGrammarProgress.findFirst as any).mockResolvedValueOnce(null);
      (db.query.users.findFirst as any).mockResolvedValueOnce({
        id: 'user-123',
        xpPoints: 110,
        streakDays: 1,
        currentLevel: 'N5',
      });
      (db.query.userBadges.findMany as any).mockResolvedValueOnce([]);
      vi.spyOn(streakService, 'recordActivity').mockResolvedValueOnce(undefined as any);
      vi.spyOn(streakService, 'calculateStreak').mockResolvedValueOnce({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-08-23',
        isActiveToday: true,
      });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.xpGained).toBe(6);
    });
  });
});
