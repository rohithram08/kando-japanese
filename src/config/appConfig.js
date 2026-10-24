// ─── App-wide constants and tunables ─────────────────────
export const APP_CONFIG = {
  // App identity
  APP_NAME: 'Kando Japanese',
  LOCAL_STORAGE_KEY: 'nihongo_settings',

  // File upload limits
  AVATAR_MAX_SIZE_MB: 2, // must match backend/src/routes/upload.ts MAX_FILE_SIZE
  AVATAR_MAX_SIZE_BYTES: 2 * 1024 * 1024,
  AVATAR_BUCKET: 'avatars',
  AVATAR_ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  // Speech synthesis
  SPEECH: {
    LANG: 'ja-JP',
    RATE_NORMAL: 0.85,
    RATE_SLOW: 0.55,
  },

  // Chat Dojo timing (ms)
  CHAT: {
    GREETING_DELAY_MS: 1000,
    RESPONSE_DELAY_MIN_MS: 1200,
    RESPONSE_DELAY_RANDOM_MS: 800,
    COPY_RESET_MS: 2000,
  },

  // Username constraints
  USERNAME_MAX_LENGTH: 30,

  // Database table names – single source of truth
  TABLES: {
    USER_PROFILES: 'user_profiles',
    LESSON_PROGRESS: 'user_lesson_progress',
    KANJI_PROGRESS: 'user_kanji_progress',
    VOCAB_PROGRESS: 'user_vocabulary_progress',
    SRS_CARDS: 'srs_cards',
  },

  // Pagination / display limits
  SRS_REVIEW_BATCH_SIZE: 20,
  LEADERBOARD_PAGE_SIZE: 10,
}