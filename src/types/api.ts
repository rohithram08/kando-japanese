// ─── API Request/Response Types ─────────────────────────────────────────────
// Typed contracts for every backend endpoint.
// These are distinct from domain models — they represent wire format.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  User,
  JLPTLevel,
  LessonSummary,
  Lesson,
  LessonProgress,
  KanjiProgress,
  VocabularyProgress,
  UserProgress,
  StreakEntry,
  Badge,
  XPEventType,
  XPAwardResult,
  SRSCard,
  SRSQuality,
  SRSReviewResult,
  SRSIntervalMode,
  Quiz,
  QuizResult,
  AIChatMessage,
  AIChatResponse,
  AIWritingFeedback,
  AIMnemonic,
  AvatarUploadResult,
  StreakInfo,
} from './models';

// ─── Generic API Response ────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiError;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  nativeLanguage?: string;
  currentLevel?: JLPTLevel;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface AuthMeResponse extends User {}

export interface ResetPasswordRequestPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface UpdateProfileRequest {
  username?: string;
  nativeLanguage?: string;
  currentLevel?: JLPTLevel;
  avatarUrl?: string | null;
  avatarId?: string | null;
}

export interface UserProfileResponse extends User {}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export interface LessonListResponse {
  lessons: LessonSummary[];
}

export interface LessonDetailResponse {
  lesson: Lesson;
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface ProgressResponse extends UserProgress {}

export interface LessonProgressListResponse {
  progress: LessonProgress[];
}

export interface LessonCompletionRequest {
  lessonId: string;
  score: number;
  timeSpentSeconds: number;
}

export interface LessonCompletionResponse {
  progress: LessonProgress;
  xpResult: XPAwardResult;
}

export interface KanjiProgressListResponse {
  kanji: KanjiProgress[];
}

export interface RecordKanjiProgressRequest {
  kanjiId: string;
  recognitionLevel?: number;
  mastered?: boolean;
}

export interface RecordKanjiProgressResponse {
  progress: KanjiProgress;
  xpResult: XPAwardResult;
}

export interface VocabularyProgressListResponse {
  vocabulary: VocabularyProgress[];
}

export interface RecordVocabularyProgressRequest {
  vocabularyId: string;
  masteryLevel?: number;
  mastered?: boolean;
}

export interface RecordVocabularyProgressResponse {
  progress: VocabularyProgress;
  xpResult: XPAwardResult;
}

export interface XPEventRequest {
  event: XPEventType;
  lessonId?: string;
  score?: number;
  timeSpentSeconds?: number;
  totalQuestions?: number;
  quality?: SRSQuality;
}

export interface XPEventResponse extends XPAwardResult {}

export interface StreakHistoryResponse {
  streaks: StreakEntry[];
  streakInfo: StreakInfo;
}

export interface BadgeListResponse {
  badges: Badge[];
}

export interface AwardBadgeRequest {
  badgeType: string;
  badgeName?: string;
}

export interface AwardBadgeResponse {
  badge: Badge;
}

export interface ProgressResetResponse {
  message: string;
}

// ─── SRS ─────────────────────────────────────────────────────────────────────

export interface SRSDueCardsResponse {
  cards: SRSCard[];
}

export interface SRSDueCountResponse {
  count: number;
}

export interface AddSRSCardRequest {
  cardType: 'vocabulary' | 'kanji' | 'kana';
  cardRefId: string;
}

export interface AddSRSCardResponse {
  card: SRSCard;
}

export interface ReviewSRSCardRequest {
  quality: SRSQuality;
  intervalMode?: SRSIntervalMode;
}

export interface ReviewSRSCardResponse extends SRSReviewResult {}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export interface QuizResponse extends Quiz {}

export interface QuizSubmitRequest {
  score: number;
  totalQuestions: number;
  answers: Array<{
    questionId: string;
    selectedOption: number;
    correct: boolean;
  }>;
}

export interface QuizSubmitResponse extends QuizResult {}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AIChatStartRequest {
  systemPrompt: string;
  scenario: string;
}

export interface AIChatStartResponse {
  data: string; // JSON string to be parsed
}

export interface AIChatRequest {
  messages: AIChatMessage[];
  userMessage: string;
  systemPrompt: string;
}

export interface AIChatResponse {
  data: string; // JSON string to be parsed
}

export interface AICheckWritingRequest {
  text: string;
  level?: string;
}

export interface AICheckWritingResponse {
  data: string; // JSON string to be parsed
}

export interface AIGenerateMnemonicRequest {
  kanji: string;
  meaning: string;
}

export interface AIGenerateMnemonicResponse {
  data: string; // JSON string to be parsed
}

export interface AIGenerateQuizRequest {
  content: unknown;
  level?: string;
  count?: number;
}

export interface AIGenerateQuizResponse {
  data: string; // JSON string to be parsed
}

// ─── Upload ──────────────────────────────────────────────────────────────────

export interface AvatarUploadResponse extends AvatarUploadResult {}

export interface AvatarDeleteResponse {
  message: string;
}
