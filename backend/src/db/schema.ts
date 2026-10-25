import { mysqlTable, varchar, int, text, boolean, datetime, date, float, timestamp, primaryKey, index, uniqueIndex } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  nativeLanguage: varchar('native_language', { length: 50 }).default('English'),
  // XP-derived JLPT rank (auto-updated by the progress routes). Display only.
  currentLevel: varchar('current_level', { length: 10 }).default('N5'),
  // Highest JLPT level whose content the user may open (N5 -> only N5, N3 -> N5+N4+N3).
  // Changed only by the user (Settings / level-up), never by XP.
  studyLevel: varchar('study_level', { length: 10 }).default('N5').notNull(),
  avatarUrl: text('avatar_url'),
  // JSON recipe for the customizable cartoon avatar (see services/avatarConfig.ts). TEXT keeps MariaDB/MySQL/TiDB behaviour identical.
  avatarConfig: text('avatar_config'),
  // Privacy: true = hidden from leagues and leaderboards.
  leagueOptOut: boolean('league_opt_out').default(false).notNull(),
  avatarId: varchar('avatar_id', { length: 100 }),
  xpPoints: int('xp_points').default(0).notNull(),
  streakDays: int('streak_days').default(0).notNull(),
  timezone: varchar('timezone', { length: 100 }).default('UTC'),
  googleId: varchar('google_id', { length: 255 }),  // For Google OAuth
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Lesson Progress ─────────────────────────────────────────────────────────
export const userLessonProgress = mysqlTable('user_lesson_progress', {
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: varchar('lesson_id', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).default('in_progress').notNull(),
  score: int('score').default(0),
  timeSpentSeconds: int('time_spent_seconds').default(0),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.lessonId] }),
}));

// ─── Kanji Progress ──────────────────────────────────────────────────────────
export const userKanjiProgress = mysqlTable('user_kanji_progress', {
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  kanjiId: varchar('kanji_id', { length: 100 }).notNull(),
  recognitionLevel: int('recognition_level').default(0).notNull(),
  mastered: boolean('mastered').default(false),
  reviewCount: int('review_count').default(0),
  lastReviewedAt: timestamp('last_reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.kanjiId] }),
}));

// ─── Vocabulary Progress ─────────────────────────────────────────────────────
export const userVocabularyProgress = mysqlTable('user_vocabulary_progress', {
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  vocabularyId: varchar('vocabulary_id', { length: 100 }).notNull(),
  masteryLevel: int('mastery_level').default(0).notNull(),
  mastered: boolean('mastered').default(false),
  reviewCount: int('review_count').default(0),
  lastReviewedAt: timestamp('last_reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.vocabularyId] }),
}));

// ─── Grammar Progress ────────────────────────────────────────────────────────
export const userGrammarProgress = mysqlTable('user_grammar_progress', {
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  grammarId: varchar('grammar_id', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).default('studied').notNull(),
  mastered: boolean('mastered').default(false).notNull(),
  studyCount: int('study_count').default(1).notNull(),
  lastStudiedAt: timestamp('last_studied_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.grammarId] }),
  userGrammarStatusIdx: index('user_grammar_status_idx').on(table.userId, table.status),
}));

// ─── Streaks ─────────────────────────────────────────────────────────────────
export const userStreaks = mysqlTable('user_streaks', {
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date', { mode: 'string' }).notNull(),
  lessonsCompleted: int('lessons_completed').default(0),
  minutesStudied: int('minutes_studied').default(0),
  xp: int('xp').default(0),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.date] }),
}));

// XP ledger: append-only record of every XP award. users.xp_points stays the fast total;
// this table is the auditable source for weekly leagues, rival battles and anti-cheat.
export const xpEvents = mysqlTable('xp_events', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: int('amount').notNull(),
  source: varchar('source', { length: 32 }).notNull(),
  refId: varchar('ref_id', { length: 100 }),
  minutes: int('minutes').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userTimeIdx: index('xp_events_user_time_idx').on(table.userId, table.createdAt),
  timeIdx: index('xp_events_time_idx').on(table.createdAt),
}));

// ─── Leagues ─────────────────────────────────────────────────────────────────
// Weekly leagues (see services/leagueRules.ts). A learner sits on one of 15 rungs; each week they
// are placed in a cohort of up to 30 learners on the same rung and ranked by league XP.

export const leagueMembership = mysqlTable('league_membership', {
  userId: varchar('user_id', { length: 36 }).primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  rung: int('rung').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const leagueWeeks = mysqlTable('league_weeks', {
  /** IST Monday date, e.g. 2026-10-19 */
  id: varchar('id', { length: 10 }).primaryKey(),
  startsAt: timestamp('starts_at').notNull(),
  endsAt: timestamp('ends_at').notNull(),
  settledAt: timestamp('settled_at'),
});

export const leagueCohorts = mysqlTable('league_cohorts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  weekId: varchar('week_id', { length: 10 }).notNull(),
  rung: int('rung').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  weekRungIdx: index('league_cohorts_week_rung_idx').on(table.weekId, table.rung),
}));

