// src/components/celebration/LevelUpCelebrationModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 2D Level Up Celebration Modal — Subway Surfers Sprint-in High-Score Style!
// Kando Slime runs in at high speed from offscreen with speed streaks,
// slides to a halt with dust puffs, leaps up triumphantly with crown & confetti!
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Zap } from 'lucide-react';
import { playFanfare } from '../../utils/soundEffects';

export default function LevelUpCelebrationModal({
  oldLevel = 1,
  newLevel = 2,
  onDismiss,
}) {
  const [animationStage, setAnimationStage] = useState('running'); // 'running' -> 'skidding' -> 'celebrating'

  useEffect(() => {
    try {
      playFanfare();
    } catch {}

    const skidTimer = setTimeout(() => setAnimationStage('skidding'), 450);
    const celebrateTimer = setTimeout(() => setAnimationStage('celebrating'), 750);

    return () => {
      clearTimeout(skidTimer);
      clearTimeout(celebrateTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-md rounded-3xl bg-surface border-3 border-amber-400/50 shadow-2xl p-6 text-center overflow-hidden"
      >
        {/* Background Radiant Sunburst & Confetti Shimmer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-52 h-52 bg-amber-400/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-cyan-400/25 rounded-full blur-3xl animate-pulse" />

          {/* Floating Confetti / Firework Sparks */}
          {animationStage === 'celebrating' && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <span className="absolute top-6 left-8 text-2xl animate-bounce">🎉</span>
              <span className="absolute top-10 right-10 text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
              <span className="absolute bottom-16 left-6 text-xl animate-bounce" style={{ animationDelay: '0.4s' }}>🌸</span>
              <span className="absolute bottom-12 right-8 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</span>
              <span className="absolute top-1/2 left-4 text-lg animate-pulse">🎊</span>
              <span className="absolute top-1/2 right-4 text-lg animate-pulse">💫</span>
            </div>
          )}
        </div>

        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-lg mb-2">
          <Crown className="w-4 h-4 fill-amber-950" />
          <span>LEVEL UP! レベルアップ！</span>
        </div>

        {/* ── Subway Surfers Sprint-in Character Arena ── */}
        <div className="relative h-48 w-full flex items-center justify-center overflow-hidden my-2">
          {/* Track Ground Line */}
          <div className="absolute bottom-6 left-4 right-4 h-1.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-full" />

          {/* Speed Streaks while running in */}
          {animationStage === 'running' && (
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: [0, 1, 0], x: [0, 80] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none"
            >
              <div className="w-16 h-1 bg-cyan-300 rounded-full blur-[0.5px]" />
              <div className="w-24 h-1 bg-white rounded-full blur-[0.5px]" />
              <div className="w-12 h-1 bg-sky-300 rounded-full blur-[0.5px]" />
            </motion.div>
          )}

          {/* Skid Dust Puff upon halting */}
          {animationStage === 'skidding' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none"
            >
              <div className="w-8 h-8 rounded-full bg-slate-300/60 blur-xs" />
              <div className="w-10 h-10 rounded-full bg-slate-400/50 blur-xs" />
              <div className="w-6 h-6 rounded-full bg-slate-300/60 blur-xs" />
            </motion.div>
          )}

          {/* 2D Slime Runner Rig */}
          <motion.div
            initial={{ x: -280, scaleX: 1.25, scaleY: 0.85, rotate: -15 }}
            animate={
              animationStage === 'running'
                ? { x: -60, scaleX: 1.2, scaleY: 0.85, rotate: -10 }
                : animationStage === 'skidding'
                ? { x: 0, scaleX: 1.3, scaleY: 0.75, rotate: 12 }
                : { x: 0, y: [0, -42, 0], scaleX: [1, 0.9, 1.1, 1], scaleY: [1, 1.2, 0.9, 1], rotate: [0, -5, 5, 0] }
            }
            transition={
              animationStage === 'celebrating'
                ? { y: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }, rotate: { repeat: Infinity, duration: 1.2 } }
                : { duration: 0.45, ease: 'easeOut' }
            }
            className="relative flex items-center justify-center"
          >
            {/* Golden Crown Dropping onto Head */}
            {animationStage === 'celebrating' && (
              <motion.div
                initial={{ y: -60, opacity: 0, scale: 0.5 }}
                animate={{ y: -68, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 260, delay: 0.1 }}
                className="absolute z-20 pointer-events-none"
              >
                <div className="relative">
                  <Crown className="w-10 h-10 text-amber-400 fill-amber-400 drop-shadow-md" />
                  <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-spin" />
                </div>
              </motion.div>
            )}

            {/* 2D Vector Slime SVG in Full Hero Victory Rig */}
            <svg
              viewBox="0 0 100 100"
              className="w-32 h-32 drop-shadow-2xl overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="levelUpSlimeBody" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="40%" stopColor="#0ea5e9" />
                  <stop offset="85%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <radialGradient id="levelUpSlimeBase" cx="50" cy="85" r="38" fx="50" fy="88" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Slime Mochi Body */}
              <path
                d="M 50 30
                   C 68 30, 84 42, 87 60
                   C 89 74, 82 85, 68 87
                   C 58 88.5, 42 88.5, 32 87
                   C 18 85, 11 74, 13 60
                   C 16 42, 32 30, 50 30 Z"
                fill="url(#levelUpSlimeBody)"
              />
              <path
                d="M 20 72
                   C 32 84, 68 84, 80 72
                   C 86 81, 74 88, 50 88
                   C 26 88, 14 81, 20 72 Z"
                fill="url(#levelUpSlimeBase)"
              />

              {/* Gloss shine */}
              <ellipse cx="34" cy="39" rx="8.5" ry="3.5" transform="rotate(-28 34 39)" fill="#ffffff" fillOpacity="0.8" />
              <circle cx="23" cy="47" r="2.2" fill="#ffffff" fillOpacity="0.75" />

              {/* Subway Surfers Victory Expression: Big Laughing Eyes & Grin */}
              <path d="M 36 62 Q 42 56 48 62" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 56 62 Q 62 56 68 62" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 43 70 Q 52 82 61 70" fill="#f43f5e" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="28" cy="68" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.6" />
              <ellipse cx="74" cy="68" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.6" />

              {/* Both Hands Raised in Victory High-Five */}
              <path d="M 24 58 C 16 44, 26 36, 32 44" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 76 58 C 84 44, 74 36, 68 44" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>
        </div>

        {/* Level Transition Pill */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="px-4 py-2 rounded-2xl bg-muted border border-border text-center">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Previous</span>
            <span className="text-xl font-black text-muted-foreground font-mono">Lv.{oldLevel}</span>
          </div>

          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg shadow-md"
          >
            ➜
          </motion.div>

          <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-center shadow-lg border-2 border-amber-300">
            <span className="text-[10px] uppercase tracking-wider block opacity-80">New Level</span>
            <span className="text-2xl font-black font-mono">Lv.{newLevel}</span>
          </div>
        </div>

        {/* Mascot Congratulatory Message */}
        <p className="text-xs font-semibold text-muted-foreground max-w-xs mx-auto mb-5">
          「信じられない！新記録達成！君の日本語の冒険がさらにパワーアップしたよ！」
        </p>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          className="w-full py-3 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider text-amber-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-400/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 fill-amber-950" />
          <span>Keep Moving Forward! (進む)</span>
        </button>
      </motion.div>
    </div>
  );
}
