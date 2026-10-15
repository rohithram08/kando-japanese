import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProgressStore } from '../progressStore';
import * as progressApi from '../../api/progress';
import type { ProgressResponse } from '../../types/api';

describe('ProgressStore (Zustand + API layer)', () => {
  const mockProgress: ProgressResponse = {
    totalXP: 500,
    streakDays: 5,
    userLevel: 2,
    jlptLevel: 'N5',
    lessonsCompleted: 4,
    kanjiLearned: 12,
    vocabLearned: 25,
    cardsReviewed: 10,
    cardsMastered: 2,
    srsReviewsDue: 3,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    useProgressStore.getState().reset();
  });

  it('initializes progress state from API correctly', async () => {
    vi.spyOn(progressApi, 'getProgress').mockResolvedValueOnce(mockProgress);

    await useProgressStore.getState().initializeProgress('user-123');

    const state = useProgressStore.getState();
    expect(state.totalXP).toBe(500);
    expect(state.streak).toBe(5);
    expect(state.lessonsCompleted).toBe(4);
    expect(state.kanjiLearned).toBe(12);
    expect(state.vocabLearned).toBe(25);
    expect(state.cardsMastered).toBe(2);
    expect(state.srsReviewsDue).toBe(3);
    expect(state.initialized).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('awards lesson XP and syncs with API', async () => {
    vi.spyOn(progressApi, 'submitXPEvent').mockResolvedValueOnce({
      xpGained: 15,
      totalXP: 515,
      newLevel: 2,
      badgesAwarded: [],
      streakDays: 5,
    });

    useProgressStore.setState({ totalXP: 500 });
    const result = await useProgressStore.getState().awardLessonXP('user-123', 95);

    expect(result?.xpGained).toBe(15);
    expect(useProgressStore.getState().totalXP).toBe(515);
  });

  it('updates streak and triggers streak recording via API', async () => {
    vi.spyOn(progressApi, 'recordStreakActivity').mockResolvedValueOnce({ streakDays: 6 });

    useProgressStore.setState({ streak: 5 });
    const newStreak = await useProgressStore.getState().updateStreak('user-123');

    expect(newStreak).toBe(6);
    expect(useProgressStore.getState().streak).toBe(6);
  });

  it('awards kanji XP and records progress via API', async () => {
    vi.spyOn(progressApi, 'recordKanjiProgress').mockResolvedValueOnce({
      progress: {
        userId: 'user-123',
        kanjiId: 'k1',
        recognitionLevel: 1,
        mastered: false,
        reviewCount: 1,
        lastReviewedAt: '2026-08-23T00:00:00Z',
        createdAt: '2026-08-23T00:00:00Z',
      },
      xpResult: {
        xpGained: 8,
        totalXP: 508,
        newLevel: 2,
        badgesAwarded: [],
        streakDays: 5,
      },
    });

    useProgressStore.setState({ totalXP: 500, kanjiLearned: 10 });
    const result = await useProgressStore.getState().awardKanjiXP('user-123', 'k1');

    expect(result?.xpGained).toBe(8);
    expect(useProgressStore.getState().totalXP).toBe(508);
    expect(useProgressStore.getState().kanjiLearned).toBe(11);
  });

  it('awards vocabulary XP and records progress via API', async () => {
    vi.spyOn(progressApi, 'recordVocabularyProgress').mockResolvedValueOnce({
      progress: {
        userId: 'user-123',
        vocabularyId: 'v1',
        masteryLevel: 1,
        mastered: false,
        reviewCount: 1,
        lastReviewedAt: '2026-08-23T00:00:00Z',
        createdAt: '2026-08-23T00:00:00Z',
      },
      xpResult: {
        xpGained: 4,
        totalXP: 504,
        newLevel: 2,
        badgesAwarded: [],
        streakDays: 5,
      },
    });

    useProgressStore.setState({ totalXP: 500, vocabLearned: 20 });
    const result = await useProgressStore.getState().awardVocabXP('user-123', 'v1');

    expect(result?.xpGained).toBe(4);
    expect(useProgressStore.getState().totalXP).toBe(504);
    expect(useProgressStore.getState().vocabLearned).toBe(21);
  });

  it('resets progress state to initial values', () => {
    useProgressStore.setState({
      totalXP: 1000,
      streak: 10,
      lessonsCompleted: 15,
      initialized: true,
    });

    useProgressStore.getState().reset();

    const state = useProgressStore.getState();
    expect(state.totalXP).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.lessonsCompleted).toBe(0);
    expect(state.initialized).toBe(false);
  });

  it('rolls back totalXP, dailyXP, and sets syncStatus to error when API submission fails', async () => {
    vi.spyOn(progressApi, 'submitXPEvent').mockRejectedValueOnce(new Error('Network failure'));

    useProgressStore.setState({ totalXP: 250, dailyXP: 50, userLevel: 1, jlptLevel: 'N5' });

    await expect(
      useProgressStore.getState().addXP(50, 'user-123', { event: 'lesson_completed', score: 100 })
    ).rejects.toThrow('Network failure');

    const state = useProgressStore.getState();
    expect(state.totalXP).toBe(250); // Rolled back
    expect(state.dailyXP).toBe(50);   // Rolled back
    expect(state.syncStatus).toBe('error');
  });

  it('computes quiz XP locally for guest users without calling backend API', async () => {
    const apiSpy = vi.spyOn(progressApi, 'submitXPEvent');

    useProgressStore.setState({ totalXP: 100 });
    const result = await useProgressStore.getState().awardQuizXP(undefined, 100, 'n5l001');

    expect(apiSpy).not.toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.xpGained).toBe(12); // 12 XP for perfect quiz
  });

  it('dispatches kana_learned event and increments kanaLearned without touching kanjiLearned', async () => {
    const apiSpy = vi.spyOn(progressApi, 'submitXPEvent').mockResolvedValueOnce({
      xpGained: 4,
      totalXP: 504,
      newLevel: 2,
      badgesAwarded: [],
      streakDays: 5,
    });

    useProgressStore.setState({ totalXP: 500, kanaLearned: 5, kanjiLearned: 10 });
    const result = await useProgressStore.getState().awardKanaXP('user-123', 'h_a', true);

    expect(apiSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'kana_learned',
        cardId: 'h_a',
      })
    );
    expect(useProgressStore.getState().kanaLearned).toBe(6);
    expect(useProgressStore.getState().kanjiLearned).toBe(10); // Untouched!
    expect(result?.xpGained).toBe(4);
  });

  it('reconciles dailyXP with authoritative backend xpGained when repeated activity awards 0 XP', async () => {
    vi.spyOn(progressApi, 'submitXPEvent').mockResolvedValueOnce({
      xpGained: 0,
      totalXP: 500,
      newLevel: 2,
      badgesAwarded: [],
      streakDays: 5,
    });

    useProgressStore.setState({ totalXP: 500, dailyXP: 50 });
    // User attempts to add 15 XP for repeat lesson
    const result = await useProgressStore.getState().addXP(15, 'user-123', {
      event: 'lesson_completed',
      lessonId: 'n5l001',
    });

    expect(result?.xpGained).toBe(0);
    expect(useProgressStore.getState().totalXP).toBe(500);
    expect(useProgressStore.getState().dailyXP).toBe(50); // Correctly reconciled to +0, not remaining at 65
  });

  describe('Grammar Progress (Zustand store)', () => {
    it('loads grammar progress from API and updates store', async () => {
      vi.spyOn(progressApi, 'getGrammarProgress').mockResolvedValueOnce({
        grammar: [
          {
            userId: 'user-123',
            grammarId: 'n5_g001',
            status: 'studied',
            mastered: false,
            studyCount: 1,
            lastStudiedAt: '2026-08-23T00:00:00Z',
            createdAt: '2026-08-23T00:00:00Z',
          },
          {
            userId: 'user-123',
            grammarId: 'n5_g002',
            status: 'mastered',
            mastered: true,
            studyCount: 3,
            lastStudiedAt: '2026-08-24T00:00:00Z',
            createdAt: '2026-08-20T00:00:00Z',
          },
        ],
      });

      await useProgressStore.getState().loadGrammarProgress('user-123');

      const state = useProgressStore.getState();
      expect(state.grammarLearned).toBe(2);
      expect(state.grammarProgress['n5_g001']?.status).toBe('studied');
      expect(state.grammarProgress['n5_g002']?.mastered).toBe(true);
    });

    it('records grammar progress with optimistic update and authoritative API sync', async () => {
      vi.spyOn(progressApi, 'recordGrammarProgress').mockResolvedValueOnce({
        progress: {
          userId: 'user-123',
          grammarId: 'n5_g001',
          status: 'studied',
          mastered: false,
          studyCount: 1,
          lastStudiedAt: '2026-08-24T00:00:00Z',
          createdAt: '2026-08-24T00:00:00Z',
        },
        xpResult: {
          xpGained: 6,
          totalXP: 506,
          newLevel: 2,
          streakDays: 5,
        },
      });

      useProgressStore.setState({ totalXP: 500, grammarLearned: 0, grammarProgress: {} });

      const result = await useProgressStore.getState().recordGrammarProgress('user-123', 'n5_g001', 'studied');

      const state = useProgressStore.getState();
      expect(result.xpGained).toBe(6);
      expect(state.totalXP).toBe(506);
      expect(state.grammarLearned).toBe(1);
      expect(state.grammarProgress['n5_g001']?.status).toBe('studied');
      expect(state.syncStatus).toBe('saved');
    });

    it('records grammar progress idempotently with 0 XP on repeat study', async () => {
      vi.spyOn(progressApi, 'recordGrammarProgress').mockResolvedValueOnce({
        progress: {
          userId: 'user-123',
          grammarId: 'n5_g001',
          status: 'studied',
          mastered: false,
          studyCount: 2,
          lastStudiedAt: '2026-08-25T00:00:00Z',
          createdAt: '2026-08-24T00:00:00Z',
        },
        xpResult: {
          xpGained: 0,
          totalXP: 506,
          newLevel: 2,
          streakDays: 5,
        },
      });

      useProgressStore.setState({
        totalXP: 506,
        grammarLearned: 1,
        grammarProgress: {
          n5_g001: {
            userId: 'user-123',
            grammarId: 'n5_g001',
            status: 'studied',
            mastered: false,
            studyCount: 1,
          },
        },
      });

      const result = await useProgressStore.getState().recordGrammarProgress('user-123', 'n5_g001', 'studied');

      const state = useProgressStore.getState();
      expect(result.xpGained).toBe(0);
      expect(state.totalXP).toBe(506);
      expect(state.grammarLearned).toBe(1);
      expect(state.grammarProgress['n5_g001']?.studyCount).toBe(2);
    });

    it('rolls back grammarProgress and grammarLearned on API failure', async () => {
      vi.spyOn(progressApi, 'recordGrammarProgress').mockRejectedValueOnce(new Error('Network error'));

      useProgressStore.setState({
        totalXP: 500,
        grammarLearned: 0,
        grammarProgress: {},
      });

      await expect(
        useProgressStore.getState().recordGrammarProgress('user-123', 'n5_g001', 'studied')
      ).rejects.toThrow('Network error');

      const state = useProgressStore.getState();
      expect(state.grammarLearned).toBe(0);
      expect(state.grammarProgress['n5_g001']).toBeUndefined();
      expect(state.syncStatus).toBe('error');
    });

    it('handles guest grammar progress locally via localStorage without API calls', async () => {
      const apiSpy = vi.spyOn(progressApi, 'recordGrammarProgress');

      useProgressStore.setState({
        totalXP: 0,
        grammarLearned: 0,
        grammarProgress: {},
      });

      const result = await useProgressStore.getState().recordGrammarProgress(undefined, 'n5_g001', 'studied');

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result.isGuest).toBe(true);
      expect(result.xpGained).toBe(6);

      const state = useProgressStore.getState();
      expect(state.grammarLearned).toBe(1);
      expect(state.grammarProgress['n5_g001']?.status).toBe('studied');
      expect(state.grammarProgress['n5_g001']?.userId).toBe('guest');
    });
  });
});
