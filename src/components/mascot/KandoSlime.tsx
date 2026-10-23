// src/components/mascot/KandoSlime.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, Volume2, Heart, RefreshCw } from 'lucide-react'
import { playPop } from '../../utils/soundEffects'
import './kandoSlime.css'

export type SlimeMood = 'idle' | 'waving' | 'studying' | 'celebrating' | 'curious'

export interface KandoSlimeProps {
  mood?: SlimeMood
  size?: number | string
  interactive?: boolean
  showSpeech?: boolean
  showMoodButtons?: boolean
  slimeType?: 'mr' | 'mrs'
  customSpeech?: {
    japanese: string
    romaji?: string
    english?: string
  }
  onSpeak?: (text: string) => void
  onMoodChange?: (newMood: SlimeMood) => void
  className?: string
}

const DEFAULT_SPEECHES: Record<SlimeMood, { japanese: string; romaji: string; english: string }> = {
  waving: {
    japanese: '「やっほー！感動スライムだよ！一緒に日本語を学ぼう！」',
    romaji: 'Yahho~! Kando Suraimu da yo! Issho ni nihongo o manabou!',
    english: "Hii there! I'm Kando Slime! Let's master Japanese together!",
  },
  idle: {
    japanese: '「今日も一歩ずつ、楽しく勉強しましょう！」',
    romaji: 'Kyou mo ippo zutsu, tanoshiku benkyou shimashou!',
    english: "Step by step with joy! Every day brings you closer to fluency.",
  },
  studying: {
    japanese: '「必勝！漢字も文法も、毎日コツコツ覚えるよ！」',
    romaji: 'Hisshou! Kanji mo bunpou mo, mainichi kotsukotsu oboeru yo!',
    english: "Victory! Kanji and grammar, mastering them piece by piece!",
  },
  celebrating: {
    japanese: '「すごい！よくできました！レベルアップ！」',
    romaji: 'Sugoi! Yoku dekimashita! Reberu appu!',
    english: "Incredible! Fantastic work! Level Up!",
  },
  curious: {
    japanese: '「これ、どういう意味？一緒に調べよう！」',
    romaji: 'Kore, dou iu imi? Issho ni shirabeyou!',
    english: "What does this mean? Let's explore and discover together!",
  },
}

