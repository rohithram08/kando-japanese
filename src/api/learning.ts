// ─── Learning insights API (measured, not guessed) ──────────────────────────

import { get, post } from './client';

export type Modality = 'recall' | 'recognition' | 'listening' | 'writing' | 'reading';
export type ItemType = 'kanji' | 'vocabulary' | 'grammar' | 'reading' | 'kana';

export interface SuggestionDto { code: string; params?: Record<string, string | number> }

export interface LearningInsights {
  windowDays: number;
  sampleSize: number;
  confidence: 'low' | 'medium' | 'high';
  overall: { attempts: number; accuracy: number | null; recentAccuracy: number | null };
  byType: { itemType: string; attempts: number; accuracy: number; medianMs: number | null }[];
  byModality: { modality: string; attempts: number; accuracy: number; medianMs: number | null }[];
  modalitySignal: { best: string; worst: string; gap: number } | null;
  byTimeBlock: { block: string; attempts: number; accuracy: number }[];
  timeSignal: { best: string; gap: number } | null;
  leeches: { itemType: string; itemId: string; attempts: number; accuracy: number }[];
  consistency: { activeDaysLast14: number };
  plan: { newItemsCap: number; interleave: boolean; reviewFirst: boolean; targetAccuracy: number };
  suggestions: SuggestionDto[];
}

export interface EvidenceItem { id: string; cite: string; url: string; supports: string }

export const getInsights = () => get<{ insights: LearningInsights; evidence: EvidenceItem[] }>('/learning/insights');

export interface AttemptDto {
  itemType: ItemType;
  itemId: string;
  correct: boolean;
  quality?: number;
  responseMs?: number;
  modality?: Modality;
}

/** Fire-and-forget logging of answered items; failures are swallowed (analytics must never block learning). */
export function recordAttempts(attempts: AttemptDto[]): Promise<void> {
  if (!attempts.length) return Promise.resolve();
  return post<unknown>('/learning/attempts', { attempts: attempts.slice(0, 50) }).then(() => undefined, () => undefined);
}
