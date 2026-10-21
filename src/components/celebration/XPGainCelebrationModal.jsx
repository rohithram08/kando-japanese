// src/components/celebration/XPGainCelebrationModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 2D Wave XP Gain Celebration Modal
// Features 6 random Slime Cheering types, animated liquid wave count,
// and encouraging Japanese mascot voice prompts.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlimeCheerRig, { CHEER_META } from './SlimeCheerRig';
import { AnimatedLiquidWaveIcon } from '../common/WaveXPBadge';
import { Sparkles, X } from 'lucide-react';
import { playPop } from '../../utils/soundEffects';

export default function XPGainCelebrationModal({
  amount = 50,
  currentXP = 0,
  cheerType = 'confetti_cannon',
  reason = 'Activity Completed',
  onDismiss,
}) {
  const meta = CHEER_META[cheerType] || CHEER_META.confetti_cannon;

  useEffect(() => {
    try {
      playPop();
    } catch {}
    // Auto-dismiss after 4 seconds if not closed
    const timer = setTimeout(() => {
      onDismiss?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="relative w-full max-w-sm rounded-3xl bg-surface border-2 border-cyan-400/40 shadow-2xl p-6 text-center overflow-hidden"
      >
        {/* Background Ambient Radial Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cheering Badge Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-400/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{meta.badge}</span>
        </div>

        {/* 2D Slime Cheering Rig (1 of 6 variants) */}
        <div className="flex justify-center my-2">
          <SlimeCheerRig cheerType={cheerType} size={170} />
        </div>

        {/* Japanese Mascot Speech Bubble */}
        <div className="mb-4">
          <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">
            {meta.japanese}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {meta.english}
          </p>
        </div>

        {/* Animated XP Gain Callout */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-500/15 to-blue-500/10 border border-cyan-400/30 mb-4 flex items-center justify-center gap-3">
          <AnimatedLiquidWaveIcon size={28} />
          <div className="text-left">
            <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-300 leading-none">
              +{amount} Wave XP
            </div>
            {currentXP > 0 && (
              <span className="text-[10px] text-muted-foreground font-semibold">
                Total: {currentXP.toLocaleString()} Wave XP
              </span>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onDismiss}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-md shadow-cyan-500/25 transition-all transform active:scale-95"
        >
          Great! (次へ)
        </button>
      </motion.div>
    </div>
  );
}
