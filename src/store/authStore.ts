import { create } from 'zustand';
import { authApi, usersApi } from '../api';
import type { User, JLPTLevel } from '../types/models';
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from '../types/api';
import { useProgressStore } from './progressStore';
import { useNotificationStore } from './notificationStore';
import { useSettingsStore } from './settingsStore';
import { normalizeLocale } from '../i18n/languageUtils';

export interface AuthState {
  user: User | null;
  profile: User | null; // Profile is alias/synonym to User model
  loading: boolean;
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signIn: (credentials: LoginRequest) => Promise<User>;
  signUp: (data: RegisterRequest) => Promise<User>;
  register: (email: string, password: string, username: string, nativeLanguage?: string, currentLevel?: JLPTLevel) => Promise<User>;
  signInWithGoogle: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: UpdateProfileRequest) => Promise<User | undefined>;
  refreshProfile: () => Promise<void>;
}

const GUEST_PROFILE_KEY = 'nihongo_guest_profile';

function getGuestProfile(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GUEST_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveGuestProfile(profile: User) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore quota errors
  }
}

function syncUserSettings(user: User | null) {
  if (!user) return;
  try {
    const patch: Record<string, any> = {};
    if (user.nativeLanguage) {
      const code = normalizeLocale(user.nativeLanguage);
      patch.nativeLanguage = code;
      patch.displayLanguage = code;
      patch.explanationLanguage = code;
    }
    if (user.currentLevel) {
      patch.jlptLevel = user.currentLevel;
    }
    if (Object.keys(patch).length > 0) {
      useSettingsStore.getState().updateSettings(patch);
    }
  } catch (err) {
    console.warn('Failed to sync user settings on login:', err);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  // ── Initialize Session on App Startup ───────────────────
  initialize: async () => {
    try {
      const user = await authApi.getMe();
      set({ user, profile: user, loading: false, initialized: true });

      // Synchronize language and level settings on startup
      syncUserSettings(user);

      // Initialize progress store with user profile data
      if (user) {
        try {
          await useProgressStore.getState().initializeProgress(user.id, user);
        } catch {
          // Non-blocking progress sync failure
        }
      }
    } catch {
      // 401 Unauthorized or network error → unauthenticated state
      const guestProfile = getGuestProfile();
      set({ user: null, profile: guestProfile, loading: false, initialized: true });
    }
  },

  // ── Sign In ────────────────────────────────────────────
  signIn: async (credentials: LoginRequest) => {
    await authApi.login(credentials);
    // Fetch authenticated user profile via cookie session
    const user = await authApi.getMe();
    set({ user, profile: user });

    // Instantly activate user's preferred language and study level
    syncUserSettings(user);

    try {
      await useProgressStore.getState().initializeProgress(user.id, user);
    } catch {
      // Non-blocking progress sync failure
    }
    return user;
  },

  // ── Sign Up ────────────────────────────────────────────
  signUp: async (data: RegisterRequest) => {
    await authApi.register(data);
    // Fetch authenticated user profile
    const user = await authApi.getMe();
    set({ user, profile: user });

    // Instantly activate user's preferred language and study level
    syncUserSettings(user);

    try {
      await useProgressStore.getState().initializeProgress(user.id, user);
    } catch {
      // Non-blocking progress sync failure
    }
    return user;
  },

  // ── Register (convenience alias) ───────────────────────
  register: async (email: string, password: string, username: string, nativeLanguage?: string, currentLevel?: JLPTLevel) => {
    return get().signUp({
      email,
      password,
      username,
      nativeLanguage,
      currentLevel,
    });
  },

  // ── Google Sign In ─────────────────────────────────────
  signInWithGoogle: () => {
    const url = authApi.getGoogleOAuthUrl();
    window.location.href = url;
  },

  // ── Logout ─────────────────────────────────────────────
  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      try {
        localStorage.removeItem('nihongo_daily_xp');
        localStorage.removeItem('nihongo_last_streak_date');
        localStorage.removeItem('nihongo_streak_frozen_today');
      } catch {}
      set({ user: null, profile: null });
      useProgressStore.getState().reset();
      useNotificationStore.getState().clearAll();
    }
  },

  updateProfile: async (updates: UpdateProfileRequest) => {
    const currentUser = get().user;
    if (!currentUser) {
      // Guest mode: update local guest profile
      const existing: User = get().profile || {
        id: 'guest',
        email: 'guest@nihongomaster.local',
        username: 'Learner',
        nativeLanguage: 'english',
        currentLevel: 'N5',
        avatarUrl: null,
        avatarId: null,
        xpPoints: 0,
        streakDays: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedGuest: User = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveGuestProfile(updatedGuest);
      set({ profile: updatedGuest });
      return updatedGuest;
    }

    const updatedUser = await usersApi.updateProfile(updates);
    set({ user: updatedUser, profile: updatedUser });

    // Sync progress if level changed
    if (updates.currentLevel !== undefined) {
      try {
        await useProgressStore.getState().initializeProgress(currentUser.id, updatedUser);
      } catch {
        // Non-blocking progress sync failure
      }
    }

    return updatedUser;
  },

  // ── Refresh Profile ────────────────────────────────────
  refreshProfile: async () => {
    try {
      const user = await usersApi.getProfile();
      set({ user, profile: user });
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    }
  },
}));
