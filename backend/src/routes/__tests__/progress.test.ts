import { describe, it, expect, vi, beforeEach } from 'vitest';
import { progressRouter } from '../progress.js';
import { db } from '../../db/index.js';
import * as streakService from '../../services/streakService.js';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      users: { findFirst: vi.fn() },
      userBadges: { findMany: vi.fn(), findFirst: vi.fn() },
      userLessonProgress: { findMany: vi.fn() },
      userKanjiProgress: { findMany: vi.fn(), findFirst: vi.fn() },
      userVocabularyProgress: { findMany: vi.fn(), findFirst: vi.fn() },
      userStreaks: { findMany: vi.fn() },
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

  beforeEach(() => {
    vi.clearAllMocks();
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
});
