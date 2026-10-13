// src/config/constants.js
// Centralized app configuration to avoid hardcoded values and improve scalability.

export const STORAGE_KEYS = {
  SETTINGS: 'nihongo_settings',
}

export const UPLOAD = {
  MAX_IMAGE_SIZE_MB: 5,
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024,
  ACCEPTED_IMAGE_TYPE_PREFIX: 'image/',
  AVATAR_BUCKET: 'avatars',
  AVATAR_FILENAME_PREFIX: 'avatar',
}

export const PROFILE_CONFIG = {
  USERNAME_MAX_LENGTH: 30,
}

export const LEVEL_DATA = {
  N5: { min: 0,     max: 2500,  color: 'from-green-400 to-emerald-500', label: 'Beginner',     next: 'N4' },
  N4: { min: 2500,  max: 8000,  color: 'from-blue-400 to-blue-600',     label: 'Elementary',   next: 'N3' },
  N3: { min: 8000,  max: 20000, color: 'from-purple-400 to-purple-600', label: 'Intermediate', next: 'N2' },
  N2: { min: 20000, max: 45000, color: 'from-orange-400 to-red-500',    label: 'Advanced',     next: 'N1' },
  N1: { min: 45000, max: 80000, color: 'from-yellow-400 to-amber-500',  label: 'Expert',       next: null },
}

export const RANK_THRESHOLDS = [
  { xp: 0,     title: 'Novice',  iconKey: 'Shield', color: 'text-gray-400' },
  { xp: 500,   title: 'Learner', iconKey: 'Star',   color: 'text-blue-400' },
  { xp: 1000,  title: 'Student', iconKey: 'Award',  color: 'text-green-400' },
  { xp: 2500,  title: 'Scholar', iconKey: 'Medal',  color: 'text-purple-400' },
  { xp: 5000,  title: 'Expert',  iconKey: 'Trophy', color: 'text-orange-400' },
  { xp: 10000, title: 'Master',  iconKey: 'Crown',  color: 'text-yellow-400' },
]

export const SKILL_OVERVIEW = [
  { key: 'reading', label: 'Reading', IconKey: 'Eye', color: 'blue' },
  { key: 'writing', label: 'Writing', IconKey: 'Pen', color: 'purple' },
  { key: 'listening', label: 'Listening', IconKey: 'Volume2', color: 'green' },
  { key: 'speaking', label: 'Speaking', IconKey: 'MessageCircle', color: 'orange' },
  { key: 'grammar', label: 'Grammar', IconKey: 'Languages', color: 'red' },
  { key: 'vocab', label: 'Vocabulary', IconKey: 'BookMarked', color: 'cyan' },
]

export const SKILL_SCORING = {
  reading: { source: 'lessonsCompleted', multiplier: 5 },
  writing: { source: 'kanjiLearned', multiplier: 2 },
  listening: { fixed: 35 },
  speaking: { fixed: 20 },
  grammar: { source: 'lessonsCompleted', multiplier: 3 },
  vocab: { source: 'vocabLearned', divisor: 8 },
}

export const CHAT_DOJO_CONFIG = {
  SPEECH_LANG: 'ja-JP',
  SPEECH_RATE_SLOW: 0.55,
  SPEECH_RATE_NORMAL: 0.85,
  COPY_RESET_MS: 2000,
  RESPONSE_DELAY_BASE_MS: 1200,
  RESPONSE_DELAY_RANDOM_MS: 800,
}

export const SPEECH_CONFIG = {
  LANG: 'ja-JP',
  SCORE_GOOD_THRESHOLD: 90,
  SCORE_OK_THRESHOLD: 70,
}

export const VOCABULARY_CONFIG = {
  SPEECH_LANG: 'ja-JP',
}

export const ACHIEVEMENT_THRESHOLDS = {
  lessons: [1, 5, 10, 25, 50, 100],
  kanji: [1, 10, 50, 100, 200, 500, 1000, 2000],
  vocab: [1, 25, 50, 100, 200, 500, 1000, 2000],
  xp: [50, 100, 500, 1000, 2000, 5000, 10000, 25000, 50000],
  levels: [3, 5, 10, 15, 20],
  streak: [1, 3, 5, 7, 14, 21, 30, 60, 90, 365],
  reviews: [1, 10, 50, 100, 500, 1000],
  milestones: {
    n5: { kanji: 100, vocab: 500 },
    n4: { kanji: 300, vocab: 1500 },
    n3: { kanji: 650, vocab: 3500 },
    wellRounded: { lessons: 10, kanji: 50, vocab: 100 },
    tripleThreat: { level: 10, streak: 7, xp: 1000 },
    perfectionistUnlockCount: 50,
  },
  secret: {
    dailyXP: 100,
    firstHourLessons: 5,
  },
  socialWindows: {
    nightOwl: { startHour: 0, endHour: 5 },
    earlyBird: { startHour: 5, endHour: 7 },
  }
}