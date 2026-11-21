// src/components/celebration/StreakFreezeSavedModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Duolingo-Grade Streak Freeze Saved Modal
// Shown when midnight resolution automatically consumes a freeze to protect
// a missed day and preserve the student's streak unbroken!
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, ShieldCheck, ArrowRight } from 'lucide-react';
import { playFanfare } from '../../utils/soundEffects';

export default function StreakFreezeSavedModal({
  streak = 1,
  savedDate = '',
  remainingFreezes = 1,
  onDismiss,
}) {
  useEffect(() => {
    try {
      playFanfare();
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="relative w-full max-w-md rounded-3xl bg-surface border-2 border-sky-400/50 shadow-2xl p-6 text-center overflow-hidden"
      >
        {/* Ice & Frost Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-sky-400/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl" />

          {/* Floating Snowflakes */}
          <span className="absolute top-6 left-8 text-xl animate-bounce" style={{ animationDuration: '3.2s' }}>❄️</span>
          <span className="absolute top-10 right-10 text-base animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.6s' }}>❄️</span>
          <span className="absolute bottom-16 left-10 text-sm animate-bounce" style={{ animationDuration: '3.6s', animationDelay: '1.2s' }}>❄️</span>
        </div>

        {/* Top Shield Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-400/30 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
          <span>STREAK FREEZE ACTIVATED! 連続記録保護</span>
        </div>

        {/* Ice Crystal & Slime Visual Arena */}
        <div className="relative h-40 w-full flex items-center justify-center my-2">
          {/* Outer Frost Rings */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.8 }}
            className="absolute w-32 h-32 rounded-full border-2 border-sky-400/40 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 3.4, delay: 0.4 }}
            className="absolute w-40 h-40 rounded-full border border-dashed border-sky-300/30 pointer-events-none"
          />

          {/* Frozen Slime Encased in Crystalline Ice Cube */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
            className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-200/90 via-sky-300/80 to-cyan-400/80 dark:from-sky-900/80 dark:via-sky-800/80 dark:to-cyan-700/80 border-2 border-white/70 shadow-lg shadow-sky-400/30 flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-4xl select-none">❄️</span>
            <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              {streak} Days Safe
            </div>
          </motion.div>
        </div>

        {/* Headline & Explanation */}
        <div className="space-y-1.5 my-3">
          <h2 className="text-xl font-black text-foreground">
            Your Streak Was Saved!
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You didn't study yesterday{savedDate ? ` (${savedDate})` : ''}, but your equipped
            <strong className="text-sky-600 dark:text-sky-300"> Jelly Freeze </strong>
            shielded your <strong className="text-foreground">{streak}-day streak</strong> from breaking.
          </p>
        </div>

        {/* Freeze Inventory Indicator */}
        <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 flex items-center justify-between gap-3 text-xs my-4">
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-sky-500" />
            <span className="font-semibold text-sky-900 dark:text-sky-200">
              Remaining Freezes:
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-sky-600 dark:text-sky-400">
            <span>{remainingFreezes}</span>
            <span className="text-muted-foreground">/ 2 equipped</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          className="w-full btn-3d-success py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue & Practice Today</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
