// ============================================================
// 1. utils/progressCalculator.js — SINGLE SOURCE OF TRUTH
// ============================================================

/**
 * Kando Japanese — XP & Progress System
 * 
 * Design Philosophy:
 * - JLPT-aligned levels (N5 → N1)
 * - XP rewards are small & consistent (no inflation)
 * - Level thresholds match real-world JLPT study timelines
 * - One unified system used everywhere
 */

// ── JLPT Level Thresholds (THE source of truth) ──────────
export const JLPT_LEVELS = [
  {
    level: 'N5',
    minXP: 0,
    maxXP: 2500,
    title: 'Beginner',
    emoji: '🌱',
    description: 'Learning hiragana, katakana, and basic phrases',
    color: 'from-green-400 to-emerald-500',
    studyTime: '0-3 months',
  },
  {
    level: 'N4',
    minXP: 2500,
    maxXP: 8000,
    title: 'Elementary',
    emoji: '📚',
    description: 'Basic grammar and everyday conversations',
    color: 'from-blue-400 to-blue-600',
    studyTime: '3-8 months',
  },
  {
    level: 'N3',
    minXP: 8000,
    maxXP: 20000,
    title: 'Intermediate',
    emoji: '⭐',
    description: 'Reading everyday topics and natural speech',
    color: 'from-purple-400 to-purple-600',
    studyTime: '8-18 months',
  },
  {
    level: 'N2',
    minXP: 20000,
    maxXP: 45000,
    title: 'Advanced',
    emoji: '💫',
    description: 'Newspapers, lectures, and complex topics',
    color: 'from-orange-400 to-red-500',
    studyTime: '18-36 months',
  },
  {
    level: 'N1',
    minXP: 45000,
    maxXP: 80000,
    title: 'Expert',
    emoji: '👑',
    description: 'Near-native comprehension and fluency',
    color: 'from-yellow-400 to-amber-500',
    studyTime: '36+ months',
  },
]

// ── XP Reward Table ───────────────────────────────────────
export const XP_REWARDS = {
  // Lessons
  LESSON_PERFECT:     15,   // Score >= 90%
  LESSON_GREAT:       12,   // Score >= 80%
  LESSON_GOOD:         8,   // Score >= 60%
  LESSON_PASS:         3,   // Score < 60% (just attempted)

  // SRS Reviews
  SRS_CARD_CORRECT:    2,   // Per correct card
  SRS_CARD_EASY:       3,   // Per "easy" rated card
  SRS_CARD_MASTERED:   5,   // When a card reaches mastered status

  // Learning New Items
  KANJI_LEARNED:       8,   // First time learning a kanji
  VOCAB_LEARNED:       4,   // First time learning vocabulary
  KANA_LEARNED:        4,   // First time learning kana character
  GRAMMAR_LEARNED:     6,   // First time learning grammar point

  // Quizzes
  QUIZ_PERFECT:       12,   // 100% score
  QUIZ_GREAT:          8,   // >= 80% score
  QUIZ_PASS:           4,   // >= 60% score
  QUIZ_ATTEMPT:        1,   // Just for trying (< 60%)

  // Graded Readers & Story Quizzes (Wave XP)
  STORY_READ_COMPLETE: 40,  // Complete reading a full story
  STORY_QUIZ_COMPLETE: 30,  // Base completion of story quiz
  STORY_QUIZ_BONUS:    30,  // Max score bonus (proportional to score: round(30 * score / 100))

  // Daily Bonuses
  DAILY_GOAL_COMPLETE: 10,  // All daily goals done
  DAILY_FIRST_LESSON:   3,  // First activity of the day

  // Streak Bonuses (flat, not multipliers)
  STREAK_DAILY:        2,   // Daily streak maintenance
  STREAK_WEEK_BONUS:   5,   // Bonus at 7-day milestone
  STREAK_MONTH_BONUS: 15,   // Bonus at 30-day milestone
  STREAK_100_BONUS:   30,   // Bonus at 100-day milestone
}

// ── Core Level Calculator ─────────────────────────────────
export function getJLPTLevel(totalXP) {
  let current = JLPT_LEVELS[0]
  let next = JLPT_LEVELS[1] || null

  for (let i = 0; i < JLPT_LEVELS.length; i++) {
    if (totalXP >= JLPT_LEVELS[i].minXP) {
      current = JLPT_LEVELS[i]
      next = JLPT_LEVELS[i + 1] || null
    }
  }

  const xpInLevel = totalXP - current.minXP
  const xpNeeded = (next?.minXP || current.maxXP) - current.minXP
  const progressPercent = xpNeeded > 0
    ? Math.min(Math.round((xpInLevel / xpNeeded) * 100), 100)
    : 100

  return {
    ...current,
    totalXP,
    xpInLevel,
    xpNeeded,
    xpToNext: next ? Math.max(0, next.minXP - totalXP) : 0,
    progressPercent,
    nextLevel: next,
  }
}

