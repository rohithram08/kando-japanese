import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { validate } from '../validate.js';
import { AppError } from '../errorHandler.js';

const schema = z.object({ body: z.object({ name: z.string().min(2) }), query: z.any(), params: z.any() });

describe('validate middleware', () => {
  it('passes valid input through', () => {
    const next = vi.fn();
    validate(schema)({ body: { name: 'ok' }, query: {}, params: {} } as never, {} as never, next);
    expect(next).toHaveBeenCalledWith();
  });

  // Regression: this used to be a plain object, which errorHandler turned into a 500.
  it('reports invalid input as a real AppError with status 400', () => {
    const next = vi.fn();
    validate(schema)({ body: { name: 'x' }, query: {}, params: {} } as never, {} as never, next);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err).toMatchObject({ statusCode: 400, code: 'VALIDATION_ERROR' });
  });
});
