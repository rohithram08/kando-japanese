import { describe, it, expect, vi } from 'vitest';
import { lessonsRouter } from '../lessons.js';
import { AppError } from '../../middleware/errorHandler.js';

describe('Lessons Routes Handlers', () => {
  const getRouteHandler = (path: string, method: string) => {
    const layer = (lessonsRouter as any).stack.find((s: any) => s.route && s.route.path === path && s.route.methods[method]);
    if (!layer) throw new Error(`Route not found for ${method.toUpperCase()} ${path}`);
    return layer.route.stack[0].handle;
  };

  it('GET / with valid level returns lessons list', async () => {
    const handler = getRouteHandler('/', 'get');
    const req: any = { query: { level: 'N5' } };
    let jsonResult: any = null;
    const res: any = {
      json: (data: any) => { jsonResult = data; },
    };
    const next = vi.fn();

    await handler(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(jsonResult).toBeDefined();
    expect(jsonResult.lessons).toBeInstanceOf(Array);
    expect(jsonResult.lessons.length).toBe(5);
    expect(jsonResult.lessons[0].id).toBe('n5l001');
  });

  it('GET / with missing level calls next with AppError 400', async () => {
    const handler = getRouteHandler('/', 'get');
    const req: any = { query: {} };
    const res: any = { json: vi.fn() };
    const next = vi.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('INVALID_LEVEL');
  });

  it('GET / with invalid level calls next with AppError 400', async () => {
    const handler = getRouteHandler('/', 'get');
    const req: any = { query: { level: 'N99' } };
    const res: any = { json: vi.fn() };
    const next = vi.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
  });

  it('GET /:level/:day with valid params returns full lesson', async () => {
    const handler = getRouteHandler('/:level/:day', 'get');
    const req: any = { params: { level: 'N5', day: '1' } };
    let jsonResult: any = null;
    const res: any = {
      json: (data: any) => { jsonResult = data; },
    };
    const next = vi.fn();

    await handler(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(jsonResult).toBeDefined();
    expect(jsonResult.lesson).toBeDefined();
    expect(jsonResult.lesson.id).toBe('n5l001');
    expect(jsonResult.lesson.title).toBe('Greetings & Self-Introduction');
  });

  it('GET /:level/:day with invalid day calls next with AppError 400', async () => {
    const handler = getRouteHandler('/:level/:day', 'get');
    const req: any = { params: { level: 'N5', day: 'abc' } };
    const res: any = { json: vi.fn() };
    const next = vi.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('INVALID_DAY');
  });

  it('GET /:level/:day with nonexistent day calls next with AppError 404', async () => {
    const handler = getRouteHandler('/:level/:day', 'get');
    const req: any = { params: { level: 'N5', day: '99' } };
    const res: any = { json: vi.fn() };
    const next = vi.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('LESSON_NOT_FOUND');
  });
});
