// src/components/kanji/KanjiStudy.jsx
// Fully rewritten — reads from unified KANJI data index

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Search, ChevronLeft, ChevronRight, Layers, RotateCcw } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { useProgressStore } from '../../store/progressStore'
import { useDailyGoalsStore } from '../../store/dailyGoalsStore'
import { useAuthStore } from '../../store/authStore'
import { audioService } from '../../services/audioService'
import { KANJI, LEVEL_META, DATA_COUNTS } from '../../data/index'
import LevelSelector from '../common/LevelSelector'
import { useLevelState } from '../../hooks/useStudyLevel'

// ── Flash-card style study view ───────────────────────────────
function FlashCard({ item, isDark: _isDark, flipped, onFlip }) {
  const meta = LEVEL_META[item.level]
  const onR   = item.readings?.on?.filter(Boolean)  || []
  const kunR  = item.readings?.kun?.filter(Boolean) || []

  const speak = (text) => audioService.speak(text)

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto cursor-pointer select-none"
      style={{ perspective: 1000, height: 240 }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front — kanji */}
        <div className={`
          absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3
          backface-hidden shadow-xl
          bg-gradient-to-br ${meta.gradient}
        `} style={{ backfaceVisibility: 'hidden' }}>
          <span className="text-7xl font-bold text-white drop-shadow-md">{item.kanji}</span>
          {item.strokeCount > 0 && (
            <span className="text-white/60 text-sm">{item.strokeCount} strokes</span>
          )}
          <span className="text-white/50 text-xs">Tap to reveal</span>
        </div>

        {/* Back — details */}
        <div
          className={`
            absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 p-6
            backface-hidden shadow-xl
            bg-white border border-gray-200 dark:bg-gray-900 dark:border dark:border-gray-700
          `}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className={`text-4xl font-bold bg-gradient-to-br ${meta.gradient} bg-clip-text text-transparent`}>
            {item.kanji}
          </span>
          <p className={`text-lg font-semibold text-foreground`}>{item.meaning}</p>
          <div className="flex gap-4 text-sm">
            {onR.length  > 0 && <span className="text-blue-600 dark:text-blue-400" ><b>音</b> {onR.join('・')}</span>}
            {kunR.filter(r=>r!=='-').length > 0 && <span className="text-green-600 dark:text-green-400"><b>訓</b> {kunR.filter(r=>r!=='-').join('・')}</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); speak(item.kanji) }}
            className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white`}
          >
            <Volume2 className="w-3 h-3" /> Listen
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function KanjiStudy() {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const { user }   = useAuthStore()
  const { awardKanjiXP } = useProgressStore()
  const addKanjiGoal = useDailyGoalsStore((s) => s.addKanji)
  const [level, setLevel, { unlocked }] = useLevelState()
  const [search,   setSearch]   = useState('')
  const [mode,     setMode]     = useState('browse')  // 'browse' | 'flashcard'
  const [cardIdx,  setCardIdx]  = useState(0)
  const [flipped,  setFlipped]  = useState(false)
  const [learned,  setLearned]  = useState(new Set())

  const meta = LEVEL_META[level]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return KANJI[level]
    return KANJI[level].filter((k) => {
      const onR  = (k.readings?.on  || []).join(' ').toLowerCase()
      const kunR = (k.readings?.kun || []).join(' ').toLowerCase()
      return (
        k.kanji.includes(search) ||
        k.meaning.toLowerCase().includes(q) ||
        onR.includes(q) || kunR.includes(q)
      )
    })
  }, [level, search])

  const currentCard = filtered[cardIdx] || filtered[0]

  const handleMarkLearned = async () => {
    if (!currentCard || learned.has(currentCard.id)) return
    setLearned(prev => new Set([...prev, currentCard.id]))
    await awardKanjiXP(user?.id, currentCard.id)
    addKanjiGoal(1)
    // Advance to next
    if (cardIdx < filtered.length - 1) {
      setCardIdx(cardIdx + 1)
      setFlipped(false)
    }
  }

  const speak = (text) => audioService.speak(text)

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${meta.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 75% 50%, white 0%, transparent 65%)' }} />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 opacity-90" />
              <span className="text-sm font-medium opacity-90">Kanji Study</span>
            </div>
            <h1 className="text-2xl font-bold">{meta.label}</h1>
            <p className="text-sm opacity-80 mt-1">
              <strong>{DATA_COUNTS.kanji[level]}</strong> characters •{' '}
              <strong>{learned.size}</strong> learned this session
            </p>
          </div>
          {/* Mode toggle */}
          <div className={`flex rounded-xl p-1 bg-white/20 dark:bg-black/20 backdrop-blur-sm`}>
            {['browse', 'flashcard'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setCardIdx(0); setFlipped(false) }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  mode === m ? 'bg-white text-gray-800 shadow' : 'text-white/80 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Level + Search */}
      <div className="space-y-3">
        <LevelSelector
          selected={level}
          onChange={(l) => { setLevel(l); setCardIdx(0); setFlipped(false); setLearned(new Set()) }}
          counts={DATA_COUNTS.kanji}
          isDark={isDark}
          levels={unlocked}
        />
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-white border-gray-200 focus-within:border-gray-300 dark:bg-gray-900 dark:border-gray-700/60 dark:focus-within:border-gray-500`}>
          <Search className={`w-4 h-4 shrink-0 text-muted-foreground`} />
          <input
            type="text"
            placeholder="Search kanji, meaning, or reading…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCardIdx(0) }}
            className={`flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 dark:text-white dark:placeholder-gray-600`}
          />
          {search && (
            <button onClick={() => setSearch('')} className={`text-xs text-muted-foreground`}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── FLASHCARD MODE ── */}
      {mode === 'flashcard' && currentCard && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className={`h-1.5 rounded-full bg-gray-200 dark:bg-gray-800`}>
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
              animate={{ width: `${((cardIdx + 1) / filtered.length) * 100}%` }}
            />
          </div>
          <p className={`text-xs text-center text-muted-foreground`}>
            {cardIdx + 1} / {filtered.length}
          </p>

          <FlashCard
            item={currentCard}
            isDark={isDark}
            flipped={flipped}
            onFlip={() => setFlipped(!flipped)}
          />

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3">
            <button
              disabled={cardIdx === 0}
              onClick={() => { setCardIdx(cardIdx - 1); setFlipped(false) }}
              className={`p-2 rounded-xl border transition-colors disabled:opacity-30 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleMarkLearned}
              disabled={learned.has(currentCard.id)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                learned.has(currentCard.id)
                  ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border dark:border-green-500/30'
                  : `bg-gradient-to-r ${meta.gradient} text-white shadow-md hover:shadow-lg`
              }`}
            >
              {learned.has(currentCard.id) ? '✓ Learned' : 'Mark as Learned'}
            </button>

            <button
              disabled={cardIdx === filtered.length - 1}
              onClick={() => { setCardIdx(cardIdx + 1); setFlipped(false) }}
              className={`p-2 rounded-xl border transition-colors disabled:opacity-30 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => { setCardIdx(0); setFlipped(false); setLearned(new Set()) }}
            className={`mx-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400`}
          >
            <RotateCcw className="w-3 h-3" /> Reset session
          </button>
        </div>
      )}

      {/* ── BROWSE MODE ── */}
      {mode === 'browse' && (
        <>
          <p className={`text-sm text-muted-foreground`}>
            {filtered.length} character{filtered.length !== 1 ? 's' : ''}
          </p>
          <motion.div layout className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speak(item.kanji)}
                  title={item.meaning}
                  className={`
                    aspect-square rounded-xl border flex flex-col items-center justify-center gap-0.5 p-1
                    transition-colors group relative
                    ${learned.has(item.id)
                      ? `bg-gradient-to-br ${meta.gradient} border-transparent text-white`
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700/60 dark:hover:border-gray-500 dark:text-white'
                    }
                  `}
                >
                  <span className="text-xl font-bold leading-none">{item.kanji}</span>
                  <span className={`text-[9px] leading-tight truncate w-full text-center px-0.5 ${
                    learned.has(item.id) ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {item.meaning.split('/')[0]}
                  </span>
                  {learned.has(item.id) && (
                    <span className="absolute top-0.5 right-0.5 text-[8px]">✓</span>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className={`text-center py-16 rounded-2xl border border-border text-muted-foreground`}>
              <span className="text-4xl block mb-3 opacity-30">漢</span>
              <p className="font-medium">No kanji found</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}