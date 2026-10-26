// src/components/league/LeagueBadge.jsx
// A shield in the league's colour with its kanji; three pips show the stage
// (III = 1 pip ... I = 3 pips, i.e. closer to promotion into the next league).
import React, { useId } from 'react'
import { stagePips } from '../../utils/league'

export default function LeagueBadge({ league, stage, size = 64, dim = false, className = '' }) {
  const gid = useId().replace(/:/g, '')
  const pips = stagePips(stage)
  const jp = league?.jp || ''
  const color = league?.color || '#94a3b8'
  const roman = { 3: 'III', 2: 'II', 1: 'I' }[stage] || ''
  return (
    <svg
      viewBox="0 0 64 76"
      width={size}
      height={(size * 76) / 64}
      role="img"
      aria-label={`${league?.name || 'League'} ${roman}`.trim()}
      className={`${dim ? 'opacity-40 grayscale' : ''} ${className}`}
    >
      <defs>
        <linearGradient id={`lg-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.62" />
        </linearGradient>
      </defs>
      <path d="M32 2 L60 12 V36 C60 54 46 68 32 74 C18 68 4 54 4 36 V12 Z" fill={`url(#lg-${gid})`} stroke="rgba(0,0,0,0.22)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 7 L55 15 V36 C55 51 43 63 32 68.5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" />
      <text
        x="32" y="40" textAnchor="middle" fontWeight="800" fill="#fff"
        fontSize={jp.length > 1 ? 21 : 29}
        stroke="rgba(0,0,0,0.28)" strokeWidth="2" paintOrder="stroke"
      >
        {jp}
      </text>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={24 + i * 8} cy="56" r="2.7" fill={i < pips ? '#fff' : 'rgba(255,255,255,0.32)'} />
      ))}
    </svg>
  )
}
