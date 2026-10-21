// src/components/common/WaveXPBadge.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Wave XP Badge with Interactive 2D Liquid Wave Animation
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 2D Animated Liquid Wave Icon
 * Renders two oscillating sine wave paths simulating flowing liquid / water wave
 */
export function AnimatedLiquidWaveIcon({ size = 20, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-cyan-500/15 dark:bg-cyan-400/20 shadow-xs ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full absolute inset-0"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Background slower wave */}
        <motion.path
          d="M 0,55 C 25,45 40,65 65,55 C 90,45 110,65 135,55 C 160,45 175,65 200,55 L 200,100 L 0,100 Z"
          fill="url(#waveGradient2)"
          animate={{ x: [-100, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
          }}
        />

        {/* Foreground rhythmic liquid wave */}
        <motion.path
          d="M 0,60 C 25,50 50,70 75,60 C 100,50 125,70 150,60 C 175,50 200,70 225,60 L 225,100 L 0,100 Z"
          fill="url(#waveGradient1)"
          animate={{ x: [-100, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
          }}
        />

        {/* Floating liquid crest bubbles */}
        <motion.circle
          cx="35"
          cy="48"
          r="3"
          fill="#ffffff"
          opacity="0.8"
          animate={{ y: [0, -4, 0], opacity: [0.8, 0.3, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="68"
          cy="52"
          r="2"
          fill="#ffffff"
          opacity="0.7"
          animate={{ y: [0, -3, 0], opacity: [0.7, 0.2, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.5 }}
        />
      </svg>

      {/* Surface shine ring */}
      <div className="absolute inset-0 rounded-full border border-cyan-400/40 pointer-events-none" />
    </div>
  );
}

/**
 * WaveXPBadge Component
 * Shows the animated liquid wave on the side, accompanied by the XP count and label.
 */
export default function WaveXPBadge({
  xp = 0,
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'default', // 'default' | 'glass'
  showLabel = true,
  className = '',
  onClick,
}) {
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs sm:text-sm gap-2',
    lg: 'px-4 py-2 text-sm sm:text-base gap-2.5',
  }[size] || 'px-3 py-1.5 text-sm gap-2';

  const formattedXP = typeof xp === 'number' ? xp.toLocaleString() : xp;
  const isGlass = variant === 'glass';

  const containerClasses = isGlass
    ? 'bg-white/20 backdrop-blur-md border border-white/25 text-white shadow-xs'
    : 'bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/25 dark:border-cyan-400/30 text-cyan-700 dark:text-cyan-300 shadow-xs';

  const numberClasses = isGlass
    ? 'font-extrabold tracking-tight text-white font-mono'
    : 'font-extrabold tracking-tight text-cyan-900 dark:text-cyan-100 font-mono';

  const labelClasses = isGlass
    ? 'font-bold text-[10px] sm:text-xs text-white/90 uppercase tracking-wider'
    : 'font-bold text-[10px] sm:text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-wider';

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title={`Wave XP: ${formattedXP}`}
      className={`inline-flex items-center rounded-full cursor-default transition-all ${containerClasses} ${sizeClasses} ${className}`}
    >
      {/* 2D Liquid Wave Animation on the side */}
      <AnimatedLiquidWaveIcon size={iconSize} className={isGlass ? 'ring-1 ring-white/30' : ''} />

      {/* XP Counter and Label */}
      <div className="flex items-baseline gap-1">
        <span className={numberClasses}>
          {formattedXP}
        </span>
        {showLabel && (
          <span className={labelClasses}>
            Wave XP
          </span>
        )}
      </div>
    </motion.div>
  );
}
