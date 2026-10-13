// ============================================================
// hooks/useProgress.ts — UNIFIED PROGRESS HOOK
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import {
  getProgress,
  completeLesson as apiCompleteLesson,
  getBadges as apiGetBadges,
  awardBadge as apiAwardBadge,
} from '../api/progress';
import {
  getJLPTLevel,
  calculateLessonXP,
  getBadges,
} from '../utils/progressCalculator';
import type { JLPTLevel, Badge } from '../types/models';

export interface ProgressStats {
  lessonsCompleted: number;
  kanjiLearned: number;
  vocabLearned: number;
  srsReviewsDue: number;
  totalStudyMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  jlptLevel: JLPTLevel;
  userLevel: number;
  badges: Badge[];
}

export function useProgress() {
  const { user, profile, updateProfile } = useAuthStore();
  const progressStore = useProgressStore();

  const [stats, setStats] = useState<ProgressStats>({
    lessonsCompleted: 0,
    kanjiLearned: 0,
    vocabLearned: 0,
    srsReviewsDue: 0,
    totalStudyMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalXP: 0,
    jlptLevel: 'N5',
    userLevel: 1,
    badges: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [progressData, badgesRes] = await Promise.all([
        getProgress(),
        apiGetBadges().catch(() => ({ badges: [] })),
      ]);

      const totalXP = progressData.totalXP;
      const jlptInfo = getJLPTLevel(totalXP);

      setStats({
        lessonsCompleted: progressData.lessonsCompleted,
        kanjiLearned: progressData.kanjiLearned,
        vocabLearned: progressData.vocabLearned,
        srsReviewsDue: progressData.srsReviewsDue,
        totalStudyMinutes: 0,
        totalXP,
        currentStreak: progressData.streakDays,
        longestStreak: progressData.longestStreak ?? progressData.streakDays,
        jlptLevel: (progressData.jlptLevel || jlptInfo.level) as JLPTLevel,
        userLevel: progressData.userLevel,
        badges: badgesRes.badges || [],
      });
    } catch (err) {
      console.error('Error loading stats via API:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Complete a Lesson ───────────────────────────────────
  const completeLesson = useCallback(async (lessonId: string, score?: number, timeSpent?: number) => {
    if (!user) return;

    try {
      const scorePercent = typeof score === 'number' ? score : 100;
      const timeSpentSeconds = typeof timeSpent === 'number' ? timeSpent : 0;

      const res = await apiCompleteLesson({
        lessonId,
        score: scorePercent,
        timeSpentSeconds,
      });

      const xpResult = res.xpResult;
      progressStore.incrementLessons();

      if (xpResult) {
        updateProfile({
          xpPoints: xpResult.totalXP,
          streakDays: xpResult.streakDays,
          currentLevel: getJLPTLevel(xpResult.totalXP).level as JLPTLevel,
        });

        // Show toast for newly awarded badges if any
        if (xpResult.badgesAwarded && xpResult.badgesAwarded.length > 0) {
          xpResult.badgesAwarded.forEach((b) => {
            import('react-hot-toast').then(({ default: toast }) => {
              toast.success(`New badge: ${b.badgeName || b.badgeType}`, {
                duration: 4000,
                icon: '🏆',
              });
            });
          });
        }
      }

      await loadStats();

      return {
        xpGained: xpResult?.xpGained ?? calculateLessonXP(scorePercent),
        newStreak: xpResult?.streakDays ?? stats.currentStreak,
        leveledUp: false,
        jlptLevel: getJLPTLevel(xpResult?.totalXP || stats.totalXP).level,
      };
    } catch (err) {
      console.error('Error completing lesson via API:', err);
    }
  }, [user, profile, stats, progressStore]);

  // ── Badge Checker ───────────────────────────────────────
  const checkAndAwardBadges = useCallback(async () => {
    if (!user) return;

    try {
      const badgesRes = await apiGetBadges();
      const existingTypes = badgesRes.badges.map((b) => b.badgeType);

      const badgeData = getBadges({
        lessonsCompleted: stats.lessonsCompleted + 1,
        kanjiLearned: stats.kanjiLearned,
        vocabLearned: stats.vocabLearned,
        streak: profile?.streakDays || stats.currentStreak,
        totalXP: progressStore.totalXP,
        cardsReviewed: progressStore.cardsReviewed,
        cardsMastered: progressStore.cardsMastered,
      });

      const newBadges = badgeData.earned.filter((b) => !existingTypes.includes(b.id));

      for (const b of newBadges) {
        await apiAwardBadge({ badgeType: b.id, badgeName: b.name });
        import('react-hot-toast').then(({ default: toast }) => {
          toast.success(`New badge: ${b.name}`, {
            duration: 4000,
            icon: '🏆',
          });
        });
      }
    } catch (err) {
      console.error('Error checking badges:', err);
    }
  }, [user, stats, profile, progressStore]);

  return {
    stats,
    loading,
    loadStats,
    completeLesson,
    checkAndAwardBadges,
    awardQuizXP: progressStore.awardQuizXP,
    awardSRSReviewXP: progressStore.awardSRSReviewXP,
    awardKanjiXP: progressStore.awardKanjiXP,
    awardVocabXP: progressStore.awardVocabXP,
    awardGrammarXP: progressStore.awardGrammarXP,
  };
}
