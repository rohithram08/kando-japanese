// src/components/landing/SakuraPetals2D.jsx
import React from 'react'

const PETAL_CONFIGS = [
  { left: '8%', delay: '0s', duration: '9s', size: 18, anim: 'drift-sakura-1' },
  { left: '22%', delay: '2.5s', duration: '11s', size: 14, anim: 'drift-sakura-2' },
  { left: '38%', delay: '4.8s', duration: '8.5s', size: 20, anim: 'drift-sakura-3' },
  { left: '52%', delay: '1.2s', duration: '10s', size: 16, anim: 'drift-sakura-1' },
  { left: '68%', delay: '3.6s', duration: '9.5s', size: 22, anim: 'drift-sakura-2' },
  { left: '82%', delay: '0.8s', duration: '12s', size: 15, anim: 'drift-sakura-3' },
  { left: '94%', delay: '5.2s', duration: '8s', size: 19, anim: 'drift-sakura-1' },
  { left: '15%', delay: '6.5s', duration: '10.5s', size: 16, anim: 'drift-sakura-2' },
  { left: '44%', delay: '7.2s', duration: '9s', size: 18, anim: 'drift-sakura-1' },
  { left: '76%', delay: '4.1s', duration: '11.5s', size: 21, anim: 'drift-sakura-3' },
]

export default function SakuraPetals2D() {
  return (
    <div
      className="sakura-container absolute inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {PETAL_CONFIGS.map((petal, index) => (
        <div
          key={index}
          className="sakura-petal-node absolute top-0"
          style={{
            left: petal.left,
            animationName: petal.anim,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            opacity: 0,
          }}
        >
          <svg
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transform drop-shadow-sm"
          >
            <path
              d="M12 2C6.5 6 4 13 5 21C6 27 10 30 12 30C14 30 18 27 19 21C20 13 17.5 6 12 2Z"
              fill="url(#sakuraGrad)"
              opacity="0.88"
            />
            {/* Notch at the tip of sakura petal */}
            <path
              d="M10 2C11 3.5 12 4 12 4C12 4 13 3.5 14 2"
              stroke="#ff94aa"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="sakuraGrad" x1="12" y1="2" x2="12" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffe4ea" />
                <stop offset="0.65" stopColor="#ffb3c6" />
                <stop offset="1" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  )
}
