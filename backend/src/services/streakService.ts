import { db } from '../db/index.js';
import { users, userStreaks } from '../db/schema.js';
import { eq, desc, sql, and } from 'drizzle-orm';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isActiveToday: boolean;
}

export interface RecordActivityResult extends StreakResult {
  isFirstActivityToday: boolean;
}

export interface RecordActivityOptions {
  xp?: number;
  minutesStudied?: number;
  isLesson?: boolean;
  timezone?: string;
}

/**
 * Validate whether a string is a recognized IANA timezone identifier.
 */
export function isValidTimezone(tz?: string | null): boolean {
  if (!tz || typeof tz !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve effective timezone from request headers, user settings, or default UTC.
 */
export function resolveTimezone(headerTz?: string | null, userTz?: string | null): string {
  if (isValidTimezone(headerTz)) return headerTz!;
  if (isValidTimezone(userTz)) return userTz!;
  return 'UTC';
}

/**
 * Convert a Date object into a calendar day string ('YYYY-MM-DD') for a specific timezone.
 */
export function getLocalDateString(date: Date = new Date(), tz: string = 'UTC'): string {
  const effectiveTz = isValidTimezone(tz) ? tz : 'UTC';
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: effectiveTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Get the calendar day string immediately preceding dateStr ('YYYY-MM-DD').
 * Uses pure UTC calendar arithmetic without local timezone drift.
 */
export function getPreviousDayString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d - 1));
  return dt.toISOString().split('T')[0];
}

/**
 * Get the calendar day string immediately following dateStr ('YYYY-MM-DD').
 */
export function getNextDayString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.toISOString().split('T')[0];
}

/**
 * Calculate the number of calendar days between earlier and later date strings.
 */
export function getDaysBetween(earlierDateStr: string, laterDateStr: string): number {
  const [y1, m1, d1] = earlierDateStr.split('-').map(Number);
  const [y2, m2, d2] = laterDateStr.split('-').map(Number);
  const ms1 = Date.UTC(y1, m1 - 1, d1);
  const ms2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((ms2 - ms1) / (1000 * 60 * 60 * 24));
}

/**
 * Pure function to calculate current and longest streaks from an array of activity dates.
 * Accepts strings ('YYYY-MM-DD' or ISO) or Date objects.
 * Accurately aligns with user's local reference date and timezone.
 */
export function calculateStreakFromDates(
  datesInput: (string | Date)[],
  referenceDateOrStr: Date | string = new Date(),
  tz: string = 'UTC'
): StreakResult {
  if (!datesInput || datesInput.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      isActiveToday: false,
    };
  }

  const effectiveTz = isValidTimezone(tz) ? tz : 'UTC';

  // Determine reference today string
  let todayStr: string;
  if (typeof referenceDateOrStr === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(referenceDateOrStr)) {
      todayStr = referenceDateOrStr;
    } else {
      const parsed = new Date(referenceDateOrStr);
      todayStr = !isNaN(parsed.getTime())
        ? getLocalDateString(parsed, effectiveTz)
        : referenceDateOrStr.split('T')[0];
    }
  } else if (referenceDateOrStr instanceof Date) {
    todayStr = getLocalDateString(referenceDateOrStr, effectiveTz);
  } else {
    todayStr = getLocalDateString(new Date(), effectiveTz);
  }

  const yesterdayStr = getPreviousDayString(todayStr);

  // Normalize all dates to YYYY-MM-DD strings in the user's timezone
  const formattedDates = Array.from(
    new Set(
      datesInput.map((d) => {
        if (typeof d === 'string') {
          if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
          if (d.includes('T')) {
            const parsed = new Date(d);
            return !isNaN(parsed.getTime())
              ? getLocalDateString(parsed, effectiveTz)
              : d.split('T')[0];
          }
          return d.split('T')[0];
        }
        return getLocalDateString(d, effectiveTz);
      })
    )
  ).sort((a, b) => (a > b ? -1 : 1)); // DESC (newest first)

  if (formattedDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      isActiveToday: false,
    };
  }

  const lastActivityDate = formattedDates[0];
  const isActiveToday = formattedDates.includes(todayStr);
  const isActiveYesterday = formattedDates.includes(yesterdayStr);

  let currentStreak = 0;

  // Streak continues if active today OR yesterday
  if (isActiveToday || isActiveYesterday) {
    let checkStr = isActiveToday ? todayStr : yesterdayStr;
    while (formattedDates.includes(checkStr)) {
      currentStreak++;
      checkStr = getPreviousDayString(checkStr);
    }
  }

  // Calculate longest streak across history
  const ascDates = [...formattedDates].reverse();
  let longestStreak = 0;
  let runningCount = 0;
  let prevDateStr: string | null = null;

  for (const curDateStr of ascDates) {
    if (!prevDateStr) {
      runningCount = 1;
    } else {
      const diffDays = getDaysBetween(prevDateStr, curDateStr);
      if (diffDays === 1) {
        runningCount++;
      } else if (diffDays > 1) {
        runningCount = 1;
      }
    }
    if (runningCount > longestStreak) {
      longestStreak = runningCount;
    }
    prevDateStr = curDateStr;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    lastActivityDate,
    isActiveToday,
  };
}

