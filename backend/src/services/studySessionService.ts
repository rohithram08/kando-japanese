import { randomUUID } from 'node:crypto';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  userStudySessions,
  userListeningProgress,
  userStreaks,
  users,
} from '../db/schema.js';
import { recordXpEvent } from './xpLedger.js';

export interface RecordSessionInput {
  activityType: 'listening' | 'reading' | 'grammar' | 'kanji' | 'conversation';
  level: string;
  itemId: string;
  durationSeconds: number;
  completed?: boolean;
  score?: number | null;
  metadata?: Record<string, unknown> | null;
}

export interface ActivityBreakdown {
  activityType: string;
  totalSeconds: number;
  totalMinutes: number;
  hours: number;
  sessionCount: number;
}

export interface DailyStudyBreakdown {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  totalMinutes: number;
  listeningMinutes: number;
  readingMinutes: number;
  otherMinutes: number;
}

export interface StudySummaryResponse {
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  listeningHours: number;
  readingHours: number;
  todayMinutes: number;
  weekMinutes: number;
  totalSessions: number;
  byActivity: Record<string, ActivityBreakdown>;
  weeklyTrend: DailyStudyBreakdown[];
  recentSessions: Array<{
    id: string;
    activityType: string;
    level: string;
    itemId: string;
    durationSeconds: number;
    completed: boolean;
    score: number | null;
    createdAt: Date;
  }>;
}

/**
 * Record an active, verified study session heartbeat or completion.
 * Guards against idle farming by capping max duration per log to 3600 seconds (1 hour).
 */
export async function recordStudySession(
  userId: string,
  input: RecordSessionInput
): Promise<{ sessionId: string; awardedXp: number }> {
  const safeDuration = Math.min(Math.max(1, Math.round(input.durationSeconds)), 3600);
  const sessionId = randomUUID();
  const safeLevel = (input.level || 'N5').toUpperCase();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // 1. Insert session record
  await db.insert(userStudySessions).values({
    id: sessionId,
    userId,
    activityType: input.activityType,
    level: safeLevel,
    itemId: input.itemId,
    durationSeconds: safeDuration,
    completed: Boolean(input.completed),
    score: typeof input.score === 'number' ? Math.round(input.score) : null,
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    createdAt: now,
  });

  // 2. If listening, update listening progress
  if (input.activityType === 'listening') {
    const existing = await db.query.userListeningProgress.findFirst({
      where: and(
        eq(userListeningProgress.userId, userId),
        eq(userListeningProgress.scenarioId, input.itemId)
      ),
    });

    if (existing) {
      const bestScore =
        typeof input.score === 'number'
          ? Math.max(existing.bestScore ?? 0, input.score)
          : existing.bestScore;

      await db
        .update(userListeningProgress)
        .set({
          listenedCount: sql`${userListeningProgress.listenedCount} + 1`,
          totalSeconds: sql`${userListeningProgress.totalSeconds} + ${safeDuration}`,
          bestScore,
          lastListenedAt: now,
        })
        .where(eq(userListeningProgress.id, existing.id));
    } else {
      await db.insert(userListeningProgress).values({
        id: randomUUID(),
        userId,
        scenarioId: input.itemId,
        level: safeLevel,
        listenedCount: 1,
        bestScore: typeof input.score === 'number' ? input.score : null,
        totalSeconds: safeDuration,
        lastListenedAt: now,
      });
    }
  }

  // 3. Update userStreaks minutes_studied for today
  const minutesToAdd = Math.max(1, Math.round(safeDuration / 60));
  try {
    const existingStreak = await db.query.userStreaks.findFirst({
      where: and(eq(userStreaks.userId, userId), eq(userStreaks.date, todayStr)),
    });

    if (existingStreak) {
      await db
        .update(userStreaks)
        .set({
          minutesStudied: sql`${userStreaks.minutesStudied} + ${minutesToAdd}`,
        })
        .where(and(eq(userStreaks.userId, userId), eq(userStreaks.date, todayStr)));
    } else {
      await db.insert(userStreaks).values({
        userId,
        date: todayStr,
        lessonsCompleted: input.completed ? 1 : 0,
        minutesStudied: minutesToAdd,
        xp: 0,
      });
    }
  } catch (err) {
    console.error('[studySessionService] failed to update streak minutes', err);
  }

  // 4. Calculate & Award XP if completed or significant session
  let awardedXp = 0;
  if (input.completed) {
    if (input.activityType === 'listening') {
      awardedXp = input.score && input.score >= 80 ? 25 : 15;
    } else if (input.activityType === 'reading') {
      awardedXp = 20;
    } else {
      awardedXp = 10;
    }

    await db
      .update(users)
      .set({
        xpPoints: sql`${users.xpPoints} + ${awardedXp}`,
      })
      .where(eq(users.id, userId));

    await recordXpEvent(
      userId,
      awardedXp,
      input.activityType === 'listening'
        ? 'event'
        : input.activityType === 'reading'
        ? 'reading'
        : 'lesson',
      { refId: input.itemId, minutes: minutesToAdd }
    );
  }

  return { sessionId, awardedXp };
}

