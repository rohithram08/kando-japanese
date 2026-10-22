// src/components/notifications/SlimeNotificationMascot.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Expressive 2D Vector Slime Mascot for Duolingo-style Notification Cards
// Original Kando Slime design: Translucent Lime Jelly, Kawaii Anime Expression
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function SlimeNotificationMascot({
  mood = 'daily', // 'daily' | 'srs' | 'streak' | 'achievement' | 'level_up' | 'study' | 'general'
  size = 64,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion()

  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        y: [0, -3, 0],
        scaleY: [1, 1.03, 0.98, 1],
        scaleX: [1, 0.98, 1.02, 1],
        transition: {
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        },
      }

  return (
    <motion.div
      animate={floatAnimation}
      className={`inline-flex items-center justify-center select-none relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Kando Slime Mascot: ${mood}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Main Slime Body Gradient: Fresh Lime-Green Jelly */}
          <linearGradient id={`slimeGrad-${mood}`} x1="20" y1="15" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            {mood === 'streak' ? (
              <>
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#a3e635" />
                <stop offset="80%" stopColor="#4d7c0f" />
                <stop offset="100%" stopColor="#365314" />
              </>
            ) : mood === 'achievement' ? (
              <>
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#bef264" />
                <stop offset="85%" stopColor="#65a30d" />
                <stop offset="100%" stopColor="#3f6212" />
              </>
            ) : mood === 'srs' ? (
              <>
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="45%" stopColor="#84cc16" />
                <stop offset="85%" stopColor="#4d7c0f" />
                <stop offset="100%" stopColor="#1f3d18" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#d9f99d" />
                <stop offset="45%" stopColor="#a3e635" />
                <stop offset="85%" stopColor="#65a30d" />
                <stop offset="100%" stopColor="#365314" />
              </>
            )}
          </linearGradient>

          {/* Ambient Base Shadow */}
          <radialGradient id="slimeBase" cx="50" cy="88" r="36" fx="50" fy="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1f3d18" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1f3d18" stopOpacity="0" />
          </radialGradient>

          {/* Jelly Specular Gloss */}
          <linearGradient id="slimeGloss" x1="25" y1="20" x2="75" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Ground Drop Shadow */}
        <ellipse cx="50" cy="90" rx="34" ry="5.5" fill="#000000" fillOpacity="0.25" />

        {/* ── FIRE AURA (Streak Mood) ── */}
        {mood === 'streak' && (
          <g className="slime-fire-aura">
            <path
              d="M 50 14 C 44 2 34 16 38 28 C 42 22 47 24 49 20 C 51 24 57 18 62 26 C 65 14 55 4 50 14 Z"
              fill="#fb923c"
              opacity="0.85"
            />
            <path
              d="M 50 16 C 46 8 39 18 42 26 C 45 22 48 24 50 20 C 52 24 55 20 58 26 C 60 18 53 10 50 16 Z"
              fill="#fef08a"
              opacity="0.9"
            />
          </g>
        )}

        {/* ── CHUBBY JELLY SLIME BODY ── */}
        <path
          d="M 50 26
             C 72 26, 86 38, 88 58
             C 90 74, 82 86, 68 87
             C 56 88, 44 88, 32 87
             C 18 86, 10 74, 12 58
             C 14 38, 28 26, 50 26 Z"
          fill={`url(#slimeGrad-${mood})`}
        />

        {/* Translucent Base Depth */}
        <path
          d="M 16 66 C 24 84, 76 84, 84 66 C 80 84, 66 88, 50 88 C 34 88, 20 84, 16 66 Z"
          fill="url(#slimeBase)"
        />

        {/* Top Gloss Highlight (3D Jelly Look) */}
        <ellipse cx="36" cy="36" rx="14" ry="7" transform="rotate(-22 36 36)" fill="url(#slimeGloss)" />
        <circle cx="27" cy="45" r="3" fill="#ffffff" opacity="0.6" />

        {/* ── CHEEKS (Blushing Anime Glow) ── */}
        <circle cx="25" cy="62" r="5" fill="#f43f5e" opacity="0.3" />
        <circle cx="75" cy="62" r="5" fill="#f43f5e" opacity="0.3" />

        {/* ── EYES ── */}
        {mood === 'achievement' || mood === 'level_up' ? (
          // Happy Joy Eyes (Arc / Smile Eyes ^_^)
          <g stroke="#172e10" strokeWidth="3.5" strokeLinecap="round">
            <path d="M 28 54 Q 35 48 42 54" />
            <path d="M 58 54 Q 65 48 72 54" />
          </g>
        ) : (
          // Big Anime Kawaii Eyes with Sparkle Highlights
          <g>
            {/* Left Eye */}
            <ellipse cx="34" cy="53" rx="5.5" ry="7.5" fill="#14260d" />
            <circle cx="32.5" cy="50" r="2.4" fill="#ffffff" />
            <circle cx="36" cy="56" r="1.2" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="66" cy="53" rx="5.5" ry="7.5" fill="#14260d" />
            <circle cx="64.5" cy="50" r="2.4" fill="#ffffff" />
            <circle cx="68" cy="56" r="1.2" fill="#ffffff" />
          </g>
        )}

        {/* ── MOUTH ── */}
        {mood === 'streak' || mood === 'achievement' || mood === 'level_up' ? (
          // Big Excited Open Mouth :D
          <path
            d="M 43 62 Q 50 72 57 62 Z"
            fill="#881337"
            stroke="#14260d"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ) : (
          // Gentle Cute Smile :)
          <path
            d="M 45 61 Q 50 67 55 61"
            stroke="#14260d"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* ── ACCESSORIES BY MOOD ── */}

        {/* 1. DAILY REMINDER: Cute Alarm Clock ⏰ */}
        {mood === 'daily' && (
          <g transform="translate(68, 54)">
            {/* Clock body */}
            <circle cx="12" cy="12" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            {/* Bells */}
            <ellipse cx="5" cy="3" rx="3" ry="1.8" transform="rotate(-30 5 3)" fill="#eab308" />
            <ellipse cx="19" cy="3" rx="3" ry="1.8" transform="rotate(30 19 3)" fill="#eab308" />
            {/* Legs */}
            <line x1="6" y1="20" x2="4" y2="23" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="18" y1="20" x2="20" y2="23" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" />
            {/* Clock Hands */}
            <line x1="12" y1="12" x2="12" y2="6" stroke="#854d0e" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="12" x2="16" y2="12" stroke="#854d0e" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* 2. SRS REVIEW: Smart Reading Glasses 👓 & Card */}
        {mood === 'srs' && (
          <g>
            {/* Round Glasses */}
            <circle cx="34" cy="53" r="8" fill="none" stroke="#bef264" strokeWidth="1.8" />
            <circle cx="66" cy="53" r="8" fill="none" stroke="#bef264" strokeWidth="1.8" />
            <line x1="42" y1="53" x2="58" y2="53" stroke="#bef264" strokeWidth="1.8" />
            {/* SRS Flashcard in front */}
            <g transform="translate(64, 58) rotate(12)">
              <rect width="18" height="22" rx="2.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
              <line x1="4" y1="6" x2="14" y2="6" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="10" x2="12" y2="10" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
              <circle cx="9" cy="15" r="2" fill="#84cc16" />
            </g>
          </g>
        )}

        {/* 3. ACHIEVEMENT: Golden Crown 👑 */}
        {mood === 'achievement' && (
          <g transform="translate(35, 8)">
            <path
              d="M 0 15 L 6 3 L 15 10 L 24 3 L 30 15 Z"
              fill="#facc15"
              stroke="#ca8a04"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="6" cy="3" r="1.5" fill="#ef4444" />
            <circle cx="15" cy="10" r="1.5" fill="#3b82f6" />
            <circle cx="24" cy="3" r="1.5" fill="#10b981" />
          </g>
        )}

        {/* 4. LEVEL UP: Sparkle Star ⭐ */}
        {mood === 'level_up' && (
          <g transform="translate(68, 12)">
            <path
              d="M 10 0 L 12.5 6.5 L 19 8 L 14 12.5 L 15.5 19 L 10 15.5 L 4.5 19 L 6 12.5 L 1 8 L 7.5 6.5 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1"
            />
          </g>
        )}

        {/* 5. STUDY: Pencil ✏️ */}
        {mood === 'study' && (
          <g transform="translate(68, 52) rotate(-35)">
            <rect x="0" y="0" width="6" height="20" rx="1" fill="#f59e0b" />
            <polygon points="0,20 6,20 3,25" fill="#fbbf24" />
            <polygon points="2,23 4,23 3,25" fill="#1e293b" />
          </g>
        )}

        {/* 6. GENERAL / WAVING: Cute little slime hand waving 👋 */}
        {(mood === 'general' || mood === 'daily') && (
          <g transform="translate(76, 52)">
            <ellipse cx="6" cy="4" rx="5" ry="4" transform="rotate(-25 6 4)" fill={`url(#slimeGrad-${mood})`} />
            <circle cx="8" cy="2" r="1.5" fill="#ffffff" opacity="0.6" />
          </g>
        )}
      </svg>
    </motion.div>
  )
}
