// src/components/celebration/SlimeCheerRig.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 2D Vector Animated Slime Cheering Rig
// 6 Distinct Cheering Variants for Wave XP Gains:
//  1. confetti_cannon  - Party popper cannon with exploding streamers
//  2. pompom_cheer     - Victory headband (必勝) + shaking golden pompoms
//  3. sparkle_twirl    - Twirling star dancer with orbiting sparkles
//  4. wave_bubble      - Wave XP liquid bubble blower
//  5. golden_trophy    - Champion hoisting a shining golden trophy cup
//  6. onigiri_feast    - Onigiri munching bliss with heart cheeks
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';

export const CHEER_META = {
  confetti_cannon: {
    title: 'Party Popper Cheer!',
    japanese: '「やったー！大成功！」',
    romaji: 'Yattaa! Dai seikou!',
    english: 'Hooray! Big success!',
    badge: '🎉 Confetti Blast',
  },
  pompom_cheer: {
    title: 'Pompom Spirit Cheer!',
    japanese: '「ファイト！その調子！」',
    romaji: 'Faito! Sono choushi!',
    english: 'Fight on! Keep up that great energy!',
    badge: '📣 Cheer Squad',
  },
  sparkle_twirl: {
    title: 'Twinkling Star Dancer!',
    japanese: '「素晴らしい！きらめく成長！」',
    romaji: 'Subarashii! Kirameku seichou!',
    english: 'Wonderful! You are shining brightly!',
    badge: '⭐ Star Twirl',
  },
  wave_bubble: {
    title: 'Wave Bubble Power!',
    japanese: '「ウェーブパワー全開！」',
    romaji: 'Weebu pawaa zenkai!',
    english: 'Wave power at maximum surge!',
    badge: '🫧 Bubble Burst',
  },
  golden_trophy: {
    title: 'Champion Trophy Hoist!',
    japanese: '「お見事！さすがマスター！」',
    romaji: 'Omigoto! Sasuga masutaa!',
    english: 'Brilliant! Truly a Nihongo Master!',
    badge: '🏆 Champion Hoist',
  },
  onigiri_feast: {
    title: 'Delicious Energy Recharge!',
    japanese: '「おいしい！エネルギー満タン！」',
    romaji: 'Oishii! Enerugii mantan!',
    english: 'Delicious onigiri! Fully recharged!',
    badge: '🍙 Onigiri Feast',
  },
};

