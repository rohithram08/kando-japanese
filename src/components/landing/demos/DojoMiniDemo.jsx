// src/components/landing/demos/DojoMiniDemo.jsx
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { playPop } from '../../../utils/soundEffects'

export default function DojoMiniDemo() {
  const [status, setStatus] = useState('idle') // 'idle' | 'correct' | 'wrong'
  const [shakeKey, setShakeKey] = useState(0)
  const lastConfettiRef = useRef(0)

  const triggerConfetti = () => {
    const now = Date.now()
    if (now - lastConfettiRef.current < 2000) return
    lastConfettiRef.current = now
    try {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          disableForReducedMotion: true,
        })
      }
    } catch {
      // Ignore in environments without canvas
    }
  }

  const handleCorrect = () => {
    playPop()
    setStatus('correct')
    triggerConfetti()
  }

  const handleWrong = () => {
    playPop()
    setStatus('wrong')
    setShakeKey((prev) => prev + 1)
  }

  const handleReset = () => {
    playPop()
    setStatus('idle')
  }

  return (
    <div className="space-y-3 text-left relative">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
        <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Interactive Conversation Dojo</span>
        </span>
        {status !== 'idle' && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Host Dialogue Bubble */}
      <div className="p-3 rounded-2xl bg-surface border border-border shadow-sm flex items-start gap-2.5">
        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
          店員:
        </span>
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-bold text-foreground font-jp leading-relaxed">
            「いらっしゃいませ！何名様ですか？」
          </p>
          <p className="text-[11px] text-muted-foreground italic mt-0.5">
            "Welcome! How many people in your party?"
          </p>
        </div>
      </div>

      {/* Host Success Response if Correct */}
      <AnimatePresence>
        {status === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2.5 shadow-sm"
          >
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
              店員:
            </span>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold text-foreground font-jp leading-relaxed">
                「かしこまりました！カウンター席へどうぞ！」
              </p>
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400 italic mt-0.5">
                "Certainly! Right this way to the counter!"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Messages */}
      <AnimatePresence>
        {status === 'wrong' && (
          <motion.div
            key={`shake-${shakeKey}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              The host asked how many people. Answer that first!
            </span>
          </motion.div>
        )}
        {status === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1.5 pt-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>✓ Natural polite phrasing (N5~N4)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Natural Japanese Reply Chips */}
      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Choose Your Response:
        </div>

        {/* Option A: Correct Party Size Response */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCorrect}
          aria-label="Option 1: 一人です。カウンター席は空いていますか？"
          className={`w-full p-2.5 rounded-xl border text-left text-xs font-jp transition-all flex items-center justify-between cursor-pointer ${
            status === 'correct'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30 font-bold'
              : 'bg-surface hover:bg-muted/80 border-border text-foreground hover:border-primary/40'
          }`}
        >
          <span>「一人です。カウンター席は空いていますか？」</span>
          {status === 'correct' && (
            <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              ✓ Correct
            </span>
          )}
        </motion.button>

        {/* Option B: Natural Japanese Food Order, but premature! */}
        <motion.button
          type="button"
          key={shakeKey}
          animate={
            status === 'wrong'
              ? { x: [-6, 6, -4, 4, -2, 2, 0] }
              : undefined
          }
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleWrong}
          aria-label="Option 2: ラーメンを一つください。"
          className={`w-full p-2.5 rounded-xl border text-left text-xs font-jp transition-all flex items-center justify-between cursor-pointer ${
            status === 'wrong'
              ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30'
              : 'bg-surface hover:bg-muted/80 border-border text-foreground hover:border-primary/40'
          }`}
        >
          <span>「ラーメンを一つください。」</span>
          {status === 'wrong' && (
            <span className="text-amber-600 dark:text-amber-400 text-[11px] font-bold">
              Retry
            </span>
          )}
        </motion.button>
      </div>
    </div>
  )
}
