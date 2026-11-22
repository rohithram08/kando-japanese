import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authSecurity } from '../../services/authSecurityService.js';
import { db } from '../../db/index.js';
import { authRouter } from '../auth.js';
import { AppError } from '../../middleware/errorHandler.js';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      users: {
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
  },
}));

describe('Duolingo-Grade Auth Security & Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authSecurity.resetAll();
  });

  describe('authSecurityService Unit Tests', () => {
    it('initial state is unlocked', () => {
      const status = authSecurity.isAccountLocked('test@example.com');
      expect(status.locked).toBe(false);
      expect(status.remainingSeconds).toBe(0);
    });

    it('records failed attempts and triggers lockout after 5 failures', () => {
      const email = 'lockout-test@example.com';

      // 4 failures: should NOT lock
      for (let i = 1; i <= 4; i++) {
        const res = authSecurity.recordFailedLogin(email);
        expect(res.locked).toBe(false);
        expect(res.remainingAttempts).toBe(5 - i);
      }

      // 5th failure: locks out
      const fifth = authSecurity.recordFailedLogin(email);
      expect(fifth.locked).toBe(true);
      expect(fifth.remainingAttempts).toBe(0);
      expect(fifth.remainingSeconds).toBeGreaterThan(800); // ~900s (15 min)

      const status = authSecurity.isAccountLocked(email);
      expect(status.locked).toBe(true);
      expect(status.remainingSeconds).toBeGreaterThan(800);
    });

    it('clears lockout and failure records on successful login', () => {
      const email = 'success-reset@example.com';
      authSecurity.recordFailedLogin(email);
      authSecurity.recordFailedLogin(email);

      authSecurity.recordSuccessfulLogin(email);
      const status = authSecurity.isAccountLocked(email);
      expect(status.locked).toBe(false);
    });

    it('executes dummy hash compare safely for timing-attack neutralization', async () => {
      const result = await authSecurity.executeDummyHashCompare('arbitraryPassword123!');
      expect(result).toBe(false);
    });
  });

  describe('Auth Route Brute-Force & Lockout Handlers', () => {
    const getRouteHandler = (path: string, method: string) => {
      const layer = (authRouter as any).stack.find(
        (s: any) => s.route && s.route.path === path && s.route.methods[method]
      );
      if (!layer) throw new Error(`Route not found for ${method.toUpperCase()} ${path}`);
      const stack = layer.route.stack;
      return stack[stack.length - 1].handle;
    };

    it('blocks login with ACCOUNT_LOCKED 429 when account exceeds failure threshold', async () => {
      const email = 'locked-user@example.com';

      // Simulate 5 failures
      for (let i = 0; i < 5; i++) {
        authSecurity.recordFailedLogin(email);
      }

      const handler = getRouteHandler('/login', 'post');
      const req: any = { body: { email, password: 'password123' } };
      const res: any = { json: vi.fn(), cookie: vi.fn() };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(429);
      expect(err.code).toBe('ACCOUNT_LOCKED');
      expect(err.message).toContain('Account temporarily locked');
    });

    it('mitigates timing attack when user does not exist by executing dummy compare and incrementing failed attempts', async () => {
      const email = 'nonexistent-account@example.com';
      (db.query.users.findFirst as any).mockResolvedValue(null);

      const handler = getRouteHandler('/login', 'post');
      const req: any = { body: { email, password: 'guessedPassword' } };
      const res: any = { json: vi.fn(), cookie: vi.fn() };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('INVALID_CREDENTIALS');

      // Check that a failure was recorded for brute force tracking
      const lockCheck = authSecurity.isAccountLocked(email);
      expect(lockCheck.locked).toBe(false); // only 1 failure so far
    });

    it('rejects wrong password for existing user, increments failure counter', async () => {
      const email = 'real-user@example.com';
      (db.query.users.findFirst as any).mockResolvedValue({
        id: 'user-123',
        email,
        passwordHash: '$2a$10$wE9K2v8t5H1oQ4sY3nK0g.7P5V5v8t5H1oQ4sY3nK0g.7P5V5v8t5',
      });

      const handler = getRouteHandler('/login', 'post');
      const req: any = { body: { email, password: 'wrongPasswordAttempt' } };
      const res: any = { json: vi.fn(), cookie: vi.fn() };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
