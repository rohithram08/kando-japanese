import { create } from 'zustand';
import { authApi, usersApi } from '../api';
import type { User, JLPTLevel } from '../types/models';
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from '../types/api';
import { useProgressStore } from './progressStore';
import { useNotificationStore } from './notificationStore';

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

      // Initialize progress store with user profile data
      if (user) {
        useProgressStore.getState().initializeProgress(user.id, user);
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

    useProgressStore.getState().initializeProgress(user.id, user);
    return user;
  },

  // ── Sign Up ────────────────────────────────────────────
  signUp: async (data: RegisterRequest) => {
    await authApi.register(data);
    // Fetch authenticated user profile
    const user = await authApi.getMe();
    set({ user, profile: user });

    useProgressStore.getState().initializeProgress(user.id, user);
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
      useProgressStore.getState().initializeProgress(currentUser.id, updatedUser);
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