export default function SlimeCheerRig({
  cheerType = 'confetti_cannon',
  size = 180,
  className = '',
}) {
  const s = size;

  return (
    <div
      style={{ width: s, height: s }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Jelly Slime Body Gradient */}
          <linearGradient id="cheerSlimeGrad" x1="25" y1="20" x2="95" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#0ea5e9" />
            <stop offset="85%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Liquid Base Depth */}
          <radialGradient id="cheerSlimeBase" cx="60" cy="95" r="42" fx="60" fy="98" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>

          {/* Gloss Specular Shine */}
          <linearGradient id="cheerSlimeGlint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>

          {/* Gold Gradient for Trophy & Pompoms */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Floor Shadow with Breathing Pulse */}
        <motion.ellipse
          cx="60"
          cy="106"
          rx="42"
          ry="6"
          fill="#0f172a"
          fillOpacity="0.25"
          animate={{
            rx: [42, 46, 42],
            fillOpacity: [0.25, 0.18, 0.25],
          }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        />

        {/* ── Main Slime Group with Dynamic Cheering Bounces ── */}
        <motion.g
          animate={
            cheerType === 'sparkle_twirl'
              ? { y: [0, -14, 0], rotate: [0, 8, -8, 0] }
              : cheerType === 'pompom_cheer'
              ? { y: [0, -10, 0], scaleY: [1, 1.06, 0.96, 1] }
              : cheerType === 'confetti_cannon'
              ? { y: [0, -16, 0], scale: [1, 1.08, 0.95, 1] }
              : cheerType === 'golden_trophy'
              ? { y: [0, -8, 0], scaleY: [1, 1.04, 1] }
              : cheerType === 'onigiri_feast'
              ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
              : { y: [0, -12, 0] }
          }
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          {/* Chubby Dome Slime Body */}
          <path
            d="M 60 36
               C 82 36, 100 48, 103 70
               C 105 86, 96 98, 80 101
               C 68 103, 52 103, 40 101
               C 24 98, 15 86, 17 70
               C 20 48, 38 36, 60 36 Z"
            fill="url(#cheerSlimeGrad)"
          />

          {/* Slime Ambient Base Depth */}
          <path
            d="M 26 84
               C 40 98, 80 98, 94 84
               C 101 94, 88 102, 60 102
               C 32 102, 19 94, 26 84 Z"
            fill="url(#cheerSlimeBase)"
          />

          {/* Specular Gloss Highlights */}
          <ellipse cx="42" cy="46" rx="10" ry="4" transform="rotate(-28 42 46)" fill="url(#cheerSlimeGlint)" />
          <circle cx="28" cy="56" r="2.8" fill="#ffffff" fillOpacity="0.8" />

          {/* ═══════════════════════════════════════════════════════════════════
              CHEER VARIANT 1: Confetti Cannon
             ═══════════════════════════════════════════════════════════════════ */}
          {cheerType === 'confetti_cannon' && (
            <>
              {/* Joyous (≧∇≦) Closed Wink Eyes */}
              <path d="M 44 65 L 51 69 L 44 73" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 76 65 L 69 69 L 76 73" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Wide Happy Smile */}
              <path d="M 52 75 Q 60 86 68 75" fill="#f43f5e" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
              {/* Blushing Cheeks */}
              <ellipse cx="38" cy="74" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.6" />
              <ellipse cx="82" cy="74" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.6" />

              {/* Hand holding party popper on right */}
              <g transform="translate(82, 54)">
                {/* Party popper cone */}
                <polygon points="0,15 20,0 22,25" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                <polygon points="5,11 15,3 16,18" fill="#ec4899" />
              </g>

              {/* Confetti Explosion Streamers in Air */}
              <motion.g
                animate={{ scale: [0.8, 1.25, 0.8], rotate: [-5, 10, -5] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              >
                <circle cx="95" cy="30" r="3" fill="#ec4899" />
                <circle cx="108" cy="38" r="3.5" fill="#eab308" />
                <circle cx="102" cy="18" r="2.5" fill="#06b6d4" />
                <rect x="85" y="22" width="6" height="2" transform="rotate(30 85 22)" fill="#10b981" />
                <rect x="110" y="24" width="7" height="2.5" transform="rotate(-40 110 24)" fill="#8b5cf6" />
                <path d="M 98 12 Q 104 22 96 28" stroke="#f43f5e" strokeWidth="2" fill="none" />
              </motion.g>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CHEER VARIANT 2: Pompom Cheerleader
             ═══════════════════════════════════════════════════════════════════ */}
          {cheerType === 'pompom_cheer' && (
            <>
              {/* Victory Headband (Hachimaki) across top */}
              <path d="M 28 50 C 48 44, 72 44, 92 50 L 92 55 C 72 49, 48 49, 28 55 Z" fill="#ffffff" stroke="#e11d48" strokeWidth="1" />
              <circle cx="60" cy="50" r="3.5" fill="#e11d48" />

              {/* Energetic (★ω<) Star Eye + Wink */}
              <path d="M 44 68 L 46 64 L 48 68 L 52 68 L 49 71 L 50 75 L 46 72 L 42 75 L 43 71 L 40 68 Z" fill="#eab308" stroke="#1e3a8a" strokeWidth="1" />
              <path d="M 70 70 Q 76 66 80 71" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Cat Mouth Cute Smile */}
              <path d="M 54 75 Q 58 79 60 76 Q 62 79 66 75" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <ellipse cx="36" cy="74" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.55" />
              <ellipse cx="84" cy="74" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.55" />

              {/* Left Pompom */}
              <motion.g
                animate={{ rotate: [-20, 20, -20], y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                transform-origin="20 60"
              >
                <circle cx="16" cy="58" r="12" fill="url(#goldGrad)" opacity="0.9" />
                <circle cx="12" cy="54" r="6" fill="#fef08a" />
                <circle cx="20" cy="62" r="5" fill="#f59e0b" />
              </motion.g>

              {/* Right Pompom */}
              <motion.g
                animate={{ rotate: [20, -20, 20], y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                transform-origin="100 60"
              >
                <circle cx="104" cy="58" r="12" fill="url(#goldGrad)" opacity="0.9" />
                <circle cx="108" cy="54" r="6" fill="#fef08a" />
                <circle cx="100" cy="62" r="5" fill="#f59e0b" />
              </motion.g>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CHEER VARIANT 3: Sparkle Twirl
             ═══════════════════════════════════════════════════════════════════ */}
          {cheerType === 'sparkle_twirl' && (
            <>
              {/* Twinkling Star Eyes (✿^‿^) */}
              <circle cx="46" cy="68" r="4.5" fill="#1e3a8a" />
              <circle cx="48" cy="66" r="1.8" fill="#ffffff" />
              <circle cx="74" cy="68" r="4.5" fill="#1e3a8a" />
              <circle cx="76" cy="66" r="1.8" fill="#ffffff" />

              <path d="M 53 76 Q 60 84 67 76" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <ellipse cx="36" cy="74" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.6" />
              <ellipse cx="84" cy="74" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.6" />

              {/* Orbiting Golden Stars */}
              <motion.g
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                transform-origin="60 70"
              >
                <path d="M 60 16 L 62 21 L 67 21 L 63 24 L 65 29 L 60 26 L 55 29 L 57 24 L 53 21 L 58 21 Z" fill="#fbbf24" />
                <path d="M 108 70 L 110 73 L 114 73 L 111 75 L 112 79 L 108 77 L 104 79 L 105 75 L 102 73 L 106 73 Z" fill="#f59e0b" />
                <path d="M 12 70 L 14 73 L 18 73 L 15 75 L 16 79 L 12 77 L 8 79 L 9 75 L 6 73 L 10 73 Z" fill="#38bdf8" />
              </motion.g>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CHEER VARIANT 4: Wave Bubble Blower
             ═══════════════════════════════════════════════════════════════════ */}
          {cheerType === 'wave_bubble' && (
            <>
              {/* Cute Puffed Cheeks (*'▽'*) */}
              <circle cx="45" cy="68" r="4" fill="#1e3a8a" />
              <circle cx="46.5" cy="66.5" r="1.5" fill="#ffffff" />
              <circle cx="75" cy="68" r="4" fill="#1e3a8a" />
              <circle cx="76.5" cy="66.5" r="1.5" fill="#ffffff" />

              {/* Round blowing mouth */}
              <ellipse cx="60" cy="76" rx="4.5" ry="4.5" fill="#1e3a8a" />
              <ellipse cx="60" cy="76" rx="2.5" ry="2.5" fill="#38bdf8" />

              <ellipse cx="36" cy="74" rx="6" ry="4" fill="#f43f5e" fillOpacity="0.6" />
              <ellipse cx="84" cy="74" rx="6" ry="4" fill="#f43f5e" fillOpacity="0.6" />

              {/* Floating Wave XP Bubbles */}
              <motion.g
                animate={{ y: [0, -18, 0], x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <circle cx="60" cy="50" r="10" fill="#06b6d4" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="57" cy="47" r="2.5" fill="#ffffff" fillOpacity="0.8" />
                <text x="60" y="53" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#0e7490">XP</text>
              </motion.g>

              <motion.g
                animate={{ y: [0, -22, 0], x: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
              >
                <circle cx="82" cy="40" r="8" fill="#38bdf8" fillOpacity="0.35" stroke="#60a5fa" strokeWidth="1.5" />
                <circle cx="80" cy="38" r="2" fill="#ffffff" fillOpacity="0.8" />
              </motion.g>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CHEER VARIANT 5: Golden Trophy Champion
             ═══════════════════════════════════════════════════════════════════ */}
          {cheerType === 'golden_trophy' && (
            <>
              {/* Proud Hero Face (｀・ω・´) */}
              <circle cx="45" cy="68" r="4" fill="#1e3a8a" />
              <circle cx="47" cy="66" r="1.5" fill="#ffffff" />
              <circle cx="75" cy="68" r="4" fill="#1e3a8a" />
              <circle cx="77" cy="66" r="1.5" fill="#ffffff" />
              <path d="M 52 75 Q 60 82 68 75" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              <ellipse cx="36" cy="74" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.55" />
              <ellipse cx="84" cy="74" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.55" />

              {/* Two raised hands holding trophy */}
              <path d="M 32 60 C 28 50, 40 40, 48 46" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 88 60 C 92 50, 80 40, 72 46" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Gleaming Golden Trophy Cup */}
              <g transform="translate(46, 20)">
                <path d="M 4 4 L 24 4 L 21 18 Q 14 26 7 18 Z" fill="url(#goldGrad)" stroke="#b45309" strokeWidth="1.2" />
                {/* Trophy handles */}
                <path d="M 4 8 C -2 8, -2 16, 5 16" stroke="#b45309" strokeWidth="1.5" fill="none" />
                <path d="M 24 8 C 30 8, 30 16, 23 16" stroke="#b45309" strokeWidth="1.5" fill="none" />
                {/* Trophy base */}
                <rect x="11" y="22" width="6" height="5" fill="#ca8a04" />
                <rect x="8" y="27" width="12" height="4" rx="1" fill="#78350f" />
                <text x="14" y="14" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#78350f">1</text>
              </g>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CHEER VARIANT 6: Onigiri Feast
             ═══════════════════════════════════════════════════════════════════ */}
          {cheerType === 'onigiri_feast' && (
            <>
              {/* Blissful Munching Face (๑´ڡ`๑) */}
              <path d="M 42 68 Q 47 63 52 68" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 68 68 Q 73 63 78 68" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Munching mouth with tongue */}
              <path d="M 54 74 Q 60 82 66 74" fill="#f43f5e" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />

              {/* Rosy heart-blush cheeks */}
              <ellipse cx="36" cy="73" rx="5.5" ry="3.5" fill="#f43f5e" fillOpacity="0.65" />
              <ellipse cx="84" cy="73" rx="5.5" ry="3.5" fill="#f43f5e" fillOpacity="0.65" />

              {/* Hands holding Japanese Onigiri */}
              <g transform="translate(48, 70)">
                {/* Triangle rice ball */}
                <polygon points="12,0 24,18 0,18" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                {/* Black Nori wrapper */}
                <rect x="8" y="10" width="8" height="8" rx="1" fill="#1e293b" />
                {/* Sesame speckles */}
                <circle cx="8" cy="6" r="0.8" fill="#1e293b" />
                <circle cx="15" cy="5" r="0.8" fill="#1e293b" />
              </g>

              {/* Floating Love Hearts */}
              <motion.g
                animate={{ y: [-4, -18, -4], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              >
                <text x="32" y="44" fontSize="11" fill="#f43f5e">❤️</text>
                <text x="80" y="40" fontSize="9" fill="#ec4899">✨</text>
              </motion.g>
            </>
          )}
        </motion.g>
      </svg>
    </div>
  );
}