/**
 * Get comprehensive study time summary for a user.
 */
export async function getStudyTimeSummary(userId: string): Promise<StudySummaryResponse> {
  const sessions = await db
    .select({
      id: userStudySessions.id,
      activityType: userStudySessions.activityType,
      level: userStudySessions.level,
      itemId: userStudySessions.itemId,
      durationSeconds: userStudySessions.durationSeconds,
      completed: userStudySessions.completed,
      score: userStudySessions.score,
      createdAt: userStudySessions.createdAt,
    })
    .from(userStudySessions)
    .where(eq(userStudySessions.userId, userId))
    .orderBy(desc(userStudySessions.createdAt))
    .limit(1000);

  let totalSeconds = 0;
  const byActivity: Record<string, ActivityBreakdown> = {
    listening: { activityType: 'listening', totalSeconds: 0, totalMinutes: 0, hours: 0, sessionCount: 0 },
    reading: { activityType: 'reading', totalSeconds: 0, totalMinutes: 0, hours: 0, sessionCount: 0 },
    grammar: { activityType: 'grammar', totalSeconds: 0, totalMinutes: 0, hours: 0, sessionCount: 0 },
    kanji: { activityType: 'kanji', totalSeconds: 0, totalMinutes: 0, hours: 0, sessionCount: 0 },
    conversation: { activityType: 'conversation', totalSeconds: 0, totalMinutes: 0, hours: 0, sessionCount: 0 },
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

  let todayMinutes = 0;
  let weekMinutes = 0;

  // Initialize weekly trend map for the last 7 days
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyMap = new Map<string, DailyStudyBreakdown>();

  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().slice(0, 10);
    dailyMap.set(dateStr, {
      date: dateStr,
      dayLabel: dayNames[d.getDay()],
      totalMinutes: 0,
      listeningMinutes: 0,
      readingMinutes: 0,
      otherMinutes: 0,
    });
  }

  for (const s of sessions) {
    const sec = s.durationSeconds;
    totalSeconds += sec;
    const mins = Math.round(sec / 60);

    const act = s.activityType;
    if (!byActivity[act]) {
      byActivity[act] = { activityType: act, totalSeconds: 0, totalMinutes: 0, hours: 0, sessionCount: 0 };
    }
    byActivity[act].totalSeconds += sec;
    byActivity[act].sessionCount += 1;

    const sDate = new Date(s.createdAt);
    if (sDate >= startOfToday) {
      todayMinutes += mins;
    }
    if (sDate >= sevenDaysAgo) {
      weekMinutes += mins;
      const dateStr = sDate.toISOString().slice(0, 10);
      const dayData = dailyMap.get(dateStr);
      if (dayData) {
        dayData.totalMinutes += mins;
        if (act === 'listening') {
          dayData.listeningMinutes += mins;
        } else if (act === 'reading') {
          dayData.readingMinutes += mins;
        } else {
          dayData.otherMinutes += mins;
        }
      }
    }
  }

  for (const key of Object.keys(byActivity)) {
    const item = byActivity[key];
    item.totalMinutes = Math.round(item.totalSeconds / 60);
    item.hours = Number((item.totalSeconds / 3600).toFixed(1));
  }

  const totalMinutes = Math.round(totalSeconds / 60);
  const totalHours = Number((totalSeconds / 3600).toFixed(1));
  const listeningHours = byActivity.listening?.hours ?? 0;
  const readingHours = byActivity.reading?.hours ?? 0;

  return {
    totalSeconds,
    totalMinutes,
    totalHours,
    listeningHours,
    readingHours,
    todayMinutes,
    weekMinutes,
    totalSessions: sessions.length,
    byActivity,
    weeklyTrend: Array.from(dailyMap.values()),
    recentSessions: sessions.slice(0, 10),
  };
}

/**
 * Get verified student study summary for public profile or teacher dashboard.
 */
export async function getStudentStudySummary(studentId: string) {
  const summary = await getStudyTimeSummary(studentId);
  const listeningCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(userListeningProgress)
    .where(eq(userListeningProgress.userId, studentId));

  return {
    totalHours: summary.totalHours,
    listeningHours: summary.listeningHours,
    readingHours: summary.readingHours,
    todayMinutes: summary.todayMinutes,
    weekMinutes: summary.weekMinutes,
    totalSessions: summary.totalSessions,
    scenariosListened: Number(listeningCountResult[0]?.count || 0),
    recentSessions: summary.recentSessions.slice(0, 5),
  };
}
