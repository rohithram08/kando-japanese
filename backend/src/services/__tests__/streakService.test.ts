import { describe, it, expect } from 'vitest';
import { calculateStreakFromDates } from '../streakService.js';

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
});
