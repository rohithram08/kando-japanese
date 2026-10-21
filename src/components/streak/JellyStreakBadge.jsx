// src/components/streak/JellyStreakBadge.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Interactive Jelly Streak Pill Badge for Navbar & Sidebar
// Replaces Fire Flame with 2D Cute Slime Mascot & Freeze Indicator
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import JellyStreakSlime from '../mascot/JellyStreakSlime';

export default function JellyStreakBadge({
  streak = 0,
  isFrozen = false,
  size = 'md', // 'sm' | 'md'
  variant = 'default', // 'default' | 'glass'
  className = '',
  onClick,
}) {
  const hasStreak = streak > 0;
  const slimeMood = isFrozen ? 'frozen' : hasStreak ? 'active' : 'sleepy';
  const isGlass = variant === 'glass';

  const containerClasses = isGlass
    ? 'bg-white/20 backdrop-blur-md border border-white/25 text-white shadow-xs'
    : isFrozen
    ? 'bg-sky-500/15 border-sky-400/40 text-sky-600 dark:text-sky-300'
    : hasStreak
    ? 'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-500/25 dark:border-cyan-400/30 text-cyan-600 dark:text-cyan-300'
    : 'bg-muted/80 border-border text-muted-foreground';

  const numberClasses = isGlass
    ? 'font-extrabold text-sm font-mono leading-none text-white'
    : isFrozen
    ? 'font-extrabold text-sm font-mono leading-none text-sky-700 dark:text-sky-200'
    : hasStreak
    ? 'font-extrabold text-sm font-mono leading-none text-cyan-900 dark:text-cyan-100'
    : 'font-extrabold text-sm font-mono leading-none text-muted-foreground';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      title={
        isFrozen
          ? `Jelly Streak: ${streak} days (Protected by Jelly Freeze ❄️)`
          : hasStreak
          ? `Jelly Streak: ${streak} days active! Keep reading daily!`
          : 'Start your Jelly Streak today with a Story Lesson!'
      }
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-pointer border transition-all shadow-xs ${containerClasses} ${className}`}
    >
      {/* 2D Jelly Slime Mascot */}
      <JellyStreakSlime
        size={size === 'sm' ? 'xs' : 'sm'}
        mood={slimeMood}
        animated={hasStreak || isFrozen}
      />

      {/* Streak Count */}
      <span className={numberClasses}>
        {streak}
      </span>

      {/* Freeze indicator badge if active */}
      {isFrozen && (
        <span className="text-xs" title="Jelly Freeze Shield Active">
          ❄️
        </span>
      )}
    </motion.div>
  );
}
