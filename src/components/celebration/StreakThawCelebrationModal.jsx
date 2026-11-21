// src/components/celebration/StreakThawCelebrationModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Duolingo-Grade Streak Thaw & Reignite Celebration Modal
// Features ice-cracking transition, flame burst pop, and odometer roll!
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import StreakOdometer from '../common/StreakOdometer';
import { playFanfare, playPop } from '../../utils/soundEffects';

export default function StreakThawCelebrationModal({
  oldStreak = 1,
  newStreak = 2,
  onDismiss,
}) {
  const [isThawed, setIsThawed] = useState(false);
  const [odometerValue, setOdometerValue] = useState(oldStreak);

  useEffect(() => {
    try {
      playPop();
    } catch {}

    // Phase 1: Ice cracks and melts into flame after 500ms
    const thawTimer = setTimeout(() => {
      setIsThawed(true);
      try {
        playFanfare();
      } catch {}
    }, 550);

    // Phase 2: Odometer rolls from oldStreak to newStreak after flame pop (900ms)
    const odoTimer = setTimeout(() => {
      setOdometerValue(newStreak);
    }, 950);

    return () => {
      clearTimeout(thawTimer);
      clearTimeout(odoTimer);
    };
  }, [oldStreak, newStreak]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="relative w-full max-w-md rounded-3xl bg-surface border-2 border-amber-500/50 shadow-2xl p-6 text-center overflow-hidden"
      >
        {/* Flame & Warm Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-amber-500/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-orange-500/20 rounded-full blur-3xl" />

          {/* Sakura & Fire Sparks */}
          <span className="absolute top-6 left-8 text-xl animate-bounce" style={{ animationDuration: '3.2s' }}>✨</span>
          <span className="absolute top-10 right-10 text-base animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.6s' }}>🔥</span>
          <span className="absolute bottom-16 left-10 text-sm animate-bounce" style={{ animationDuration: '3.6s', animationDelay: '1.2s' }}>🌸</span>
        </div>

        {/* Top Header Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>STREAK THAWED & REIGNITED! 氷解・炎の復活</span>
        </div>

        {/* ── Thaw & Flame Pop Interactive Arena ── */}
        <div className="relative h-44 w-full flex items-center justify-center my-2">
          {/* Flame Shockwave / Blast Ring on Thaw */}
          {isThawed && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="absolute w-32 h-32 rounded-full border-4 border-amber-400 pointer-events-none"
            />
          )}

          {/* Visual Transformation: Ice Crystal shatters into Blazing Flame */}
          <AnimatePresence mode="wait">
            {!isThawed ? (
              <motion.div
                key="ice-stage"
                initial={{ scale: 0.9, opacity: 1 }}
                exit={{ scale: 1.25, opacity: 0, rotate: 10 }}
                transition={{ duration: 0.4 }}
                className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-300 via-sky-400 to-cyan-500 border-2 border-white shadow-xl shadow-sky-400/50 flex items-center justify-center"
              >
                <span className="text-4xl select-none">❄️</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold font-mono text-white/90">THAWING...</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="flame-stage"
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ scale: [1.2, 0.95, 1], rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 340, damping: 18 }}
                className="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 border-3 border-amber-200 shadow-2xl shadow-orange-500/50 flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ y: [-2, 2, -2], scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                >
                  <Flame className="w-14 h-14 text-white drop-shadow-md fill-white" />
                </motion.div>
                <span className="text-[10px] font-black text-amber-100 uppercase tracking-widest mt-0.5">
                  ON FIRE!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rolling Odometer Counter */}
        <div className="my-3 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Current Streak
            </span>
            <StreakOdometer
              value={odometerValue}
              className="text-4xl font-black font-mono text-amber-600 dark:text-amber-400"
            />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Days
            </span>
          </div>

          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed pt-1">
            Your freeze protected your streak yesterday, and today’s study session thawed the ice.
            Your flame is burning brighter than ever! 🔥
          </p>
        </div>

        {/* Refill Reminder Alert */}
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2 my-4">
          <div className="flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Streak extended! Don't forget to refill your Jelly Freezes in the Treasury.</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          className="w-full btn-3d-success py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Awesome! Keep Going</span>
        </button>
      </motion.div>
    </div>
  );
}
