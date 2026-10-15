// src/components/landing/demos/SRSMiniDemo.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, RotateCcw, Volume2, Sparkles, Check } from 'lucide-react'
import { playPop } from '../../../utils/soundEffects'

const SRS_INTERVALS = [
  { label: 'Day 1', days: '1d', rating: 'Again', color: 'text-red-500 border-red-500/30' },
  { label: 'Day 3', days: '3d', rating: 'Hard', color: 'text-amber-500 border-amber-500/30' },
  { label: 'Day 7', days: '7d', rating: 'Good', color: 'text-blue-500 border-blue-500/30' },
  { label: 'Day 14', days: '14d', rating: 'Easy', color: 'text-emerald-500 border-emerald-500/30' },
  { label: 'Mastered ✨', days: '30d', rating: 'Mastered', color: 'text-amber-400 border-amber-400/40' },
]

export default function SRSMiniDemo() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeIntervalIndex, setActiveIntervalIndex] = useState(2) // Default to Day 7

  const speak = (text) => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    )
      return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const handleFlip = () => {
    playPop()
    setIsFlipped(!isFlipped)
  }

  const handleSelectRating = (index) => {
    playPop()
    setActiveIntervalIndex(index)
  }

  return (
    <div className="space-y-3.5 text-left relative">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Interactive 3D SRS Flashcard</span>
        </span>
        <button
          type="button"
          onClick={handleFlip}
          className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Tap to Flip</span>
        </button>
      </div>

      {/* 3D Flashcard Container */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: 1000 }}
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full h-36"
        >
          {/* Card Front */}
          <div
            className="absolute inset-0 w-full h-full p-4 rounded-2xl bg-surface border border-border shadow-md flex flex-col items-center justify-center text-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-3xl font-black text-foreground font-jp mb-1">
              食べる
            </div>
            <div className="text-xs text-primary font-jp font-semibold">
              たべる · taberu
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              Ichidan Verb · JLPT N5
            </div>
            <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>Click to reveal answer</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                speak('食べる')
              }}
              className="absolute top-2.5 right-2.5 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Pronounce word"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Back */}
          <div
            className="absolute inset-0 w-full h-full p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-surface border border-indigo-500/40 shadow-md flex flex-col items-center justify-center text-center backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-lg font-bold text-foreground mb-1">
              To eat / have a meal
            </div>
            <div className="text-xs text-muted-foreground font-jp italic">
              「毎日ご飯を食べます。」
            </div>
            <div className="text-[11px] text-muted-foreground/80">
              "I eat rice every day."
            </div>
            <div className="absolute top-2.5 left-2.5 text-[10px] font-bold text-indigo-400">
              Answer Revealed
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interval Rating Buttons */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
          <span>SM-2 Memory Intervals:</span>
          <span className="text-amber-500 font-mono">
            Next: {SRS_INTERVALS[activeIntervalIndex].days}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 text-center">
          {SRS_INTERVALS.map((item, idx) => {
            const isActive = activeIntervalIndex === idx
            return (
              <motion.button
                key={item.label}
                type="button"
                aria-label={`Select interval ${item.days} ${item.label}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectRating(idx)}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-surface border-border text-foreground hover:border-primary/40'
                }`}
              >
                <div>{item.days}</div>
                <div className="text-[8px] opacity-80">{item.rating}</div>
              </motion.button>
            )
          })}
        </div>

        <div className="text-[11px] text-muted-foreground text-center pt-1 font-medium">
          Spaced repetition helps reinforce memory over time.
        </div>
      </div>
    </div>
  )
}
