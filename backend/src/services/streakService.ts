import { db } from '../db/index.js';
import { users, userStreaks } from '../db/schema.js';
import { eq, desc, sql, and } from 'drizzle-orm';

export type StreakStatus = 'COMPLETED_TODAY' | 'PENDING_TODAY' | 'FROZEN_TODAY' | 'BROKEN';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isActiveToday: boolean;
  isStreakFrozen?: boolean;
  frozenDates?: string[];
  streakStatus?: StreakStatus;
}

export interface RecordActivityResult extends StreakResult {
  isFirstActivityToday: boolean;
}

export interface RecordActivityOptions {
  xp?: number;
  minutesStudied?: number;
  isLesson?: boolean;
  timezone?: string;
  isFrozen?: boolean;
}

export interface ResolveStreakOptions {
  activeDates: (string | Date)[];
  frozenDates?: (string | Date)[];
  freezeInventory?: number;
  referenceDateOrStr?: Date | string;
  timezone?: string;
}

export interface StreakResolutionResult extends StreakResult {
  freezesConsumed: number;
  remainingFreezes: number;
  newlyFrozenDates: string[];
  wasSavedByFreeze: boolean;
  brokenStreakCount: number;
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
 * Normalize an array of date inputs to unique sorted 'YYYY-MM-DD' strings in the effective timezone.
 */
export function normalizeDates(datesInput: (string | Date)[], effectiveTz: string = 'UTC'): string[] {
  if (!datesInput || datesInput.length === 0) return [];
  return Array.from(
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
}

/**
 * Pure function to calculate current and longest streaks from an array of activity dates.
 * Accepts active dates and optional frozen dates ('YYYY-MM-DD' or ISO or Date objects).
 * Accurately aligns with user's local reference date and timezone.
 */
export function calculateStreakFromDates(
  datesInput: (string | Date)[],
  referenceDateOrStr: Date | string = new Date(),
  tz: string = 'UTC',
  frozenDatesInput: (string | Date)[] = []
): StreakResult {
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

  const formattedDates = normalizeDates(datesInput, effectiveTz);
  const formattedFrozenDates = normalizeDates(frozenDatesInput, effectiveTz);

  if (formattedDates.length === 0 && formattedFrozenDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      isActiveToday: false,
    };
  }

  const lastActivityDate = formattedDates[0] || null;
  const isActiveToday = formattedDates.includes(todayStr);
  const isTodayFrozen = formattedFrozenDates.includes(todayStr);
  const isActiveYesterday = formattedDates.includes(yesterdayStr);
  const isYesterdayFrozen = formattedFrozenDates.includes(yesterdayStr);

  let currentStreak = 0;

  // Streak continues if active today OR yesterday (or if today/yesterday is preserved by a freeze)
  const streakContinues = isActiveToday || isTodayFrozen || isActiveYesterday || isYesterdayFrozen;

  if (streakContinues) {
    let checkStr = (isActiveToday || isTodayFrozen) ? todayStr : yesterdayStr;
    while (formattedDates.includes(checkStr) || formattedFrozenDates.includes(checkStr)) {
      currentStreak++;
      checkStr = getPreviousDayString(checkStr);
    }
  }

  // Calculate longest streak across entire combined history
  const allUniqueDates = Array.from(new Set([...formattedDates, ...formattedFrozenDates])).sort();
  let longestStreak = 0;
  let runningCount = 0;
  let prevDateStr: string | null = null;

  for (const curDateStr of allUniqueDates) {
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

  // Determine streak status in Duolingo state machine
  let streakStatus: StreakStatus;
  if (isActiveToday) {
    streakStatus = 'COMPLETED_TODAY';
  } else if (isTodayFrozen || isYesterdayFrozen) {
    streakStatus = 'FROZEN_TODAY';
  } else if (isActiveYesterday) {
    streakStatus = 'PENDING_TODAY';
  } else if (currentStreak === 0) {
    streakStatus = 'BROKEN';
  } else {
    streakStatus = 'PENDING_TODAY';
  }

  const isStreakFrozen = Boolean(isTodayFrozen || isYesterdayFrozen);

  const baseResult: StreakResult = {
    currentStreak,
    longestStreak,
    lastActivityDate,
    isActiveToday,
  };

  if (formattedFrozenDates.length > 0) {
    baseResult.isStreakFrozen = isStreakFrozen;
    baseResult.frozenDates = formattedFrozenDates;
    baseResult.streakStatus = streakStatus;
  }

  return baseResult;
}

/**
 * Duolingo Midnight Resolution Algorithm:
 * Evaluates timeline gap between last active session and today.
 * If user missed days (e.g. yesterday) and has available streak freezes in inventory,
 * it auto-consumes the needed freezes, marks missed days as frozen, and preserves the streak.
 * If freezes are insufficient, the streak breaks.
 */
export function resolveStreakWithFreezes(options: ResolveStreakOptions): StreakResolutionResult {
  const {
    activeDates,
    frozenDates = [],
    freezeInventory = 0,
    referenceDateOrStr = new Date(),
    timezone = 'UTC',
  } = options;

  const effectiveTz = isValidTimezone(timezone) ? timezone : 'UTC';

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

  const normActive = normalizeDates(activeDates, effectiveTz);
  const normFrozen = normalizeDates(frozenDates, effectiveTz);

  // Baseline calculation prior to any new freeze consumption
  const initial = calculateStreakFromDates(normActive, todayStr, effectiveTz, normFrozen);

  // If user is already active today or active yesterday or already frozen yesterday,
  // streak is continuous! No new freezes needed.
  if (initial.currentStreak > 0) {
    const computedStatus: StreakStatus = initial.isActiveToday
      ? 'COMPLETED_TODAY'
      : initial.isStreakFrozen
      ? 'FROZEN_TODAY'
      : 'PENDING_TODAY';

    return {
      ...initial,
      streakStatus: initial.streakStatus || computedStatus,
      freezesConsumed: 0,
      remainingFreezes: freezeInventory,
      newlyFrozenDates: [],
      wasSavedByFreeze: false,
      brokenStreakCount: 0,
    };
  }

  // Current streak is 0. Check if there was an unbroken streak that just broke yesterday!
  const allPastDates = Array.from(new Set([...normActive, ...normFrozen])).sort((a, b) => (a > b ? -1 : 1));
  if (allPastDates.length === 0) {
    return {
      ...initial,
      freezesConsumed: 0,
      remainingFreezes: freezeInventory,
      newlyFrozenDates: [],
      wasSavedByFreeze: false,
      brokenStreakCount: 0,
    };
  }

  const mostRecentDate = allPastDates[0];
  const daysDiff = getDaysBetween(mostRecentDate, todayStr);

  if (daysDiff <= 1) {
    return {
      ...initial,
      freezesConsumed: 0,
      remainingFreezes: freezeInventory,
      newlyFrozenDates: [],
      wasSavedByFreeze: false,
      brokenStreakCount: 0,
    };
  }

  // Gap of (daysDiff - 1) missed days
  const missedDates: string[] = [];
  let stepDate = getPreviousDayString(todayStr);
  while (stepDate > mostRecentDate) {
    missedDates.push(stepDate);
    stepDate = getPreviousDayString(stepDate);
  }
  missedDates.reverse(); // chronological order

  const unhandledMissedDates = missedDates.filter((d) => !normFrozen.includes(d));

  if (unhandledMissedDates.length === 0) {
    const rechecked = calculateStreakFromDates(normActive, todayStr, effectiveTz, normFrozen);
    return {
      ...rechecked,
      freezesConsumed: 0,
      remainingFreezes: freezeInventory,
      newlyFrozenDates: [],
      wasSavedByFreeze: false,
      brokenStreakCount: 0,
    };
  }

  // Can the user's available freeze inventory bridge this gap?
  if (freezeInventory >= unhandledMissedDates.length) {
    const newlyFrozenDates = [...unhandledMissedDates];
    const updatedFrozen = Array.from(new Set([...normFrozen, ...newlyFrozenDates]));
    const remainingFreezes = freezeInventory - newlyFrozenDates.length;

    const restored = calculateStreakFromDates(normActive, todayStr, effectiveTz, updatedFrozen);

    return {
      ...restored,
      freezesConsumed: newlyFrozenDates.length,
      remainingFreezes,
      newlyFrozenDates,
      wasSavedByFreeze: true,
      brokenStreakCount: 0,
    };
  }

  // Freezes insufficient: streak breaks to 0
  const priorStreak = calculateStreakFromDates(normActive, mostRecentDate, effectiveTz, normFrozen);

  return {
    ...initial,
    currentStreak: 0,
    streakStatus: 'BROKEN',
    freezesConsumed: 0,
    remainingFreezes: freezeInventory,
    newlyFrozenDates: [],
    wasSavedByFreeze: false,
    brokenStreakCount: priorStreak.currentStreak,
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

  const activeDates: string[] = [];
  const frozenDates: string[] = [];

  for (const s of streaks) {
    const dStr = typeof s.date === 'string' ? s.date : getLocalDateString(s.date as unknown as Date, effectiveTz);
    if ((s.xp ?? 0) === 0 && (s.minutesStudied ?? 0) === 0 && (s.lessonsCompleted ?? 0) === 0) {
      frozenDates.push(dStr);
    } else {
      activeDates.push(dStr);
    }
  }

  const result = calculateStreakFromDates(activeDates, new Date(), effectiveTz, frozenDates);

  // Lazy synchronization of users.streakDays
  if (user && user.streakDays !== result.currentStreak) {
    await db.update(users)
      .set({ streakDays: result.currentStreak })
      .where(eq(users.id, userId));
  }

  return result;
}

/**
 * Record a frozen day in user_streaks.
 * Preserves the streak chain without adding false XP or lesson stats.
 */
export async function recordFreezeActivity(
  userId: string,
  localDateStr?: string,
  tz?: string
): Promise<StreakResult> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const effectiveTz = resolveTimezone(tz, user?.timezone);
  const targetDate = localDateStr || getLocalDateString(new Date(), effectiveTz);

  await db.insert(userStreaks)
    .values({
      userId,
      date: targetDate,
      lessonsCompleted: 0,
      minutesStudied: 0,
      xp: 0,
    })
    .onDuplicateKeyUpdate({
      set: {
        lessonsCompleted: sql`${userStreaks.lessonsCompleted}`,
        minutesStudied: sql`${userStreaks.minutesStudied}`,
        xp: sql`${userStreaks.xp}`,
      },
    });

  return calculateStreak(userId, effectiveTz);
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
