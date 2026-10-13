export const JLPT_LEVELS = [
  { level: 'N5', minXP: 0, maxXP: 2500 },
  { level: 'N4', minXP: 2500, maxXP: 8000 },
  { level: 'N3', minXP: 8000, maxXP: 20000 },
  { level: 'N2', minXP: 20000, maxXP: 45000 },
  { level: 'N1', minXP: 45000, maxXP: 80000 },
] as const;

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export const XP_REWARDS = {
  LESSON_PERFECT: 15,
  LESSON_GREAT: 12,
  LESSON_GOOD: 8,
  LESSON_PASS: 3,

  SRS_CARD_CORRECT: 2,
  SRS_CARD_EASY: 3,
  SRS_CARD_MASTERED: 5,

  KANJI_LEARNED: 8,
  VOCAB_LEARNED: 4,
  GRAMMAR_LEARNED: 6,

  QUIZ_PERFECT: 12,
  QUIZ_GREAT: 8,
  QUIZ_PASS: 4,
  QUIZ_ATTEMPT: 1,

  DAILY_GOAL_COMPLETE: 10,
  DAILY_FIRST_LESSON: 3,

  STREAK_DAILY: 2,
  STREAK_WEEK_BONUS: 5,
  STREAK_MONTH_BONUS: 15,
  STREAK_100_BONUS: 30,
} as const;

export interface JLPTLevelInfo {
  level: JLPTLevel;
  minXP: number;
  maxXP: number;
}

export function getJLPTLevel(totalXP: number): JLPTLevelInfo {
  let current: JLPTLevelInfo = JLPT_LEVELS[0];
  for (let i = 0; i < JLPT_LEVELS.length; i++) {
    if (totalXP >= JLPT_LEVELS[i].minXP) {
      current = JLPT_LEVELS[i];
    }
  }
  return current;
}

export function getUserLevel(totalXP: number): number {
  if (totalXP <= 0) return 1;
  let level = 1;
  let cumulativeXP = 0;

  while (cumulativeXP <= totalXP) {
    level++;
    cumulativeXP += Math.floor(10 * level * (level + 1) / 2);
    if (level > 200) break;
  }

  return level - 1;
}

export function calculateLessonXP(scorePercent: number): number {
  if (scorePercent >= 90) return XP_REWARDS.LESSON_PERFECT;
  if (scorePercent >= 80) return XP_REWARDS.LESSON_GREAT;
  if (scorePercent >= 60) return XP_REWARDS.LESSON_GOOD;
  return XP_REWARDS.LESSON_PASS;
}

export function calculateQuizXP(scorePercent: number): number {
  if (scorePercent >= 100) return XP_REWARDS.QUIZ_PERFECT;
  if (scorePercent >= 80) return XP_REWARDS.QUIZ_GREAT;
  if (scorePercent >= 60) return XP_REWARDS.QUIZ_PASS;
  return XP_REWARDS.QUIZ_ATTEMPT;
}

export function calculateSRSReviewXP(quality: number, isMastered = false): number {
  if (isMastered) return XP_REWARDS.SRS_CARD_MASTERED;
  if (quality >= 5) return XP_REWARDS.SRS_CARD_EASY;
  if (quality >= 3) return XP_REWARDS.SRS_CARD_CORRECT;
  return 0;
}

export function calculateStreakBonus(streakDays: number): number {
  let bonus = 0;
  if (streakDays === 7) bonus += XP_REWARDS.STREAK_WEEK_BONUS;
  if (streakDays === 30) bonus += XP_REWARDS.STREAK_MONTH_BONUS;
  if (streakDays === 100) bonus += XP_REWARDS.STREAK_100_BONUS;
  if (streakDays > 0 && streakDays % 365 === 0) bonus += 50;
  return bonus;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  check: (stats: {
    lessonsCompleted: number;
    kanjiLearned: number;
    vocabLearned: number;
    streak: number;
    totalXP: number;
    cardsReviewed?: number;
    cardsMastered?: number;
  }) => boolean;
}

export const ALL_BADGES: BadgeDefinition[] = [
  { id: 'first_lesson', name: '?? First Step', check: s => s.lessonsCompleted >= 1 },
  { id: 'lessons_10', name: '?? Dedicated Learner', check: s => s.lessonsCompleted >= 10 },
  { id: 'lessons_25', name: '?? Bookworm', check: s => s.lessonsCompleted >= 25 },
  { id: 'lessons_50', name: '?? Scholar', check: s => s.lessonsCompleted >= 50 },
  { id: 'lessons_100', name: '?? Century', check: s => s.lessonsCompleted >= 100 },

  { id: 'kanji_10', name: '? Kanji Starter', check: s => s.kanjiLearned >= 10 },
  { id: 'kanji_50', name: '? Kanji Learner', check: s => s.kanjiLearned >= 50 },
  { id: 'kanji_100', name: '? Kanji Scholar', check: s => s.kanjiLearned >= 100 },
  { id: 'kanji_200', name: '? N5 Kanji Master', check: s => s.kanjiLearned >= 200 },
  { id: 'kanji_500', name: '? N4 Kanji Master', check: s => s.kanjiLearned >= 500 },

  { id: 'vocab_50', name: '?? Word Collector', check: s => s.vocabLearned >= 50 },
  { id: 'vocab_200', name: '?? Wordsmith', check: s => s.vocabLearned >= 200 },
  { id: 'vocab_500', name: '?? Lexicon', check: s => s.vocabLearned >= 500 },

  { id: 'streak_3', name: '?? Hat Trick', check: s => s.streak >= 3 },
  { id: 'streak_7', name: '?? Week Warrior', check: s => s.streak >= 7 },
  { id: 'streak_14', name: '?? Fortnight Fighter', check: s => s.streak >= 14 },
  { id: 'streak_30', name: '?? Month Master', check: s => s.streak >= 30 },
  { id: 'streak_100', name: '?? Century Streak', check: s => s.streak >= 100 },
  { id: 'streak_365', name: '?? Year of Dedication', check: s => s.streak >= 365 },

  { id: 'xp_500', name: '? Getting Started', check: s => s.totalXP >= 500 },
  { id: 'xp_2500', name: '? Rising Star', check: s => s.totalXP >= 2500 },
  { id: 'xp_8000', name: '? Star Learner', check: s => s.totalXP >= 8000 },
  { id: 'xp_20000', name: '? Super Star', check: s => s.totalXP >= 20000 },
  { id: 'xp_45000', name: '? XP Legend', check: s => s.totalXP >= 45000 },

  { id: 'srs_100', name: '?? Review Rookie', check: s => (s.cardsReviewed || 0) >= 100 },
  { id: 'srs_500', name: '?? Memory Builder', check: s => (s.cardsReviewed || 0) >= 500 },
  { id: 'srs_mastered_50', name: '?? Mastery Path', check: s => (s.cardsMastered || 0) >= 50 },
];
