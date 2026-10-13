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
});
