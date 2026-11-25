import React, { useState, useRef, useEffect } from 'react'
import { Volume2, RotateCcw, Flame } from 'lucide-react'
import KandoSlime from '../mascot/KandoSlime'
import { playPop } from '../../utils/soundEffects'

const GREETINGS = [
  {
    japanese: '「こんにちは！一緒に日本語を勉強しましょう！」',
    romaji: 'Konnichiwa! Issho ni nihongo o benkyou shimashou!',
    english: "Hello! Let's study Japanese together! I'll guide you through stories, conversation, and grammar.",
    mood: 'waving',
  },
  {
    japanese: '「今日も一歩ずつ、楽しく学びましょう！」',
    romaji: 'Kyou mo ippo zutsu, tanoshiku manabimashou!',
    english: "Step by step, let's enjoy learning today too! Consistent practice helps you progress toward fluency.",
    mood: 'idle',
  },
  {
    japanese: '「やっほー！感動スライムだよ！一緒に日本語を学ぼう！」',
    romaji: 'Yahho~! Kando Suraimu da yo! Issho ni nihongo o manabou!',
    english: "Hii there! I'm Kando Slime! Let's master Japanese together!",
    mood: 'waving',
  },
  {
    japanese: '「必勝！漢字も文法も、毎日コツコツ覚えるよ！」',
    romaji: 'Hisshou! Kanji mo bunpou mo, mainichi kotsukotsu oboeru yo!',
    english: "Victory! Kanji and grammar, mastering them piece by piece!",
    mood: 'studying',
  },
  {
    japanese: '「すごい！よくできました！レベルアップ！」',
    romaji: 'Sugoi! Yoku dekimashita! Reberu appu!',
    english: "Incredible! Fantastic work! Level Up!",
    mood: 'celebrating',
  },
]

const SATELLITE_CARDS = [
  {
    id: 'streak',
    category: 'Daily Habit',
    icon: '🔥',
    title: '7-Day Streak',
    subtitle: '継続は力なり',
    position: 'top-2 -left-2 sm:-left-6',
    animClass: 'animate-satellite-tl',
    borderGlow: 'hover:border-amber-500/60 hover:shadow-amber-500/20',
    badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    type: 'streak',
  },
  {
    id: 'kanji',
    category: 'JLPT N5 Kanji',
    japanese: '桜',
    romaji: 'sakura',
    meaning: 'Cherry Blossom',
    speakText: 'さくら',
    position: 'top-2 -right-2 sm:-right-6',
    animClass: 'animate-satellite-tr',
    borderGlow: 'hover:border-rose-400/60 hover:shadow-rose-500/20',
    badgeBg: 'bg-rose-500/15 text-rose-500',
    type: 'interactive',
    ariaLabel: 'Kanji character 桜',
  },
  {
    id: 'kana',
    category: 'Hiragana Foundation',
    japanese: 'あ',
    romaji: 'a',
    meaning: 'First Step',
    speakText: 'あ',
    position: 'bottom-4 -left-2 sm:-left-6',
    animClass: 'animate-satellite-bl',
    borderGlow: 'hover:border-indigo-500/60 hover:shadow-indigo-500/20',
    badgeBg: 'bg-indigo-500/15 text-indigo-500',
    type: 'interactive',
    ariaLabel: 'Hiragana character あ',
  },
  {
    id: 'vocab',
    category: 'Core Vocab',
    japanese: '猫',
    furigana: 'ねこ',
    romaji: 'neko',
    meaning: 'Cat',
    speakText: 'ねこ',
    position: 'bottom-4 -right-2 sm:-right-6',
    animClass: 'animate-satellite-br',
    borderGlow: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20',
    badgeBg: 'bg-emerald-500/15 text-emerald-500',
    type: 'interactive',
    ariaLabel: 'Vocabulary word 猫',
  },
]

