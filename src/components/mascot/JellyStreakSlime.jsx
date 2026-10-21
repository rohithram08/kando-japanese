// src/components/mascot/JellyStreakSlime.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 2D Anime Jelly Slime Mascot for Jelly Streak & Milestones
// 100% Slime Concept replacing Fire 🔥 with cute translucent Jelly animations
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';

export default function JellyStreakSlime({
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg'
  mood = 'active', // 'active' | 'celebrating' | 'frozen' | 'sleepy'
  animated = true,
  className = '',
}) {
  const pixelSize = {
    xs: 20,
    sm: 28,
    md: 48,
    lg: 84,
  }[size] || 48;

  // Animation variants based on mood
  const squishVariants = {
    active: {
      scaleY: [1, 0.94, 1.04, 1],
      scaleX: [1, 1.05, 0.96, 1],
      y: [0, 2, -3, 0],
      transition: {
        repeat: Infinity,
        duration: 2.8,
        ease: 'easeInOut',
      },
    },
    celebrating: {
      y: [0, -10, 0],
      scaleY: [1, 1.15, 0.92, 1],
      scaleX: [1, 0.9, 1.08, 1],
      rotate: [-3, 4, -2, 0],
      transition: {
        repeat: Infinity,
        duration: 1.4,
        ease: 'easeInOut',
      },
    },
    frozen: {
      scale: [1, 1.01, 1],
      y: [0, -1, 0],
      transition: {
        repeat: Infinity,
        duration: 4,
        ease: 'easeInOut',
      },
    },
    sleepy: {
      scaleY: [1, 0.92, 1],
      scaleX: [1, 1.04, 1],
      transition: {
        repeat: Infinity,
        duration: 3.5,
        ease: 'easeInOut',
      },
    },
  };

  const isFrozen = mood === 'frozen';
  const isSleepy = mood === 'sleepy';
  const isCelebrating = mood === 'celebrating';

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        animate={animated ? squishVariants[mood] || squishVariants.active : false}
      >
        <defs>
          {/* Main translucent jelly gradient */}
          <radialGradient id="jellyBodyGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={isFrozen ? '#a5f3fc' : '#67e8f9'} />
            <stop offset="45%" stopColor={isFrozen ? '#38bdf8' : '#06b6d4'} />
            <stop offset="85%" stopColor={isFrozen ? '#0284c7' : '#0891b2'} />
            <stop offset="100%" stopColor={isFrozen ? '#0369a1' : '#0e7490'} />
          </radialGradient>

          {/* Liquid inner glow */}
          <linearGradient id="jellyInnerShine" x1="20%" y1="10%" x2="70%" y2="90%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>

          {/* Frozen Ice Shard Gradient */}
          <linearGradient id="iceShardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id="jellyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation={isFrozen ? '4' : '3'}
              floodColor={isFrozen ? '#0284c7' : '#06b6d4'}
              floodOpacity={isFrozen ? '0.6' : '0.45'}
            />
          </filter>
        </defs>

        {/* Ambient Ground Jelly Shadow */}
        <ellipse
          cx="50"
          cy="88"
          rx="32"
          ry="7"
          fill={isFrozen ? '#0284c7' : '#0891b2'}
          opacity="0.25"
        />

        {/* ── Main Jelly Slime Body ── */}
        <path
          d="M 50,15 
             C 72,15 88,32 88,56 
             C 88,76 74,86 50,86 
             C 26,86 12,76 12,56 
             C 12,32 28,15 50,15 Z"
          fill="url(#jellyBodyGrad)"
          filter="url(#jellyGlow)"
        />

        {/* Translucent Bottom Ambient Ring */}
        <ellipse
          cx="50"
          cy="80"
          rx="26"
          ry="5"
          fill="#ffffff"
          opacity="0.2"
        />

        {/* Top-Left Specular Liquid Reflection */}
        <ellipse
          cx="36"
          cy="32"
          rx="12"
          ry="7"
          transform="rotate(-25 36 32)"
          fill="url(#jellyInnerShine)"
        />

        <circle
          cx="28"
          cy="42"
          r="3"
          fill="#ffffff"
          opacity="0.65"
        />

        {/* ── Eyes & Expression ── */}
        {isSleepy ? (
          // Sleepy cute curved closed eyes
          <g stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 33,52 Q 38,48 43,52" />
            <path d="M 57,52 Q 62,48 67,52" />
          </g>
        ) : (
          // Sparkling anime eyes
          <g>
            {/* Left eye */}
            <circle cx="38" cy="50" r="5.5" fill="#0f172a" />
            <circle cx="36" cy="48" r="2.2" fill="#ffffff" />
            <circle cx="40" cy="52" r="1.1" fill="#ffffff" />

            {/* Right eye */}
            <circle cx="62" cy="50" r="5.5" fill="#0f172a" />
            <circle cx="60" cy="48" r="2.2" fill="#ffffff" />
            <circle cx="64" cy="52" r="1.1" fill="#ffffff" />
          </g>
        )}

        {/* Anime Rosy Cheeks */}
        <ellipse cx="28" cy="56" rx="4.5" ry="2.5" fill="#f43f5e" opacity={isFrozen ? '0.3' : '0.6'} />
        <ellipse cx="72" cy="56" rx="4.5" ry="2.5" fill="#f43f5e" opacity={isFrozen ? '0.3' : '0.6'} />

        {/* Happy Anime Mouth */}
        {!isSleepy && (
          <path
            d={isCelebrating ? 'M 46,55 Q 50,62 54,55 Z' : 'M 47,56 Q 50,60 53,56'}
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            fill={isCelebrating ? '#f43f5e' : 'none'}
          />
        )}

        {/* ── Celebrating Floating Elements ── */}
        {isCelebrating && (
          <g>
            <motion.path
              d="M 22,25 L 24,18 L 30,22 L 24,25 Z"
              fill="#fbbf24"
              animate={{ y: [-2, -8, -2], rotate: [0, 30, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            <motion.path
              d="M 75,20 L 78,14 L 84,18 L 78,21 Z"
              fill="#fbbf24"
              animate={{ y: [-1, -7, -1], rotate: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
            />
          </g>
        )}

        {/* ── Streak Freeze Frozen Ice Shell Overlay ── */}
        {isFrozen && (
          <g>
            {/* Ice crystal frame overlay */}
            <polygon
              points="14,35 28,12 72,12 86,35 84,75 50,92 16,75"
              fill="url(#iceShardGrad)"
              stroke="#e0f2fe"
              strokeWidth="2.5"
              strokeLinejoin="round"
              opacity="0.65"
            />
            {/* Frost crystal shards */}
            <line x1="28" y1="12" x2="45" y2="40" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            <line x1="72" y1="12" x2="55" y2="40" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            <line x1="50" y1="92" x2="50" y2="65" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            {/* Cute mini snowflake */}
            <text x="68" y="32" fontSize="14" fill="#ffffff" opacity="0.9">❄️</text>
          </g>
        )}
      </motion.svg>
    </div>
  );
}
