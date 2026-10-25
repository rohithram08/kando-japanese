// ─── Domain Model Types ─────────────────────────────────────────────────────
// These types represent the core data structures used throughout the application.
// They are shared between the API client and components.
// ─────────────────────────────────────────────────────────────────────────────

// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  nativeLanguage: string;
  /** XP-derived rank (display only). Use studyLevel for access control. */
  currentLevel: JLPTLevel;
  /** Highest JLPT level the user may open; content is cumulative (N3 => N5+N4+N3). */
  studyLevel?: JLPTLevel;
  avatarUrl: string | null;
  /** Customizable cartoon avatar recipe; wins over avatarUrl/avatarId when set. */
  avatarConfig?: AvatarConfig | null;
  avatarId: string | null;
  xpPoints: number;
  streakDays: number;
  createdAt: string;
  updatedAt: string;
}

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface AvatarConfig {
  style: 'avataaars' | 'lorelei' | 'openPeeps' | 'notionists';
  seed: string;
  options: Record<string, string | number>;
}

export interface CategoryCoverage {
  done: number;
  total: number;
  percent: number;
}

export interface LevelStatus {
  studyLevel: JLPTLevel;
  unlocked: JLPTLevel[];
  nextLevel: JLPTLevel | null;
  coverage: {
    percent: number;
    threshold: number;
    categories: Record<'vocabulary' | 'kanji' | 'grammar' | 'reading', CategoryCoverage>;
  } | null;
  readyToLevelUp: boolean;
}

export interface AuthSession {
  user: User;
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export interface Lesson {
  id: string;
  level: JLPTLevel;
  day: number;
  title: string;
  titleJp: string;
  description: string;
  vocabulary: VocabularyItem[];
  kanji: KanjiItem[];
  grammar: GrammarPoint[];
}

export interface LessonSummary {
  id: string;
  level: JLPTLevel;
  day: number;
  title: string;
  titleJp: string;
  description: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  partOfSpeech: string;
}

export interface KanjiItem {
  id: string;
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokeCount: number;
  examples: string[];
}

export interface GrammarPoint {
  id: string;
  pattern: string;
  meaning: string;
  explanation: string;
  examples: GrammarExample[];
}

export interface GrammarExample {
  japanese: string;
  romaji: string;
  english: string;
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface UserProgress {
  totalXP: number;
  streakDays: number;
  longestStreak?: number;
  isActiveToday?: boolean;
  userLevel: number;
  jlptLevel: JLPTLevel;
  lessonsCompleted: number;
  kanjiLearned: number;
  vocabLearned: number;
  grammarLearned?: number;
  cardsReviewed: number;
  cardsMastered: number;
  srsReviewsDue: number;
}

export interface LessonProgress {
  lessonId: string;
  status: 'in_progress' | 'completed';
  score: number;
  timeSpentSeconds: number;
  lastAccessedAt: string;
  completedAt: string | null;
}

export interface KanjiProgress {
  userId: string;
  kanjiId: string;
  recognitionLevel: number;
  mastered: boolean;
  reviewCount: number;
  lastReviewedAt: string | null;
  createdAt: string;
}

export interface VocabularyProgress {
  userId: string;
  vocabularyId: string;
  masteryLevel: number;
  mastered: boolean;
  reviewCount: number;
  lastReviewedAt: string | null;
  createdAt: string;
}

export interface GrammarProgress {
  userId: string;
  grammarId: string;
  status: 'not_started' | 'studied' | 'mastered';
  mastered: boolean;
  studyCount: number;
  lastStudiedAt: string | null;
  createdAt: string;
}

export interface StreakEntry {
  date: string;
  lessonsCompleted: number;
  minutesStudied: number;
  xp: number;
}

export interface Badge {
  id: string;
  badgeType: string;
  badgeName: string | null;
  awardedAt: string;
}

export interface XPAwardResult {
  xpGained: number;
  totalXP: number;
  newLevel: number;
  badgesAwarded: Badge[];
  streakDays: number;
}

export type XPEventType =
  | 'lesson_completed'
  | 'quiz_completed'
  | 'srs_review'
  | 'kanji_learned'
  | 'vocab_learned'
  | 'kana_learned'
  | 'grammar_studied'
  | 'daily_goal_complete';

// ─── SRS ─────────────────────────────────────────────────────────────────────

export interface SRSCard {
  id: string;
  cardType: 'vocabulary' | 'kanji' | 'kana';
  cardRefId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string | null;
  isMastered: boolean;
  createdAt: string;
  // Populated from join:
  content?: VocabularyItem | KanjiItem;
}

export type SRSQuality = 0 | 2 | 4 | 5;
// 0 = Forgot, 2 = Hard, 4 = Good, 5 = Easy

export interface SRSReviewResult {
  card: SRSCard;
  xpGained: number;
}

export type SRSIntervalMode = 'relaxed' | 'balanced' | 'intense';

// ─── Quiz ────────────────────────────────────────────────────────────────────

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionJp?: string;
  options: string[];
  correct: number;
  explanation: string;
  explanationJp?: string;
}

export interface QuizSubmission {
  lessonId: string;
  score: number;
  totalQuestions: number;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  correct: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  xpGained: number;
  passed: boolean;
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIChatResponse {
  message: string;
  romaji: string;
  translation: string;
  corrections: AIChatCorrection | null;
}

export interface AIChatCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface AIWritingFeedback {
  overall_score: number;
  grammar_score: number;
  vocabulary_score: number;
  naturalness_score: number;
  corrections: string[];
  positive_feedback: string;
  improvement_tips: string;
  native_alternative: string;
}

export interface AIMnemonic {
  mnemonic: string;
  visual: string;
}

// ─── Streak ──────────────────────────────────────────────────────────────────

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isActiveToday: boolean;
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

export interface AvatarUploadResult {
  url: string;
  key: string;
}
