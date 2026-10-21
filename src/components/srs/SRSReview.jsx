// src/components/srs/SRSReview.jsx
// Production Spaced Repetition (SRS) Review Engine
// Integrates SM-2 backend queue with resolved vocabulary and kanji data.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useProgressStore } from '../../store/progressStore';
import { getDueCards, reviewCard } from '../../api/srs';
import { calculateSRSReviewXP, XP_REWARDS } from '../../utils/progressCalculator';
import { useDailyGoalsStore } from '../../store/dailyGoalsStore';
import { resolveCardContent } from '../../utils/srsCardResolver';
import SRSReviewCard from './SRSReviewCard';
import { useI18n, getCurriculumMeaning } from '../../i18n';
import { BookOpen, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { playSuccess, playError, playFanfare, playSwoosh, playClick } from '../../utils/soundEffects';

export default function SRSReview() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuthStore();
  const { awardSRSReviewXP, incrementCards, incrementMastered } = useProgressStore();
  const addReview = useDailyGoalsStore((s) => s.addReview);
  const { t, locale } = useI18n();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    wrong: 0,
    completed: 0,
  });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [batchCheckpoint, setBatchCheckpoint] = useState(false);
  const BATCH_SIZE = 15;

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const res = await getDueCards();
        const rawList = res?.cards || [];
        const resolvedList = rawList.map((c) => ({
          ...c,
          resolved: resolveCardContent(c),
        }));
        setCards(resolvedList);
        setSessionStats((prev) => ({ ...prev, total: resolvedList.length }));
      } else {
        // Guest mode fallback — load cards saved in localStorage
        const raw = localStorage.getItem('nihongo_guest_srs_deck');
        let guestIds = [];
        try {
          guestIds = raw ? JSON.parse(raw) : [];
        } catch {
          guestIds = [];
        }
        const guestCards = (guestIds || []).map((refId, i) => {
          let cardType = 'vocabulary';
          if (typeof refId === 'string') {
            if (refId.startsWith('k_') || /^n[1-5]k\d+/i.test(refId) || (refId.length === 1 && /[\u4e00-\u9faf]/.test(refId))) {
              cardType = 'kanji';
            } else if (refId.startsWith('hiragana_') || refId.startsWith('katakana_') || refId.startsWith('h_') || /^[\u3040-\u30ff]$/.test(refId)) {
              cardType = 'kana';
            } else if (/^n[1-5]_?g\d+/i.test(refId)) {
              cardType = 'grammar';
            }
          }
          const cardObj = {
            id: `guest_${i}_${refId}`,
            cardRefId: refId,
            cardType,
            repetitions: 0,
            intervalDays: 1,
            easeFactor: 2.5,
            isMastered: false,
          };
          return {
            ...cardObj,
            resolved: resolveCardContent(cardObj),
          };
        });
        setCards(guestCards);
        setSessionStats((prev) => ({ ...prev, total: guestCards.length }));
      }
    } catch (err) {
      console.error('Failed to load due cards:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleQuality = useCallback(
    async (quality) => {
      const card = cards[currentIndex];
      if (!card) return;

      try {
        const srsIntervalMode = useSettingsStore.getState().srsInterval || 'balanced';
        let isMastered = false;
        let xpGained = calculateSRSReviewXP(quality);

        if (user?.id) {
          const result = await reviewCard(card.id, { quality, intervalMode: srsIntervalMode });
          isMastered = result?.card?.isMastered || false;

          // Consume xpResult directly from reviewCard response to prevent duplicate XP awards
          const xpResult = result?.xpResult || await awardSRSReviewXP(user.id, quality, isMastered, card.id);
          xpGained = xpResult?.xpGained !== undefined
            ? xpResult.xpGained
            : (calculateSRSReviewXP(quality) + (isMastered ? XP_REWARDS.SRS_CARD_MASTERED : 0));

          if (xpResult) {
            useProgressStore.setState((s) => ({
              totalXP: xpResult.totalXP ?? s.totalXP,
              userLevel: xpResult.newLevel ?? s.userLevel,
              streak: xpResult.streakDays ?? s.streak,
              dailyXP: s.dailyXP + (xpResult.xpGained || 0),
            }));
          }
        } else {
          // Guest mode review progression
          if (quality >= 3) {
            isMastered = quality === 5;
          }
        }

        setSessionXP((prev) => prev + xpGained);
        incrementCards();
        addReview(1);
        if (isMastered) incrementMastered();

        setSessionStats((prev) => ({
          ...prev,
          completed: prev.completed + 1,
          correct: quality >= 3 ? prev.correct + 1 : prev.correct,
          wrong: quality < 3 ? prev.wrong + 1 : prev.wrong,
        }));

        if (currentIndex + 1 >= cards.length) {
          playFanfare();
          setSessionComplete(true);
          toast.success(`Review complete! +${sessionXP + xpGained} XP 🎉`);
        } else if ((currentIndex + 1) % BATCH_SIZE === 0) {
          playFanfare();
          setBatchCheckpoint(true);
        } else {
          if (quality >= 3) {
            playSuccess();
          } else {
            playError();
          }
          setCurrentIndex((prev) => prev + 1);
          setRevealed(false);
        }
      } catch (err) {
        console.error('Error submitting SRS review:', err);
        toast.error('Failed to record review');
      }
    },
    [cards, currentIndex, user?.id, awardSRSReviewXP, incrementCards, addReview, incrementMastered, sessionXP]
  );

  // Keyboard navigation: Space/Enter reveals; 1, 2, 3, 4 grades quality
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (sessionComplete || cards.length === 0) return;

      if (!revealed) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          playSwoosh();
          setRevealed(true);
        }
      } else {
        if (e.key === '1') handleQuality(0);
        else if (e.key === '2') handleQuality(3);
        else if (e.key === '3') handleQuality(4);
        else if (e.key === '4') handleQuality(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [revealed, sessionComplete, cards.length, handleQuality]);

  const getLangMeaning = (item) => {
    return getCurriculumMeaning(item, locale) || item.meaning || '';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          🔄
        </motion.div>
        <p className="text-sm text-muted-foreground">{t('common.loading', 'Loading your SRS cards...')}</p>
      </div>
    );
  }

  // ── Empty State: All Caught Up / Deck Empty ──
  if (cards.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-4 space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-4xl shadow-sm">
          🎉
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('srs.no_cards_due', 'All caught up!')}
          </h2>
          <p className="text-sm mt-1.5 text-muted-foreground">
            {t('srs.no_cards_due', 'No reviews due right now. New cards appear as intervals mature.')}
          </p>
        </div>

        {/* Action recommendations to populate deck */}
        <div className="p-4 rounded-2xl bg-muted/50 border border-border text-left space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Want to study more? Add new cards to your deck:
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/vocabulary')}
              className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border hover:border-red-400 transition-colors text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                Browse Vocabulary Bank
              </span>
              <span className="text-xs text-muted-foreground">Add words →</span>
            </button>
            <button
              onClick={() => navigate('/kanji')}
              className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border hover:border-red-400 transition-colors text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Explore Kanji Studio
              </span>
              <span className="text-xs text-muted-foreground">Add kanji →</span>
            </button>
            <button
              onClick={() => navigate('/lessons')}
              className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border hover:border-red-400 transition-colors text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-500" />
                Continue JLPT Lessons
              </span>
              <span className="text-xs text-muted-foreground">Learn →</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Batch Checkpoint (Anti-Burnout) ──
  if (batchCheckpoint) {
    const batchAccuracy = sessionStats.completed > 0
      ? Math.round((sessionStats.correct / sessionStats.completed) * 100)
      : 100;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-8 px-4 space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-4xl shadow-sm">
          ⚡
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('srs.checkpoint_title', 'Batch Checkpoint Reached!')}
          </h2>
          <p className="text-sm mt-1 text-muted-foreground">
            {t('srs.checkpoint_desc', `You have reviewed ${sessionStats.completed} cards so far with ${batchAccuracy}% accuracy.`)}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20 font-bold text-sm shadow-sm">
          <span>⭐</span>
          <span>+{sessionXP} XP Earned</span>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => {
              playClick();
              setBatchCheckpoint(false);
              setCurrentIndex((prev) => prev + 1);
              setRevealed(false);
            }}
            className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md transition-all active:scale-98 cursor-pointer"
          >
            {t('srs.continue_batch', 'Continue Next Batch')} ({cards.length - (currentIndex + 1)} cards left) →
          </button>
          <button
            onClick={() => {
              playClick();
              setBatchCheckpoint(false);
              setSessionComplete(true);
            }}
            className="w-full py-3 rounded-2xl font-semibold text-sm border bg-surface border-border text-foreground hover:bg-muted transition-all active:scale-98 cursor-pointer"
          >
            {t('srs.finish_session', 'Wrap Up Session for Now')}
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Session Complete Summary ──
  if (sessionComplete) {
    const accuracy =
      sessionStats.total > 0
        ? Math.round((sessionStats.correct / sessionStats.total) * 100)
        : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-8 px-4"
      >
        <div className="text-6xl mb-4">
          {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold mb-1 text-foreground">{t('srs.session_complete', 'Session Complete!')}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t('srs.cards_reviewed', { count: sessionStats.completed }, `Reviewed ${sessionStats.completed} cards today`)}
        </p>

        {/* XP Earned */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20 shadow-sm">
          <span>⭐</span>
          <span className="font-bold text-sm">+{sessionXP} XP</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl p-3 bg-green-50 dark:bg-green-500/10">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {sessionStats.correct}
            </div>
            <div className="text-xs text-green-500">{t('quiz.correct_label', 'Correct')}</div>
          </div>
          <div className="rounded-2xl p-3 bg-red-50 dark:bg-red-500/10">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {sessionStats.wrong}
            </div>
            <div className="text-xs text-red-500">{t('quiz.incorrect_label', 'Wrong')}</div>
          </div>
          <div className="rounded-2xl p-3 bg-blue-50 dark:bg-blue-500/10">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {accuracy}%
            </div>
            <div className="text-xs text-blue-500">{t('srs.accuracy_label', 'Accuracy')}</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setSessionComplete(false);
              setCurrentIndex(0);
              setRevealed(false);
              setSessionXP(0);
              setSessionStats({ total: 0, correct: 0, wrong: 0, completed: 0 });
              loadCards();
            }}
            className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            {t('common.retry', 'Review Again')}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
          >
            {t('srs.return_dashboard', 'Dashboard')}
          </button>
        </div>
      </motion.div>
    );
  }

  const currentCard = cards[currentIndex];
  const cardData = currentCard?.resolved;

  return (
    <div className="max-w-md mx-auto px-4 pb-12">
      {/* Progress Counter & Streak */}
      <div className="mb-5">
        <div className="flex justify-between text-sm mb-2 text-muted-foreground">
          <span className="font-medium">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span>✅ {sessionStats.correct} | ❌ {sessionStats.wrong}</span>
            {sessionXP > 0 && (
              <span className="font-bold text-yellow-600 dark:text-yellow-400">
                +{sessionXP} XP
              </span>
            )}
          </div>
        </div>
        <div className="rounded-full h-2 bg-muted overflow-hidden">
          <motion.div
            className="bg-red-500 h-2 rounded-full transition-all"
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Review Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <SRSReviewCard
            card={cardData}
            revealed={revealed}
            onReveal={() => {
              playSwoosh();
              setRevealed(true);
            }}
            getLangMeaning={getLangMeaning}
          />
        </motion.div>
      </AnimatePresence>

      {/* Quality Rating Buttons */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-2 mt-4"
          >
            {[
              { quality: 0, keyNumber: '1', label: t('srs.quality_forgot', 'Forgot'), color: 'bg-red-500 hover:bg-red-600', emoji: '😰' },
              { quality: 3, keyNumber: '2', label: t('srs.quality_hard', 'Hard'), color: 'bg-orange-500 hover:bg-orange-600', emoji: '😓' },
              { quality: 4, keyNumber: '3', label: t('srs.quality_good', 'Good'), color: 'bg-blue-500 hover:bg-blue-600', emoji: '😊' },
              { quality: 5, keyNumber: '4', label: t('srs.quality_easy', 'Easy'), color: 'bg-green-500 hover:bg-green-600', emoji: '😄' },
            ].map(({ quality, keyNumber, label, color, emoji }) => {
              const xpForThis = calculateSRSReviewXP(quality);
              return (
                <button
                  key={quality}
                  onClick={() => handleQuality(quality)}
                  className={`${color} text-white rounded-2xl py-3 px-1 font-semibold text-xs shadow-md active:scale-95 transition-all flex flex-col items-center gap-1`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span>{label}</span>
                  <span className="text-[10px] opacity-75">
                    [{keyNumber}] {xpForThis > 0 ? `+${xpForThis}XP` : ''}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard navigation hint */}
      {!revealed && (
        <p className="text-center text-xs mt-4 text-muted-foreground">
          {t('srs.tap_to_reveal', 'Tip: Press Space or tap card to reveal')}
        </p>
      )}
    </div>
  );
}