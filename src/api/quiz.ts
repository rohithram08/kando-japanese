// ─── Quiz API ────────────────────────────────────────────────────────────────

import { get, post } from './client';
import type {
  QuizResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
} from '../types/api';

/**
 * Get quiz data for a lesson.
 */
export function getQuiz(lessonId: string): Promise<QuizResponse> {
  return get<QuizResponse>(`/quiz/${lessonId}`);
}

/**
 * Submit quiz results. Backend calculates and awards XP.
 */
export function submitQuiz(lessonId: string, data: QuizSubmitRequest): Promise<QuizSubmitResponse> {
  return post<QuizSubmitResponse>(`/quiz/${lessonId}/submit`, data);
}