/**
 * Fetch and calculate streak information for a user.
 * Lazily updates the user record if the stored streak count is out of sync.
 */
export async function calculateStreak(userId: string, tz?: string): Promise<StreakResult> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const effectiveTz = resolveTimezone(tz, user?.timezone);

  const streaks = await db.query.userStreaks.findMany({
    where: eq(userStreaks.userId, userId),
    orderBy: [desc(userStreaks.date)],
  });

  const dateList = streaks.map((s) => {
    if (typeof s.date === 'string') return s.date;
    return getLocalDateString(s.date as unknown as Date, effectiveTz);
  });

  const result = calculateStreakFromDates(dateList, new Date(), effectiveTz);

  // Lazy synchronization of users.streakDays
  if (user && user.streakDays !== result.currentStreak) {
    await db.update(users)
      .set({ streakDays: result.currentStreak })
      .where(eq(users.id, userId));
  }

  return result;
}

/**
 * Record study activity for streak tracking.
 * Writes to user_streaks and syncs users.streakDays.
 */
export async function recordActivity(
  userId: string,
  localDateStr?: string,
  options?: RecordActivityOptions
): Promise<RecordActivityResult> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const effectiveTz = resolveTimezone(options?.timezone, user?.timezone);
  const targetDate = localDateStr || getLocalDateString(new Date(), effectiveTz);

  const existingToday = await db.query.userStreaks.findFirst({
    where: and(eq(userStreaks.userId, userId), eq(userStreaks.date, targetDate)),
  });
  const isFirstActivityToday = !existingToday;

  const lessonsIncrement = options?.isLesson ? 1 : 0;
  const minutesIncrement = options?.minutesStudied || 0;
  const xpIncrement = options?.xp || 0;

  await db.insert(userStreaks)
    .values({
      userId,
      date: targetDate,
      lessonsCompleted: lessonsIncrement,
      minutesStudied: minutesIncrement,
      xp: xpIncrement,
    })
    .onDuplicateKeyUpdate({
      set: {
        lessonsCompleted: options?.isLesson
          ? sql`${userStreaks.lessonsCompleted} + 1`
          : sql`${userStreaks.lessonsCompleted}`,
        minutesStudied: sql`${userStreaks.minutesStudied} + ${minutesIncrement}`,
        xp: sql`${userStreaks.xp} + ${xpIncrement}`,
      },
    });

  const streakResult = await calculateStreak(userId, effectiveTz);

  await db.update(users)
    .set({ streakDays: streakResult.currentStreak })
    .where(eq(users.id, userId));

  return {
    ...streakResult,
    isFirstActivityToday,
  };
}