export const leagueEntries = mysqlTable('league_entries', {
  id: varchar('id', { length: 36 }).primaryKey(),
  cohortId: varchar('cohort_id', { length: 36 }).notNull(),
  weekId: varchar('week_id', { length: 10 }).notNull(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  rungStart: int('rung_start').notNull(),
  /** Final league XP, rank and outcome - filled in when the week is settled. */
  xp: int('xp'),
  rank: int('rank'),
  outcome: varchar('outcome', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  weekUserUnique: uniqueIndex('league_entries_week_user').on(table.weekId, table.userId),
  cohortIdx: index('league_entries_cohort_idx').on(table.cohortId),
  userIdx: index('league_entries_user_idx').on(table.userId, table.weekId),
}));

// ─── Badges ──────────────────────────────────────────────────────────────────
export const userBadges = mysqlTable('user_badges', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeType: varchar('badge_type', { length: 100 }).notNull(),
  badgeName: varchar('badge_name', { length: 200 }),
  awardedAt: timestamp('awarded_at').defaultNow().notNull(),
}, (table) => ({
  userBadgeUnique: uniqueIndex('user_badge_unique').on(table.userId, table.badgeType),
}));

// ─── SRS Cards ───────────────────────────────────────────────────────────────
export const srsCards = mysqlTable('srs_cards', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  cardType: varchar('card_type', { length: 20 }).notNull(), // 'vocabulary' | 'kanji'
  cardRefId: varchar('card_ref_id', { length: 100 }).notNull(), // references vocab/kanji ID
  easeFactor: float('ease_factor').default(2.5).notNull(),
  intervalDays: int('interval_days').default(0).notNull(),
  repetitions: int('repetitions').default(0).notNull(),
  nextReviewDate: date('next_review_date').notNull(),
  lastReviewDate: date('last_review_date'),
  isMastered: boolean('is_mastered').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userCardUnique: uniqueIndex('user_card_unique').on(table.userId, table.cardType, table.cardRefId),
  dueCardsIdx: index('due_cards_idx').on(table.userId, table.isMastered, table.nextReviewDate),
}));

// ─── Sensei Conversations ──────────────────────────────────────────────────────
export const senseiConversations = mysqlTable('sensei_conversations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  intent: varchar('intent', { length: 50 }),
  emotion: varchar('emotion', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userCreatedIdx: index('user_created_idx').on(table.userId, table.createdAt),
}));

// ─── Sensei Tour Progress ────────────────────────────────────────────────────
export const senseiTourProgress = mysqlTable('sensei_tour_progress', {
  userId: varchar('user_id', { length: 36 }).primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  currentStep: int('current_step').default(0).notNull(),
  completed: boolean('completed').default(false).notNull(),
  skipped: boolean('skipped').default(false).notNull(),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// ─── Reading Progress ────────────────────────────────────────────────────────
export const userReadingProgress = mysqlTable('user_reading_progress', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  storyId: varchar('story_id', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).default('in_progress').notNull(), // 'in_progress' | 'completed'
  lastSentenceIndex: int('last_sentence_index').default(0).notNull(),
  quizScore: int('quiz_score').default(0), // percentage
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userStoryUnique: uniqueIndex('user_story_unique').on(table.userId, table.storyId),
  userReadingIdx: index('user_reading_idx').on(table.userId, table.status),
}));

// ─── Relations ───────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  lessonProgress: many(userLessonProgress),
  kanjiProgress: many(userKanjiProgress),
  vocabularyProgress: many(userVocabularyProgress),
  streaks: many(userStreaks),
  badges: many(userBadges),
  srsCards: many(srsCards),
  senseiConversations: many(senseiConversations),
  senseiTourProgress: many(senseiTourProgress),
  readingProgress: many(userReadingProgress),
  grammarProgress: many(userGrammarProgress),
}));

export const userGrammarProgressRelations = relations(userGrammarProgress, ({ one }) => ({
  user: one(users, { fields: [userGrammarProgress.userId], references: [users.id] }),
}));

export const userReadingProgressRelations = relations(userReadingProgress, ({ one }) => ({
  user: one(users, { fields: [userReadingProgress.userId], references: [users.id] }),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  user: one(users, { fields: [userLessonProgress.userId], references: [users.id] }),
}));

export const userKanjiProgressRelations = relations(userKanjiProgress, ({ one }) => ({
  user: one(users, { fields: [userKanjiProgress.userId], references: [users.id] }),
}));

export const userVocabularyProgressRelations = relations(userVocabularyProgress, ({ one }) => ({
  user: one(users, { fields: [userVocabularyProgress.userId], references: [users.id] }),
}));

export const userStreaksRelations = relations(userStreaks, ({ one }) => ({
  user: one(users, { fields: [userStreaks.userId], references: [users.id] }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
}));

export const srsCardsRelations = relations(srsCards, ({ one }) => ({
  user: one(users, { fields: [srsCards.userId], references: [users.id] }),
}));

export const senseiConversationsRelations = relations(senseiConversations, ({ one }) => ({
  user: one(users, { fields: [senseiConversations.userId], references: [users.id] }),
}));

export const senseiTourProgressRelations = relations(senseiTourProgress, ({ one }) => ({
  user: one(users, { fields: [senseiTourProgress.userId], references: [users.id] }),
}));
