// src/components/listening/ListeningSessionEndModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Duolingo-Grade Session End XP Celebration Modal for Listening Dojo
// Inherits Duolingo's Session End Architecture:
//  - Animated Mascot Celebration (Slime Cheering Rig)
//  - XP Breakdown Tally: Base XP (+15) + Choukai Comprehension Bonus (+10)
//  - Streak Flame Preservation Pill & Daily Goal Progress Ring
//  - 3D Tactile Continue Button with Sound Feedback
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Award, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import SlimeCheerRig from '../celebration/SlimeCheerRig';
import { playFanfare, playPop } from '../../utils/soundEffects';
import type { ListeningScenario } from '../../api/listening';

interface ListeningSessionEndModalProps {
  isOpen: boolean;
  scenario: ListeningScenario;
  baseXP?: number;
  accuracyBonus?: number;
  currentStreak?: number;
  dailyGoalTarget?: number;
  dailyGoalCurrent?: number;
  onContinue: () => void;
  onReplay: () => void;
  onOpenExam: () => void;
}

export const ListeningSessionEndModal: React.FC<ListeningSessionEndModalProps> = ({
  isOpen,
  scenario,
  baseXP = 15,
  accuracyBonus = 10,
  currentStreak = 1,
  dailyGoalTarget = 50,
  dailyGoalCurrent = 25,
  onContinue,
  onReplay,
  onOpenExam,
}) => {
  const [animatedXP, setAnimatedXP] = useState(0);
  const totalEarned = baseXP + accuracyBonus;

  useEffect(() => {
    if (!isOpen) {
      setAnimatedXP(0);
      return;
    }

    // Play fanfare chime
    try {
      const audio = new Audio('/audio/lesson_complete.mp3');
      audio.volume = 0.6;
      audio.play().catch(() => {
        playFanfare();
      });
    } catch {
      playFanfare();
    }

    // Animate XP number counter tick-up
    let current = 0;
    const step = Math.max(1, Math.ceil(totalEarned / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= totalEarned) {
        setAnimatedXP(totalEarned);
        clearInterval(interval);
      } else {
        setAnimatedXP(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen, totalEarned]);

  if (!isOpen) return null;

  const currentGoalPct = Math.min(100, Math.round((dailyGoalCurrent / dailyGoalTarget) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-surface border-2 border-primary/40 shadow-2xl p-5 sm:p-6 text-center overflow-hidden max-h-[92vh] overflow-y-auto"
        >
          {/* Ambient Radial Background Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 -left-16 w-44 h-44 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl" />
          </div>

          {/* Top Level & Scenario Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{scenario.level} • {scenario.titleJa}</span>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            聴解トレーニング完了！
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conversation mastered! Great ear for native Japanese nuance.
          </p>

          {/* Slime Mascot Rig */}
          <div className="flex justify-center my-3">
            <SlimeCheerRig cheerType="confetti_cannon" size={150} />
          </div>

          {/* Duolingo XP Breakdown Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 my-3 text-left">
            {/* Total XP Card */}
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-primary mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total XP</span>
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-primary leading-none">
                +{animatedXP}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">
                Base (+{baseXP}) + Bonus (+{accuracyBonus})
              </span>
            </div>

            {/* Streak Preservation Card */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
                <Flame className="w-4 h-4 fill-current text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-500 leading-none">
                {currentStreak} <span className="text-xs font-bold text-foreground">DAYS</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                ✓ Extended for today!
              </span>
            </div>
          </div>

          {/* Daily Goal Progress Bar */}
          <div className="p-2.5 rounded-2xl bg-muted/60 border border-border/80 my-3 text-left">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-muted-foreground">Daily Goal Target</span>
              <span className="font-mono text-primary">{dailyGoalCurrent} / {dailyGoalTarget} XP</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentGoalPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Action Buttons: Continue & Exam */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                playPop();
                onContinue();
              }}
              className="w-full btn-3d-slime py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Continue (次へ)</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  onReplay();
                }}
                className="flex-1 py-2 px-3 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Video</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  onOpenExam();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Take Exam (試験)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
