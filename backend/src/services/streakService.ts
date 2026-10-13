import { db } from '../db/index.js';
import { users, userStreaks } from '../db/schema.js';
import { eq, desc, sql } from 'drizzle-orm';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isActiveToday: boolean;
}

/**
 * Pure function to calculate current and longest streaks from an array of activity dates.
 * Accepts strings ('YYYY-MM-DD') or Date objects.
 * Handles duplicate dates on the same calendar day and validates gaps.
 */
export function calculateStreakFromDates(
  datesInput: (string | Date)[],
  referenceDate: Date = new Date()
): StreakResult {
  if (!datesInput || datesInput.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      isActiveToday: false,
    };
  }

  // Normalize and deduplicate dates formatted as YYYY-MM-DD in UTC
  const formattedDates = Array.from(
    new Set(
      datesInput.map((d) => {
        if (typeof d === 'string') {
          return d.split('T')[0];
        }
        return d.toISOString().split('T')[0];
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
  const todayStr = referenceDate.toISOString().split('T')[0];

  const yesterdayDate = new Date(referenceDate);
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const isActiveToday = formattedDates.includes(todayStr);
  const isActiveYesterday = formattedDates.includes(yesterdayStr);

  let currentStreak = 0;

  // If active neither today nor yesterday, current streak has lapsed (0)
  if (isActiveToday || isActiveYesterday) {
    let checkDate = new Date(isActiveToday ? todayStr : yesterdayStr);
    let checkStr = checkDate.toISOString().split('T')[0];

    for (const d of formattedDates) {
      if (d === checkStr) {
        currentStreak++;
        checkDate.setUTCDate(checkDate.getUTCDate() - 1);
        checkStr = checkDate.toISOString().split('T')[0];
      } else if (d < checkStr) {
        // Gap found — streak ends
        break;
      }
    }
  }

  // Calculate longest streak across all historic dates
  // Sort chronological (ASC)
  const ascDates = [...formattedDates].reverse();
  let longestStreak = 0;
  let runningCount = 0;
  let prevDate: Date | null = null;

  for (const dateStr of ascDates) {
    const curDate = new Date(dateStr);
    if (!prevDate) {
      runningCount = 1;
    } else {
      const diffMs = curDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningCount++;
      } else if (diffDays > 1) {
        runningCount = 1;
      }
    }
    if (runningCount > longestStreak) {
      longestStreak = runningCount;
    }
    prevDate = curDate;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    lastActivityDate,
    isActiveToday,
  };
}

export async function calculateStreak(userId: string): Promise<StreakResult> {
  const streaks = await db.query.userStreaks.findMany({
    where: eq(userStreaks.userId, userId),
    orderBy: [desc(userStreaks.date)],
  });

  const dateList = streaks.map((s) => s.date);
  return calculateStreakFromDates(dateList);
}

export async function recordActivity(userId: string, date: string): Promise<void> {
  const dateObj = new Date(date);
  await db.insert(userStreaks)
    .values({
      userId,
      date: dateObj,
      lessonsCompleted: 1,
    })
    .onDuplicateKeyUpdate({
      set: {
        lessonsCompleted: sql`${userStreaks.lessonsCompleted} + 1`,
      },
    });

  const streak = await calculateStreak(userId);

  await db.update(users)
    .set({ streakDays: streak.currentStreak })
    .where(eq(users.id, userId));
}