export default function KandoSlime({
  mood = 'waving',
  size = 220,
  interactive = true,
  showSpeech = true,
  showMoodButtons = true,
  slimeType = 'mr',
  customSpeech,
  onSpeak,
  onMoodChange,
  className = '',
}: KandoSlimeProps) {
  const [currentMood, setCurrentMood] = useState<SlimeMood>(mood)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isSquished, setIsSquished] = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])

  const slimeRef = useRef<HTMLDivElement>(null)

  // Sync external mood changes
  useEffect(() => {
    setCurrentMood(mood)
  }, [mood])

  // Natural spontaneous blinking interval (like Duolingo's mascot)
  useEffect(() => {
    let blinkTimer: NodeJS.Timeout
    const triggerBlink = () => {
      setIsBlinking(true)
      setTimeout(() => {
        setIsBlinking(false)
      }, 160)

      // Random next blink between 2.8s and 5.2s
      const nextDelay = 2800 + Math.random() * 2400
      blinkTimer = setTimeout(triggerBlink, nextDelay)
    }

    blinkTimer = setTimeout(triggerBlink, 3000)
    return () => clearTimeout(blinkTimer)
  }, [])

  // Mouse tracking for realistic anime eye focus
  useEffect(() => {
    if (!interactive) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!slimeRef.current) return
      const rect = slimeRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const distance = Math.hypot(dx, dy)

      // Clamp pupil translation between -5px and +5px
      const maxDist = 200
      const clampedFactor = Math.min(distance / maxDist, 1)
      const angle = Math.atan2(dy, dx)

      setEyeOffset({
        x: Math.cos(angle) * 5 * clampedFactor,
        y: Math.sin(angle) * 3.5 * clampedFactor,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [interactive])

  // Interactive Squish / Poke
  const handleSlimeClick = (e: React.MouseEvent) => {
    if (!interactive) return

    playPop()
    setIsSquished(true)
    setTimeout(() => setIsSquished(false), 450)

    // Add ripple
    if (slimeRef.current) {
      const rect = slimeRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRippleId = Date.now()
      setRipples((prev) => [...prev.slice(-3), { id: newRippleId, x, y }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRippleId))
      }, 600)

      // Spawn heart particle
      const newHeartId = Date.now() + 1
      setHearts((prev) => [...prev.slice(-4), { id: newHeartId, x, y }])
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeartId))
      }, 900)
    }

    // Toggle exciting mood on click
    if (currentMood === 'idle') {
      const nextMood: SlimeMood = 'waving'
      setCurrentMood(nextMood)
      onMoodChange?.(nextMood)
    } else if (currentMood === 'waving') {
      const nextMood: SlimeMood = 'celebrating'
      setCurrentMood(nextMood)
      onMoodChange?.(nextMood)
    }
  }

  const activeSpeech = customSpeech || DEFAULT_SPEECHES[currentMood]
  const pixelSize = typeof size === 'number' ? `${size}px` : size

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* ── Interactive Comic Speech Bubble ────────────────────── */}
      {showSpeech && (
        <div
          className="mb-4 max-w-xs sm:max-w-sm card p-3.5 sm:p-4 rounded-2xl border border-indigo-500/25 bg-surface/95 backdrop-blur-md shadow-xl relative z-30 transition-all text-left slime-bubble-animated"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kando Slime (感動スライム)</span>
            </div>
            {onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(activeSpeech.japanese)}
                className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
                title="Play Japanese Audio"
                aria-label="Listen to Slime voice"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-sm font-bold text-foreground font-jp leading-snug">
            {activeSpeech.japanese}
          </p>
          <p className="text-[11px] text-primary font-medium mt-1">
            {activeSpeech.romaji}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 italic">
            "{activeSpeech.english}"
          </p>

          {/* Speech Bubble Tail */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-surface border-r border-b border-indigo-500/25 transform rotate-45 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}

      {/* ── Animated Slime Character Stage ─────────────────────── */}
      <div
        ref={slimeRef}
        onClick={handleSlimeClick}
        style={{ width: pixelSize, height: pixelSize }}
        className={`relative flex items-center justify-center cursor-pointer transition-transform duration-300 ${
          isSquished ? 'scale-x-125 scale-y-75' : ''
        }`}
        title="Click to poke and play with Kando Slime!"
        role="button"
        tabIndex={0}
        aria-label="Interactive Kando Slime Mascot"
      >
        {/* Soft Ambient Jelly Glow */}
        <div
          className="absolute inset-2 rounded-full bg-gradient-to-tr from-cyan-500/30 via-indigo-500/25 to-pink-500/20 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Jelly Ripples on poke */}
        {ripples.map((rip) => (
          <span
            key={rip.id}
            className="absolute rounded-full border-2 border-cyan-400/60 pointer-events-none slime-ripple"
            style={{
              left: rip.x - 25,
              top: rip.y - 25,
              width: 50,
              height: 50,
            }}
          />
        ))}

        {/* Heart Particles on poke */}
        {hearts.map((h) => (
          <span
            key={h.id}
            className="absolute text-rose-500 text-lg pointer-events-none slime-confetti"
            style={{
              left: h.x,
              top: h.y,
              '--tx': `${(Math.random() - 0.5) * 60}px`,
              '--ty': `${-40 - Math.random() * 40}px`,
            } as any}
          >
            ❤️
          </span>
        ))}

        {/* Confetti Particles in Celebrating Mode */}
        {currentMood === 'celebrating' && (
          <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
            <span className="slime-confetti absolute top-2 left-4 text-amber-400 text-sm font-bold" style={{ '--tx': '-30px', '--ty': '-50px' } as any}>✨</span>
            <span className="slime-confetti absolute top-1 right-6 text-rose-400 text-sm font-bold" style={{ '--tx': '35px', '--ty': '-45px' } as any}>🌸</span>
            <span className="slime-confetti absolute bottom-6 left-2 text-yellow-400 text-sm font-bold" style={{ '--tx': '-35px', '--ty': '20px' } as any}>⭐</span>
            <span className="slime-confetti absolute bottom-4 right-4 text-emerald-400 text-sm font-bold" style={{ '--tx': '40px', '--ty': '25px' } as any}>🎉</span>
          </div>
        )}

        {/* ── Vector SVG Slime with Full Animation Rig ─────────── */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-xl ${
            currentMood === 'celebrating' ? 'slime-body-celebrate' : 'slime-body-idle'
          }`}
        >
          <defs>
            {/* Glossy Jelly Body Gradient */}
            <linearGradient id="kandoSlimeBody" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#0ea5e9" />
              <stop offset="85%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Inner Jelly Shadow */}
            <radialGradient id="kandoSlimeBase" cx="50" cy="85" r="38" fx="50" fy="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </radialGradient>

            {/* Specular Shine Highlight */}
            <linearGradient id="kandoSlimeShine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Floor Shadow */}
          <ellipse cx="50" cy="91" rx="36" ry="5.5" fill="#0f172a" fillOpacity="0.22" />

          {/* Rimuru Jelly Slime Body: Chubby, Bouncy, Dome/Mochi Shaped (TenSura Anime Accurate) */}
          <path
            d="M 50 30
               C 68 30, 84 42, 87 60
               C 89 74, 82 85, 68 87
               C 58 88.5, 42 88.5, 32 87
               C 18 85, 11 74, 13 60
               C 16 42, 32 30, 50 30 Z"
            fill="url(#kandoSlimeBody)"
          />

          {/* Jelly 3D Base Ambient Depth */}
          <path
            d="M 20 72
               C 32 84, 68 84, 80 72
               C 86 81, 74 88, 50 88
               C 26 88, 14 81, 20 72 Z"
            fill="url(#kandoSlimeBase)"
          />

          {/* Primary Top Specular Gloss */}
          <ellipse cx="34" cy="39" rx="8.5" ry="3.5" transform="rotate(-28 34 39)" fill="url(#kandoSlimeShine)" />
          <circle cx="23" cy="47" r="2.2" fill="#ffffff" fillOpacity="0.75" />

          {/* Waving Arm / Pseudopod on Right */}
          {currentMood === 'waving' && (
            <g className="slime-hand-waving">
              <path
                d="M 78 64
                   C 86 58, 93 46, 88 40
                   C 84 36, 79 42, 76 50
                   C 74 54, 75 60, 78 64 Z"
                fill="url(#kandoSlimeBody)"
                stroke="#2563eb"
                strokeWidth="1"
              />
              {/* Palm highlight */}
              <circle cx="86" cy="42" r="2" fill="#ffffff" fillOpacity="0.75" />
            </g>
          )}

          {/* Studying Mode: Holding Japanese Kanji Scroll/Book */}
          {currentMood === 'studying' && (
            <g transform="translate(62, 54)">
              {/* Book cover */}
              <rect x="0" y="0" width="18" height="24" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              {/* White label */}
              <rect x="4" y="4" width="10" height="16" rx="1" fill="#ffffff" />
              {/* Kanji "日" */}
              <text x="9" y="15" fontSize="9" textAnchor="middle" fill="#0f172a" fontWeight="bold">日</text>
            </g>
          )}

          {/* Studying Mode: Japanese Hachimaki (Headband) */}
          {currentMood === 'studying' && (
            <g transform="translate(0, 0)">
              {/* Headband cloth wrapping */}
              <path
                d="M 18 48
                   Q 50 42 82 48
                   L 83 54
                   Q 50 48 17 54 Z"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="0.8"
              />
              {/* Red Sun Circle in Center (Hinomaru / 必勝) */}
              <circle cx="50" cy="48" r="3.8" fill="#ef4444" />
              {/* Headband ribbon knot tail flying off left */}
              <path
                d="M 17 50 Q 9 52 5 46 Q 9 56 15 53 Z"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="0.6"
              />
            </g>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="28" cy="66" rx="5.5" ry="3" fill="#f43f5e" fillOpacity="0.55" />
          <ellipse cx="72" cy="66" rx="5.5" ry="3" fill="#f43f5e" fillOpacity="0.55" />

          {/* ── Expressive Anime Eyes with Pupil Tracking & Blinking ─ */}
          {/* Left Eye */}
          <g transform={`translate(${eyeOffset.x * 0.7}, ${eyeOffset.y * 0.7})`}>
            {isBlinking ? (
              // Rimuru's famous cute curved crescent eye
              <path d="M 31 59 Q 37 53 43 59" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            ) : currentMood === 'celebrating' ? (
              // Star eye
              <g transform="translate(37, 58) scale(0.9)">
                <path d="M 0 -6 L 1.8 -1.8 L 6 0 L 1.8 1.8 L 0 6 L -1.8 1.8 L -6 0 L -1.8 -1.8 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
              </g>
            ) : (
              // Open Anime Eye
              <g>
                <ellipse cx="37" cy="58" rx="4.5" ry="6.5" fill="#0f172a" />
                {/* Big sparkling catchlight */}
                <circle cx="35.5" cy="55" r="2.1" fill="#ffffff" />
                <circle cx="38.8" cy="60.5" r="1.1" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* Right Eye */}
          <g transform={`translate(${eyeOffset.x * 0.7}, ${eyeOffset.y * 0.7})`}>
            {isBlinking || currentMood === 'waving' ? (
              // Rimuru's famous cute winking crescent eye
              <path d="M 57 59 Q 63 53 69 59" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            ) : currentMood === 'celebrating' ? (
              // Star eye
              <g transform="translate(63, 58) scale(0.9)">
                <path d="M 0 -6 L 1.8 -1.8 L 6 0 L 1.8 1.8 L 0 6 L -1.8 1.8 L -6 0 L -1.8 -1.8 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
              </g>
            ) : (
              // Open Anime Eye
              <g>
                <ellipse cx="63" cy="58" rx="4.5" ry="6.5" fill="#0f172a" />
                {/* Big sparkling catchlight */}
                <circle cx="61.5" cy="55" r="2.1" fill="#ffffff" />
                <circle cx="64.8" cy="60.5" r="1.1" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* Cute Mouth */}
          {currentMood === 'celebrating' || currentMood === 'waving' ? (
            // Open Happy Smile
            <path
              d="M 46 64
                 Q 50 72 54 64
                 Z"
              fill="#f43f5e"
              stroke="#0f172a"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          ) : currentMood === 'curious' ? (
            // Small curious "O" mouth
            <ellipse cx="50" cy="65" rx="2.5" ry="3.5" fill="#0f172a" />
          ) : (
            // Soft sweet smile
            <path
              d="M 46 64 Q 50 68 54 64"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {/* Mr. Slime / Mrs. Slime Persona Head Accessories */}
          {slimeType === 'mrs' ? (
            <g transform="translate(68, 30) scale(0.85)" className="slime-blossom">
              {/* Pink Sakura Flower Hair Bow for Mrs. Slime */}
              <circle cx="0" cy="0" r="4.5" fill="#f43f5e" />
              <circle cx="-5" cy="-3" r="4" fill="#fb7185" />
              <circle cx="5" cy="-3" r="4" fill="#fb7185" />
              <circle cx="-5" cy="4" r="4" fill="#fb7185" />
              <circle cx="5" cy="4" r="4" fill="#fb7185" />
              <circle cx="0" cy="0" r="2.2" fill="#fef08a" />
            </g>
          ) : (
            <g transform="translate(50, 24) scale(0.85)">
              {/* Fresh Adventurer Sprout Leaf for Mr. Slime */}
              <path d="M 0 6 C -4 1, -6 -3, 0 -7 C 5 -3, 4 1, 0 6 Z" fill="#22c55e" />
              <path d="M 0 6 C 3 3, 7 2, 9 -2 C 5 -1, 2 2, 0 6 Z" fill="#16a34a" />
            </g>
          )}
        </svg>
      </div>

      {/* ── Mood Switcher Action Buttons (Duolingo Style Playfulness) ── */}
      {interactive && showMoodButtons && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-muted/70 backdrop-blur-md border border-border/80 shadow-sm">
          <button
            type="button"
            onClick={() => { playPop(); setCurrentMood('waving'); onMoodChange?.('waving') }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              currentMood === 'waving'
                ? 'bg-indigo-600 text-white shadow-md scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            }`}
          >
            <span>👋 Wave</span>
          </button>

          <button
            type="button"
            onClick={() => { playPop(); setCurrentMood('studying'); onMoodChange?.('studying') }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              currentMood === 'studying'
                ? 'bg-indigo-600 text-white shadow-md scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            }`}
          >
            <span>📚 Study</span>
          </button>

          <button
            type="button"
            onClick={() => { playPop(); setCurrentMood('celebrating'); onMoodChange?.('celebrating') }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              currentMood === 'celebrating'
                ? 'bg-indigo-600 text-white shadow-md scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            }`}
          >
            <span>🎉 Celebrate</span>
          </button>

          <button
            type="button"
            onClick={() => { playPop(); setCurrentMood('curious'); onMoodChange?.('curious') }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              currentMood === 'curious'
                ? 'bg-indigo-600 text-white shadow-md scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            }`}
          >
            <span>🤔 Curious</span>
          </button>
        </div>
      )}
    </div>
  )
}
