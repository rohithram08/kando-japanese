import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Volume2, RotateCcw, Flame } from 'lucide-react'
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
        aria-label="Kando Slime welcome message"
      >
        {/* Header row with avatar badge, speaker, and controls */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-bold text-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Kando Slime (感動スライム) 🌸</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Interactive 2D Mascot
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
              aria-label="Listen to Kando Slime greeting"
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

        {/* Comic speech bubble tail pointing to Kando Slime */}
        <div
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-r border-b border-indigo-500/25 transform rotate-45 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* ── Character Center Stage & Synchronized Japanese Orbit Satellites ──────── */}
      <div className="relative w-full max-w-[390px] sm:max-w-[460px] h-[350px] sm:h-[390px] flex items-center justify-center select-none">
        
        {/* Subtle Celestial Orbit Track with Rotating Glow */}
        <div
          className="absolute inset-4 rounded-full border-2 border-dashed border-indigo-400/20 animate-orbit-ring pointer-events-none"
          aria-hidden="true"
        >
          {/* Subtle celestial orbital sparkles on the track */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400/80 shadow-sm shadow-cyan-400" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-400/80 shadow-sm shadow-pink-400" />
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400/80 shadow-sm shadow-amber-400" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-indigo-400/80 shadow-sm shadow-indigo-400" />
        </div>

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

      {/* ── Mascot Mood Switcher Buttons (Single, Clean Dock — No Duplicates) ── */}
      <div className="flex items-center justify-center gap-1.5 mt-3 z-20 flex-wrap p-1.5 rounded-full bg-surface/90 backdrop-blur-md border border-border/70 shadow-md">
        {[
          { id: 'waving', label: '👋 Wave' },
          { id: 'studying', label: '📚 Study' },
          { id: 'celebrating', label: '🎉 Celebrate' },
          { id: 'curious', label: '🤔 Curious' },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => {
              playPop()
              setSlimeMood(btn.id)
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
              slimeMood === btn.id
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ── Subtitle Cue ───────────────────────────────────────────── */}
      <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5 opacity-80">
        <Sparkles className="w-3 h-3 text-primary" />
        <span>Tap Kando Slime to squish & poke · Eyes track your cursor in real time</span>
      </div>

    </div>
  )
}
