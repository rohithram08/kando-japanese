// src/components/common/KeyboardShortcutsModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Keyboard Shortcuts Cheatsheet Modal (?)
// Senior-grade power-user shortcuts for readers, quizzes, audio & navigation.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard, Compass, BookOpen, RefreshCw, PenTool } from 'lucide-react'

export interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ShortcutSection {
  title: string
  icon: React.ComponentType<{ className?: string }>
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: 'Global Navigation',
    icon: Compass,
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open Quick Search & Command Palette (or Ctrl+K)' },
      { keys: ['/'], description: 'Focus search or open command palette' },
      { keys: ['?'], description: 'Open this keyboard shortcuts modal' },
      { keys: ['Esc'], description: 'Close any active modal, dialog, or drawer' },
    ],
  },
  {
    title: 'Graded Readers (多読)',
    icon: BookOpen,
    shortcuts: [
      { keys: ['J', 'or', '→'], description: 'Next sentence in story' },
      { keys: ['K', 'or', '←'], description: 'Previous sentence in story' },
      { keys: ['Space'], description: 'Play / replay sentence audio pronunciation' },
      { keys: ['T'], description: 'Toggle English translation visibility' },
      { keys: ['N'], description: 'Open / close story vocabulary notes drawer' },
    ],
  },
  {
    title: 'SRS Reviews & Quizzes',
    icon: RefreshCw,
    shortcuts: [
      { keys: ['1', '2', '3', '4'], description: 'Select multiple-choice option directly' },
      { keys: ['Enter'], description: 'Submit quiz answer or continue to next question' },
      { keys: ['Space'], description: 'Flip flashcard or replay native audio' },
    ],
  },
  {
    title: 'Kana & Kanji Studio',
    icon: PenTool,
    shortcuts: [
      { keys: ['Space'], description: 'Replay stroke order stroke-by-stroke animation' },
      { keys: ['R'], description: 'Clear / reset active tracing canvas' },
    ],
  },
]

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard Shortcuts"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Keyboard Shortcuts</h2>
                <p className="text-xs text-muted-foreground">Power-user keyboard controls for fast learning</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close shortcuts"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Shortcut Grid ───────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {SHORTCUT_SECTIONS.map((section) => {
              const SectionIcon = section.icon
              return (
                <div key={section.title} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    <SectionIcon className="w-3.5 h-3.5" />
                    <span>{section.title}</span>
                  </div>

                  <div className="space-y-2">
                    {section.shortcuts.map((shortcut, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/60 transition-colors"
                      >
                        <span className="text-foreground/90 font-medium leading-relaxed">
                          {shortcut.description}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          {shortcut.keys.map((k, kIdx) =>
                            k === 'or' ? (
                              <span key={kIdx} className="text-[10px] text-muted-foreground/60 px-0.5">
                                or
                              </span>
                            ) : (
                              <kbd
                                key={kIdx}
                                className="px-2 py-1 text-[11px] font-mono font-semibold text-foreground bg-surface border border-border shadow-2xs rounded-md"
                              >
                                {k}
                              </kbd>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Footer ──────────────────────────────────────────────── */}
          <div className="px-6 py-3 border-t border-border bg-surface-muted/30 flex items-center justify-between text-xs text-muted-foreground">
            <span>Press <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-[10px]">?</kbd> anywhere to reopen</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
