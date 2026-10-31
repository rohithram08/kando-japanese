// src/components/mascot/KandoSlimeLogo.tsx
import React from 'react'

interface KandoSlimeLogoProps {
  size?: number | string
  className?: string
  animated?: boolean
  showBlossom?: boolean
}

export default function KandoSlimeLogo({
  size = 36,
  className = '',
  animated = false,
  showBlossom = false,
}: KandoSlimeLogoProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${animated ? 'hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer' : ''} ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      aria-label="Kando Slime Logo"
      role="img"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Vibrant Translucent Jelly Body Gradient */}
          <linearGradient id="slimeBodyGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#0ea5e9" />
            <stop offset="85%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Inner Base Ambient Shadow */}
          <radialGradient id="slimeBaseShadow" cx="50" cy="85" r="38" fx="50" fy="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>

          {/* Specular Highlight Gradient */}
          <linearGradient id="specularGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Soft Drop Shadow under the slime */}
        <ellipse cx="50" cy="91" rx="36" ry="5.5" fill="#0f172a" fillOpacity="0.2" />

        {/* Rimuru Jelly Slime Body: Chubby, Bouncy, Dome/Mochi Shaped (TenSura Anime Accurate) */}
        <path
          d="M 50 30
             C 68 30, 84 42, 87 60
             C 89 74, 82 85, 68 87
             C 58 88.5, 42 88.5, 32 87
             C 18 85, 11 74, 13 60
             C 16 42, 32 30, 50 30 Z"
          fill="url(#slimeBodyGrad)"
        />

        {/* Internal 3D Base Ambient Depth */}
        <path
          d="M 20 72
             C 32 84, 68 84, 80 72
             C 86 81, 74 88, 50 88
             C 26 88, 14 81, 20 72 Z"
          fill="url(#slimeBaseShadow)"
        />

        {/* Primary Specular Light Reflection (Glossy Jelly Surface) */}
        <ellipse cx="34" cy="39" rx="8.5" ry="3.5" transform="rotate(-28 34 39)" fill="url(#specularGlow)" />
        <circle cx="23" cy="47" r="2.2" fill="#ffffff" fillOpacity="0.75" />

        {/* Rosy Anime Cheeks */}
        <ellipse cx="28" cy="66" rx="5.5" ry="3" fill="#f43f5e" fillOpacity="0.55" />
        <ellipse cx="72" cy="66" rx="5.5" ry="3" fill="#f43f5e" fillOpacity="0.55" />

        {/* Big Expressive Anime Eyes */}
        {/* Left Eye */}
        <ellipse cx="37" cy="58" rx="4.5" ry="6.5" fill="#0f172a" />
        <circle cx="35.5" cy="55" r="2.1" fill="#ffffff" />
        <circle cx="38.8" cy="60.5" r="1.1" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="63" cy="58" rx="4.5" ry="6.5" fill="#0f172a" />
        <circle cx="61.5" cy="55" r="2.1" fill="#ffffff" />
        <circle cx="64.8" cy="60.5" r="1.1" fill="#ffffff" />

        {/* Sweet Smiling Mouth */}
        <path
          d="M 46 64 Q 50 68 54 64"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Optional Sakura Blossom */}
        {showBlossom && (
          <g transform="translate(62, 28) scale(0.65)">
            <circle cx="10" cy="10" r="3" fill="#f43f5e" />
            <path d="M10,4 Q12,1 14,4 Q15,7 10,10" fill="#fbcfe8" />
            <path d="M16,10 Q19,12 16,14 Q13,15 10,10" fill="#fbcfe8" />
            <path d="M10,16 Q8,19 6,16 Q5,13 10,10" fill="#fbcfe8" />
            <path d="M4,10 Q1,8 4,6 Q7,5 10,10" fill="#fbcfe8" />
            <path d="M10,4 Q8,1 6,4 Q5,7 10,10" fill="#fbcfe8" />
          </g>
        )}
      </svg>
    </div>
  )
}