export default function AnimatedCharacterHero({ onSpeak, isSpeaking }) {
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [activeKana, setActiveKana] = useState(null)
  const [slimeMood, setSlimeMood] = useState('waving')
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
    setGreetingIndex((prev) => {
      const nextIdx = (prev + 1) % GREETINGS.length
      setSlimeMood(GREETINGS[nextIdx].mood || 'waving')
      return nextIdx
    })
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

  const handleNextGreeting = () => {
    playPop()
    nextGreeting()
  }

  const handleSatelliteClick = (item) => {
    setActiveKana(item.id === activeKana ? null : item.id)
    playPop()
    if (item.type === 'streak') {
      setSlimeMood('celebrating')
    } else if (item.speakText) {
      if (onSpeak) onSpeak(item.speakText)
      setSlimeMood(item.id === 'kana' ? 'waving' : item.id === 'vocab' ? 'celebrating' : 'curious')
    }
  }

  return (
    <div
      ref={heroStageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg lg:max-w-xl mx-auto flex flex-col items-center"
    >
      {/* ── Crisp Dialogue Bubble ────────────────────────────── */}
      <div
        key={greetingIndex}
        className="w-full mb-4 sm:mb-6 card p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-card-md relative animate-bubble-pop z-30 transition-all"
        role="region"
        aria-label="Kando Slime welcome message"
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">
              Kando Slime
            </span>
            <span className="text-[11px] font-jp text-muted-foreground">
              感動スライム
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Pronunciation audio button */}
            <button
              type="button"
              onClick={() => onSpeak && onSpeak(activeGreeting.japanese)}
              disabled={isSpeaking}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Listen to Japanese pronunciation"
              aria-label="Listen to Kando Slime greeting"
            >
              <Volume2 className={`w-4 h-4 text-primary ${isSpeaking ? 'animate-pulse' : ''}`} />
            </button>

            {/* Cycle to next greeting button */}
            <button
              type="button"
              onClick={handleNextGreeting}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-xs flex items-center gap-1"
              title="Next greeting"
              aria-label="Next Japanese greeting"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Japanese Greeting */}
        <div className="text-base sm:text-lg font-bold text-foreground leading-snug tracking-wide mb-1 font-jp">
          {activeGreeting.japanese}
        </div>

        {/* Romaji pronunciation */}
        <div className="text-[11px] sm:text-xs text-primary font-medium tracking-wide mb-1">
          {activeGreeting.romaji}
        </div>

        {/* English Translation */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          &ldquo;{activeGreeting.english}&rdquo;
        </p>

        {/* Speech bubble pointer */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-surface border-r border-b border-border transform rotate-45 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* ── Character Center Stage & Satellites ──────── */}
      <div className="relative w-full max-w-[390px] sm:max-w-[460px] h-[350px] sm:h-[390px] flex items-center justify-center select-none">
        
        {/* Clean Architectural Concentric Ring */}
        <div
          className="absolute inset-6 rounded-full border border-border/60 pointer-events-none"
          aria-hidden="true"
        />

        {/* ── 4 Non-Overlapping Interactive Learning Satellites ── */}
        {SATELLITE_CARDS.map((card) => {
          const parallaxX = isTouchDevice ? 0 : mousePos.x * 4
          const parallaxY = isTouchDevice ? 0 : mousePos.y * 4

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleSatelliteClick(card)}
              className={`absolute ${card.position} z-20 px-3 py-1.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border/70 shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${card.animClass} ${card.borderGlow}`}
              style={{
                transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
              }}
              title={card.type === 'streak' ? 'Daily Habit Streak' : `Click to hear: ${card.japanese} (${card.romaji})`}
              aria-label={card.ariaLabel || card.title || `${card.japanese} - ${card.meaning}`}
            >
              {card.type === 'streak' ? (
                <>
                  <span className={`p-1.5 rounded-xl ${card.badgeBg}`}>
                    <Flame className="w-3.5 h-3.5 fill-current" />
                  </span>
                  <div className="text-left">
                    <div className="text-[10px] text-muted-foreground font-semibold leading-tight">{card.category}</div>
                    <div className="text-xs font-black text-foreground">{card.title}</div>
                  </div>
                </>
              ) : (
                <>
                  <span className={`w-8 h-8 rounded-xl ${card.badgeBg} flex items-center justify-center font-jp font-black text-sm`}>
                    {card.japanese}
                  </span>
                  <div className="text-left">
                    <div className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider leading-tight">{card.romaji}</div>
                    <div className="text-xs font-bold text-foreground">{card.meaning}</div>
                  </div>
                </>
              )}
            </button>
          )
        })}

        {/* ── Centered 2D Kando Slime Mascot (Interactive, Eye-Tracking, Squash & Stretch) ── */}
        <div className="relative z-10 transition-transform duration-300">
          <KandoSlime
            mood={slimeMood}
            size={230}
            interactive={true}
            showSpeech={false}
            showMoodButtons={false}
            onSpeak={onSpeak}
            onMoodChange={setSlimeMood}
          />
        </div>

      </div>

      {/* ── Segmented Expression Switcher ── */}
      <div className="flex items-center justify-center gap-1 mt-3 z-20 flex-wrap p-1 rounded-full bg-surface-muted border border-border shadow-2xs">
        {[
          { id: 'waving', label: 'Wave' },
          { id: 'studying', label: 'Study' },
          { id: 'celebrating', label: 'Celebrate' },
          { id: 'curious', label: 'Curious' },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => {
              playPop()
              setSlimeMood(btn.id)
            }}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
              slimeMood === btn.id
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ── Subtitle Cue ───────────────────────────────────────────── */}
      <p className="text-[11px] text-muted-foreground mt-2.5">
        Click any satellite card to hear native pronunciation
      </p>

    </div>
  )
}
