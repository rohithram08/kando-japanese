// ─── Users API ───────────────────────────────────────────────────────────────

import { get, put, del } from './client';
import type {
  UserProfileResponse,
  UpdateProfileRequest,
} from '../types/api';

/**
 * Get the authenticated user's profile.
 */
export function getProfile(): Promise<UserProfileResponse> {
  return get<UserProfileResponse>('/users/profile');
}

/**
 * Update the authenticated user's profile.
 */
export function updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
  return put<UserProfileResponse>('/users/profile', data);
}

/**
 * Public profile response for any user / peer
 */
export interface PublicUserProfile {
  id: string;
  username: string;
  nativeLanguage?: string;
  currentLevel?: string;
  avatarUrl?: string | null;
  avatarId?: string | null;
  xpPoints: number;
  streakDays: number;
  createdAt: string;
  lessonsCount: number;
  kanjiCount: number;
  vocabCount: number;
}

/**
 * Get public profile of a user by ID.
 */
export function getUserProfile(userId: string): Promise<PublicUserProfile> {
  return get<PublicUserProfile>(`/users/${encodeURIComponent(userId)}`);
}

/**
 * Delete the authenticated user's account and all associated data.
 * This is irreversible.
 */
export function deleteAccount(): Promise<{ message: string }> {
  return del<{ message: string }>('/users/account');
}

