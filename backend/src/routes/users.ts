import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { users, userLessonProgress, userKanjiProgress, userVocabularyProgress } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';
import { computeLevelStatus, getStudyLevel } from '../services/levelService.js';
import { avatarConfigSchema, parseAvatarConfig, serializeAvatarConfig, type AvatarConfig } from '../services/avatarConfig.js';
import { serializeProfile } from '../services/userSerializer.js';

export const usersRouter = Router();

usersRouter.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user!.userId)
    });
    
    if (!user) throw new AppError(404, 'User not found');
    
    res.json(serializeProfile(user));
  } catch (err) {
    next(err);
  }
});

const safeAvatarUrlRegex = /^\/storage\/avatars\/(?:[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9_\-.]+\.(jpg|jpeg|png|webp|gif)$/i;

export const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(100).optional(),
    nativeLanguage: z.string().max(50).optional(),
    currentLevel: z.enum(['N1', 'N2', 'N3', 'N4', 'N5']).optional(),
    studyLevel: z.enum(['N1', 'N2', 'N3', 'N4', 'N5']).optional(),
    avatarConfig: avatarConfigSchema.nullable().optional(),
    timezone: z.string().max(100).optional(),
    avatarUrl: z
      .string()
      .max(500)
      .refine(
        (val) => {
          let decoded = val;
          try {
            decoded = decodeURIComponent(val);
          } catch {
            return false;
          }
          if (
            decoded.includes('..') ||
            decoded.includes('\\') ||
            /\s/.test(decoded) ||
            decoded.includes('%')
          ) {
            return false;
          }
          return safeAvatarUrlRegex.test(decoded);
        },
        {
          message:
            'avatarUrl must be a safe relative path starting with /storage/avatars/ and ending with an allowed image extension (.jpg, .jpeg, .png, .webp, .gif)',
        }
      )
      .nullable()
      .optional(),
    avatarId: z
      .string()
      .max(100)
      .regex(/^[a-zA-Z0-9_\-./]+$/, 'avatarId must contain only alphanumeric characters, underscores, dashes, dots, or slashes')
      .refine((val) => {
        let decoded = val;
        try {
          decoded = decodeURIComponent(val);
        } catch {
          return false;
        }
        return !decoded.includes('..') && !decoded.includes('\\') && !decoded.includes('%');
      }, {
        message: 'avatarId must not contain path traversal or encoded characters',
      })
      .nullable()
      .optional(),
  }),
});

