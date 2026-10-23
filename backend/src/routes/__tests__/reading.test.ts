import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readingRouter } from '../reading.js';

// Mock DB
vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      userReadingProgress: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      users: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onDuplicateKeyUpdate: vi.fn().mockResolvedValue([{}]),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{}]),
      })),
    })),
  },
}));

vi.mock('../../services/streakService.js', async () => {
  const actual = await vi.importActual<any>('../../services/streakService.js');
  return {
    ...actual,
    recordActivity: vi.fn().mockResolvedValue({ currentStreak: 3, isFirstActivityToday: true }),
  };
});

import { db } from '../../db/index.js';
import { recordActivity } from '../../services/streakService.js';

function getRouteHandler(path: string, method: string) {
  const layer = (readingRouter as any).stack.find(
    (l: any) => l.route && l.route.path === path && l.route.methods[method]
  );
  if (!layer) throw new Error(`Route handler not found for ${method.toUpperCase()} ${path}`);
  // Return the final handler (after validation and auth middleware)
  return layer.route.stack[layer.route.stack.length - 1].handle;
}

describe('Reading Progress Routes — Backend API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (db.query.userReadingProgress.findFirst as any).mockReset();
    (db.query.users.findFirst as any).mockReset();
    (recordActivity as any).mockResolvedValue({ currentStreak: 3, isFirstActivityToday: true });
  });

  describe('GET /progress', () => {
    it('returns reading progress for authenticated user', async () => {
      const handler = getRouteHandler('/progress', 'get');
      const req: any = {
        user: { userId: 'user-456' },
      };
      const mockRecords = [
        {
          id: 'prog-1',
          userId: 'user-456',
          storyId: 'story_n5_01',
          status: 'completed',
          lastSentenceIndex: 9,
          quizScore: 100,
        },
      ];
      (db.query.userReadingProgress.findMany as any).mockResolvedValue(mockRecords);

      let responseData: any = null;
      const res: any = {
        json: (data: any) => {
          responseData = data;
        },
      };

      await handler(req, res, () => {});
      expect(responseData).toEqual({ progress: mockRecords });
    });
  });

  describe('GET /progress/:storyId', () => {
    it('returns default unstarted state if no record exists', async () => {
      const handler = getRouteHandler('/progress/:storyId', 'get');
      const req: any = {
        user: { userId: 'user-456' },
        params: { storyId: 'story_n5_02' },
      };
      (db.query.userReadingProgress.findFirst as any).mockResolvedValue(null);

      let responseData: any = null;
      const res: any = {
        json: (data: any) => {
          responseData = data;
        },
      };

      await handler(req, res, () => {});
      expect(responseData.progress.status).toBe('not_started');
      expect(responseData.progress.lastSentenceIndex).toBe(0);
      expect(responseData.progress.storyId).toBe('story_n5_02');
    });

    it('returns existing record if present', async () => {
      const handler = getRouteHandler('/progress/:storyId', 'get');
      const req: any = {
        user: { userId: 'user-456' },
        params: { storyId: 'story_n5_01' },
      };
      const existing = {
        id: 'prog-1',
        userId: 'user-456',
        storyId: 'story_n5_01',
        status: 'in_progress',
        lastSentenceIndex: 4,
        quizScore: 0,
      };
      (db.query.userReadingProgress.findFirst as any).mockResolvedValue(existing);

      let responseData: any = null;
      const res: any = {
        json: (data: any) => {
          responseData = data;
        },
      };

      await handler(req, res, () => {});
      expect(responseData.progress).toEqual(existing);
    });
  });

  describe('POST /progress', () => {
    const makeRes = () => {
      const out: { data: any } = { data: null };
      const res: any = { json: (d: any) => { out.data = d; } };
      return { out, res };
    };
    const makeReq = (body: any, userId = 'user-456') => ({ user: { userId }, headers: {}, body }) as any;

    /** Queue results for successive db.update(...).set(...).where(...) calls. */
    const queueUpdates = (...results: any[]) => {
      const where = vi.fn();
      for (const r of results) where.mockResolvedValueOnce(r);
      where.mockResolvedValue([{ affectedRows: 1 }]);
      (db.update as any).mockImplementation(() => ({ set: vi.fn(() => ({ where })) }));
      return where;
    };

    const stored = (overrides: any = {}) => ({
      id: 'prog-1',
      userId: 'user-456',
      storyId: 'story_n5_01',
      status: 'in_progress',
      lastSentenceIndex: 7,
      quizScore: 0,
      ...overrides,
    });

    it('pays story + quiz Wave XP exactly once on first completion and credits the streak', async () => {
      const handler = getRouteHandler('/progress', 'post');
      (db.query.userReadingProgress.findFirst as any)
        .mockResolvedValueOnce(stored())
        .mockResolvedValueOnce(stored({ status: 'completed', quizScore: 100 }));
      (db.query.users.findFirst as any).mockResolvedValue({ xpPoints: 100, currentLevel: 'N5', streakDays: 3 });
      queueUpdates([{}], [{ affectedRows: 1 }]); // best score, then the one-time claim

      const { out, res } = makeRes();
      await handler(makeReq({ storyId: 'story_n5_01', lastSentenceIndex: 7, status: 'completed', quizScore: 100 }), res, () => {});

      expect(out.data.rewards).toMatchObject({ storyXp: 40, quizXp: 60, totalXp: 100, firstCompletion: true, alreadyCompleted: false });
      expect(out.data.xpAwarded).toBe(100);
      expect(out.data.totalXP).toBe(100);
      expect(out.data.userLevel).toBe(3); // 100 Wave XP -> level 3 (starts at 90)
      expect(out.data.streak).toEqual({ recorded: true, days: 3, firstActivityToday: true });
      expect(recordActivity).toHaveBeenCalledWith('user-456', expect.any(String), expect.objectContaining({ xp: 100, isLesson: true }));
    });

    it('still credits the Jelly Streak (and pays once) when the learner fails the quiz', async () => {
      const handler = getRouteHandler('/progress', 'post');
      (db.query.userReadingProgress.findFirst as any)
        .mockResolvedValueOnce(stored())
        .mockResolvedValueOnce(stored({ status: 'completed', quizScore: 20 }));
      (db.query.users.findFirst as any).mockResolvedValue({ xpPoints: 76, currentLevel: 'N5', streakDays: 1 });
      queueUpdates([{}], [{ affectedRows: 1 }]);

      const { out, res } = makeRes();
      await handler(makeReq({ storyId: 'story_n5_01', lastSentenceIndex: 7, status: 'completed', quizScore: 20 }), res, () => {});

      expect(out.data.rewards.totalXp).toBe(40 + 30 + 6); // 20% of the 30 bonus = 6
      expect(out.data.streak.recorded).toBe(true);
      expect(recordActivity).toHaveBeenCalledTimes(1);
    });

    it('does not re-award XP on a retake of a completed story, but still records today\'s streak', async () => {
      const handler = getRouteHandler('/progress', 'post');
      const done = stored({ status: 'completed', quizScore: 80 });
      (db.query.userReadingProgress.findFirst as any).mockResolvedValueOnce(done).mockResolvedValueOnce(done);
      (db.query.users.findFirst as any).mockResolvedValue({ xpPoints: 100, currentLevel: 'N5', streakDays: 3 });
      (recordActivity as any).mockResolvedValueOnce({ currentStreak: 3, isFirstActivityToday: false });
      const where = queueUpdates([{}]);

      const { out, res } = makeRes();
      await handler(makeReq({ storyId: 'story_n5_01', lastSentenceIndex: 7, status: 'completed', quizScore: 100 }), res, () => {});

      expect(out.data.xpAwarded).toBe(0);
      expect(out.data.rewards).toMatchObject({ firstCompletion: false, alreadyCompleted: true, totalXp: 0 });
      expect(out.data.streak.recorded).toBe(true);
      expect(recordActivity).toHaveBeenCalledWith('user-456', expect.any(String), expect.objectContaining({ xp: 0, isLesson: false }));
      expect(where).toHaveBeenCalledTimes(1); // only the best-score update — no claim, no XP update
    });

    it('pays nothing when a parallel request already claimed the completion (race / double submit)', async () => {
      const handler = getRouteHandler('/progress', 'post');
      (db.query.userReadingProgress.findFirst as any)
        .mockResolvedValueOnce(stored())
        .mockResolvedValueOnce(stored({ status: 'completed', quizScore: 100 }));
      (db.query.users.findFirst as any).mockResolvedValue({ xpPoints: 100, currentLevel: 'N5', streakDays: 3 });
      const where = queueUpdates([{}], [{ affectedRows: 0 }]); // claim loses the race

      const { out, res } = makeRes();
      await handler(makeReq({ storyId: 'story_n5_01', lastSentenceIndex: 7, status: 'completed', quizScore: 100 }), res, () => {});

      expect(out.data.xpAwarded).toBe(0);
      expect(out.data.rewards.firstCompletion).toBe(false);
      expect(where).toHaveBeenCalledTimes(2); // best score + failed claim, no users.xpPoints update
    });

    it('saves in_progress without XP or streak, and never downgrades a completed story', async () => {
      const handler = getRouteHandler('/progress', 'post');
      (db.query.userReadingProgress.findFirst as any)
        .mockResolvedValueOnce(stored({ status: 'completed', quizScore: 90 }))
        .mockResolvedValueOnce(stored({ status: 'completed', quizScore: 90, lastSentenceIndex: 2 }));
      const valuesSpy = vi.fn(() => ({ onDuplicateKeyUpdate: vi.fn().mockResolvedValue([{}]) }));
      (db.insert as any).mockImplementationOnce(() => ({ values: valuesSpy }));

      const { out, res } = makeRes();
      await handler(makeReq({ storyId: 'story_n5_01', lastSentenceIndex: 2, status: 'in_progress' }), res, () => {});

      expect(valuesSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'completed' }));
      expect(out.data.xpAwarded).toBe(0);
      expect(out.data.streak).toBeUndefined();
      expect(recordActivity).not.toHaveBeenCalled();
    });

    it('successfully saves and tracks in_progress for an expanded N4 story', async () => {
      const handler = getRouteHandler('/progress', 'post');
      (db.query.userReadingProgress.findFirst as any)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'prog-n4-1', userId: 'user-789', storyId: 'story_n4_01', status: 'in_progress', lastSentenceIndex: 3, quizScore: null });

      const { out, res } = makeRes();
      await handler(makeReq({ storyId: 'story_n4_01', lastSentenceIndex: 3, status: 'in_progress' }, 'user-789'), res, () => {});

      expect(db.insert).toHaveBeenCalled();
      expect(out.data.progress.storyId).toBe('story_n4_01');
      expect(out.data.progress.status).toBe('in_progress');
      expect(out.data.xpAwarded).toBe(0);
    });
  });
});
