// ─── League API ──────────────────────────────────────────────────────────────

import { get, put } from './client';
import type { LeagueView, LeagueHistoryWeek, GlobalBoard } from '../types/models';

/** Current league, rung, countdown and cohort standings. */
export function getLeague(): Promise<LeagueView> {
  return get<LeagueView>('/league/me');
}

export function getLeagueHistory(): Promise<{ weeks: LeagueHistoryWeek[] }> {
  return get<{ weeks: LeagueHistoryWeek[] }>('/league/history');
}

/** All-time top learners by total XP. */
export function getGlobalBoard(): Promise<GlobalBoard> {
  return get<GlobalBoard>('/league/global');
}

/** Hide from (true) or rejoin (false) leagues and leaderboards. */
export function setLeagueOptOut(optOut: boolean): Promise<{ optOut: boolean }> {
  return put<{ optOut: boolean }>('/league/settings', { optOut });
}