usersRouter.put('/profile', requireAuth, validate(updateProfileSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const updates = req.body;
    
    // Exactly one avatar kind may be set at a time: uploaded photo, preset, or custom cartoon.
    const avatarKindsSet = [updates.avatarUrl, updates.avatarId, updates.avatarConfig].filter(Boolean).length;
    if (avatarKindsSet > 1 && !(updates.avatarUrl && updates.avatarId)) {
      throw new AppError(
        400,
        'Provide only one of avatarUrl, avatarId or avatarConfig.',
        'AMBIGUOUS_AVATAR_UPDATE'
      );
    }

    // Reject ambiguous contradictory avatar updates
    if (updates.avatarUrl && updates.avatarId) {
      throw new AppError(
        400,
        'Cannot provide both avatarUrl and avatarId simultaneously. Choose either a custom avatar or a preset avatar.',
        'AMBIGUOUS_AVATAR_UPDATE'
      );
    }

    // Enforce ownership policy: custom avatar path must belong to the authenticated user or be a shared avatar
    if (updates.avatarUrl) {
      const isUserAvatar = updates.avatarUrl.startsWith(`/storage/avatars/${userId}/`);
      const isSharedAvatar = /^\/storage\/avatars\/[a-zA-Z0-9_\-.]+\.(jpg|jpeg|png|webp|gif)$/i.test(updates.avatarUrl);
      if (!isUserAvatar && !isSharedAvatar) {
        throw new AppError(
          403,
          'Cannot use an avatar belonging to another user',
          'FORBIDDEN_AVATAR_OWNERSHIP'
        );
      }
    }

    // Only update allowed fields
    const dbUpdates: {
      username?: string;
      nativeLanguage?: string;
      currentLevel?: string;
      studyLevel?: string;
      timezone?: string;
      avatarUrl?: string | null;
      avatarId?: string | null;
      avatarConfig?: string | null;
    } = {};

    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.nativeLanguage !== undefined) dbUpdates.nativeLanguage = updates.nativeLanguage;
    if (updates.currentLevel !== undefined) dbUpdates.currentLevel = updates.currentLevel;
    if (updates.studyLevel !== undefined) dbUpdates.studyLevel = updates.studyLevel;
    if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone;
    
    // Handle avatarUrl and avatarId coordination deterministically
    if (updates.avatarUrl !== undefined) {
      dbUpdates.avatarUrl = updates.avatarUrl;
      if (updates.avatarUrl !== null) {
        // Custom upload clears preset avatar
        dbUpdates.avatarId = null;
      }
    }
    
    if (updates.avatarId !== undefined) {
      dbUpdates.avatarId = updates.avatarId;
      if (updates.avatarId !== null) {
        // Setting a preset avatar clears custom avatarUrl
        dbUpdates.avatarUrl = null;
      }
    }

    // A custom cartoon avatar replaces photo/preset; choosing a photo/preset replaces the cartoon.
    if (updates.avatarConfig !== undefined) {
      dbUpdates.avatarConfig = serializeAvatarConfig(updates.avatarConfig as AvatarConfig | null);
      if (updates.avatarConfig !== null) {
        dbUpdates.avatarUrl = null;
        dbUpdates.avatarId = null;
      }
    }
    if ((updates.avatarUrl || updates.avatarId) && updates.avatarConfig === undefined) {
      dbUpdates.avatarConfig = null;
    }

    await db.update(users)
      .set(dbUpdates)
      .where(eq(users.id, userId));
      
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    
    if (!updatedUser) throw new AppError(404, 'User not found after update');
    res.json(serializeProfile(updatedUser));
  } catch (err) {
    next(err);
  }
});

usersRouter.delete('/account', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    
    // Drizzle with MySQL handles ON DELETE CASCADE for related tables 
    // because we defined constraints in the schema.
    // Delete the user record
    await db.delete(users).where(eq(users.id, userId));

    // Clear the auth cookie since the account is deleted
    res.clearCookie('token');
    res.clearCookie('auth_token');
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/level-status
 * Study level, unlocked levels and coverage of the current level.
 * Declared before '/:userId' so it is not captured by that route.
 */
usersRouter.get('/level-status', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const studyLevel = (await getStudyLevel(userId)) ?? 'N5';
    res.json(await computeLevelStatus(userId, studyLevel));
  } catch (err) {
    next(err);
  }
});

usersRouter.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) throw new AppError(404, 'User not found');

    const [lessonCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userLessonProgress)
      .where(eq(userLessonProgress.userId, user.id));

    const [kanjiCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userKanjiProgress)
      .where(eq(userKanjiProgress.userId, user.id));

    const [vocabCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userVocabularyProgress)
      .where(eq(userVocabularyProgress.userId, user.id));

    res.json({
      id: user.id,
      username: user.username,
      nativeLanguage: user.nativeLanguage,
      currentLevel: user.currentLevel,
      avatarUrl: user.avatarUrl,
      avatarId: user.avatarId,
      avatarConfig: parseAvatarConfig(user.avatarConfig),
      xpPoints: user.xpPoints,
      streakDays: user.streakDays,
      createdAt: user.createdAt,
      lessonsCount: Number(lessonCountResult?.count || 0),
      kanjiCount: Number(kanjiCountResult?.count || 0),
      vocabCount: Number(vocabCountResult?.count || 0),
    });
  } catch (err) {
    next(err);
  }
});
