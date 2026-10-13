// ─── SRS API ─────────────────────────────────────────────────────────────────

import { get, post, put } from './client';
import type {
  SRSDueCardsResponse,
  SRSDueCountResponse,
  AddSRSCardRequest,
  AddSRSCardResponse,
  ReviewSRSCardRequest,
  ReviewSRSCardResponse,
} from '../types/api';

/**
 * Get SRS cards due for review.
 * Returns unmastered cards where nextReviewDate <= today, limit 20.
 */
export function getDueCards(): Promise<SRSDueCardsResponse> {
  return get<SRSDueCardsResponse>('/srs/due');
}

/**
 * Get count of cards due for review (for dashboard badge).
 */
export function getDueCardCount(): Promise<SRSDueCountResponse> {
  return get<SRSDueCountResponse>('/srs/due/count');
}

/**
 * Add a new card to the SRS deck.
 */
export function addCard(data: AddSRSCardRequest): Promise<AddSRSCardResponse> {
  return post<AddSRSCardResponse>('/srs/cards', data);
}

/**
 * Submit a review result for an SRS card.
 * Backend applies SM-2 algorithm and returns updated card state.
 * Quality: 0=Forgot, 2=Hard, 4=Good, 5=Easy
 */
export function reviewCard(cardId: string, data: ReviewSRSCardRequest): Promise<ReviewSRSCardResponse> {
  return put<ReviewSRSCardResponse>(`/srs/cards/${cardId}/review`, data);
}

/**
 * Get all SRS cards belonging to current user (for membership checking).
 */
export function getAllCards(): Promise<{ cards: import('../types/models').SRSCard[] }> {
  return get<{ cards: import('../types/models').SRSCard[] }>('/srs/cards');
}
