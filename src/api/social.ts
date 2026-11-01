// ─── Social API: follow / unfollow and the global learner directory ─────────

import { get, post, del } from './client';
import type { AvatarConfig } from '../types/models';

export interface Person {
  id: string;
  username: string;
  level: string;
  xp: number;
  streakDays: number;
  avatarConfig: AvatarConfig | null;
  avatarId: string | null;
  avatarUrl: string | null;
  isFollowing: boolean;
  followsYou: boolean;
}

export interface PeoplePage {
  people: Person[];
  hasMore: boolean;
  nextOffset: number | null;
}

export interface FollowCounts {
  followers: number;
  following: number;
}

export type FollowResult = FollowCounts & { isFollowing: boolean };

interface PageParams { limit?: number; offset?: number }

const qs = (params: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : '';
};

/** Global directory of learners (opted-out learners are never returned). */
export const searchPeople = (params: PageParams & { q?: string } = {}) =>
  get<PeoplePage>(`/social/people${qs(params)}`);

export const getFollowing = (params: PageParams = {}) => get<PeoplePage>(`/social/following${qs(params)}`);
export const getFollowers = (params: PageParams = {}) => get<PeoplePage>(`/social/followers${qs(params)}`);
export const getFollowSummary = () => get<FollowCounts>('/social/summary');

export const followUser = (userId: string) =>
  post<FollowResult>(`/social/follow/${encodeURIComponent(userId)}`);
export const unfollowUser = (userId: string) =>
  del<FollowResult>(`/social/follow/${encodeURIComponent(userId)}`);
