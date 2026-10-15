// ─── Progress API ────────────────────────────────────────────────────────────

import { get, post, del } from './client';
import type {
  ProgressResponse,
  LessonProgressListResponse,
  LessonCompletionRequest,
  LessonCompletionResponse,
  KanjiProgressListResponse,
  RecordKanjiProgressRequest,
  RecordKanjiProgressResponse,
  VocabularyProgressListResponse,
  RecordVocabularyProgressRequest,
  RecordVocabularyProgressResponse,
  GrammarProgressListResponse,
  RecordGrammarProgressRequest,
  RecordGrammarProgressResponse,
  XPEventRequest,
  XPEventResponse,
  StreakHistoryResponse,
  BadgeListResponse,
  AwardBadgeRequest,
  AwardBadgeResponse,
  ProgressResetResponse,
} from '../types/api';

/**
 * Get the authenticated user's complete progress summary.
 */
export function getProgress(): Promise<ProgressResponse> {
  return get<ProgressResponse>('/progress');
}

/**
 * Get lesson-level progress for the authenticated user.
 */
export function getLessonProgress(): Promise<LessonProgressListResponse> {
  return get<LessonProgressListResponse>('/progress/lessons');
}

/**
 * Record a lesson completion. Backend calculates XP.
 */
export function completeLesson(data: LessonCompletionRequest): Promise<LessonCompletionResponse> {
  return post<LessonCompletionResponse>('/progress/lesson', data);
}

/**
 * Get all kanji progress for the authenticated user.
 */
export function getKanjiProgress(): Promise<KanjiProgressListResponse> {
  return get<KanjiProgressListResponse>('/progress/kanji');
}

/**
 * Record or update kanji learning progress. Backend calculates XP and updates streaks.
 */
export function recordKanjiProgress(data: RecordKanjiProgressRequest): Promise<RecordKanjiProgressResponse> {
  return post<RecordKanjiProgressResponse>('/progress/kanji', data);
}

/**
 * Get all vocabulary progress for the authenticated user.
 */
export function getVocabularyProgress(): Promise<VocabularyProgressListResponse> {
  return get<VocabularyProgressListResponse>('/progress/vocabulary');
}

/**
 * Record or update vocabulary learning progress. Backend calculates XP and updates streaks.
 */
export function recordVocabularyProgress(data: RecordVocabularyProgressRequest): Promise<RecordVocabularyProgressResponse> {
  return post<RecordVocabularyProgressResponse>('/progress/vocabulary', data);
}

/**
 * Get all grammar progress for the authenticated user.
 */
export function getGrammarProgress(): Promise<GrammarProgressListResponse> {
  return get<GrammarProgressListResponse>('/progress/grammar');
}

/**
 * Record or update grammar learning progress. Backend calculates XP and updates streaks.
 */
export function recordGrammarProgress(data: RecordGrammarProgressRequest): Promise<RecordGrammarProgressResponse> {
  return post<RecordGrammarProgressResponse>('/progress/grammar', data);
}

/**
 * Submit an XP event. Backend validates and atomically increments XP.
 * NEVER send raw XP amounts — send the event type and let the backend calculate.
 */
export function submitXPEvent(data: XPEventRequest): Promise<XPEventResponse> {
  return post<XPEventResponse>('/progress/xp', data);
}

/**
 * Get streak history (last 30 days) with current streak info.
 */
export function getStreakHistory(): Promise<StreakHistoryResponse> {
  return get<StreakHistoryResponse>('/progress/streaks');
}

/**
 * Record today's activity for streak tracking.
 */
export function recordStreakActivity(): Promise<{ streakDays: number }> {
  return post<{ streakDays: number }>('/progress/streak');
}

/**
 * Get all earned badges.
 */
export function getBadges(): Promise<BadgeListResponse> {
  return get<BadgeListResponse>('/progress/badges');
}

/**
 * Award a badge (called by backend logic, but exposed for edge cases).
 */
export function awardBadge(data: AwardBadgeRequest): Promise<AwardBadgeResponse> {
  return post<AwardBadgeResponse>('/progress/badges', data);
}

/**
 * Reset ALL user progress. Irreversible.
 * Deletes: lesson progress, kanji progress, vocab progress, SRS cards, streaks, badges.
 * Resets XP to 0.
 */
export function resetAllProgress(): Promise<ProgressResetResponse> {
  return del<ProgressResetResponse>('/progress/reset');
}
