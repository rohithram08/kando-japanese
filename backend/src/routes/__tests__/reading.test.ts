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

vi.mock('../../services/streakService.js', () => ({
  recordActivity: vi.fn().mockResolvedValue({}),
}));

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
    it('saves progress and awards XP when completing for the first time', async () => {
      const handler = getRouteHandler('/progress', 'post');
      const req: any = {
        user: { userId: 'user-456' },
        body: {
          storyId: 'story_n5_01',
          lastSentenceIndex: 9,
          status: 'completed',
          quizScore: 100,
        },
      };

      // Mock that it was not completed previously
      (db.query.userReadingProgress.findFirst as any)
        .mockResolvedValueOnce(null) // first check
        .mockResolvedValueOnce({
          id: 'prog-1',
          userId: 'user-456',
          storyId: 'story_n5_01',
          status: 'completed',
          lastSentenceIndex: 9,
          quizScore: 100,
        }); // updated check

      let responseData: any = null;
      const res: any = {
        json: (data: any) => {
          responseData = data;
        },
      };

      await handler(req, res, () => {});

      expect(db.insert).toHaveBeenCalled();
      expect(db.update).toHaveBeenCalled(); // user XP updated
      expect(recordActivity).toHaveBeenCalledWith('user-456', expect.any(String));
      expect(responseData.xpAwarded).toBe(75); // 50 base + 25 bonus
      expect(responseData.progress.status).toBe('completed');
    });

    it('does not re-award XP if story was already completed', async () => {
      const handler = getRouteHandler('/progress', 'post');
      const req: any = {
        user: { userId: 'user-456' },
        body: {
          storyId: 'story_n5_01',
          lastSentenceIndex: 9,
          status: 'completed',
          quizScore: 100,
        },
      };

      const previouslyCompleted = {
        id: 'prog-1',
        userId: 'user-456',
        storyId: 'story_n5_01',
        status: 'completed',
        lastSentenceIndex: 9,
        quizScore: 100,
      };

      (db.query.userReadingProgress.findFirst as any)
        .mockResolvedValueOnce(previouslyCompleted)
        .mockResolvedValueOnce(previouslyCompleted);

      let responseData: any = null;
      const res: any = {
        json: (data: any) => {
          responseData = data;
        },
      };

      await handler(req, res, () => {});

      expect(db.update).not.toHaveBeenCalled(); // no XP added
      expect(responseData.xpAwarded).toBe(0);
    });

    it('successfully saves and tracks in_progress for an expanded N4 story', async () => {
      const handler = getRouteHandler('/progress', 'post');
      const req: any = {
        user: { userId: 'user-789' },
        body: {
          storyId: 'story_n4_01',
          lastSentenceIndex: 3,
          status: 'in_progress',
        },
      };

      (db.query.userReadingProgress.findFirst as any)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'prog-n4-1',
          userId: 'user-789',
          storyId: 'story_n4_01',
          status: 'in_progress',
          lastSentenceIndex: 3,
          quizScore: null,
        });

      let responseData: any = null;
      const res: any = {
        json: (data: any) => {
          responseData = data;
        },
      };

      await handler(req, res, () => {});

      expect(db.insert).toHaveBeenCalled();
      expect(responseData.progress.storyId).toBe('story_n4_01');
      expect(responseData.progress.status).toBe('in_progress');
      expect(responseData.xpAwarded).toBe(0);
    });
  });
});