// ── User Display Level (numeric 1-50+) ────────────────────
// This is a secondary "user level" for gamification alongside JLPT
export function getUserLevel(totalXP) {
  if (totalXP <= 0) return 1

  // Quadratic scaling: each level takes slightly more XP
  // Level 1: 0 XP, Level 2: 30 XP, Level 3: 90, Level 4: 190, Level 5: 340...
  // Formula: XP needed for level L = 10 * L * (L + 1) / 2
  let level = 1
  let cumulativeXP = 0

  while (cumulativeXP <= totalXP) {
    level++
    cumulativeXP += getXPForLevel(level)
    if (level > 200) break // safety cap
  }

  return level - 1
}

export function getXPForLevel(level) {
  // XP required to GO FROM level-1 TO level
  return Math.floor(10 * level * (level + 1) / 2)
}

/** Total Wave XP at which a given level starts (level 1 starts at 0). */
export function getLevelStartXP(level) {
  let cumulative = 0
  for (let l = 2; l <= level; l++) cumulative += getXPForLevel(l)
  return cumulative
}

export function getUserLevelProgress(totalXP) {
  const xp = Math.max(0, Number(totalXP) || 0)
  const level = getUserLevel(xp)
  const startXP = getLevelStartXP(level)
  const xpForNext = getXPForLevel(level + 1)
  const xpIntoLevel = Math.min(Math.max(xp - startXP, 0), xpForNext)
  return {
    level,
    startXP,
    xpIntoLevel,
    xpForNext,
    xpToNext: xpForNext - xpIntoLevel,
    // floor so the bar never reads 100% until the level-up has really happened
    percent: Math.min(100, Math.floor((xpIntoLevel / xpForNext) * 100)),
  }
}

// ── XP Calculator for Activities ──────────────────────────
export function calculateLessonXP(scorePercent) {
  if (scorePercent >= 90) return XP_REWARDS.LESSON_PERFECT
  if (scorePercent >= 80) return XP_REWARDS.LESSON_GREAT
  if (scorePercent >= 60) return XP_REWARDS.LESSON_GOOD
  return XP_REWARDS.LESSON_PASS
}

export function calculateQuizXP(scorePercent) {
  if (scorePercent >= 100) return XP_REWARDS.QUIZ_PERFECT
  if (scorePercent >= 80) return XP_REWARDS.QUIZ_GREAT
  if (scorePercent >= 60) return XP_REWARDS.QUIZ_PASS
  return XP_REWARDS.QUIZ_ATTEMPT
}

export function calculateStoryQuizXP(scorePercent = 0) {
  const clamped = Math.max(0, Math.min(100, Number(scorePercent) || 0))
  return XP_REWARDS.STORY_QUIZ_COMPLETE + Math.round(XP_REWARDS.STORY_QUIZ_BONUS * (clamped / 100))
}

/** Everything a first-time story + quiz completion pays out (mirrors the backend). */
export function calculateStoryRewards(scorePercent = 0) {
  const storyXp = XP_REWARDS.STORY_READ_COMPLETE
  const quizXp = calculateStoryQuizXP(scorePercent)
  return { storyXp, quizXp, total: storyXp + quizXp }
}

export function calculateSRSReviewXP(quality, isMastered = false) {
  if (isMastered) return XP_REWARDS.SRS_CARD_MASTERED
  if (quality >= 5) return XP_REWARDS.SRS_CARD_EASY
  if (quality >= 3) return XP_REWARDS.SRS_CARD_CORRECT
  return 0 // No XP for incorrect
}

// ── Streak Bonus (Flat, NOT multiplier) ───────────────────
export function calculateStreakBonus(streakDays) {
  let bonus = XP_REWARDS.STREAK_DAILY

  // Milestone bonuses (awarded once when reached)
  if (streakDays === 7) bonus += XP_REWARDS.STREAK_WEEK_BONUS
  if (streakDays === 30) bonus += XP_REWARDS.STREAK_MONTH_BONUS
  if (streakDays === 100) bonus += XP_REWARDS.STREAK_100_BONUS
  if (streakDays > 0 && streakDays % 365 === 0) bonus += 50 // Yearly bonus

  return {
    bonus,
    label: getStreakLabel(streakDays),
  }
}

function getStreakLabel(days) {
  if (days >= 365) return '🔥 Year Streak!'
  if (days >= 100) return '🔥 100 Day Streak!'
  if (days >= 30) return '🔥 Month Streak!'
  if (days >= 14) return '🔥 2 Week Streak!'
  if (days >= 7) return '🔥 Week Streak!'
  if (days >= 3) return '🔥 3 Day Streak!'
  return ''
}

