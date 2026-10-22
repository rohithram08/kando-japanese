import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { useProgressStore } from '../progressStore';
import { authApi, usersApi } from '../../api';
import type { User } from '../../types/models';

describe('AuthStore (Zustand + JWT Session)', () => {
  const mockUser: User = {
    id: 'user-uuid-123',
    email: 'learner@nihongo.com',
    username: 'NihongoLearner',
    nativeLanguage: 'English',
    currentLevel: 'N5',
    avatarUrl: null,
    avatarId: null,
    xpPoints: 150,
    streakDays: 3,
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-23T00:00:00Z',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(useProgressStore.getState(), 'initializeProgress').mockResolvedValue(undefined as any);
    useAuthStore.setState({
      user: null,
      profile: null,
      loading: true,
      initialized: false,
    });
  });

  it('restores authenticated user session on initialize() when 200 OK', async () => {
    vi.spyOn(authApi, 'getMe').mockResolvedValueOnce(mockUser);

    await useAuthStore.getState().initialize();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.initialized).toBe(true);
  });

  it('sets unauthenticated state when initialize() receives 401', async () => {
    vi.spyOn(authApi, 'getMe').mockRejectedValueOnce(new Error('Unauthorized'));

    await useAuthStore.getState().initialize();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.initialized).toBe(true);
  });

  it('signs in user, sets user state, and returns profile', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValueOnce({ message: 'Success' });
    vi.spyOn(authApi, 'getMe').mockResolvedValueOnce(mockUser);

    const user = await useAuthStore.getState().signIn({
      email: 'learner@nihongo.com',
      password: 'password123',
    });

    expect(user).toEqual(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('signs up user with full profile preferences and sets session', async () => {
    vi.spyOn(authApi, 'register').mockResolvedValueOnce({ message: 'Registered', userId: 'user-uuid-123' });
    vi.spyOn(authApi, 'getMe').mockResolvedValueOnce(mockUser);

    const user = await useAuthStore.getState().signUp({
      email: 'learner@nihongo.com',
      password: 'password123',
      username: 'NihongoLearner',
      nativeLanguage: 'English',
      currentLevel: 'N5',
    });

    expect(user).toEqual(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('clears user state and session on logout()', async () => {
    useAuthStore.setState({ user: mockUser, profile: mockUser, loading: false, initialized: true });
    vi.spyOn(authApi, 'logout').mockResolvedValueOnce({ message: 'Logged out' });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
  });

  it('updates profile and updates state atomically', async () => {
    useAuthStore.setState({ user: mockUser, profile: mockUser, loading: false, initialized: true });
    const updatedUser = { ...mockUser, username: 'UpdatedName', currentLevel: 'N4' as const };
    vi.spyOn(usersApi, 'updateProfile').mockResolvedValueOnce(updatedUser);

    const result = await useAuthStore.getState().updateProfile({ username: 'UpdatedName', currentLevel: 'N4' });

    expect(result).toEqual(updatedUser);
    expect(useAuthStore.getState().user?.username).toBe('UpdatedName');
    expect(useAuthStore.getState().user?.currentLevel).toBe('N4');
  });
});
