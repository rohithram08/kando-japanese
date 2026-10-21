// ============================================================
// store/progressStore.ts — UNIFIED XP & PROGRESS STORE
// ============================================================

import { create } from 'zustand';
import {
  getProgress,
  getGrammarProgress,
  submitXPEvent,
  recordStreakActivity,
  recordKanjiProgress as apiRecordKanjiProgress,
  recordVocabularyProgress as apiRecordVocabularyProgress,
  recordGrammarProgress as apiRecordGrammarProgress,
} from '../api/progress';
import {
  getJLPTLevel,
  getUserLevel,
  XP_REWARDS,
  calculateLessonXP,
  calculateQuizXP,
  calculateStoryQuizXP,
  calculateSRSReviewXP,
  calculateStreakBonus,
} from '../utils/progressCalculator';
import type { JLPTLevel, XPEventType, SRSQuality, User, GrammarProgress } from '../types/models';
import { useCelebrationStore } from './celebrationStore';

export interface ProgressState {
  streak: number;
  totalXP: number;
  dailyXP: number;
  userLevel: number;
  jlptLevel: JLPTLevel;
  lessonsCompleted: number;
  kanjiLearned: number;
  vocabLearned: number;
  kanaLearned: number;
  grammarLearned: number;
  grammarProgress: Record<string, GrammarProgress>;
  cardsReviewed: number;
  cardsMastered: number;
  srsReviewsDue: number;
  loading: boolean;
  initialized: boolean;
  syncStatus: 'idle' | 'saving' | 'saved' | 'error';

  initializeProgress: (userId?: string, profile?: Partial<User> | null) => Promise<void>;
  loadGrammarProgress: (userId?: string) => Promise<void>;
  recordGrammarProgress: (
    userId: string | undefined,
    grammarId: string,
    status?: 'not_started' | 'studied' | 'mastered',
    mastered?: boolean
  ) => Promise<{
    xpGained: number;
    newTotal?: number;
    isGuest?: boolean;
    progress?: GrammarProgress;
  }>;
  addXP: (
    amount: number,
    userId?: string,
    eventData?: {
      event?: XPEventType;
      lessonId?: string;
      quizId?: string;
      cardId?: string;
      score?: number;
      quality?: SRSQuality;
      isMastered?: boolean;
    }
  ) => Promise<{
    xpGained: number;
    newTotal: number;
    jlptLevel: JLPTLevel;
    userLevel: number;
    leveledUp: boolean;
  } | undefined>;
  awardLessonXP: (userId: string | undefined, scorePercent: number, lessonId?: string) => Promise<any>;
  awardQuizXP: (userId: string | undefined, scorePercent: number, quizId?: string) => Promise<any>;
  awardSRSReviewXP: (userId: string | undefined, quality: SRSQuality, isMastered?: boolean, cardId?: string) => Promise<any>;
  awardKanjiXP: (userId?: string, kanjiId?: string, recognitionLevel?: number, mastered?: boolean) => Promise<any>;
  awardVocabXP: (userId?: string, vocabularyId?: string, masteryLevel?: number, mastered?: boolean) => Promise<any>;
  awardKanaXP: (userId?: string, kanaId?: string, mastered?: boolean) => Promise<any>;
  awardGrammarXP: (userId?: string, grammarId?: string, status?: 'not_started' | 'studied' | 'mastered', mastered?: boolean) => Promise<any>;
  awardDailyGoalXP: (userId?: string) => Promise<any>;
  awardStoryCompletionXP: (storyId: string, userId?: string) => Promise<{ xpGained: number; alreadyClaimed: boolean }>;
  awardStoryQuizXP: (storyId: string, score?: number, userId?: string) => Promise<{ xpGained: number; alreadyClaimed: boolean }>;
  isStoryXPClaimed: (storyId: string) => boolean;
  isQuizXPClaimed: (storyId: string) => boolean;
  streakFreezes: number;
  isStreakFrozen: boolean;
  equipStreakFreeze: (count?: number) => void;
  useStreakFreeze: () => boolean;
  checkAndMaintainStreak: () => { streak: number; preservedWithFreeze: boolean };
  updateStreak: (userId?: string) => Promise<number>;
  loadSRSDue: (userId?: string) => Promise<number>;
  incrementXP: (amount: number, userId?: string) => Promise<any>;
  incrementLessons: () => void;
  incrementKanji: () => void;
  incrementVocab: () => void;
  incrementKana: () => void;
  incrementGrammar: () => void;
  incrementCards: () => void;
  incrementMastered: () => void;
  resetDailyXP: () => void;
  reset: () => void;
}

