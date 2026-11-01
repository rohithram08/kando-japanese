import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { users, userLessonProgress, userKanjiProgress, userVocabularyProgress } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';
import { computeLevelStatus, getStudyLevel } from '../services/levelService.js';
import { avatarConfigSchema, parseAvatarConfig, serializeAvatarConfig, type AvatarConfig } from '../services/avatarConfig.js';
import { serializeProfile } from '../services/userSerializer.js';
import { getFollowCounts, isFollowing } from '../services/socialService.js';
import { createAlert, getInbox, markRead, STUDY_ALERT_TYPES, type StudyAlertType } from '../services/alertService.js';

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

/**
 * POST /api/users/qualify-placement
 * Qualifies a user for a higher level (N4..N1) if they achieve >= 80% on the qualification test.
 */
const qualifyPlacementSchema = z.object({
  body: z.object({
    targetLevel: z.enum(['N4', 'N3', 'N2', 'N1']),
    score: z.number().int().min(0),
    totalQuestions: z.number().int().min(1),
  }),
});

usersRouter.post(
  '/qualify-placement',
  requireAuth,
  validate(qualifyPlacementSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { targetLevel, score, totalQuestions } = req.body;

      const ratio = score / totalQuestions;
      if (ratio < 0.8) {
        throw new AppError(400, 'Score below 80% passing threshold for qualification. Beginning at N5.');
      }

      await db
        .update(users)
        .set({
          studyLevel: targetLevel,
          currentLevel: targetLevel,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      res.json({
        success: true,
        qualifiedLevel: targetLevel,
        message: `Successfully qualified and unlocked JLPT ${targetLevel}!`,
      });
    } catch (err) {
      next(err);
    }
  }
);

/** GET /api/users/alerts/inbox - alerts other learners sent me. Declared before '/:userId'. */
usersRouter.get('/alerts/inbox', requireAuth, async (req, res, next) => {
  try {
    res.json(await getInbox(req.user!.userId));
  } catch (err) {
    next(err);
  }
});

const markReadSchema = z.object({ body: z.object({ ids: z.array(z.string().uuid()).max(100).optional() }) });

/** POST /api/users/alerts/read { ids? } - mark some (or all) alerts as read. */
usersRouter.post('/alerts/read', requireAuth, validate(markReadSchema), async (req, res, next) => {
  try {
    await markRead(req.user!.userId, req.body.ids);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

usersRouter.get('/:userId', optionalAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.userId ?? null;
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // Learners who opted out of leagues/leaderboards are private: indistinguishable from missing.
    if (!user || (user.leagueOptOut && user.id !== viewerId)) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');

    const [[lessonCountResult], [kanjiCountResult], [vocabCountResult], counts, following] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(userLessonProgress).where(eq(userLessonProgress.userId, user.id)),
      db.select({ count: sql<number>`count(*)` }).from(userKanjiProgress).where(eq(userKanjiProgress.userId, user.id)),
      db.select({ count: sql<number>`count(*)` }).from(userVocabularyProgress).where(eq(userVocabularyProgress.userId, user.id)),
      getFollowCounts(user.id),
      viewerId && viewerId !== user.id ? isFollowing(viewerId, user.id) : Promise.resolve(false),
    ]);

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
      followersCount: counts.followers,
      followingCount: counts.following,
      isFollowing: following,
      isSelf: viewerId === user.id,
    });
  } catch (err) {
    next(err);
  }
});

// ─── Peer study alerts ───────────────────────────────────────────────────────
export { STUDY_ALERT_TYPES, type StudyAlertType };

export const sendAlertSchema = z.object({
  body: z.object({
    alertType: z.enum(['study', 'streak', 'cheer', 'league']),
  }),
});

usersRouter.post('/:userId/alert', requireAuth, validate(sendAlertSchema), async (req, res, next) => {
  try {
    const senderId = req.user!.userId;
    const targetUserId = req.params.userId;
    const { alertType } = req.body;

    if (senderId === targetUserId) {
      throw new AppError(400, 'Cannot send a study alert to yourself', 'SELF_ALERT_FORBIDDEN');
    }

    const targetUser = await db.query.users.findFirst({ where: eq(users.id, targetUserId) });
    // Opted-out learners are private: they cannot be messaged either.
    if (!targetUser || targetUser.leagueOptOut) {
      throw new AppError(404, 'User not found');
    }

    const { sentAt } = await createAlert(senderId, targetUserId, alertType as StudyAlertType);
    const sender = await db.query.users.findFirst({ where: eq(users.id, senderId) });
    const template = STUDY_ALERT_TYPES[alertType as StudyAlertType];

    res.json({
      success: true,
      message: 'Study alert sent successfully',
      alert: {
        type: template.type,
        label: template.label,
        text: template.text,
        icon: template.icon,
        senderName: sender?.username || 'A fellow learner',
        recipientId: targetUser.id,
        sentAt,
      },
    });
  } catch (err) {
    next(err);
  }
});
