// src/components/celebration/StreakClaimCelebrationModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 2D Jelly Streak Claim Celebration Modal
// Slime takes an energetic step forward onto the next Japanese garden stone!
// Features stone garden steps, landing ripples, lantern glow, and sakura drift.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { playPop } from '../../utils/soundEffects';

export default function StreakClaimCelebrationModal({
  oldStreak = 0,
  newStreak = 1,
  onDismiss,
}) {
  const [hasStepped, setHasStepped] = useState(false);

  useEffect(() => {
    try {
      playPop();
    } catch {}

    // Slime leaps forward after initial charge-up (400ms)
    const stepTimer = setTimeout(() => {
      setHasStepped(true);
    }, 450);

    return () => clearTimeout(stepTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
        className="relative w-full max-w-md rounded-3xl bg-surface border-2 border-cyan-400/40 shadow-2xl p-6 text-center overflow-hidden"
      >
        {/* Ambient Cyan Water Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />

          {/* Drifting Cherry Blossom Petals */}
          <span className="absolute top-8 left-6 text-lg animate-bounce" style={{ animationDuration: '3s' }}>🌸</span>
          <span className="absolute top-12 right-8 text-base animate-bounce" style={{ animationDuration: '3.6s', animationDelay: '0.5s' }}>🌸</span>
          <span className="absolute bottom-16 left-8 text-sm animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🌸</span>
        </div>

        {/* Top Streak Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-400/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>JELLY STREAK EXTENDED! 毎日の一歩</span>
        </div>

        {/* ── Stepping Forward Interactive Arena (Stones + Slime Leap) ── */}
        <div className="relative h-44 w-full flex items-center justify-center overflow-hidden my-3">
          {/* Stepping Stones Pathway */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between px-4">
            {/* Step 1: Yesterday's Stone */}
            <div className="relative flex flex-col items-center">
              <span className="text-[10px] font-bold text-muted-foreground mb-1">
                Day {oldStreak}
              </span>
              <div className="w-20 h-7 rounded-full bg-slate-300 dark:bg-slate-700 border border-slate-400/60 shadow-inner flex items-center justify-center">
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">PASSED</span>
              </div>
            </div>

            {/* Stepping Arrow / Bridge */}
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-cyan-500 font-bold text-sm select-none"
            >
              ➔➔➔
            </motion.div>

            {/* Step 2: Today's Glowing Goal Stone (Stepped onto!) */}
            <div className="relative flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-wider mb-1 transition-colors ${
                hasStepped ? 'text-cyan-600 dark:text-cyan-300' : 'text-muted-foreground'
              }`}>
                Day {newStreak} 💧
              </span>
              <motion.div
                animate={
                  hasStepped
                    ? {
                        scale: [1, 1.08, 1],
                        borderColor: ['#38bdf8', '#0ea5e9', '#38bdf8'],
                      }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-24 h-8 rounded-full flex items-center justify-center transition-all ${
                  hasStepped
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-400/40 border-2 border-cyan-300'
                    : 'bg-muted/60 border border-dashed border-cyan-400/50'
                }`}
              >
                {hasStepped ? (
                  <span className="text-[10px] font-extrabold tracking-wider">ACTIVE! 🎉</span>
                ) : (
                  <span className="text-[9px] font-semibold text-muted-foreground">TODAY</span>
                )}
              </motion.div>

              {/* Water Shockwave Ripple upon landing */}
              {hasStepped && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute bottom-0 w-24 h-8 rounded-full border-2 border-cyan-400 pointer-events-none"
                />
              )}
            </div>
          </div>

          {/* 2D Vector Slime Leaping from Stone 1 to Stone 2 */}
          <motion.div
            initial={{ x: -100, y: 15, scaleX: 1.1, scaleY: 0.9 }}
            animate={
              hasStepped
                ? {
                    x: 95,
                    y: 12,
                    scaleX: [0.85, 1.2, 1],
                    scaleY: [1.2, 0.85, 1],
                  }
                : {
                    x: -100,
                    y: [15, 8, 15],
                    scaleX: [1.1, 1.25, 1.1],
                    scaleY: [0.9, 0.8, 0.9],
                  }
            }
            transition={
              hasStepped
                ? {
                    x: { type: 'spring', damping: 14, stiffness: 220 },
                    y: { type: 'spring', damping: 14, stiffness: 220 },
                  }
                : { repeat: Infinity, duration: 0.8 }
            }
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20 drop-shadow-xl overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="streakSlimeGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="40%" stopColor="#0ea5e9" />
                  <stop offset="85%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>

              {/* Slime Body */}
              <path
                d="M 50 30
                   C 68 30, 84 42, 87 60
                   C 89 74, 82 85, 68 87
                   C 58 88.5, 42 88.5, 32 87
                   C 18 85, 11 74, 13 60
                   C 16 42, 32 30, 50 30 Z"
                fill="url(#streakSlimeGrad)"
              />

              {/* Shine */}
              <ellipse cx="34" cy="39" rx="8" ry="3.5" transform="rotate(-28 34 39)" fill="#ffffff" fillOpacity="0.8" />

              {/* Happy Landing Expression */}
              {hasStepped ? (
                <>
                  {/* Happy Waving Face */}
                  <path d="M 38 64 Q 44 58 50 64" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 58 64 Q 64 58 70 64" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 46 72 Q 54 80 62 72" fill="#f43f5e" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
                  <ellipse cx="32" cy="70" rx="4.5" ry="2.5" fill="#f43f5e" fillOpacity="0.6" />
                  <ellipse cx="76" cy="70" rx="4.5" ry="2.5" fill="#f43f5e" fillOpacity="0.6" />

                  {/* Waving Hand on Top Right */}
                  <g className="animate-bounce" style={{ animationDuration: '0.8s' }}>
                    <path d="M 78 54 C 84 44, 92 38, 88 32 C 84 28, 80 34, 76 42" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <circle cx="86" cy="32" r="2" fill="#ffffff" />
                  </g>
                </>
              ) : (
                <>
                  {/* Determined Charging Face */}
                  <circle cx="44" cy="64" r="3.5" fill="#1e3a8a" />
                  <circle cx="64" cy="64" r="3.5" fill="#1e3a8a" />
                  <ellipse cx="54" cy="73" rx="4" ry="2" fill="#1e3a8a" />
                </>
              )}
            </svg>
          </motion.div>
        </div>

        {/* Motivational Callout */}
        <div className="p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-400/30 mb-4">
          <p className="text-sm font-bold text-cyan-800 dark:text-cyan-200">
            {hasStepped ? `Day ${newStreak} Streak Reached!` : 'Stepping forward...'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            You took a big step forward on your Japanese journey today. Consistency is your greatest superpower!
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-md shadow-cyan-500/25 transition-all transform active:scale-95"
        >
          Keep the Momentum Going! (次へ)
        </button>
      </motion.div>
    </div>
  );
}
