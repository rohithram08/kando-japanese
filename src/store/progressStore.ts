// ============================================================
// store/progressStore.ts — UNIFIED XP & PROGRESS STORE
// ============================================================

import { create } from 'zustand';
import {
  getProgress,
  submitXPEvent,
  recordStreakActivity,
  recordKanjiProgress as apiRecordKanjiProgress,
  recordVocabularyProgress as apiRecordVocabularyProgress,
} from '../api/progress';
import {
  getJLPTLevel,
  getUserLevel,
  XP_REWARDS,
  calculateLessonXP,
  calculateQuizXP,
  calculateSRSReviewXP,
  calculateStreakBonus,
} from '../utils/progressCalculator';
import type { JLPTLevel, XPEventType, SRSQuality, User } from '../types/models';

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
  cardsReviewed: number;
  cardsMastered: number;
  srsReviewsDue: number;
  loading: boolean;
  initialized: boolean;

  initializeProgress: (userId?: string, profile?: Partial<User> | null) => Promise<void>;
  addXP: (
    amount: number,
    userId?: string,
    eventData?: {
      event?: XPEventType;
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
  awardLessonXP: (userId: string | undefined, scorePercent: number) => Promise<any>;
  awardQuizXP: (userId: string | undefined, scorePercent: number) => Promise<any>;
  awardSRSReviewXP: (userId: string | undefined, quality: SRSQuality, isMastered?: boolean) => Promise<any>;
  awardKanjiXP: (userId?: string, kanjiId?: string, recognitionLevel?: number, mastered?: boolean) => Promise<any>;
  awardVocabXP: (userId?: string, vocabularyId?: string, masteryLevel?: number, mastered?: boolean) => Promise<any>;
  awardKanaXP: (userId?: string, kanaId?: string, mastered?: boolean) => Promise<any>;
  awardGrammarXP: (userId?: string) => Promise<any>;
  awardDailyGoalXP: (userId?: string) => Promise<any>;
  updateStreak: (userId?: string) => Promise<number>;
  loadSRSDue: (userId?: string) => Promise<number>;
  incrementLessons: () => void;
  incrementKanji: () => void;
  incrementVocab: () => void;
  incrementKana: () => void;
  incrementCards: () => void;
  incrementMastered: () => void;
  resetDailyXP: () => void;
  reset: () => void;
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
  totalXP: 0,
  dailyXP: 0,
  userLevel: 1,
  jlptLevel: 'N5',
  lessonsCompleted: 0,
  kanjiLearned: 0,
  vocabLearned: 0,
  kanaLearned: 0,
  cardsReviewed: 0,
  cardsMastered: 0,
  srsReviewsDue: 0,
  loading: false,
  initialized: false,

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

      set({
        totalXP: data.totalXP,
        streak: data.streakDays,
        jlptLevel: data.jlptLevel,
        userLevel: data.userLevel,
        dailyXP,
        lessonsCompleted: data.lessonsCompleted,
        kanjiLearned: data.kanjiLearned,
        vocabLearned: data.vocabLearned,
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
        loading: false,
        initialized: true,
      });
    }
  },

  // ── Core XP Adding Function ─────────────────────────────
  addXP: async (amount, userId, eventData) => {
    if (amount <= 0 && !eventData?.event) return;

    const { totalXP, dailyXP } = get();
    const newTotal = totalXP + amount;
    const newDaily = dailyXP + amount;

    const jlptInfo = getJLPTLevel(newTotal);
    const newUserLevel = getUserLevel(newTotal);
    const oldJlpt = get().jlptLevel;

    set({
      totalXP: newTotal,
      dailyXP: newDaily,
      jlptLevel: jlptInfo.level as JLPTLevel,
      userLevel: newUserLevel,
    });

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
            score: eventData.score,
            quality: eventData.quality,
            isMastered: eventData.isMastered,
          });
          if (res?.totalXP) {
            set({
              totalXP: res.totalXP,
              userLevel: res.newLevel,
              streak: res.streakDays ?? get().streak,
              jlptLevel: getJLPTLevel(res.totalXP).level as JLPTLevel,
            });
          }
        } else {
          const res = await submitXPEvent({
            event: 'lesson_completed',
            amount,
          } as any);
          if (res?.totalXP) {
            set({
              totalXP: res.totalXP,
              userLevel: res.newLevel,
              streak: res.streakDays ?? get().streak,
              jlptLevel: getJLPTLevel(res.totalXP).level as JLPTLevel,
            });
          }
        }
      } catch (err) {
        console.error('Failed to submit XP to backend:', err);
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
  awardLessonXP: async (userId, scorePercent) => {
    const xp = calculateLessonXP(scorePercent);
    return get().addXP(xp, userId, { event: 'lesson_completed', score: scorePercent });
  },

  awardQuizXP: async (userId, scorePercent) => {
    const xp = calculateQuizXP(scorePercent);
    return get().addXP(xp, userId, { event: 'quiz_completed', score: scorePercent });
  },

  awardSRSReviewXP: async (userId, quality, isMastered = false) => {
    const xp = calculateSRSReviewXP(quality, isMastered);
    if (xp > 0) {
      return get().addXP(xp, userId, { event: 'srs_review', quality, isMastered });
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
          set({
            totalXP,
            userLevel: newLevel,
            streak: streakDays ?? get().streak,
            jlptLevel: getJLPTLevel(totalXP).level as JLPTLevel,
          });
          return {
            xpGained: res.xpResult.xpGained,
            newTotal: totalXP,
            jlptLevel: getJLPTLevel(totalXP).level as JLPTLevel,
            userLevel: newLevel,
          };
        }
      } catch (err) {
        console.error('Failed to record kanji progress to API:', err);
      }
    }
    return get().addXP(XP_REWARDS.KANJI_LEARNED, userId, { event: 'kanji_learned' });
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
          set({
            totalXP,
            userLevel: newLevel,
            streak: streakDays ?? get().streak,
            jlptLevel: getJLPTLevel(totalXP).level as JLPTLevel,
          });
          return {
            xpGained: res.xpResult.xpGained,
            newTotal: totalXP,
            jlptLevel: getJLPTLevel(totalXP).level as JLPTLevel,
            userLevel: newLevel,
          };
        }
      } catch (err) {
        console.error('Failed to record vocab progress to API:', err);
      }
    }
    return get().addXP(XP_REWARDS.VOCAB_LEARNED, userId, { event: 'vocab_learned' });
  },

  awardKanaXP: async (userId, kanaId, mastered = false) => {
    get().incrementKana();
    return get().addXP(10, userId, { event: 'kanji_learned' });
  },

  awardGrammarXP: async (userId) => {
    return get().addXP(XP_REWARDS.GRAMMAR_LEARNED, userId, { event: 'grammar_studied' });
  },

  awardDailyGoalXP: async (userId) => {
    return get().addXP(XP_REWARDS.DAILY_GOAL_COMPLETE, userId, { event: 'daily_goal_complete' });
  },

  // ── Streak Management ───────────────────────────────────
  updateStreak: async (userId) => {
    const { streak } = get();
    const newStreak = streak + 1;
    const { bonus } = calculateStreakBonus(newStreak);

    set({ streak: newStreak });

    if (bonus > 0) {
      await get().addXP(bonus, userId);
    }

    if (userId) {
      try {
        const res = await recordStreakActivity();
        if (res?.streakDays) {
          set({ streak: res.streakDays });
          return res.streakDays;
        }
      } catch (err) {
        console.error('Failed to update streak:', err);
      }
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
  incrementLessons: () => set((s) => ({ lessonsCompleted: s.lessonsCompleted + 1 })),
  incrementKanji: () => set((s) => ({ kanjiLearned: s.kanjiLearned + 1 })),
  incrementVocab: () => set((s) => ({ vocabLearned: s.vocabLearned + 1 })),
  incrementKana: () => set((s) => ({ kanaLearned: s.kanaLearned + 1 })),
  incrementCards: () => set((s) => ({ cardsReviewed: s.cardsReviewed + 1 })),
  incrementMastered: () => set((s) => ({ cardsMastered: s.cardsMastered + 1 })),

  // ── Daily XP Reset ──────────────────────────────────────
  resetDailyXP: () => {
    try {
      const today = new Date().toISOString().split('T')[0];
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
      cardsReviewed: 0,
      cardsMastered: 0,
      srsReviewsDue: 0,
      loading: false,
      initialized: false,
    }),
}));
