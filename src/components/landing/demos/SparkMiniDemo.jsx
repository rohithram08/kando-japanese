// src/components/landing/demos/SparkMiniDemo.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Volume2, RotateCcw, Flame, Sparkles } from 'lucide-react'
import { playPop } from '../../../utils/soundEffects'

const SPARKS = [
  {
    japanese: '「毎日の小さな積み重ねが、大きな力になります！」',
    romaji: 'Mainichi no chiisana tsumikasane ga, ookina chikara ni narimasu!',
    translation: 'Small daily steps build tremendous strength!',
    theme: 'Consistency & Habit',
  },
  {
    japanese: '「こんにちは！一緒に日本語を勉強しましょう！」',
    romaji: 'Konnichiwa! Issho ni nihongo o benkyou shimashou!',
    translation: "Hello! Let's study Japanese together!",
    theme: 'Warm Welcoming',
  },
  {
    japanese: '「今日も一歩ずつ、楽しく学びましょう！」',
    romaji: 'Kyou mo ippo zutsu, tanoshiku manabimashou!',
    translation: "Step by step, let's enjoy learning today too!",
    theme: 'Daily Motivation',
  },
  {
    japanese: '「ようこそ！生きた日本語の世界へ！」',
    romaji: 'Youkoso! Ikita nihongo no sekai e!',
    translation: 'Welcome to the world of living Japanese!',
    theme: 'Natural Context',
  },
]

export default function SparkMiniDemo() {
  const [index, setIndex] = useState(0)

  const currentSpark = SPARKS[index]

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

  const handleNext = () => {
    playPop()
    setIndex((prev) => (prev + 1) % SPARKS.length)
  }

  return (
    <div className="space-y-3.5 text-left relative">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5" />
          <span>Hana-sensei's Daily Spark</span>
        </span>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Next Spark</span>
        </button>
      </div>

      {/* Spark Message Card */}
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-2xl bg-surface border border-purple-500/30 shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              {currentSpark.theme}
            </span>
            <button
              type="button"
              onClick={() => speak(currentSpark.japanese)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Listen to Hana-sensei"
              aria-label="Listen to Hana-sensei"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm sm:text-base font-bold text-foreground font-jp mb-1.5 leading-relaxed">
            {currentSpark.japanese}
          </p>

          <p className="text-xs text-muted-foreground italic mb-1">
            "{currentSpark.translation}"
          </p>

          <p className="text-[10px] text-muted-foreground/70 font-mono">
            {currentSpark.romaji}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Streak Incentive Banner */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="font-bold text-foreground">
            7 Day Streak Bonus
          </span>
        </div>
        <div className="text-[11px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>+15 XP Awarded</span>
        </div>
      </div>

      <div className="text-[11px] text-muted-foreground text-center font-medium">
        Streak tracking · Keigo tuning · Cultural context
      </div>
    </div>
  )
}
