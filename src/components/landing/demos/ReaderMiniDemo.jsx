// src/components/landing/demos/ReaderMiniDemo.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Volume2, Plus, Check, Eye, EyeOff } from 'lucide-react'
import { useSRSStore } from '../../../store/srsStore'
import { playPop } from '../../../utils/soundEffects'

const ANNOTATED_WORDS = {
  電車: {
    surface: '電車',
    reading: 'でんしゃ',
    romaji: 'densha',
    meaning: 'train / electric train',
    pos: 'noun · N5',
    pitch: 'Heiban (0) ── Flat contour',
    refId: 'n5_vocab_densha',
  },
  一人: {
    surface: '一人',
    reading: 'ひとり',
    romaji: 'hitori',
    meaning: 'one person / by oneself',
    pos: 'noun / adverb · N5',
    pitch: 'Atamadaka (①) ── Drop on first mora',
    refId: 'n5_vocab_hitori',
  },
  初めて: {
    surface: '初めて',
    reading: 'はじめて',
    romaji: 'hajimete',
    meaning: 'for the first time',
    pos: 'adverb · N5',
    pitch: 'Nakadaka (②) ── Middle drop',
    refId: 'n5_vocab_hajimete',
  },
}

export default function ReaderMiniDemo() {
  const [showFurigana, setShowFurigana] = useState(true)
  const [activeWordKey, setActiveWordKey] = useState('電車')
  const [srsSuccess, setSrsSuccess] = useState(false)
  const { isCardInSRS, addCardToSRS } = useSRSStore()

  const activeWord = ANNOTATED_WORDS[activeWordKey] || ANNOTATED_WORDS['電車']
  const isInSRS = activeWord ? isCardInSRS(activeWord.refId) || srsSuccess : false

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

  const handleWordClick = (wordKey) => {
    playPop()
    setActiveWordKey(wordKey)
    speak(wordKey)
    setSrsSuccess(false)
  }

  const handleAddToSRS = async (e) => {
    e.stopPropagation()
    playPop()
    if (activeWord) {
      await addCardToSRS('vocabulary', activeWord.refId, activeWord.surface)
      setSrsSuccess(true)
    }
  }

  return (
    <div className="space-y-3.5 text-left relative">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs font-bold">
        <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>健太の初めての電車 (Kenta's First Train)</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Furigana toggle button */}
          <button
            type="button"
            onClick={() => {
              playPop()
              setShowFurigana(!showFurigana)
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            title="Toggle furigana ruby text"
          >
            {showFurigana ? (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Hide Furigana</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>Show Furigana</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Sentence Passage */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm">
        <div className="text-base sm:text-lg font-bold text-foreground font-jp leading-loose mb-2">
          <span>健太は七歳で、今日</span>

          {/* Interactive Word 1: 初めて */}
          <span
            onClick={() => handleWordClick('初めて')}
            className={`inline-block px-1 mx-0.5 rounded-md cursor-pointer transition-all ${
              activeWordKey === '初めて'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 ring-2 ring-emerald-500/40'
                : 'hover:bg-muted'
            }`}
          >
            <ruby>
              初[はじ]めて
              {showFurigana && <rt className="text-[10px] text-muted-foreground">はじめて</rt>}
            </ruby>
          </span>

          {/* Interactive Word 2: 一人 */}
          <span
            onClick={() => handleWordClick('一人')}
            className={`inline-block px-1 mx-0.5 rounded-md cursor-pointer transition-all ${
              activeWordKey === '一人'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 ring-2 ring-emerald-500/40'
                : 'hover:bg-muted'
            }`}
          >
            <ruby>
              一人[ひとり]
              {showFurigana && <rt className="text-[10px] text-muted-foreground">ひとり</rt>}
            </ruby>
          </span>
          <span>で</span>

          {/* Interactive Word 3: 電車 */}
          <span
            data-testid="word-densha"
            onClick={() => handleWordClick('電車')}
            className={`inline-block px-1 mx-0.5 rounded-md cursor-pointer transition-all ${
              activeWordKey === '電車'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 ring-2 ring-emerald-500/40'
                : 'hover:bg-muted'
            }`}
          >
            <ruby>
              電車[でんしゃ]
              {showFurigana && <rt className="text-[10px] text-muted-foreground">でんしゃ</rt>}
            </ruby>
          </span>
          <span>に乗ります。</span>
        </div>

        <p className="text-xs text-muted-foreground italic">
          "Kenta is seven years old and rides the train alone for the first time today."
        </p>

        {/* Sentence audio playback button */}
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => speak('健太は七歳で、今日初めて一人で電車に乗ります。')}
            className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen Native Speech</span>
          </button>
          <span className="text-[10px] text-muted-foreground font-mono">
            Tap highlighted words
          </span>
        </div>
      </div>

      {/* Word Quick Lookup Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWordKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="p-3.5 rounded-2xl bg-muted/40 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-inner"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-jp text-foreground">
                {activeWord.surface}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-jp font-semibold">
                【{activeWord.reading}】
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {activeWord.pos}
              </span>
            </div>
            <div className="text-xs text-foreground/90 font-medium truncate mt-0.5">
              {activeWord.meaning}
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              {activeWord.pitch}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToSRS}
              disabled={isInSRS}
              aria-label={isInSRS ? 'In SRS Deck' : 'Add to SRS'}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                isInSRS
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'btn-3d-primary py-1 px-2.5 text-[11px]'
              }`}
            >
              {isInSRS ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>In SRS Deck</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to SRS</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
