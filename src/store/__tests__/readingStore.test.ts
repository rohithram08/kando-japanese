import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReadingStore } from '../readingStore';
import * as readingApi from '../../api/reading';
import { useProgressStore } from '../progressStore';

vi.mock('../../api/reading', () => ({
  getReadingProgress: vi.fn(),
  getStoryProgress: vi.fn(),
  saveReadingProgress: vi.fn(),
}));

describe('ReadingStore — State and Progress Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useReadingStore.setState({
      progressMap: {},
      loading: false,
      error: null,
    });
  });

  describe('Guest mode persistence', () => {
    it('saves progress to localStorage without calling backend API', async () => {
      const { saveProgress } = useReadingStore.getState();

      const result = await saveProgress(
        {
          storyId: 'story_n5_01',
          lastSentenceIndex: 5,
          status: 'in_progress',
        },
        false // isGuest
      );

      expect(readingApi.saveReadingProgress).not.toHaveBeenCalled();
      expect(result.xpAwarded).toBe(0);
      expect(result.progress.lastSentenceIndex).toBe(5);

      // Verify it was stored in localStorage
      const stored = JSON.parse(localStorage.getItem('nihongo_guest_reading_progress') || '{}');
      expect(stored['story_n5_01']).toBeDefined();
      expect(stored['story_n5_01'].lastSentenceIndex).toBe(5);
    });

    it('loads guest progress from localStorage on loadAllProgress', async () => {
      localStorage.setItem(
        'nihongo_guest_reading_progress',
        JSON.stringify({
          story_n5_02: {
            storyId: 'story_n5_02',
            status: 'completed',
            lastSentenceIndex: 9,
            quizScore: 100,
          },
        })
      );

      const { loadAllProgress } = useReadingStore.getState();
      await loadAllProgress(false);

      const { progressMap } = useReadingStore.getState();
      expect(progressMap['story_n5_02']).toBeDefined();
      expect(progressMap['story_n5_02'].status).toBe('completed');
    });
  });

  describe('Authenticated mode persistence', () => {
    it('calls backend API and awards XP when completing a story', async () => {
      const mockBackendResponse = {
        progress: {
          id: 'prog-1',
          userId: 'user-123',
          storyId: 'story_n5_01',
          status: 'completed' as const,
          lastSentenceIndex: 9,
          quizScore: 100,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        xpAwarded: 75,
      };

      (readingApi.saveReadingProgress as any).mockResolvedValue(mockBackendResponse);
      const addXPSpy = vi.spyOn(useProgressStore.getState(), 'addXP').mockImplementation(vi.fn());

      const { saveProgress } = useReadingStore.getState();
      const result = await saveProgress(
        {
          storyId: 'story_n5_01',
          lastSentenceIndex: 9,
          status: 'completed',
          quizScore: 100,
        },
        true // isAuthenticated
      );

      expect(readingApi.saveReadingProgress).toHaveBeenCalledWith({
        storyId: 'story_n5_01',
        lastSentenceIndex: 9,
        status: 'completed',
        quizScore: 100,
      });

      expect(result.xpAwarded).toBe(75);
      expect(addXPSpy).toHaveBeenCalledWith(75);

      const { progressMap } = useReadingStore.getState();
      expect(progressMap['story_n5_01'].status).toBe('completed');
    });

    it('loads server records on loadAllProgress for authenticated user', async () => {
      const mockRecords = [
        {
          id: 'prog-1',
          userId: 'user-123',
          storyId: 'story_n5_01',
          status: 'in_progress' as const,
          lastSentenceIndex: 3,
          quizScore: null,
          completedAt: null,
          updatedAt: new Date().toISOString(),
        },
      ];
      (readingApi.getReadingProgress as any).mockResolvedValue(mockRecords);

      const { loadAllProgress } = useReadingStore.getState();
      await loadAllProgress(true);

      const { progressMap } = useReadingStore.getState();
      expect(progressMap['story_n5_01']).toBeDefined();
      expect(progressMap['story_n5_01'].lastSentenceIndex).toBe(3);
    });

    it('differentiates server error (500) from network offline and preserves local backup', async () => {
      const serverError = { status: 500, message: 'Internal Server Error' };
      (readingApi.saveReadingProgress as any).mockRejectedValue(serverError);

      const { saveProgress } = useReadingStore.getState();
      const res = await saveProgress(
        { storyId: 'story_n5_03', lastSentenceIndex: 4, status: 'in_progress' },
        true
      );

      expect(res.xpAwarded).toBe(0);
      expect(res.progress.lastSentenceIndex).toBe(4);

      const state = useReadingStore.getState();
      expect(state.error).toBe('Server error: Progress saved locally, but cloud sync failed.');

      // Verify backup is safely preserved in localStorage
      const stored = JSON.parse(localStorage.getItem('nihongo_guest_reading_progress') || '{}');
      expect(stored['story_n5_03']).toBeDefined();
      expect(stored['story_n5_03'].lastSentenceIndex).toBe(4);
    });

    it('differentiates network offline error and preserves local backup', async () => {
      const networkError = { code: 'NETWORK_ERROR', status: 0, message: 'Network Error' };
      (readingApi.saveReadingProgress as any).mockRejectedValue(networkError);

      const { saveProgress } = useReadingStore.getState();
      await saveProgress(
        { storyId: 'story_n5_04', lastSentenceIndex: 2, status: 'in_progress' },
        true
      );

      const state = useReadingStore.getState();
      expect(state.error).toBe('Network offline: Progress saved locally and will sync when reconnected.');
    });

    it('differentiates authentication expiry (401)', async () => {
      const authError = { status: 401, message: 'Unauthorized' };
      (readingApi.saveReadingProgress as any).mockRejectedValue(authError);

      const { saveProgress } = useReadingStore.getState();
      await saveProgress(
        { storyId: 'story_n4_01', lastSentenceIndex: 1, status: 'in_progress' },
        true
      );

      const state = useReadingStore.getState();
      expect(state.error).toBe('Authentication expired: Progress saved locally. Please sign in again.');
    });
  });
});
