import { describe, it, expect } from 'vitest';
import {
  calculateStreakFromDates,
  getLocalDateString,
  getPreviousDayString,
  getNextDayString,
  getDaysBetween,
  isValidTimezone,
  resolveTimezone,
} from '../streakService.js';

describe('Streak Calculation Service', () => {
  const mockNow = new Date('2026-08-23T12:00:00.000Z');

  it('handles empty activity dates', () => {
    const result = calculateStreakFromDates([], mockNow);
    expect(result).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      isActiveToday: false,
    });
  });

  it('handles first activity today', () => {
    const result = calculateStreakFromDates(['2026-08-23'], mockNow);
    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: '2026-08-23',
      isActiveToday: true,
    });
  });

  it('handles activity yesterday but not today', () => {
    const result = calculateStreakFromDates(['2026-08-22'], mockNow);
    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: '2026-08-22',
      isActiveToday: false,
    });
  });

  it('calculates consecutive active days including today', () => {
    const dates = ['2026-08-21', '2026-08-22', '2026-08-23'];
    const result = calculateStreakFromDates(dates, mockNow);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
    expect(result.isActiveToday).toBe(true);
  });

  it('calculates consecutive active days ending yesterday', () => {
    const dates = ['2026-08-20', '2026-08-21', '2026-08-22'];
    const result = calculateStreakFromDates(dates, mockNow);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
    expect(result.isActiveToday).toBe(false);
  });

  it('resets current streak when one day is missed (last active 2 days ago)', () => {
    const dates = ['2026-08-19', '2026-08-20', '2026-08-21'];
    const result = calculateStreakFromDates(dates, mockNow);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(3);
    expect(result.isActiveToday).toBe(false);
    expect(result.lastActivityDate).toBe('2026-08-21');
  });

  it('handles multiple activities on the same day without overcounting', () => {
    const dates = [
      '2026-08-22T08:00:00Z',
      '2026-08-22T14:30:00Z',
      '2026-08-23T09:15:00Z',
      '2026-08-23T20:00:00Z',
    ];
    const result = calculateStreakFromDates(dates, mockNow);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
    expect(result.isActiveToday).toBe(true);
  });

  it('correctly tracks historical longest streak when longer than current streak', () => {
    const dates = [
      // 5-day historic run
      '2026-07-01',
      '2026-07-02',
      '2026-07-03',
      '2026-07-04',
      '2026-07-05',
      // gap
      // 2-day current run
      '2026-08-22',
      '2026-08-23',
    ];
    const result = calculateStreakFromDates(dates, mockNow);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(5);
  });

  describe('Timezone & Calendar Day Arithmetic', () => {
    it('correctly formats local date in Asia/Kolkata across UTC boundary', () => {
      // 8 PM UTC on Oct 13 is 1:30 AM on Oct 14 in India (UTC+5:30)
      const lateUtc = new Date('2026-10-13T20:00:00.000Z');
      expect(getLocalDateString(lateUtc, 'UTC')).toBe('2026-10-13');
      expect(getLocalDateString(lateUtc, 'Asia/Kolkata')).toBe('2026-10-14');
    });

    it('correctly formats local date in America/New_York (UTC-4 in summer DST)', () => {
      // 1 AM UTC on July 4 is 9 PM on July 3 in New York
      const earlyUtc = new Date('2026-07-04T01:00:00.000Z');
      expect(getLocalDateString(earlyUtc, 'UTC')).toBe('2026-07-04');
      expect(getLocalDateString(earlyUtc, 'America/New_York')).toBe('2026-07-03');
    });

    it('calculates streaks relative to user timezone reference date', () => {
      // When reference time is 2026-10-13T20:00:00Z:
      // In Asia/Kolkata, today is 2026-10-14, yesterday is 2026-10-13
      const refTime = new Date('2026-10-13T20:00:00.000Z');
      const dates = ['2026-10-13', '2026-10-14'];
      const result = calculateStreakFromDates(dates, refTime, 'Asia/Kolkata');
      expect(result.isActiveToday).toBe(true);
      expect(result.currentStreak).toBe(2);
    });

    it('handles calendar year and leap year transitions accurately', () => {
      expect(getPreviousDayString('2024-03-01')).toBe('2024-02-29'); // 2024 was leap year
      expect(getPreviousDayString('2026-03-01')).toBe('2026-02-28'); // 2026 is common year
      expect(getPreviousDayString('2026-01-01')).toBe('2025-12-31');
      expect(getNextDayString('2025-12-31')).toBe('2026-01-01');
      expect(getDaysBetween('2026-01-01', '2026-01-10')).toBe(9);
      expect(getDaysBetween('2025-12-30', '2026-01-02')).toBe(3);
    });

    it('validates timezone strings and falls back to UTC safely', () => {
      expect(isValidTimezone('Asia/Tokyo')).toBe(true);
      expect(isValidTimezone('America/Los_Angeles')).toBe(true);
      expect(isValidTimezone('Invalid/Timezone_Name')).toBe(false);
      expect(resolveTimezone('Asia/Kolkata', 'UTC')).toBe('Asia/Kolkata');
      expect(resolveTimezone('Invalid/Zone', 'Asia/Tokyo')).toBe('Asia/Tokyo');
      expect(resolveTimezone('Invalid/Zone', 'Also/Invalid')).toBe('UTC');
    });
  });
});
