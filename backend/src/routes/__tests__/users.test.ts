import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  usersRouter,
  updateProfileSchema,
  sendAlertSchema,
  alertCooldowns,
} from '../users.js';
import { db } from '../../db/index.js';
import { AppError } from '../../middleware/errorHandler.js';

// Mock DB
vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{}]),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn().mockResolvedValue([{}]),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{ count: 5 }]),
      })),
    })),
  },
}));

function getRouteHandler(path: string, method: string) {
  const layer = (usersRouter as any).stack.find(
    (l: any) => l.route && l.route.path === path && l.route.methods[method]
  );
  if (!layer) throw new Error(`Route handler not found for ${method.toUpperCase()} ${path}`);
  return layer.route.stack[layer.route.stack.length - 1].handle;
}

describe('Users Routes — Backend API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateProfileSchema Validation', () => {
    it('accepts valid relative avatar URLs under /storage/avatars/', () => {
      const validCases = [
        '/storage/avatars/user-123/photo.png',
        '/storage/avatars/u_456/profile.jpg',
        '/storage/avatars/u-789/avatar.jpeg',
        '/storage/avatars/test/avatar.webp',
        '/storage/avatars/anim.gif',
      ];

      for (const avatarUrl of validCases) {
        const result = updateProfileSchema.safeParse({ body: { avatarUrl } });
        expect(result.success).toBe(true);
      }
    });

    it('accepts null avatarUrl and avatarId to clear them', () => {
      const result = updateProfileSchema.safeParse({
        body: { avatarUrl: null, avatarId: null },
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid preset and storage avatarId values', () => {
      const validIds = ['avatar-1', 'avatar-15', 'avatars/user-1/uuid.png'];
      for (const avatarId of validIds) {
        const result = updateProfileSchema.safeParse({ body: { avatarId } });
        expect(result.success).toBe(true);
      }
    });

    it('accepts valid JLPT level enums N1-N5', () => {
      const validLevels = ['N1', 'N2', 'N3', 'N4', 'N5'];
      for (const currentLevel of validLevels) {
        const result = updateProfileSchema.safeParse({ body: { currentLevel } });
        expect(result.success).toBe(true);
      }
    });

    it('rejects external URLs (e.g. https://, http://)', () => {
      const externalUrls = [
        'https://example.com/avatar.jpg',
        'http://attacker.com/profile.png',
        '//cdn.evil.com/pic.png',
      ];
      for (const avatarUrl of externalUrls) {
        const result = updateProfileSchema.safeParse({ body: { avatarUrl } });
        expect(result.success).toBe(false);
      }
    });

    it('rejects unsafe URI schemes (javascript:, data:)', () => {
      const unsafeUrls = [
        'javascript:alert(1)',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
        'vbscript:msgbox',
      ];
      for (const avatarUrl of unsafeUrls) {
        const result = updateProfileSchema.safeParse({ body: { avatarUrl } });
        expect(result.success).toBe(false);
      }
    });

    it('rejects path traversal attempts in avatarUrl (.. or \\ or encoded %2e%2e)', () => {
      const traversalUrls = [
        '/storage/avatars/../../etc/passwd.jpg',
        '/storage/avatars/user/..\\exploit.png',
        '/storage/avatars/../secrets.webp',
        '/storage/avatars/u-123/%2e%2e/passwd.jpg',
        '/storage/avatars/u-123/%2e%2e%2fpasswd.jpg',
      ];
      for (const avatarUrl of traversalUrls) {
        const result = updateProfileSchema.safeParse({ body: { avatarUrl } });
        expect(result.success).toBe(false);
      }
    });

    it('rejects disallowed file extensions in avatarUrl', () => {
      const invalidExts = [
        '/storage/avatars/user/payload.exe',
        '/storage/avatars/user/shell.sh',
        '/storage/avatars/user/code.js',
        '/storage/avatars/user/markup.html',
        '/storage/avatars/user/vector.svg',
      ];
      for (const avatarUrl of invalidExts) {
        const result = updateProfileSchema.safeParse({ body: { avatarUrl } });
        expect(result.success).toBe(false);
      }
    });

    it('rejects path traversal in avatarId', () => {
      const result = updateProfileSchema.safeParse({
        body: { avatarId: '../secrets' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid JLPT level strings', () => {
      const invalidLevels = ['N0', 'N6', 'Expert', 'B2'];
      for (const currentLevel of invalidLevels) {
        const result = updateProfileSchema.safeParse({ body: { currentLevel } });
        expect(result.success).toBe(false);
      }
    });
  });

  describe('PUT /profile', () => {
    it('updates allowed user fields including nativeLanguage and safe avatarUrl belonging to user', async () => {
      const handler = getRouteHandler('/profile', 'put');
      const req: any = {
        user: { userId: 'u-123' },
        body: {
          username: 'KenjiUpdated',
          nativeLanguage: 'japanese',
          currentLevel: 'N3',
          avatarUrl: '/storage/avatars/u-123/new_photo.png',
        },
      };
      let jsonResult: any = null;
      const res: any = {
        json: (data: any) => { jsonResult = data; },
      };
      const next = vi.fn();

      vi.mocked(db.query.users.findFirst).mockResolvedValue({
        id: 'u-123',
        username: 'KenjiUpdated',
        nativeLanguage: 'japanese',
        currentLevel: 'N3',
        avatarUrl: '/storage/avatars/u-123/new_photo.png',
        avatarId: null,
      } as any);

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(db.update).toHaveBeenCalled();
      expect(jsonResult).toBeDefined();
      expect(jsonResult.username).toBe('KenjiUpdated');
      expect(jsonResult.nativeLanguage).toBe('japanese');
      expect(jsonResult.avatarUrl).toBe('/storage/avatars/u-123/new_photo.png');
    });

    it('rejects avatarUrl when it belongs to another user (ownership policy enforcement)', async () => {
      const handler = getRouteHandler('/profile', 'put');
      const req: any = {
        user: { userId: 'u-123' },
        body: {
          avatarUrl: '/storage/avatars/victim-999/private.png',
        },
      };
      const res: any = { json: vi.fn() };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(403);
      expect(err.message).toContain('another user');
    });

    it('rejects ambiguous contradictory update with both avatarUrl and avatarId present', async () => {
      const handler = getRouteHandler('/profile', 'put');
      const req: any = {
        user: { userId: 'u-123' },
        body: {
          avatarUrl: '/storage/avatars/u-123/new_photo.png',
          avatarId: 'avatar-5',
        },
      };
      const res: any = { json: vi.fn() };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(400);
      expect(err.message).toContain('simultaneously');
    });

    it('clears avatarUrl when a preset avatarId is selected', async () => {
      const handler = getRouteHandler('/profile', 'put');
      const req: any = {
        user: { userId: 'u-123' },
        body: {
          avatarId: 'avatar-5',
        },
      };
      let jsonResult: any = null;
      const res: any = {
        json: (data: any) => { jsonResult = data; },
      };
      const next = vi.fn();

      vi.mocked(db.query.users.findFirst).mockResolvedValue({
        id: 'u-123',
        username: 'Kenji',
        avatarId: 'avatar-5',
        avatarUrl: null,
      } as any);

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(jsonResult.avatarId).toBe('avatar-5');
      expect(jsonResult.avatarUrl).toBeNull();
    });
  });

  describe('GET /:userId', () => {
    it('returns public profile for an existing user', async () => {
      const handler = getRouteHandler('/:userId', 'get');
      const req: any = { params: { userId: 'u-123' } };
      let jsonResult: any = null;
      const res: any = {
        json: (data: any) => { jsonResult = data; },
      };
      const next = vi.fn();

      vi.mocked(db.query.users.findFirst).mockResolvedValue({
        id: 'u-123',
        email: 'private@test.com',
        username: 'Kenji',
        passwordHash: 'secret-hash',
        nativeLanguage: 'English',
        currentLevel: 'N4',
        avatarUrl: '/storage/avatars/u-123/avatar.jpg',
        avatarId: null,
        xpPoints: 1200,
        streakDays: 7,
        googleId: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      } as any);

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(jsonResult).toBeDefined();
      expect(jsonResult.id).toBe('u-123');
      expect(jsonResult.username).toBe('Kenji');
      expect(jsonResult.xpPoints).toBe(1200);
      expect(jsonResult.streakDays).toBe(7);
      expect(jsonResult.currentLevel).toBe('N4');
      // Password and private fields MUST be stripped
      expect(jsonResult.passwordHash).toBeUndefined();
      expect(jsonResult.email).toBeUndefined();
      expect(jsonResult.googleId).toBeUndefined();
    });

    it('returns AppError 404 when user is not found', async () => {
      const handler = getRouteHandler('/:userId', 'get');
      const req: any = { params: { userId: 'non-existent' } };
      const res: any = { json: vi.fn() };
      const next = vi.fn();

      vi.mocked(db.query.users.findFirst).mockResolvedValue(null as any);

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('User not found');
    });
  });

  describe('sendAlertSchema and Peer Study Alerts', () => {
    it('accepts only predefined alert types: study, streak, cheer, league', () => {
      for (const alertType of ['study', 'streak', 'cheer', 'league']) {
        const result = sendAlertSchema.safeParse({ body: { alertType } });
        expect(result.success).toBe(true);
      }
    });

    it('rejects custom free-form chat messages and invalid alert types', () => {
      const invalidCases = [
        { alertType: 'custom_message', message: 'Hello meet me at...' },
        { alertType: 'free_chat' },
        { alertType: 'random' },
        {},
      ];
      for (const c of invalidCases) {
        const result = sendAlertSchema.safeParse({ body: c });
        expect(result.success).toBe(false);
      }
    });

    it('rejects sending an alert to oneself', async () => {
      const handler = getRouteHandler('/:userId/alert', 'post');
      const req: any = {
        user: { userId: 'u-123' },
        params: { userId: 'u-123' },
        body: { alertType: 'study' },
      };
      const res: any = { json: vi.fn() };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('SELF_ALERT_FORBIDDEN');
    });

    it('returns 404 when target recipient is not found', async () => {
      const handler = getRouteHandler('/:userId/alert', 'post');
      const req: any = {
        user: { userId: 'u-123' },
        params: { userId: 'non-existent' },
        body: { alertType: 'streak' },
      };
      const res: any = { json: vi.fn() };
      const next = vi.fn();

      vi.mocked(db.query.users.findFirst).mockResolvedValue(null as any);

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(404);
    });

    it('sends canned alert with sender username and predefined text', async () => {
      const handler = getRouteHandler('/:userId/alert', 'post');
      alertCooldowns.clear();
      const req: any = {
        user: { userId: 'u-sender' },
        params: { userId: 'u-target' },
        body: { alertType: 'cheer' },
      };
      let jsonResult: any;
      const res: any = {
        json: vi.fn((data) => {
          jsonResult = data;
        }),
      };
      const next = vi.fn();

      vi.mocked(db.query.users.findFirst)
        .mockResolvedValueOnce({ id: 'u-target', username: 'Sakura' } as any)
        .mockResolvedValueOnce({ id: 'u-sender', username: 'Rohith' } as any);

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(jsonResult).toBeDefined();
      expect(jsonResult.success).toBe(true);
      expect(jsonResult.alert.type).toBe('cheer');
      expect(jsonResult.alert.text).toBe('Ganbatte! You can do it! 🌸');
      expect(jsonResult.alert.senderName).toBe('Rohith');
      expect(jsonResult.alert.recipientId).toBe('u-target');
    });

    it('enforces cooldown on rapid duplicate alerts to the same user', async () => {
      const handler = getRouteHandler('/:userId/alert', 'post');
      alertCooldowns.clear();
      const req: any = {
        user: { userId: 'u-sender-rate' },
        params: { userId: 'u-target-rate' },
        body: { alertType: 'study' },
      };
      const res: any = { json: vi.fn() };
      const next = vi.fn();

      vi.mocked(db.query.users.findFirst)
        .mockResolvedValue({ id: 'u-target-rate', username: 'Target' } as any);

      // First call succeeds
      await handler(req, res, next);
      expect(res.json).toHaveBeenCalled();

      // Second immediate call must be rate limited (429)
      const next2 = vi.fn();
      await handler(req, res, next2);
      expect(next2).toHaveBeenCalledTimes(1);
      const err = next2.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(429);
      expect(err.code).toBe('ALERT_COOLDOWN');
    });
  });
});
