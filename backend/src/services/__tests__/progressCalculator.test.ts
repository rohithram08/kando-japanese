import { describe, it, expect } from 'vitest';
import {
  getJLPTLevel,
  getUserLevel,
  calculateLessonXP,
  calculateQuizXP,
  calculateSRSReviewXP,
  calculateStreakBonus,
  ALL_BADGES,
  XP_REWARDS,
} from '../progressCalculator.js';

describe('Progress & XP Calculator', () => {
  describe('JLPT Levels', () => {
    it('returns N5 for 0 XP', () => {
      expect(getJLPTLevel(0).level).toBe('N5');
    });

    it('returns N5 for 2499 XP', () => {
      expect(getJLPTLevel(2499).level).toBe('N5');
    });

    it('returns N4 for 2500 XP', () => {
      expect(getJLPTLevel(2500).level).toBe('N4');
    });

    it('returns N3 for 8000 XP', () => {
      expect(getJLPTLevel(8000).level).toBe('N3');
    });

    it('returns N2 for 20000 XP', () => {
      expect(getJLPTLevel(20000).level).toBe('N2');
    });

    it('returns N1 for 45000 XP', () => {
      expect(getJLPTLevel(45000).level).toBe('N1');
    });
  });

  describe('User Level Progression', () => {
    it('calculates numeric level from total XP', () => {
      expect(getUserLevel(0)).toBe(1);
      expect(getUserLevel(100)).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Activity XP Calculation', () => {
    it('calculates correct lesson XP based on score brackets', () => {
      expect(calculateLessonXP(95)).toBe(XP_REWARDS.LESSON_PERFECT);
      expect(calculateLessonXP(85)).toBe(XP_REWARDS.LESSON_GREAT);
      expect(calculateLessonXP(65)).toBe(XP_REWARDS.LESSON_GOOD);
      expect(calculateLessonXP(40)).toBe(XP_REWARDS.LESSON_PASS);
    });

    it('calculates correct quiz XP based on score brackets', () => {
      expect(calculateQuizXP(100)).toBe(XP_REWARDS.QUIZ_PERFECT);
      expect(calculateQuizXP(85)).toBe(XP_REWARDS.QUIZ_GREAT);
      expect(calculateQuizXP(65)).toBe(XP_REWARDS.QUIZ_PASS);
      expect(calculateQuizXP(50)).toBe(XP_REWARDS.QUIZ_ATTEMPT);
    });

    it('calculates correct SRS review XP', () => {
      expect(calculateSRSReviewXP(5, false)).toBe(XP_REWARDS.SRS_CARD_EASY);
      expect(calculateSRSReviewXP(3, false)).toBe(XP_REWARDS.SRS_CARD_CORRECT);
      expect(calculateSRSReviewXP(1, false)).toBe(0);
      expect(calculateSRSReviewXP(5, true)).toBe(XP_REWARDS.SRS_CARD_MASTERED);
    });
  });

  describe('Streak Bonus Calculation', () => {
    it('awards milestone bonuses at days 7, 30, 100, and 365', () => {
      expect(calculateStreakBonus(1)).toBe(0);
      expect(calculateStreakBonus(7)).toBe(XP_REWARDS.STREAK_WEEK_BONUS);
      expect(calculateStreakBonus(30)).toBe(XP_REWARDS.STREAK_MONTH_BONUS);
      expect(calculateStreakBonus(100)).toBe(XP_REWARDS.STREAK_100_BONUS);
      expect(calculateStreakBonus(365)).toBe(50);
    });
  });

  describe('Badge Requirements', () => {
    it('evaluates first lesson and milestone badges', () => {
      const firstLesson = ALL_BADGES.find(b => b.id === 'first_lesson');
      expect(firstLesson?.check({ lessonsCompleted: 1, kanjiLearned: 0, vocabLearned: 0, streak: 0, totalXP: 0 })).toBe(true);
      expect(firstLesson?.check({ lessonsCompleted: 0, kanjiLearned: 0, vocabLearned: 0, streak: 0, totalXP: 0 })).toBe(false);

      const weekWarrior = ALL_BADGES.find(b => b.id === 'streak_7');
      expect(weekWarrior?.check({ lessonsCompleted: 0, kanjiLearned: 0, vocabLearned: 0, streak: 7, totalXP: 0 })).toBe(true);
      expect(weekWarrior?.check({ lessonsCompleted: 0, kanjiLearned: 0, vocabLearned: 0, streak: 6, totalXP: 0 })).toBe(false);
    });
  });
});