// ── Level Progress for Lesson Lists ───────────────────────
export function calculateLevelProgress(completedLessons, totalLessons) {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

// ── Badges System ─────────────────────────────────────────
export function getBadges(stats) {
  const allBadges = [
    // Lesson milestones
    { id: 'first_lesson', name: '🎉 First Step', desc: 'Complete your first lesson', earned: stats.lessonsCompleted >= 1 },
    { id: 'lessons_10', name: '📚 Dedicated Learner', desc: 'Complete 10 lessons', earned: stats.lessonsCompleted >= 10 },
    { id: 'lessons_25', name: '📖 Bookworm', desc: 'Complete 25 lessons', earned: stats.lessonsCompleted >= 25 },
    { id: 'lessons_50', name: '🎓 Scholar', desc: 'Complete 50 lessons', earned: stats.lessonsCompleted >= 50 },
    { id: 'lessons_100', name: '👑 Century', desc: 'Complete 100 lessons', earned: stats.lessonsCompleted >= 100 },

    // Kanji milestones
    { id: 'kanji_10', name: '漢 Kanji Starter', desc: 'Learn 10 kanji', earned: stats.kanjiLearned >= 10 },
    { id: 'kanji_50', name: '漢 Kanji Learner', desc: 'Learn 50 kanji', earned: stats.kanjiLearned >= 50 },
    { id: 'kanji_100', name: '漢 Kanji Scholar', desc: 'Learn 100 kanji', earned: stats.kanjiLearned >= 100 },
    { id: 'kanji_200', name: '漢 N5 Kanji Master', desc: 'Learn all N5 kanji (200)', earned: stats.kanjiLearned >= 200 },
    { id: 'kanji_500', name: '漢 N4 Kanji Master', desc: 'Learn 500 kanji', earned: stats.kanjiLearned >= 500 },

    // Vocab milestones
    { id: 'vocab_50', name: '📝 Word Collector', desc: 'Learn 50 vocabulary', earned: stats.vocabLearned >= 50 },
    { id: 'vocab_200', name: '📝 Wordsmith', desc: 'Learn 200 vocabulary', earned: stats.vocabLearned >= 200 },
    { id: 'vocab_500', name: '📝 Lexicon', desc: 'Learn 500 vocabulary', earned: stats.vocabLearned >= 500 },

    // Streak milestones
    { id: 'streak_3', name: '🔥 Hat Trick', desc: '3 day streak', earned: stats.streak >= 3 },
    { id: 'streak_7', name: '🔥 Week Warrior', desc: '7 day streak', earned: stats.streak >= 7 },
    { id: 'streak_14', name: '🔥 Fortnight Fighter', desc: '14 day streak', earned: stats.streak >= 14 },
    { id: 'streak_30', name: '🔥 Month Master', desc: '30 day streak', earned: stats.streak >= 30 },
    { id: 'streak_100', name: '🔥 Century Streak', desc: '100 day streak', earned: stats.streak >= 100 },
    { id: 'streak_365', name: '🔥 Year of Dedication', desc: '365 day streak', earned: stats.streak >= 365 },

    // XP milestones (aligned to new thresholds)
    { id: 'xp_500', name: '⭐ Getting Started', desc: 'Earn 500 XP', earned: stats.totalXP >= 500 },
    { id: 'xp_2500', name: '⭐ Rising Star', desc: 'Earn 2,500 XP', earned: stats.totalXP >= 2500 },
    { id: 'xp_8000', name: '⭐ Star Learner', desc: 'Earn 8,000 XP', earned: stats.totalXP >= 8000 },
    { id: 'xp_20000', name: '⭐ Super Star', desc: 'Earn 20,000 XP', earned: stats.totalXP >= 20000 },
    { id: 'xp_45000', name: '⭐ XP Legend', desc: 'Earn 45,000 XP', earned: stats.totalXP >= 45000 },

    // SRS milestones
    { id: 'srs_100', name: '🧠 Review Rookie', desc: 'Review 100 SRS cards', earned: stats.cardsReviewed >= 100 },
    { id: 'srs_500', name: '🧠 Memory Builder', desc: 'Review 500 SRS cards', earned: stats.cardsReviewed >= 500 },
    { id: 'srs_mastered_50', name: '🧠 Mastery Path', desc: 'Master 50 SRS cards', earned: stats.cardsMastered >= 50 },
  ]

  return {
    earned: allBadges.filter(b => b.earned),
    locked: allBadges.filter(b => !b.earned),
    all: allBadges,
    total: allBadges.length,
    earnedCount: allBadges.filter(b => b.earned).length,
  }
}

// ── Utility Functions ─────────────────────────────────────
export function formatStudyTime(totalSeconds) {
  if (totalSeconds < 60) return `${totalSeconds}s`
  if (totalSeconds < 3600) return `${Math.floor(totalSeconds / 60)}m`
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatXP(xp) {
  if (xp >= 1000) return `${(xp / 1000).toFixed(xp >= 10000 ? 0 : 1)}k`
  return xp.toString()
}

export function getMotivationalMessage(streak, xp, lessonsToday) {
  if (lessonsToday === 0) {
    return {
      message: "Start your study session! Every lesson brings you closer to fluency.",
      emoji: "📚",
    }
  }
  if (streak >= 30) {
    return {
      message: `Incredible ${streak}-day streak! You're building true mastery!`,
      emoji: "🏆",
    }
  }
  if (streak >= 7) {
    return {
      message: `Amazing! ${streak} day streak! You're building a powerful habit!`,
      emoji: "🔥",
    }
  }
  if (lessonsToday >= 3) {
    return {
      message: "Great session today! Your Japanese is improving steadily!",
      emoji: "⭐",
    }
  }
  return {
    message: "Great progress! Keep going, every step counts!",
    emoji: "💪",
  }
}