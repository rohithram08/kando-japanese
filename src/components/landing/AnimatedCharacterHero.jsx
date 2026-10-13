import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Volume2, RotateCcw, Flame } from 'lucide-react'
import HanaSenseiCharacter2D from '../sensei/HanaSenseiCharacter2D'
import { playPop } from '../../utils/soundEffects'

const GREETINGS = [
  {
    japanese: '「こんにちは！一緒に日本語を勉強しましょう！」',
    romaji: 'Konnichiwa! Issho ni nihongo o benkyou shimashou!',
    english: "Hello! Let's study Japanese together! I'll guide you through stories, conversation, and grammar.",
  },
  {
    japanese: '「今日も一歩ずつ、楽しく学びましょう！」',
    romaji: 'Kyou mo ippo zutsu, tanoshiku manabimashou!',
    english: "Step by step, let's enjoy learning today too! Consistency creates true fluency.",
  },
  {
    japanese: '「分からないことがあれば、何でも聞いてね！」',
    romaji: 'Wakaranai koto ga areba, nan demo kiite ne!',
    english: "If there's anything you don't understand, just ask me anytime!",
  },
  {
    japanese: '「ようこそ！生きた日本語の世界へ！」',
    romaji: 'Youkoso! Ikita nihongo no sekai e!',
    english: "Welcome to the world of living Japanese! Real context, real comprehension.",
  },
]

const FLOATING_KANA = [
  {
    char: 'あ',
    type: 'Hiragana',
    romaji: 'a',
    note: 'First step',
    pos: 'top-4 -left-4 sm:-left-6',
    anim: 'animate-float-slow',
    delay: '0s',
    parallax: { x: -14, y: -10 },
  },
  {
    char: '桜',
    type: 'Kanji',
    romaji: 'sakura',
    note: 'Cherry blossom',
    pos: 'top-8 -right-4 sm:-right-6',
    anim: 'animate-float-medium',
    delay: '1.2s',
    parallax: { x: 16, y: -12 },
  },
  {
    char: '猫',
    type: 'Kanji',
    romaji: 'neko',
    note: 'Cat',
    pos: 'bottom-24 -left-6 sm:-left-8',
    anim: 'animate-float-medium',
    delay: '2.1s',
    parallax: { x: -12, y: 14 },
  },
  {
    char: '話',
    type: 'Kanji',
    romaji: 'hanasu',
    note: 'Speak / Dialogue',
    pos: 'bottom-16 -right-6 sm:-right-8',
    anim: 'animate-float-slow',
    delay: '3.4s',
    parallax: { x: 14, y: 12 },
  },
]