function getDayDiff(dateStr1: string, dateStr2: string): number {
  try {
    const d1 = new Date(dateStr1 + 'T00:00:00');
    const d2 = new Date(dateStr2 + 'T00:00:00');
    const diffTime = d1.getTime() - d2.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

function getLocalDayString(): string {
  try {
    return new Intl.DateTimeFormat('en-CA').format(new Date());
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  // ── State ───────────────────────────────────────────────
  streak: 0,
  streakFreezes: (() => {
    try {
      const stored = localStorage.getItem('nihongo_streak_freezes');
      return stored !== null ? Math.max(0, parseInt(stored, 10)) : 2;
    } catch {
      return 2;
    }
  })(),
  isStreakFrozen: (() => {
    try {
      return localStorage.getItem('nihongo_streak_frozen_today') === 'true';
    } catch {
      return false;
    }
  })(),
  totalXP: 0,
  dailyXP: 0,
  userLevel: 1,
  jlptLevel: 'N5',
  lessonsCompleted: 0,
  kanjiLearned: 0,
  vocabLearned: 0,
  kanaLearned: 0,
  grammarLearned: 0,
  grammarProgress: {},
  cardsReviewed: 0,
  cardsMastered: 0,
  srsReviewsDue: 0,
  loading: false,
  initialized: false,
  syncStatus: 'idle',

  // ── Initialize from Backend API ─────────────────────────
  initializeProgress: async (userId, profile) => {
    if (!userId) return;
    set({ loading: true });

    try {
      const data = await getProgress();

      // Check daily XP cache
      let dailyXP = 0;
      try {
        const today = getLocalDayString();
        const cached = JSON.parse(localStorage.getItem('nihongo_daily_xp') || '{}');
        if (cached.date === today) {
          dailyXP = cached.xp || 0;
        }
      } catch (e) {
        console.debug('progressStore sync check caught:', e);
      }

      // Fetch grammar progress
      const grammarProgressMap: Record<string, GrammarProgress> = {};
      try {
        const gRes = await getGrammarProgress();
        if (gRes?.grammar) {
          gRes.grammar.forEach((g) => {
            grammarProgressMap[g.grammarId] = g;
          });
        }
      } catch (e) {
        console.debug('progressStore grammar load caught:', e);
      }

      set({
        totalXP: data.totalXP,
        streak: data.streakDays,
        jlptLevel: data.jlptLevel,
        userLevel: data.userLevel,
        dailyXP,
        lessonsCompleted: data.lessonsCompleted,
        kanjiLearned: data.kanjiLearned,
        vocabLearned: data.vocabLearned,
        grammarLearned: (data as any).grammarLearned ?? Object.values(grammarProgressMap).filter((g) => g.status !== 'not_started').length,
        grammarProgress: grammarProgressMap,
        cardsMastered: data.cardsMastered,
        srsReviewsDue: data.srsReviewsDue,
        loading: false,
        initialized: true,
      });
    } catch (err) {
      console.error('Failed to initialize progress from API:', err);

      const profileXP = profile?.xpPoints || 0;
      const profileStreak = profile?.streakDays || 0;

      set({
        totalXP: profileXP,
        streak: profileStreak,
        jlptLevel: (profile?.currentLevel || getJLPTLevel(profileXP).level) as JLPTLevel,
        userLevel: getUserLevel(profileXP),
        grammarLearned: 0,
        grammarProgress: {},
        loading: false,
        initialized: true,
      });
    }
  },

  // ── Core XP Adding Function ─────────────────────────────
  addXP: async (amount, userId, eventData) => {
    if (amount <= 0 && !eventData?.event) return;

    const previousState = {
      totalXP: get().totalXP,
      dailyXP: get().dailyXP,
      jlptLevel: get().jlptLevel,
      userLevel: get().userLevel,
      streak: get().streak,
    };

    let previousDailyCache: string | null = null;
    try {
      previousDailyCache = localStorage.getItem('nihongo_daily_xp');
    } catch {}

    const newTotal = previousState.totalXP + amount;
    const newDaily = previousState.dailyXP + amount;

    const jlptInfo = getJLPTLevel(newTotal);
    const newUserLevel = getUserLevel(newTotal);
    const oldJlpt = get().jlptLevel;

    set({
      totalXP: newTotal,
      dailyXP: newDaily,
      jlptLevel: jlptInfo.level as JLPTLevel,
      userLevel: newUserLevel,
      syncStatus: userId ? 'saving' : 'idle',
    });

    // Trigger 2D animated celebrations
    try {
      const celebrationStore = useCelebrationStore.getState();
      if (newUserLevel > previousState.userLevel) {
        celebrationStore.triggerLevelUp(previousState.userLevel, newUserLevel);
      } else if (amount > 0) {
        celebrationStore.triggerXPGain(amount, newTotal, eventData?.event);
      }
    } catch (e) {
      console.debug('celebrationStore trigger error:', e);
    }

    // Cache daily XP
    try {
      const today = getLocalDayString();
      localStorage.setItem('nihongo_daily_xp', JSON.stringify({ date: today, xp: newDaily }));
    } catch (e) {
      console.debug('progressStore mutation handler caught:', e);
    }

    // Persist via Backend API
    if (userId) {
      try {
        if (eventData?.event) {
          const res = await submitXPEvent({
            event: eventData.event,
            lessonId: eventData.lessonId,
            quizId: (eventData as any).quizId,
            cardId: (eventData as any).cardId,
            score: eventData.score,
            quality: eventData.quality,
            isMastered: eventData.isMastered,
          });
          if (res?.totalXP !== undefined) {
            const actualXpGained = res.xpGained ?? amount;
            const correctedDaily = previousState.dailyXP + actualXpGained;
            try {
              const today = getLocalDayString();
              localStorage.setItem('nihongo_daily_xp', JSON.stringify({ date: today, xp: correctedDaily }));
            } catch {}
            set({
              totalXP: res.totalXP,
              dailyXP: correctedDaily,
              userLevel: res.newLevel,
              streak: res.streakDays ?? get().streak,
              jlptLevel: getJLPTLevel(res.totalXP).level as JLPTLevel,
              syncStatus: 'saved',
            });
            return {
              xpGained: actualXpGained,
              newTotal: res.totalXP,
              jlptLevel: getJLPTLevel(res.totalXP).level as JLPTLevel,
              userLevel: res.newLevel,
              leveledUp: getJLPTLevel(res.totalXP).level !== oldJlpt,
            };
          }
        }
        set({ syncStatus: 'saved' });
      } catch (err) {
        console.error('Failed to submit XP to backend, rolling back optimistic state:', err);
        set({
          totalXP: previousState.totalXP,
          dailyXP: previousState.dailyXP,
          jlptLevel: previousState.jlptLevel,
          userLevel: previousState.userLevel,
          streak: previousState.streak,
          syncStatus: 'error',
        });
        try {
          if (previousDailyCache !== null) {
            localStorage.setItem('nihongo_daily_xp', previousDailyCache);
          } else {
            localStorage.removeItem('nihongo_daily_xp');
          }
        } catch {}
        throw err;
      }
    }

    return {
      xpGained: amount,
      newTotal,
      jlptLevel: jlptInfo.level as JLPTLevel,
      userLevel: newUserLevel,
      leveledUp: jlptInfo.level !== oldJlpt,
    };
  },

  // ── Activity-Specific XP Helpers ────────────────────────
  awardLessonXP: async (userId, scorePercent, lessonId?: string) => {
    const xp = calculateLessonXP(scorePercent);
    return get().addXP(xp, userId, { event: 'lesson_completed', score: scorePercent, lessonId } as any);
  },

  awardQuizXP: async (userId, scorePercent, quizId?: string) => {
    const xp = calculateQuizXP(scorePercent);
    if (!userId) {
      return {
        xpGained: xp,
        newTotal: get().totalXP + xp,
        jlptLevel: get().jlptLevel,
        userLevel: get().userLevel,
        leveledUp: false,
      };
    }
    return get().addXP(xp, userId, { event: 'quiz_completed', score: scorePercent, quizId } as any);
  },

  awardSRSReviewXP: async (userId, quality, isMastered = false, cardId?: string) => {
    const xp = calculateSRSReviewXP(quality, isMastered);
    if (xp > 0 || cardId) {
      return get().addXP(xp, userId, { event: 'srs_review', quality, isMastered, cardId } as any);
    }
  },

  awardKanjiXP: async (userId, kanjiId, recognitionLevel = 1, mastered = false) => {
    get().incrementKanji();
    if (kanjiId) {
      try {
        const res = await apiRecordKanjiProgress({
          kanjiId,
          recognitionLevel,
          mastered,
        });
        if (res?.xpResult) {
          const { totalXP, newLevel, streakDays } = res.xpResult;
          const xpGained = res.xpResult.xpGained || 0;
          const nextDaily = get().dailyXP + xpGained;
          try {
            const today = getLocalDayString();
            localStorage.setItem('nihongo_daily_xp', JSON.stringify({ date: today, xp: nextDaily }));
          } catch {}
          set({
            totalXP,
            dailyXP: nextDaily,
            userLevel: newLevel,
            streak: streakDays ?? get().streak,
            jlptLevel: getJLPTLevel(totalXP).level as JLPTLevel,
          });
          return {
            xpGained,
            newTotal: totalXP,
            jlptLevel: getJLPTLevel(totalXP).level as JLPTLevel,
            userLevel: newLevel,
          };
        }
      } catch (err) {
        console.error('Failed to record kanji progress to API:', err);
      }
    }
    return get().addXP(XP_REWARDS.KANJI_LEARNED, userId, { event: 'kanji_learned', cardId: kanjiId } as any);
  },

  awardVocabXP: async (userId, vocabularyId, masteryLevel = 1, mastered = false) => {
    get().incrementVocab();
    if (vocabularyId) {
      try {
        const res = await apiRecordVocabularyProgress({
          vocabularyId,
          masteryLevel,
          mastered,
        });
        if (res?.xpResult) {
          const { totalXP, newLevel, streakDays } = res.xpResult;
          const xpGained = res.xpResult.xpGained || 0;
          const nextDaily = get().dailyXP + xpGained;
          try {
            const today = getLocalDayString();
            localStorage.setItem('nihongo_daily_xp', JSON.stringify({ date: today, xp: nextDaily }));
          } catch {}
          set({
            totalXP,
            dailyXP: nextDaily,
            userLevel: newLevel,
            streak: streakDays ?? get().streak,
            jlptLevel: getJLPTLevel(totalXP).level as JLPTLevel,
          });
          return {
            xpGained,
            newTotal: totalXP,
            jlptLevel: getJLPTLevel(totalXP).level as JLPTLevel,
            userLevel: newLevel,
          };
        }
      } catch (err) {
        console.error('Failed to record vocab progress to API:', err);
      }
    }
    return get().addXP(XP_REWARDS.VOCAB_LEARNED, userId, { event: 'vocab_learned', cardId: vocabularyId } as any);
  },

  awardKanaXP: async (userId, kanaId, mastered = false) => {
    get().incrementKana();
    return get().addXP(XP_REWARDS.KANA_LEARNED, userId, { event: 'kana_learned', cardId: kanaId, isMastered: mastered } as any);
  },

  awardGrammarXP: async (userId, grammarId, status = 'studied', mastered) => {
    get().incrementGrammar();
    if (grammarId) {
      return get().recordGrammarProgress(userId, grammarId, status, mastered);
    }
    return get().addXP(XP_REWARDS.GRAMMAR_LEARNED, userId, { event: 'grammar_studied' });
  },

  loadGrammarProgress: async (userId) => {
    if (!userId) {
      try {
        const local = JSON.parse(localStorage.getItem('nihongo_guest_grammar_progress') || '{}');
        set({ grammarProgress: local, grammarLearned: Object.values(local).filter((g: any) => g.status !== 'not_started').length });
      } catch {}
      return;
    }
    try {
      const res = await getGrammarProgress();
      if (res?.grammar) {
        const map: Record<string, GrammarProgress> = {};
        res.grammar.forEach((g) => {
          map[g.grammarId] = g;
        });
        set({
          grammarProgress: map,
          grammarLearned: res.grammar.filter((g) => g.status !== 'not_started').length,
        });
      }
    } catch (err) {
      console.error('Failed to load grammar progress:', err);
    }
  },

  recordGrammarProgress: async (userId, grammarId, status = 'studied', mastered) => {
    const isMasteredVal = mastered !== undefined ? mastered : status === 'mastered';
    const effectiveStatus = isMasteredVal ? 'mastered' : status;

    // Guest mode
    if (!userId) {
      const prev = get().grammarProgress[grammarId];
      const isNew = !prev || prev.status === 'not_started';
      const updated: GrammarProgress = {
        userId: 'guest',
        grammarId,
        status: effectiveStatus,
        mastered: isMasteredVal,
        studyCount: (prev?.studyCount || 0) + 1,
        lastStudiedAt: new Date().toISOString(),
        createdAt: prev?.createdAt || new Date().toISOString(),
      };
      const newMap = { ...get().grammarProgress, [grammarId]: updated };
      const newCount = Object.values(newMap).filter((g) => g.status !== 'not_started').length;
      set({ grammarProgress: newMap, grammarLearned: newCount });
      try {
        localStorage.setItem('nihongo_guest_grammar_progress', JSON.stringify(newMap));
      } catch {}

      return {
        xpGained: isNew ? XP_REWARDS.GRAMMAR_LEARNED : 0,
        isGuest: true,
        progress: updated,
      };
    }

    // Authenticated mode: optimistic update with rollback
    const previousMap = get().grammarProgress;
    const prev = previousMap[grammarId];
    const isNew = !prev || prev.status === 'not_started';

    const optimisticItem: GrammarProgress = {
      userId,
      grammarId,
      status: effectiveStatus,
      mastered: isMasteredVal,
      studyCount: (prev?.studyCount || 0) + 1,
      lastStudiedAt: new Date().toISOString(),
      createdAt: prev?.createdAt || new Date().toISOString(),
    };
    const optimisticMap = { ...previousMap, [grammarId]: optimisticItem };
    const optimisticCount = Object.values(optimisticMap).filter((g) => g.status !== 'not_started').length;

    set({
      grammarProgress: optimisticMap,
      grammarLearned: optimisticCount,
      syncStatus: 'saving',
    });

    try {
      const res = await apiRecordGrammarProgress({
        grammarId,
        status: effectiveStatus,
        mastered: isMasteredVal,
      });

      if (res?.progress) {
        const finalMap = { ...get().grammarProgress, [grammarId]: res.progress };
        set({
          grammarProgress: finalMap,
          grammarLearned: Object.values(finalMap).filter((g) => g.status !== 'not_started').length,
          syncStatus: 'saved',
        });
      }

      if (res?.xpResult) {
        const { totalXP, newLevel, streakDays, xpGained } = res.xpResult;
        const currentTotal = get().totalXP;
        const updatedTotal = totalXP ?? (currentTotal + (xpGained || 0));
        const gain = xpGained || 0;
        const nextDaily = get().dailyXP + gain;
        try {
          const today = getLocalDayString();
          localStorage.setItem('nihongo_daily_xp', JSON.stringify({ date: today, xp: nextDaily }));
        } catch {}
        set({
          totalXP: updatedTotal,
          dailyXP: nextDaily,
          userLevel: newLevel ?? get().userLevel,
          streak: streakDays ?? get().streak,
          jlptLevel: getJLPTLevel(updatedTotal).level as JLPTLevel,
        });
        return {
          xpGained: res.xpResult.xpGained,
          newTotal: updatedTotal,
          progress: res.progress,
        };
      }

      return {
        xpGained: isNew ? XP_REWARDS.GRAMMAR_LEARNED : 0,
        progress: res.progress,
      };
    } catch (err) {
      console.error('Failed to record grammar progress to API:', err);
      // Rollback
      set({
        grammarProgress: previousMap,
        grammarLearned: Object.values(previousMap).filter((g) => g.status !== 'not_started').length,
        syncStatus: 'error',
      });
      throw err;
    }
  },

  awardStoryCompletionXP: async (storyId: string, userId?: string) => {
    if (!storyId) return { xpGained: 0, alreadyClaimed: false };
    try {
      const claimedList = JSON.parse(localStorage.getItem('nihongo_claimed_story_xp') || '[]');
      if (claimedList.includes(storyId)) {
        return { xpGained: 0, alreadyClaimed: true };
      }
      claimedList.push(storyId);
      localStorage.setItem('nihongo_claimed_story_xp', JSON.stringify(claimedList));
    } catch {}

    const res = await get().addXP(XP_REWARDS.STORY_READ_COMPLETE, userId, {
      event: 'lesson_completed',
      lessonId: `story_${storyId}`,
      score: 100,
    } as any);

    return { xpGained: XP_REWARDS.STORY_READ_COMPLETE, alreadyClaimed: false, res };
  },

  awardStoryQuizXP: async (storyId: string, score: number = 100, userId?: string) => {
    if (!storyId) return { xpGained: 0, alreadyClaimed: false };
    let alreadyClaimed = false;
    try {
      const claimedList = JSON.parse(localStorage.getItem('nihongo_claimed_quiz_xp') || '[]');
      if (claimedList.includes(storyId)) {
        alreadyClaimed = true;
      } else {
        claimedList.push(storyId);
        localStorage.setItem('nihongo_claimed_quiz_xp', JSON.stringify(claimedList));
      }
    } catch {}

    // Always record Jelly Streak on quiz completion
    await get().updateStreak(userId);

    if (alreadyClaimed) {
      return { xpGained: 0, alreadyClaimed: true };
    }

    const xpAmount = calculateStoryQuizXP(score);
    const res = await get().addXP(xpAmount, userId, {
      event: 'quiz_completed',
      quizId: `story_quiz_${storyId}`,
      score,
    } as any);

    return { xpGained: xpAmount, alreadyClaimed: false, res };
  },

  isStoryXPClaimed: (storyId: string) => {
    try {
      const list = JSON.parse(localStorage.getItem('nihongo_claimed_story_xp') || '[]');
      return list.includes(storyId);
    } catch {
      return false;
    }
  },

  isQuizXPClaimed: (storyId: string) => {
    try {
      const list = JSON.parse(localStorage.getItem('nihongo_claimed_quiz_xp') || '[]');
      return list.includes(storyId);
    } catch {
      return false;
    }
  },

  awardDailyGoalXP: async (userId) => {
    return get().addXP(XP_REWARDS.DAILY_GOAL_COMPLETE, userId, { event: 'daily_goal_complete' });
  },

  // ── Streak Management ───────────────────────────────────
  equipStreakFreeze: (count = 1) => {
    const updated = Math.max(0, get().streakFreezes + count);
    try {
      localStorage.setItem('nihongo_streak_freezes', String(updated));
    } catch {}
    set({ streakFreezes: updated });
  },

  useStreakFreeze: () => {
    const current = get().streakFreezes;
    if (current <= 0) return false;
    const updated = current - 1;
    try {
      localStorage.setItem('nihongo_streak_freezes', String(updated));
      localStorage.setItem('nihongo_streak_frozen_today', 'true');
    } catch {}
    set({ streakFreezes: updated, isStreakFrozen: true });
    return true;
  },

  checkAndMaintainStreak: () => {
    const today = getLocalDayString();
    let lastDate: string | null = null;
    try {
      lastDate = localStorage.getItem('nihongo_last_streak_date');
    } catch {}

    if (!lastDate) {
      return { streak: get().streak, preservedWithFreeze: false };
    }

    const diffDays = getDayDiff(today, lastDate);
    if (diffDays <= 1) {
      return { streak: get().streak, preservedWithFreeze: false };
    }

    if (diffDays === 2) {
      if (get().streakFreezes > 0) {
        const remaining = get().streakFreezes - 1;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        try {
          localStorage.setItem('nihongo_streak_freezes', String(remaining));
          localStorage.setItem('nihongo_last_streak_date', yesterday);
          localStorage.setItem('nihongo_streak_frozen_today', 'true');
        } catch {}
        set({ streakFreezes: remaining, isStreakFrozen: true });
        return { streak: get().streak, preservedWithFreeze: true };
      }
    }

    try {
      localStorage.removeItem('nihongo_last_streak_date');
      localStorage.setItem('nihongo_streak_frozen_today', 'false');
    } catch {}
    set({ streak: 0, isStreakFrozen: false });
    return { streak: 0, preservedWithFreeze: false };
  },

  updateStreak: async (userId) => {
    const today = getLocalDayString();
    let alreadyRecordedToday = false;
    try {
      const lastDate = localStorage.getItem('nihongo_last_streak_date');
      if (lastDate === today) {
        alreadyRecordedToday = true;
      }
    } catch {}

    if (userId) {
      try {
        const res = await recordStreakActivity();
        if (res?.streakDays) {
          set({ streak: res.streakDays });
          try {
            localStorage.setItem('nihongo_last_streak_date', today);
          } catch {}
          return res.streakDays;
        }
      } catch (err) {
        console.error('Failed to update streak:', err);
      }
    }

    if (alreadyRecordedToday) {
      return get().streak;
    }

    const { streak } = get();
    const newStreak = streak + 1;
    const { bonus } = calculateStreakBonus(newStreak);

    try {
      localStorage.setItem('nihongo_last_streak_date', today);
    } catch {}

    set({ streak: newStreak });

    try {
      useCelebrationStore.getState().triggerStreakClaim(streak, newStreak);
    } catch (e) {
      console.debug('streak celebration trigger error:', e);
    }

    if (bonus > 0) {
      await get().addXP(bonus, userId);
    }

    return newStreak;
  },

  // ── SRS due count ───────────────────────────────────────
  loadSRSDue: async (userId) => {
    if (!userId) return 0;
    try {
      const data = await getProgress();
      const due = data.srsReviewsDue || 0;
      set({ srsReviewsDue: due });
      return due;
    } catch (err) {
      console.warn('Could not load SRS due count:', err);
      return get().srsReviewsDue;
    }
  },

  // ── Counter Increments ──────────────────────────────────
  incrementXP: (amount: number, userId?: string) => get().addXP(amount, userId),
  incrementLessons: () => set((s) => ({ lessonsCompleted: s.lessonsCompleted + 1 })),
  incrementKanji: () => set((s) => ({ kanjiLearned: s.kanjiLearned + 1 })),
  incrementVocab: () => set((s) => ({ vocabLearned: s.vocabLearned + 1 })),
  incrementKana: () => set((s) => ({ kanaLearned: s.kanaLearned + 1 })),
  incrementGrammar: () => set((s) => ({ grammarLearned: s.grammarLearned + 1 })),
  incrementCards: () => set((s) => ({ cardsReviewed: s.cardsReviewed + 1 })),
  incrementMastered: () => set((s) => ({ cardsMastered: s.cardsMastered + 1 })),

  // ── Daily XP Reset ──────────────────────────────────────
  resetDailyXP: () => {
    try {
      const today = getLocalDayString();
      const cached = JSON.parse(localStorage.getItem('nihongo_daily_xp') || '{}');
      if (cached.date !== today) {
        set({ dailyXP: 0 });
        localStorage.setItem('nihongo_daily_xp', JSON.stringify({ date: today, xp: 0 }));
      }
    } catch {
      set({ dailyXP: 0 });
    }
  },

  // ── Full Reset ──────────────────────────────────────────
  reset: () =>
    set({
      streak: 0,
      totalXP: 0,
      dailyXP: 0,
      userLevel: 1,
      jlptLevel: 'N5',
      lessonsCompleted: 0,
      kanjiLearned: 0,
      vocabLearned: 0,
      kanaLearned: 0,
      grammarLearned: 0,
      grammarProgress: {},
      cardsReviewed: 0,
      cardsMastered: 0,
      srsReviewsDue: 0,
      loading: false,
      initialized: false,
    }),
}));
