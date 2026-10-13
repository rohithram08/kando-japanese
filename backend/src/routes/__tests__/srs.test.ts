import { describe, it, expect, vi, beforeEach } from 'vitest';
import { srsRouter } from '../srs.js';
import { db } from '../../db/index.js';

// Mock DB
vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      srsCards: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue([{}]),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{}]),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{ count: 3 }]),
      })),
    })),
  },
}));

function getRouteHandler(path: string, method: string) {
  const layer = (srsRouter as any).stack.find(
    (l: any) => l.route && l.route.path === path && l.route.methods[method]
  );
  if (!layer) throw new Error(`Route handler not found for ${method.toUpperCase()} ${path}`);
  return layer.route.stack[layer.route.stack.length - 1].handle;
}

describe('SRS Routes — Backend API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /due', () => {
    it('returns due cards for authenticated user', async () => {
      const handler = getRouteHandler('/due', 'get');
      const req: any = {
        user: { userId: 'user-123' },
        query: { limit: '20' },
      };

      const mockCards = [
        {
          id: 'card-1',
          userId: 'user-123',
          cardType: 'vocabulary',
          cardRefId: 'v1',
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
          nextReviewDate: '2026-08-24',
          isMastered: false,
        },
      ];

      (db.query.srsCards.findMany as any).mockResolvedValueOnce(mockCards);

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.cards).toHaveLength(1);
      expect(result.cards[0].id).toBe('card-1');
    });
  });

  describe('GET /due/count', () => {
    it('returns count of due cards', async () => {
      const handler = getRouteHandler('/due/count', 'get');
      const req: any = { user: { userId: 'user-123' } };

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result).toEqual({ count: 3 });
    });
  });

  describe('POST /cards', () => {
    it('adds a new card to SRS', async () => {
      const handler = getRouteHandler('/cards', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { cardType: 'vocabulary', cardRefId: 'v100' },
      };

      (db.query.srsCards.findFirst as any)
        .mockResolvedValueOnce(null) // not existing
        .mockResolvedValueOnce({
          id: 'card-new',
          userId: 'user-123',
          cardType: 'vocabulary',
          cardRefId: 'v100',
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
          isMastered: false,
        });

      let result: any = null;
      let statusCode = 200;
      const res: any = {
        status: (code: number) => {
          statusCode = code;
          return res;
        },
        json: (data: any) => { result = data; },
      };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(statusCode).toBe(201);
      expect(result.card.cardRefId).toBe('v100');
    });

    it('adds a new kana card to SRS', async () => {
      const handler = getRouteHandler('/cards', 'post');
      const req: any = {
        user: { userId: 'user-123' },
        body: { cardType: 'kana', cardRefId: 'h_a' },
      };

      (db.query.srsCards.findFirst as any)
        .mockResolvedValueOnce(null) // not existing
        .mockResolvedValueOnce({
          id: 'card-kana-1',
          userId: 'user-123',
          cardType: 'kana',
          cardRefId: 'h_a',
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
          isMastered: false,
        });

      let result: any = null;
      let statusCode = 200;
      const res: any = {
        status: (code: number) => {
          statusCode = code;
          return res;
        },
        json: (data: any) => { result = data; },
      };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(statusCode).toBe(201);
      expect(result.card.cardType).toBe('kana');
      expect(result.card.cardRefId).toBe('h_a');
    });
  });

  describe('PUT /cards/:id/review', () => {
    it('applies SM-2 algorithm and updates card on successful review', async () => {
      const handler = getRouteHandler('/cards/:id/review', 'put');
      const req: any = {
        user: { userId: 'user-123' },
        params: { id: 'card-1' },
        body: { quality: 4, intervalMode: 'balanced' },
      };

      (db.query.srsCards.findFirst as any)
        .mockResolvedValueOnce({
          id: 'card-1',
          userId: 'user-123',
          cardType: 'vocabulary',
          cardRefId: 'v1',
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 1,
          isMastered: false,
        })
        .mockResolvedValueOnce({
          id: 'card-1',
          userId: 'user-123',
          cardType: 'vocabulary',
          cardRefId: 'v1',
          easeFactor: 2.5,
          intervalDays: 6,
          repetitions: 2,
          isMastered: false,
        });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result.card.repetitions).toBe(2);
      expect(result.card.intervalDays).toBe(6);
    });

    it('resets repetitions to 0 and interval to 1 on an incorrect review (lapse)', async () => {
      const handler = getRouteHandler('/cards/:id/review', 'put');
      const req: any = {
        user: { userId: 'user-123' },
        params: { id: 'card-1' },
        body: { quality: 1, intervalMode: 'balanced' },
      };

      (db.query.srsCards.findFirst as any)
        .mockResolvedValueOnce({
          id: 'card-1',
          userId: 'user-123',
          cardType: 'vocabulary',
          cardRefId: 'v1',
          easeFactor: 2.5,
          intervalDays: 14,
          repetitions: 4,
          isMastered: false,
        })
        .mockResolvedValueOnce({
          id: 'card-1',
          userId: 'user-123',
          cardType: 'vocabulary',
          cardRefId: 'v1',
          easeFactor: 2.3,
          intervalDays: 1,
          repetitions: 0,
          isMastered: false,
        });

      let result: any = null;
      const res: any = { json: (data: any) => { result = data; } };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(result.card.repetitions).toBe(0);
      expect(result.card.intervalDays).toBe(1);
    });
  });
});
