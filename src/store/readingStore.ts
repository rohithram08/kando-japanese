// src/store/readingStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zustand Store for Graded Reading State & Progress Synchronization
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { getReadingProgress, getStoryProgress, saveReadingProgress } from '../api/reading';
import { useProgressStore } from './progressStore';
import type { UserReadingProgress, SaveReadingProgressPayload } from '../types/reading';

const GUEST_STORAGE_KEY = 'nihongo_guest_reading_progress';

function loadGuestProgress(): Record<string, UserReadingProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveGuestProgress(data: Record<string, UserReadingProgress>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore localStorage write failures
  }
}

export interface ReadingState {
  progressMap: Record<string, UserReadingProgress>;
  loading: boolean;
  error: string | null;

  // Actions
  loadAllProgress: (isAuthenticated: boolean) => Promise<void>;
  fetchStoryProgress: (storyId: string, isAuthenticated: boolean) => Promise<UserReadingProgress | null>;
  saveProgress: (
    payload: SaveReadingProgressPayload,
    isAuthenticated: boolean
  ) => Promise<{ progress: UserReadingProgress; xpAwarded: number }>;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
  progressMap: {},
  loading: false,
  error: null,

  loadAllProgress: async (isAuthenticated: boolean) => {
    if (!isAuthenticated) {
      // Guest mode: load strictly from localStorage
      const guestData = loadGuestProgress();
      set({ progressMap: guestData, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const records = await getReadingProgress();
      const map: Record<string, UserReadingProgress> = {};
      for (const rec of records) {
        map[rec.storyId] = rec;
      }
      set({ progressMap: map, loading: false });
    } catch (err: any) {
      // Fall back to guest storage if network or server fails
      const fallback = loadGuestProgress();
      let errorMsg = 'Failed to sync reading progress from server';
      if (err?.status === 401) {
        errorMsg = 'Session expired: Loaded local reading progress';
      } else if (err?.code === 'NETWORK_ERROR' || err?.status === 0) {
        errorMsg = 'Network offline: Loaded local reading progress';
      } else if (err?.status >= 500) {
        errorMsg = 'Server error: Loaded local reading progress';
      } else if (err?.message) {
        errorMsg = err.message;
      }
      set({
        progressMap: fallback,
        loading: false,
        error: errorMsg,
      });
    }
  },

  fetchStoryProgress: async (storyId: string, isAuthenticated: boolean) => {
    if (!isAuthenticated) {
      const guestData = loadGuestProgress();
      const prog = guestData[storyId] || {
        storyId,
        status: 'not_started',
        lastSentenceIndex: 0,
        quizScore: null,
        completedAt: null,
      };
      set((state) => ({
        progressMap: { ...state.progressMap, [storyId]: prog },
      }));
      return prog;
    }

    try {
      const prog = await getStoryProgress(storyId);
      if (prog) {
        set((state) => ({
          progressMap: { ...state.progressMap, [storyId]: prog },
        }));
      }
      return prog;
    } catch (err: any) {
      console.warn(`Failed to fetch story progress for ${storyId}:`, err);
      return get().progressMap[storyId] || null;
    }
  },

  saveProgress: async (payload: SaveReadingProgressPayload, isAuthenticated: boolean) => {
    const { storyId, lastSentenceIndex, status = 'in_progress', quizScore } = payload;
    const nowIso = new Date().toISOString();

    if (!isAuthenticated) {
      // Guest local persistence
      const guestData = loadGuestProgress();
      const existing = guestData[storyId];
      const isCompleting = status === 'completed';

      const updated: UserReadingProgress = {
        storyId,
        status,
        lastSentenceIndex,
        quizScore: quizScore !== undefined ? quizScore : (existing?.quizScore ?? 0),
        completedAt: isCompleting ? (existing?.completedAt || nowIso) : (existing?.completedAt || null),
        updatedAt: nowIso,
      };

      guestData[storyId] = updated;
      saveGuestProgress(guestData);

      set((state) => ({
        progressMap: { ...state.progressMap, [storyId]: updated },
      }));

      // In guest mode, do not claim server-side persistence or fake backend XP
      return { progress: updated, xpAwarded: 0 };
    }

    // Authenticated persistence through backend
    try {
      const res = await saveReadingProgress(payload);
      set((state) => ({
        progressMap: { ...state.progressMap, [storyId]: res.progress },
        error: null,
      }));

      // Synchronize XP if awarded
      if (res.xpAwarded > 0) {
        useProgressStore.getState().addXP(res.xpAwarded);
      }

      return res;
    } catch (err: any) {
      console.error('Failed to save reading progress to backend:', err);

      // Determine clear error description
      let userFacingError = 'Cloud sync failed: Progress saved locally';
      if (err?.status === 401) {
        userFacingError = 'Authentication expired: Progress saved locally. Please sign in again.';
      } else if (err?.code === 'NETWORK_ERROR' || err?.status === 0) {
        userFacingError = 'Network offline: Progress saved locally and will sync when reconnected.';
      } else if (err?.status >= 500) {
        userFacingError = 'Server error: Progress saved locally, but cloud sync failed.';
      }

      // Fallback update to local state and local backup
      const guestData = loadGuestProgress();
      const existing = guestData[storyId];
      const fallback: UserReadingProgress = {
        storyId,
        status,
        lastSentenceIndex,
        quizScore: quizScore !== undefined ? quizScore : (existing?.quizScore ?? 0),
        completedAt: status === 'completed' ? (existing?.completedAt || nowIso) : (existing?.completedAt || null),
        updatedAt: nowIso,
      };

      // Safely preserve progress locally
      guestData[storyId] = fallback;
      saveGuestProgress(guestData);

      set((state) => ({
        progressMap: { ...state.progressMap, [storyId]: fallback },
        error: userFacingError,
      }));
      return { progress: fallback, xpAwarded: 0 };
    }
  },
}));
