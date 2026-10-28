// ─── Users API ───────────────────────────────────────────────────────────────

import { get, post, put, del } from './client';
import type { LevelStatus } from '../types/models';
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

/**
 * Study level, unlocked levels and coverage of the current level.
 */
export function getLevelStatus(): Promise<LevelStatus> {
  return get<LevelStatus>('/users/level-status');
}

export type StudyAlertType = 'study' | 'streak' | 'cheer' | 'league';

export interface SendAlertResponse {
  success: boolean;
  message: string;
  alert: {
    type: StudyAlertType;
    label: string;
    text: string;
    icon: string;
    senderName: string;
    recipientId: string;
    sentAt: string;
  };
}

/**
 * Send a predefined, confidential study alert to a fellow learner.
 * Free-text messaging is strictly disallowed.
 */
export function sendUserAlert(userId: string, alertType: StudyAlertType): Promise<SendAlertResponse> {
  return post<SendAlertResponse>(`/users/${encodeURIComponent(userId)}/alert`, { alertType });
}
