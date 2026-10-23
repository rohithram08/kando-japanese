// src/components/mascot/SlimeSticker.tsx
import React from 'react'
import { motion } from 'framer-motion'

export type SlimeStickerType =
  | 'samurai'
  | 'scholar'
  | 'flame'
  | 'crown'
  | 'ninja'
  | 'sakura'
  | 'bookworm'
  | 'zen'
  | 'sparkle'
  | 'trophy'
  | 'target'
  | 'dragon'

export interface SlimeStickerProps {
  type: SlimeStickerType
  size?: number | string
  obtained?: boolean
  animated?: boolean
  className?: string
  alt?: string
}

export default function SlimeSticker({
  type = 'sparkle',
  size = 96,
  obtained = true,
  animated = true,
  className = '',
  alt = 'Kando Slime Sticker Award',
}: SlimeStickerProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size

  // Base gradients & accessory details per sticker type
  const renderAccessories = () => {
    switch (type) {
      case 'samurai':
        return (
          <>
            {/* Red Samurai Headband (Hachimaki) with Gold Sun Crest */}
            <path
              d="M 20 48 Q 50 40 80 48 Q 50 44 20 48 Z"
              fill="#dc2626"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Golden Clan Crest in center */}
            <circle cx="50" cy="45" r="4.5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
            {/* Wooden Katana sword slung across back */}
            <rect
              x="68"
              y="22"
              width="6"
              height="38"
              rx="3"
              transform="rotate(35 68 22)"
              fill="#78350f"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <rect
              x="82"
              y="18"
              width="10"
              height="3"
              rx="1.5"
              transform="rotate(35 82 18)"
              fill="#fbbf24"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </>
        )

      case 'scholar':
        return (
          <>
            {/* Graduation Mortarboard Cap */}
            <polygon
              points="50,15 84,27 50,39 16,27"
              fill="#1e1b4b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <polygon
              points="34,33 66,33 62,45 38,45"
              fill="#312e81"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Gold Tassel & Ribbon */}
            <circle cx="50" cy="27" r="2.5" fill="#facc15" />
            <path
              d="M 50 27 Q 72 32 75 48"
              fill="none"
              stroke="#facc15"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Smart Round Spectacles */}
            <circle cx="41" cy="58" r="6.5" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <circle cx="59" cy="58" r="6.5" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <line x1="47.5" y1="58" x2="52.5" y2="58" stroke="#facc15" strokeWidth="2.5" />
          </>
        )

      case 'flame':
        return (
          <>
            {/* Super Saiyan / Anime Fiery Aura behind Slime */}
            <path
              d="M 50 6 Q 66 22 62 38 Q 80 32 78 54 Q 92 48 88 74 Q 96 90 75 92 Q 50 96 25 92 Q 4 90 12 74 Q 8 48 22 54 Q 20 32 38 38 Q 34 22 50 6 Z"
              fill="url(#flameAuraGrad)"
              opacity="0.85"
            />
            {/* Flame Forehead Band */}
            <path
              d="M 22 52 Q 50 44 78 52"
              fill="none"
              stroke="#ea580c"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Center Flame Icon */}
            <path
              d="M 50 38 Q 54 44 50 50 Q 56 46 54 42 Q 50 38 50 38 Z"
              fill="#fef08a"
              stroke="#ffffff"
              strokeWidth="1"
            />
          </>
        )

      case 'crown':
        return (
          <>
            {/* Royal Velvet Cloak Collar */}
            <path
              d="M 24 76 Q 50 84 76 76 Q 84 88 50 90 Q 16 88 24 76 Z"
              fill="#991b1b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <circle cx="50" cy="83" r="3.5" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
            {/* Glorious Golden Crown with Rubies */}
            <polygon
              points="30,36 36,18 44,28 50,14 56,28 64,18 70,36"
              fill="#eab308"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <rect x="30" y="34" width="40" height="6" rx="2" fill="#ca8a04" stroke="#ffffff" strokeWidth="2" />
            <circle cx="36" cy="22" r="2" fill="#ef4444" />
            <circle cx="50" cy="18" r="2.5" fill="#3b82f6" />
            <circle cx="64" cy="22" r="2" fill="#ef4444" />
          </>
        )

      case 'ninja':
        return (
          <>
            {/* Midnight Ninja Headwrap */}
            <path
              d="M 22 52 Q 50 42 78 52 Q 82 64 78 72 Q 50 64 22 72 Z"
              fill="#18181b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Metal forehead protector */}
            <rect x="38" y="46" width="24" height="7" rx="2.5" fill="#71717a" stroke="#ffffff" strokeWidth="1.5" />
            {/* Glowing ninja shuriken star on side */}
            <g transform="translate(18, 64) scale(0.65)">
              <polygon points="10,0 13,7 20,10 13,13 10,20 7,13 0,10 7,7" fill="#e4e4e7" stroke="#ffffff" strokeWidth="2" />
            </g>
          </>
        )

      case 'sakura':
        return (
          <>
            {/* Pink Cherry Blossom Flower cluster on head */}
            <g transform="translate(62, 28) scale(0.9)">
              <circle cx="8" cy="8" r="4.5" fill="#fb7185" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="15" cy="8" r="4.5" fill="#fb7185" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="11.5" cy="3" r="4.5" fill="#fb7185" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="6" cy="13" r="4.5" fill="#fb7185" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="17" cy="13" r="4.5" fill="#fb7185" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="11.5" cy="9.5" r="3" fill="#fef08a" />
            </g>
            {/* Traditional Japanese Paper Fan */}
            <path
              d="M 16 68 Q 28 54 40 68 Z"
              fill="#fda4af"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <line x1="28" y1="68" x2="28" y2="76" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
          </>
        )

      case 'bookworm':
        return (
          <>
            {/* Cozy red Japanese Kanji textbook under arm */}
            <rect
              x="60"
              y="60"
              width="24"
              height="20"
              rx="3"
              transform="rotate(-15 60 60)"
              fill="#dc2626"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* White pages bookmark */}
            <path d="M 64 62 L 78 58 L 76 74 L 62 78 Z" fill="#ffffff" />
            <text x="68" y="70" fontSize="7" fontWeight="bold" fill="#dc2626" transform="rotate(-15 68 70)">漢</text>
            {/* Round reading glasses */}
            <circle cx="41" cy="57" r="6" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="59" cy="57" r="6" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <line x1="47" y1="57" x2="53" y2="57" stroke="#3b82f6" strokeWidth="2" />
          </>
        )

      case 'zen':
        return (
          <>
            {/* Fresh Green Lotus / Tea Leaf on head */}
            <path
              d="M 50 32 Q 58 18 52 10 Q 44 20 50 32 Z"
              fill="#22c55e"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <path
              d="M 50 20 Q 54 18 56 14"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Hot Matcha Green Tea Bowl */}
            <ellipse cx="50" cy="84" rx="14" ry="6" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
            <path d="M 36 84 Q 50 94 64 84" fill="#166534" stroke="#ffffff" strokeWidth="2" />
            {/* Steam swirling */}
            <path d="M 46 76 Q 44 72 47 68" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 54 77 Q 56 73 53 69" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )

      case 'trophy':
        return (
          <>
            {/* Shiny Golden 1st Place Trophy Cup */}
            <g transform="translate(32, 54)">
              <path
                d="M 6 4 Q 18 4 30 4 L 26 18 Q 18 24 10 18 Z"
                fill="#eab308"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Handles */}
              <path d="M 6 6 Q 0 10 6 15" fill="none" stroke="#ffffff" strokeWidth="2" />
              <path d="M 30 6 Q 36 10 30 15" fill="none" stroke="#ffffff" strokeWidth="2" />
              {/* Pedestal */}
              <rect x="14" y="22" width="8" height="6" fill="#ca8a04" stroke="#ffffff" strokeWidth="1.5" />
              <rect x="10" y="27" width="16" height="5" rx="1.5" fill="#713f12" stroke="#ffffff" strokeWidth="1.5" />
              {/* Star on trophy */}
              <polygon points="18,8 19.5,12 24,12 20.5,14.5 22,19 18,16 14,19 15.5,14.5 12,12 16.5,12" fill="#ffffff" />
            </g>
          </>
        )

      case 'target':
        return (
          <>
            {/* Red & White Archer Target Bullseye */}
            <g transform="translate(62, 42)">
              <circle cx="16" cy="16" r="16" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="11" fill="#ffffff" stroke="#dc2626" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="2.5" fill="#facc15" />
              {/* Arrow in the center */}
              <line x1="28" y1="4" x2="16" y2="16" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="28,4 32,3 31,7" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
            </g>
          </>
        )

      case 'dragon':
        return (
          <>
            {/* Mythical Golden Dragon Antlers / Horns */}
            <path
              d="M 28 32 Q 20 18 12 16 Q 16 26 24 38 Z"
              fill="#facc15"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path
              d="M 72 32 Q 80 18 88 16 Q 84 26 76 38 Z"
              fill="#facc15"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Dragon Pearl Gem floating above head */}
            <circle cx="50" cy="18" r="6" fill="url(#pearlGrad)" stroke="#ffffff" strokeWidth="2" />
          </>
        )

      case 'sparkle':
      default:
        return (
          <>
            {/* Dancing Celebration Stars & Confetti */}
            <polygon points="22,24 24,18 30,20 25,24 28,30 22,26 16,30 19,24 14,20 20,18" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
            <polygon points="78,22 80,16 86,18 81,22 84,28 78,24 72,28 75,22 70,18 76,16" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="16" cy="46" r="3" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
            <circle cx="84" cy="48" r="3.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
          </>
        )
    }
  }

  // Choose primary body gradient based on sticker theme
  const getBodyGradient = () => {
    switch (type) {
      case 'sakura':
        return { start: '#fb7185', mid: '#f43f5e', end: '#e11d48' }
      case 'flame':
        return { start: '#fb923c', mid: '#f97316', end: '#ea580c' }
      case 'crown':
        return { start: '#fde047', mid: '#eab308', end: '#ca8a04' }
      case 'zen':
        return { start: '#86efac', mid: '#22c55e', end: '#16a34a' }
      case 'ninja':
        return { start: '#c084fc', mid: '#9333ea', end: '#6b21a8' }
      case 'dragon':
        return { start: '#34d399', mid: '#059669', end: '#047857' }
      case 'trophy':
        return { start: '#38bdf8', mid: '#0284c7', end: '#0369a1' }
      default:
        return { start: '#38bdf8', mid: '#0ea5e9', end: '#1d4ed8' }
    }
  }

  const grad = getBodyGradient()
  const gradId = `stickerBodyGrad_${type}`

  return (
    <motion.div
      whileHover={animated ? { scale: 1.08, rotate: [0, -3, 3, 0] } : undefined}
      whileTap={animated ? { scale: 0.94 } : undefined}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        filter: obtained
          ? 'drop-shadow(0px 8px 16px rgba(14, 165, 233, 0.28)) drop-shadow(0px 3px 6px rgba(0,0,0,0.18))'
          : 'grayscale(0.85) opacity(0.55)',
      }}
      aria-label={alt}
      role="img"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Flame Aura Gradient */}
          <radialGradient id="flameAuraGrad" cx="50" cy="50" r="50">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>

          {/* Pearl Gradient */}
          <radialGradient id="pearlGrad" cx="45" cy="14" r="8">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>

          {/* Custom Body Gradient */}
          <linearGradient id={gradId} x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={grad.start} />
            <stop offset="50%" stopColor={grad.mid} />
            <stop offset="100%" stopColor={grad.end} />
          </linearGradient>

          {/* White Die-Cut Sticker Outline Filter */}
          <filter id="stickerBorder" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="3" />
            <feFlood floodColor="#ffffff" result="WHITE" />
            <feComposite in="WHITE" in2="DILATED" operator="in" result="OUTLINE" />
            <feMerge>
              <feMergeNode in="OUTLINE" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Thick White Vinyl Sticker Contour Base */}
        <ellipse cx="50" cy="91" rx="36" ry="6" fill="#090d16" fillOpacity="0.22" />

        {/* ── Slime Accessories (Background layer) ── */}
        {renderAccessories()}

        {/* ── Main Bouncy Slime Body with thick glossy sticker stroke ── */}
        <path
          d="M 50 30
             C 68 30, 84 42, 87 60
             C 89 74, 79 88, 50 88
             C 21 88, 11 74, 13 60
             C 16 42, 32 30, 50 30 Z"
          fill={`url(#${gradId})`}
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Soft 3D Specular Top-Left Highlight */}
        <path
          d="M 32 38
             C 40 33, 48 33, 54 35
             C 47 40, 39 44, 30 46
             C 29 42, 30 40, 32 38 Z"
          fill="#ffffff"
          fillOpacity="0.65"
        />
        <circle cx="28" cy="49" r="2.5" fill="#ffffff" fillOpacity="0.55" />

        {/* Anime Eyes */}
        {type === 'zen' ? (
          // Peaceful closed eyes (Smiling arcs)
          <>
            <path d="M 36 57 Q 41 62 46 57" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 54 57 Q 59 62 64 57" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : type === 'sparkle' || type === 'trophy' ? (
          // Star Sparkle Eyes
          <>
            <polygon points="41,51 43,55 47,56 44,59 45,63 41,61 37,63 38,59 35,56 39,55" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
            <polygon points="59,51 61,55 65,56 62,59 63,63 59,61 55,63 56,59 53,56 57,55" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
          </>
        ) : (
          // Cute Anime Ovals with Highlights
          <>
            <ellipse cx="41" cy="57" rx="3.8" ry="5.8" fill="#0f172a" />
            <circle cx="39.8" cy="54.8" r="1.8" fill="#ffffff" />
            <circle cx="42.5" cy="58.5" r="0.9" fill="#ffffff" />

            <ellipse cx="59" cy="57" rx="3.8" ry="5.8" fill="#0f172a" />
            <circle cx="57.8" cy="54.8" r="1.8" fill="#ffffff" />
            <circle cx="60.5" cy="58.5" r="0.9" fill="#ffffff" />
          </>
        )}

        {/* Rosy Anime Blush Cheeks */}
        <ellipse cx="32" cy="64" rx="4.5" ry="2.6" fill="#fb7185" fillOpacity="0.75" />
        <ellipse cx="68" cy="64" rx="4.5" ry="2.6" fill="#fb7185" fillOpacity="0.75" />

        {/* Happy Smile */}
        <path
          d="M 47 64 Q 50 67.5 53 64"
          fill="none"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Small Ribbon / Bow for Sakura */}
        {type === 'sakura' && (
          <path
            d="M 48 74 Q 45 77 47 80 Q 50 78 50 74 Q 50 78 53 80 Q 55 77 52 74 Z"
            fill="#fb7185"
            stroke="#ffffff"
            strokeWidth="1"
          />
        )}
      </svg>
    </motion.div>
  )
}
