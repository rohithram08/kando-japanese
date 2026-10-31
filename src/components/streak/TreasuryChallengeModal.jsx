// src/components/streak/TreasuryChallengeModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Treasury Challenge & Treasury Box Opening Modal
// 100% Slime Concept + Weekly Japanese Mini-Challenge + Drop Rate Chest Opening
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Sparkles, Snowflake, Shield, CheckCircle2,
  Clock, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';
import {
  isTreasuryChallengeAvailable,
  getTimeUntilTreasuryReset,
  rollTreasuryFreezeReward,
  getTreasuryChallengeQuestions,
  TREASURY_STORAGE_KEYS,
} from '../../services/treasuryService';
import { playSuccess, playError, playFanfare, playPop } from '../../utils/soundEffects';
import JellyStreakSlime from '../mascot/JellyStreakSlime';
import toast from 'react-hot-toast';

export default function TreasuryChallengeModal({ isOpen, onClose, onStreakRepaired }) {
  const {
    streakFreezes,
    brokenStreakInfo,
    claimTreasuryFreezeReward,
    repairStreakWithFreeze,
  } = useProgressStore();

  const [phase, setPhase] = useState('intro'); // 'intro' | 'challenge' | 'box_ready' | 'opening' | 'reward'
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [reward, setReward] = useState(null);
  const [hasRepairedInModal, setHasRepairedInModal] = useState(false);

  // Weekly availability check
  const lastClaimed = typeof window !== 'undefined'
    ? localStorage.getItem(TREASURY_STORAGE_KEYS.LAST_CLAIMED)
    : null;
  const isAvailableThisWeek = isTreasuryChallengeAvailable(lastClaimed);
  const resetTimer = getTimeUntilTreasuryReset();

  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setQuestions(getTreasuryChallengeQuestions(3));
      setCurrentQIndex(0);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setReward(null);
      setHasRepairedInModal(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startChallenge = () => {
    playPop();
    setPhase('challenge');
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  const handleSelectAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const currentQ = questions[currentQIndex];
    const correct = idx === currentQ.correctIndex;

    if (correct) {
      setIsAnswerCorrect(true);
      playSuccess();
      setTimeout(() => {
        if (currentQIndex + 1 < questions.length) {
          setCurrentQIndex(currentQIndex + 1);
          setSelectedAnswer(null);
          setIsAnswerCorrect(null);
        } else {
          // Challenge cleared!
          playFanfare();
          setPhase('box_ready');
        }
      }, 700);
    } else {
      setIsAnswerCorrect(false);
      playError();
      setTimeout(() => {
        // Reset answer so user can try again
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      }, 900);
    }
  };

  const openTreasuryBox = () => {
    playPop();
    setPhase('opening');

    setTimeout(() => {
      const outcome = rollTreasuryFreezeReward();
      setReward(outcome);
      claimTreasuryFreezeReward(outcome.freezes);
      setPhase('reward');

      if (outcome.freezes > 0) {
        playFanfare();
        toast.success(`Won ${outcome.freezes} Jelly Freeze${outcome.freezes > 1 ? 's' : ''}! ❄️`, {
          icon: '🎁',
        });
      }
    }, 1200);
  };

  const handleRepairFromModal = async () => {
    const res = await repairStreakWithFreeze();
    if (res.success) {
      playFanfare();
      setHasRepairedInModal(true);
      toast.success(res.message, { icon: '❄️' });
      onStreakRepaired?.();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg bg-surface border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-label="Treasury Challenge Modal"
      >
        {/* Header decoration bar */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── PHASE 1: INTRO ── */}
        {phase === 'intro' && (
          <div className="p-6 text-center space-y-5">
            <div className="flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400/20 to-cyan-500/20 border border-amber-400/30 flex items-center justify-center text-4xl shadow-inner">
                  🎁
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <JellyStreakSlime size="xs" mood="celebrating" />
                </div>
              </motion.div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 mb-2">
                <Sparkles className="w-3 h-3 text-amber-500" /> Weekly Treasury Box
              </div>
              <h2 className="text-xl font-black text-foreground">
                宝箱チャレンジ — Treasury Challenge
              </h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Complete a quick 3-question Japanese challenge to unlock the Treasury Box and earn Jelly Freezes to protect your daily streaks!
              </p>
            </div>

            {/* Drop Rates Table */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 text-left text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/50 text-muted-foreground font-semibold">
                <span>Treasury Reward Drop Rates</span>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">1x Per Week</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface/80 border border-amber-500/20">
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">🌟 5 Freezes (MAX)</span>
                  <span className="font-mono font-bold text-muted-foreground">5%</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface/80 border border-border">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">💎 4 Freezes</span>
                  <span className="font-mono font-bold text-muted-foreground">15%</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface/80 border border-border">
                  <span className="font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">❄️ 3 Freezes</span>
                  <span className="font-mono font-bold text-muted-foreground">25%</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface/80 border border-border">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">❄️ 2 Freezes</span>
                  <span className="font-mono font-bold text-muted-foreground">50%</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface/80 border border-border">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">❄️ 1 Freeze</span>
                  <span className="font-mono font-bold text-muted-foreground">99%</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface/80 border border-border">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">🍀 Next Time</span>
                  <span className="font-mono font-bold text-muted-foreground">1%</span>
                </div>
              </div>
            </div>

            {/* Broken Streak Warning if any */}
            {brokenStreakInfo && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-left flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-amber-700 dark:text-amber-300">
                    Streak Ended ({brokenStreakInfo.count} Days)!
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Complete this challenge to earn a freeze and repair your streak!
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            {isAvailableThisWeek ? (
              <button
                onClick={startChallenge}
                className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Start Treasury Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Treasury Box Opened This Week</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Resets every Monday. Available again in <strong className="text-foreground">{resetTimer.formatted}</strong>!
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE 2: INTERACTIVE CHALLENGE ── */}
        {phase === 'challenge' && questions.length > 0 && (
          <div className="p-6 space-y-5">
            {/* Step & Category Header */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                {questions[currentQIndex]?.category}
              </span>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                Question {currentQIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Question Card */}
            <div className="p-5 rounded-2xl bg-muted/30 border border-border text-center space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                {questions[currentQIndex]?.prompt}
              </p>
              <h3 className="text-3xl font-black text-foreground font-jp py-1">
                {questions[currentQIndex]?.japanese}
              </h3>
              {questions[currentQIndex]?.furigana && (
                <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                  {questions[currentQIndex]?.furigana}
                </p>
              )}
            </div>

            {/* Answer Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {questions[currentQIndex]?.choices.map((choice, idx) => {
                const isSelected = selectedAnswer === idx;
                let btnStyle = 'bg-surface border-border hover:border-cyan-500/40 text-foreground';

                if (isSelected) {
                  if (isAnswerCorrect === true) {
                    btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                  } else if (isAnswerCorrect === false) {
                    btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold animate-shake';
                  }
                }

                return (
                  <button
                    key={choice}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{choice}</span>
                    {isSelected && isAnswerCorrect === true && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Tip */}
            {isAnswerCorrect === false && (
              <p className="text-xs text-rose-500 text-center font-medium">
                Incorrect! Give it another try.
              </p>
            )}
          </div>
        )}

        {/* ── PHASE 3: BOX READY TO OPEN ── */}
        {phase === 'box_ready' && (
          <div className="p-6 text-center space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Challenge Cleared!
            </div>

            <h3 className="text-2xl font-black text-foreground">
              The Treasury Box is Ready!
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Tap the chest to reveal your streak freeze rewards for this week!
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openTreasuryBox}
              className="cursor-pointer mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-300 to-amber-500 shadow-xl shadow-amber-500/30 border-2 border-amber-200 flex flex-col items-center justify-center p-3 relative"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl"
              >
                🎁
              </motion.div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 mt-1">
                Tap to Open
              </span>
            </motion.div>

            <button
              onClick={openTreasuryBox}
              className="w-full py-3 px-5 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Treasury Box!</span>
            </button>
          </div>
        )}

        {/* ── PHASE 4: OPENING ANIMATION ── */}
        {phase === 'opening' && (
          <div className="p-10 text-center space-y-4">
            <motion.div
              animate={{
                rotate: [-4, 4, -4, 4, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-6xl select-none"
            >
              ✨ 🎁 ✨
            </motion.div>
            <h3 className="text-lg font-black text-foreground">
              Opening Treasury Box...
            </h3>
            <p className="text-xs text-muted-foreground font-mono animate-pulse">
              Rolling random rewards...
            </p>
          </div>
        )}

        {/* ── PHASE 5: REWARD REVEAL ── */}
        {phase === 'reward' && reward && (
          <div className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-sky-400/30 to-blue-500/20 border-2 border-cyan-400/50 flex flex-col items-center justify-center text-5xl shadow-xl shadow-cyan-500/20"
              >
                {reward.freezes > 0 ? '❄️' : '🍀'}
              </motion.div>
            </div>

            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-1">
                {reward.rarityBadge}
              </span>
              <h3 className="text-xl font-black text-foreground">
                {reward.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {reward.message}
              </p>
            </div>

            {/* Inventory Status */}
            <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-sky-500" />
              <span>
                Total Jelly Freezes in Inventory: <strong className="text-foreground">{streakFreezes}</strong>
              </span>
            </div>

            {/* Broken Streak Repair Action */}
            {brokenStreakInfo && !hasRepairedInModal && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                    Your {brokenStreakInfo.count}-day streak ended on {brokenStreakInfo.missedDate}!
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Use 1 of your Jelly Freezes to freeze that day and restore your streak!
                </p>
                <button
                  onClick={handleRepairFromModal}
                  disabled={streakFreezes < 1}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>Freeze Missed Day & Restore Streak</span>
                </button>
              </motion.div>
            )}

            {hasRepairedInModal && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Streak Successfully Restored & Protected!</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 px-5 rounded-2xl font-bold text-sm bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
