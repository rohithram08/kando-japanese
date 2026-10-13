// src/components/landing/demos/KanaMiniDemo.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, RotateCcw, Sparkles } from 'lucide-react'
import { KANA_STROKES } from '../../../data/kana/kanaStrokes'
import { playPop } from '../../../utils/soundEffects'

const KANA_ITEMS = [
  { char: 'あ', romaji: 'a' },
  { char: 'い', romaji: 'i' },
  { char: 'う', romaji: 'u' },
  { char: 'え', romaji: 'e' },
  { char: 'お', romaji: 'o' },
]

export default function KanaMiniDemo() {
  const [selectedKana, setSelectedKana] = useState('あ')
  const [replayKey, setReplayKey] = useState(0)
  const [showXpPop, setShowXpPop] = useState(false)

  const strokeData = KANA_STROKES[selectedKana] || KANA_STROKES['あ']

  const speak = (char) => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    )
      return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(char)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const handleSelectKana = (char) => {
    playPop()
    setSelectedKana(char)
    setReplayKey((prev) => prev + 1)
    speak(char)
    setShowXpPop(true)
    setTimeout(() => setShowXpPop(false), 1200)
  }

  const handleReplay = (e) => {
    e.stopPropagation()
    playPop()
    setReplayKey((prev) => prev + 1)
    speak(selectedKana)
  }

  return (
    <div className="space-y-4 text-left relative">
      {/* Header bar */}
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Kana Studio Demo</span>
        </span>
        <span className="text-primary font-mono text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">
          Tap any sound
        </span>
      </div>

      {/* Floating XP Pop Indicator */}
      <AnimatePresence>
        {showXpPop && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -15, scale: 1.1 }}
            exit={{ opacity: 0, y: -25, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            className="absolute top-1 right-3 z-30 pointer-events-none bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1"
          >
            <span>+10 XP</span>
            <span>⭐</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kana 5-vowel tiles */}
      <div className="grid grid-cols-5 gap-2">
        {KANA_ITEMS.map((k) => {
          const isSelected = selectedKana === k.char
          return (
            <motion.button
              key={k.char}
              type="button"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleSelectKana(k.char)}
              aria-label={`Practice Kana ${k.char} (${k.romaji})`}
              className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer shadow-sm relative ${
                isSelected
                  ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-300 ring-2 ring-rose-500/30'
                  : 'bg-surface border-border text-foreground hover:border-primary/50'
              }`}
            >
              <div className="text-xl sm:text-2xl font-bold font-jp">
                {k.char}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {k.romaji}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Animated Stroke Order Box */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-surface/90 border border-border flex items-center gap-4 shadow-sm">
        {/* SVG Canvas with animated strokes */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/30 rounded-xl border border-border/80 flex items-center justify-center relative shrink-0 overflow-hidden">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 border-b border-border/40 top-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute inset-0 border-r border-border/40 left-1/2 -translate-x-1/2 pointer-events-none" />

          <svg
            key={replayKey}
            viewBox="0 0 100 100"
            className="w-16 h-16 sm:w-20 sm:h-20"
          >
            {strokeData.strokes.map((d, index) => (
              <motion.path
                key={`${selectedKana}-${index}-${replayKey}`}
                d={d}
                fill="none"
                stroke="currentColor"
                className="text-rose-500 dark:text-rose-400"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.45,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </svg>
        </div>

        {/* Tips & replay controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-foreground">
              {strokeData.strokeCount} Strokes · Animated Order
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => speak(selectedKana)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Pronounce character"
                aria-label={`Pronounce ${selectedKana}`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleReplay}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Replay stroke order"
                aria-label="Replay stroke animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground leading-tight space-y-1">
            {strokeData.tips.slice(0, 2).map((tip, idx) => (
              <p key={idx} className="truncate">
                {tip}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