export default function AnimatedCharacterHero({ onSpeak, isSpeaking }) {
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [activeKana, setActiveKana] = useState(null)
  const [characterState, setCharacterState] = useState('idle')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const heroStageRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch =
        'ontouchstart' in window ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
      setIsTouchDevice(isTouch)
    }
  }, [])

  const activeGreeting = GREETINGS[greetingIndex]

  const nextGreeting = () => {
    setGreetingIndex((prev) => (prev + 1) % GREETINGS.length)
  }

  // Mouse parallax tracking for non-touch desktop devices
  const handleMouseMove = (e) => {
    if (isTouchDevice || !heroStageRef.current) return
    const rect = heroStageRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const xRatio = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)))
    const yRatio = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)))
    setMousePos({ x: xRatio, y: yRatio })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  // Hana-sensei hover wave & click reaction
  const handleMouseEnterHana = () => {
    if (!isSpeaking && characterState === 'idle') {
      setCharacterState('greeting')
    }
  }

  const handleMouseLeaveHana = () => {
    if (!isSpeaking && characterState === 'greeting') {
      setCharacterState('idle')
    }
  }

  const handleCharacterClick = () => {
    setCharacterState('happy')
    playPop()
    nextGreeting()
    setTimeout(() => {
      setCharacterState((prev) => (prev === 'happy' ? 'idle' : prev))
    }, 2200)
  }

  const handleNextGreeting = () => {
    playPop()
    nextGreeting()
  }

  const handleKanaClick = (item) => {
    setActiveKana(item.char === activeKana ? null : item.char)
    setCharacterState('listening')
    playPop()
    if (onSpeak) {
      onSpeak(item.char)
    }
    setTimeout(() => {
      setCharacterState((prev) => (prev === 'listening' ? 'idle' : prev))
    }, 1800)
  }

  return (
    <div
      ref={heroStageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg lg:max-w-xl mx-auto flex flex-col items-center"
    >
      {/* ── Ambient Radial Glow Backdrop ──────────────────────────── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-rose-500/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Dynamic Manga Speech Bubble ────────────────────────────── */}
      <div
        key={greetingIndex}
        className="w-full mb-4 sm:mb-6 card p-4 sm:p-5 rounded-3xl border border-indigo-500/25 bg-surface/95 backdrop-blur-md shadow-xl relative animate-bubble-pop z-30 transition-all"
        role="region"
        aria-label="Hana-sensei welcome message"
      >
        {/* Header row with avatar badge, speaker, and controls */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-bold text-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Hana-sensei (花先生)</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              AI Tutor
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Pronunciation audio button */}
            <button
              type="button"
              onClick={() => onSpeak && onSpeak(activeGreeting.japanese)}
              disabled={isSpeaking}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Listen to Japanese pronunciation"
              aria-label="Listen to Hana-sensei greeting"
            >
              <Volume2 className={`w-4 h-4 text-primary ${isSpeaking ? 'animate-bounce' : ''}`} />
            </button>

            {/* Cycle to next greeting button */}
            <button
              type="button"
              onClick={handleNextGreeting}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-xs flex items-center gap-1"
              title="Next greeting"
              aria-label="Next Japanese greeting"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Japanese Greeting (Authentic Japanese Font) */}
        <div className="text-base sm:text-lg font-bold text-foreground leading-snug tracking-wide mb-1 font-jp">
          {activeGreeting.japanese}
        </div>

        {/* Romaji pronunciation */}
        <div className="text-[11px] sm:text-xs text-primary font-medium tracking-wide mb-1">
          {activeGreeting.romaji}
        </div>

        {/* English Translation */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          "{activeGreeting.english}"
        </p>

        {/* Comic speech bubble tail pointing to Hana-sensei */}
        <div
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-r border-b border-indigo-500/25 transform rotate-45 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* ── Character Center Stage & Floating Japanese Objects ──────── */}
      <div className="relative w-full max-w-[340px] sm:max-w-[420px] h-[340px] sm:h-[420px] flex items-center justify-center hana-character-container select-none">
        
        {/* Halo Glow Ring */}
        <div
          className="absolute inset-4 rounded-full border-2 border-dashed border-indigo-500/20 animate-halo pointer-events-none"
          aria-hidden="true"
        />

        {/* Floating Mini Streak Badge (Top Left) */}
        <div
          className="absolute top-2 left-2 z-20 px-3 py-1.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-lg flex items-center gap-2 animate-float-slow"
          style={{
            animationDelay: '0.4s',
            transform: isTouchDevice
              ? undefined
              : `translate3d(${mousePos.x * -8}px, ${mousePos.y * -8}px, 0)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <span className="p-1 rounded-lg bg-orange-500/10 text-orange-500">
            <Flame className="w-3.5 h-3.5" />
          </span>
          <div className="text-left">
            <div className="text-[10px] text-muted-foreground font-semibold leading-tight">Daily Habit</div>
            <div className="text-xs font-black text-foreground">7-Day Streak 🔥</div>
          </div>
        </div>

        {/* Floating Mini Vocab Card (Top Right) */}
        <div
          className="absolute top-4 right-0 z-20 px-3 py-1.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-lg flex items-center gap-2 animate-float-medium"
          style={{
            animationDelay: '1.8s',
            transform: isTouchDevice
              ? undefined
              : `translate3d(${mousePos.x * 10}px, ${mousePos.y * -10}px, 0)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-xs">
            猫
          </span>
          <div className="text-left">
            <div className="text-[10px] text-muted-foreground font-medium leading-tight">N5 Vocab</div>
            <div className="text-xs font-bold text-foreground">ねこ · Cat</div>
          </div>
        </div>

        {/* Floating Mini Steaming Tea Cup (Bottom Left) */}
        <div
          className="absolute bottom-6 left-0 z-20 px-2.5 py-1.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-md flex items-center gap-1.5 animate-float-slow"
          style={{
            animationDelay: '2.4s',
            transform: isTouchDevice
              ? undefined
              : `translate3d(${mousePos.x * -10}px, ${mousePos.y * 8}px, 0)`,
            transition: 'transform 0.15s ease-out',
          }}
          title="Matcha tea break"
        >
          <div className="relative">
            <span className="text-base">🍵</span>
            <span className="absolute -top-2 left-1.5 w-1 h-2 rounded-full bg-emerald-400/50 animate-steam" />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground">お茶の時間</span>
        </div>

        {/* Floating JLPT Progress Pill (Bottom Right) */}
        <div
          className="absolute bottom-4 right-0 z-20 px-3 py-1.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-lg flex items-center gap-1.5 animate-float-medium"
          style={{
            animationDelay: '0.9s',
            transform: isTouchDevice
              ? undefined
              : `translate3d(${mousePos.x * 8}px, ${mousePos.y * 10}px, 0)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          <span className="text-[11px] font-black text-foreground">N5 → N1</span>
          <span className="text-[10px] text-muted-foreground font-medium">Roadmap</span>
        </div>

        {/* ── Interactive Floating Kana & Kanji Chips with Cursor Parallax ── */}
        {FLOATING_KANA.map((item) => {
          const xOffset = isTouchDevice ? 0 : mousePos.x * item.parallax.x
          const yOffset = isTouchDevice ? 0 : mousePos.y * item.parallax.y

          return (
            <button
              key={item.char}
              type="button"
              onClick={() => handleKanaClick(item)}
              className={`absolute ${item.pos} z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-surface/95 backdrop-blur-md border border-indigo-500/25 shadow-md flex flex-col items-center justify-center font-bold text-sm sm:text-base text-foreground transition-all duration-300 hover:scale-125 hover:border-indigo-500 hover:bg-indigo-500/10 hover:shadow-indigo-500/25 cursor-pointer ${item.anim}`}
              style={{
                animationDelay: item.delay,
                transform: isTouchDevice ? undefined : `translate3d(${xOffset}px, ${yOffset}px, 0)`,
                transition: 'transform 0.15s ease-out',
              }}
              title={`Click to pronounce: ${item.char} (${item.romaji})`}
              aria-label={`${item.type} character ${item.char}`}
            >
              <span className="font-jp text-primary">{item.char}</span>
              <span className="text-[8px] text-muted-foreground -mt-1 font-mono uppercase">
                {item.romaji}
              </span>
            </button>
          )
        })}

        {/* ── Prominent 2D Hana-sensei Illustration with Hover Wave ── */}
        <div
          onMouseEnter={handleMouseEnterHana}
          onMouseLeave={handleMouseLeaveHana}
          className="relative transition-transform duration-300 hover:scale-[1.03]"
        >
          <HanaSenseiCharacter2D
            state={isSpeaking ? 'greeting' : characterState}
            size="lg"
            interactive={true}
            showAura={true}
            showStatusPill={true}
            onCharacterClick={handleCharacterClick}
            onStateChange={setCharacterState}
          />
        </div>

      </div>

      {/* ── Subtitle Cue ───────────────────────────────────────────── */}
      <div className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1.5 opacity-80">
        <Sparkles className="w-3 h-3 text-primary" />
        <span>Tap Hana-sensei or floating chips to interact & hear pronunciation</span>
      </div>

    </div>
  )
}
