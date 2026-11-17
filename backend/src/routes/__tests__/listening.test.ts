import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listeningRouter } from '../listening.js';
import { db } from '../../db/index.js';
import { LISTENING_SCENARIOS } from '../../services/listeningContentService.js';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      userListeningProgress: {
        findFirst: vi.fn(),
      },
      userStudySessions: {
        findFirst: vi.fn(),
      },
      userStreaks: {
        findFirst: vi.fn(),
      },
    },
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([]),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue([{}]),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{}]),
      })),
    })),
  },
}));

vi.mock('../../services/studySessionService.js', () => ({
  recordStudySession: vi.fn().mockResolvedValue({
    sessionId: 'test-session-123',
    awardedXp: 25,
  }),
}));

function getRouteHandler(path: string, method: string) {
  const layer = (listeningRouter as any).stack.find(
    (l: any) => l.route && l.route.path === path && l.route.methods[method]
  );
  if (!layer) throw new Error(`Route handler not found for ${method.toUpperCase()} ${path}`);
  return layer.route.stack[layer.route.stack.length - 1].handle;
}

describe('Listening Routes & Content API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /scenarios returns scenarios list with N5 focus', async () => {
    const handler = getRouteHandler('/scenarios', 'get');
    const req: any = { query: {} };
    let jsonResult: any = null;
    const res: any = {
      json: (data: any) => {
        jsonResult = data;
      },
    };

    await handler(req, res, vi.fn());

    expect(jsonResult).toBeDefined();
    expect(jsonResult.scenarios.length).toBeGreaterThanOrEqual(5);
    const n5Items = jsonResult.scenarios.filter((s: any) => s.level === 'N5');
    expect(n5Items.length).toBeGreaterThanOrEqual(3);
  });

  it('GET /scenarios?level=N5 filters only N5 scenarios', async () => {
    const handler = getRouteHandler('/scenarios', 'get');
    const req: any = { query: { level: 'N5' } };
    let jsonResult: any = null;
    const res: any = {
      json: (data: any) => {
        jsonResult = data;
      },
    };

    await handler(req, res, vi.fn());

    expect(jsonResult).toBeDefined();
    expect(jsonResult.scenarios.every((s: any) => s.level === 'N5')).toBe(true);
  });

  it('GET /scenarios/:id returns complete storyboard and Choukai exam', async () => {
    const handler = getRouteHandler('/scenarios/:id', 'get');
    const req: any = { params: { id: 'n5_convenience_store' } };
    let jsonResult: any = null;
    const res: any = {
      json: (data: any) => {
        jsonResult = data;
      },
    };

    await handler(req, res, vi.fn());

    expect(jsonResult).toBeDefined();
    expect(jsonResult.scenario.id).toBe('n5_convenience_store');
    expect(jsonResult.scenario.storyboard.length).toBe(3);
    expect(jsonResult.scenario.dialogue.length).toBe(6);
    expect(jsonResult.scenario.vocabulary.length).toBe(5);
    expect(jsonResult.scenario.examQuestions.length).toBe(2);
  });

  it('GET /scenarios/:id returns 404 for unknown scenario', async () => {
    const handler = getRouteHandler('/scenarios/:id', 'get');
    const req: any = { params: { id: 'non_existent_scenario' } };
    const next = vi.fn();

    await handler(req, { json: vi.fn() }, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(404);
  });

  it('POST /progress records verified listening completion and awards XP', async () => {
    const handler = getRouteHandler('/progress', 'post');
    const req: any = {
      user: { userId: 'student-123' },
      body: {
        scenarioId: 'n5_convenience_store',
        durationSeconds: 120,
        completed: true,
        score: 100,
        wordsCheckedCount: 5,
      },
    };
    let jsonResult: any = null;
    const res: any = {
      json: (data: any) => {
        jsonResult = data;
      },
    };

    await handler(req, res, vi.fn());

    expect(jsonResult).toBeDefined();
    expect(jsonResult.success).toBe(true);
    expect(jsonResult.awardedXp).toBe(25);
  });
});
