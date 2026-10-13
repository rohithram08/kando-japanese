// src/api/reading.ts
// ─────────────────────────────────────────────────────────────────────────────
// Frontend API Client for Graded Reading Progress
// ─────────────────────────────────────────────────────────────────────────────

import { get, post } from './client';
import type { UserReadingProgress, SaveReadingProgressPayload } from '../types/reading';

export async function getReadingProgress(): Promise<UserReadingProgress[]> {
  const response = await get<{ progress: UserReadingProgress[] }>('/reading/progress');
  return response.progress;
}

export async function getStoryProgress(storyId: string): Promise<UserReadingProgress | null> {
  const response = await get<{ progress: UserReadingProgress }>(`/reading/progress/${storyId}`);
  return response.progress;
}

export async function saveReadingProgress(
  payload: SaveReadingProgressPayload
): Promise<{ progress: UserReadingProgress; xpAwarded: number }> {
  return post<{ progress: UserReadingProgress; xpAwarded: number }>('/reading/progress', payload);
}
