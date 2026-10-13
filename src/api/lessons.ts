// ─── Lessons API ─────────────────────────────────────────────────────────────

import { get } from './client';
import type { LessonListResponse, LessonDetailResponse } from '../types/api';
import type { JLPTLevel } from '../types/models';

/**
 * List all lessons for a JLPT level.
 */
export function getLessons(level: JLPTLevel): Promise<LessonListResponse> {
  return get<LessonListResponse>('/lessons', { params: { level } });
}

/**
 * Get a specific lesson with full content (vocabulary, kanji, grammar).
 */
export function getLesson(level: JLPTLevel, day: number): Promise<LessonDetailResponse> {
  return get<LessonDetailResponse>(`/lessons/${level}/${day}`);
}
