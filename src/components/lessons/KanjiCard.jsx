import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Star, BookOpen, Zap, Eye, RotateCcw, ChevronDown } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'
import { useThemeStore } from '../../store/themeStore'
import { useProgressStore } from '../../store/progressStore'

const KanjiCard = ({
  kanji = {},
  onMastered,
  onNext,
  showActions = true,
  compact = false,
}) => {
  const [flipped, setFlipped] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [starred, setStarred] = useState(kanji.starred || false)
  const [expanded, setExpanded] = useState(false)
  const { playAudio } = useAudio()
  const { addXP } = useProgressStore()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  const {
    character = '漢', meaning = 'Chinese characters',
    meaning_en,
    onyomi = [],
    kunyomi = [],
    on_readings,
    kun_readings,
    strokeCount,
    stroke_count,
    jlptLevel,
    jlpt_level,
    examples = [],
    mnemonic = '',
    radicals = [],
  } = kanji

  // Normalize field names (DB might use snake_case)
  const displayMeaning = meaning_en || meaning
  const displayOnyomi = Array.isArray(onyomi) && onyomi.length > 0
    ? onyomi
    : on_readings
      ? (Array.isArray(on_readings) ? on_readings : [on_readings])
      : ['—']
  const displayKunyomi = Array.isArray(kunyomi) && kunyomi.length > 0
    ? kunyomi
    : kun_readings
      ? (Array.isArray(kun_readings) ? kun_readings : [kun_readings])
      : ['—']
  const displayStrokes = strokeCount || stroke_count || '?'
  const displayLevel = jlptLevel || jlpt_level || ''

  const levelColors = {
    N5: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20',
    N4: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20',
    N3: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20',
    N2: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/20',
    N1: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20',
  }

  const handleFlip = () => {
    setFlipped(!flipped)
    if (!flipped) setRevealed(true)
  }

  const handlePlayAudio = (text, e) => {
    e?.stopPropagation()
    playAudio(text)
  }

  const handleMastered = () => {
    addXP(10)
    onMastered?.(kanji)
    onNext?.()
  }

  const handleReset = () => {
    setFlipped(false)
    setRevealed(false)
  }

  // ────────────────────────────────────────────────────────
  //  COMPACT CARD — used in LessonViewer
  // ────────────────────────────────────────────────────────
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
          expanded
            ? 'border-blue-200 bg-white shadow-lg shadow-blue-500/5 dark:border-blue-500/30 dark:bg-gray-800/80 dark:shadow-lg dark:shadow-blue-500/5'
            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-gray-700'
        }`}
      >
        {/* Main row */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 flex items-center gap-4 text-left"
        >
          {/* Character */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 dark:bg-gradient-to-br dark:from-blue-500/10 dark:to-indigo-500/10 dark:border dark:border-blue-500/20`}>
            <span className={`text-3xl font-bold text-foreground`}>
              {character}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`font-bold truncate text-foreground`}>
                {displayMeaning}
              </span>
              {displayLevel && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                  levelColors[displayLevel] || 'bg-muted text-muted-foreground'
                }`}>
                  {displayLevel}
                </span>
              )}
            </div>
            <div className={`flex items-center gap-3 text-xs flex-wrap text-muted-foreground`}>
              <span>音: {displayOnyomi.join(', ')}</span>
              <span>訓: {displayKunyomi.join(', ')}</span>
              <span>{displayStrokes} strokes</span>
            </div>
          </div>

          {/* Expand chevron */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-shrink-0 text-muted-foreground`}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className={`px-4 pb-4 space-y-3 border-t border-border`}>
                {/* Readings */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {/* On'yomi */}
                  <div className={`rounded-xl p-3 bg-blue-50 border border-blue-100 dark:bg-blue-500/5 dark:border dark:border-blue-500/15`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 text-blue-600 dark:text-blue-400/70`}>
                      音読み On'yomi
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {displayOnyomi.map((r, i) => (
                        <button
                          key={i}
                          onClick={(e) => handlePlayAudio(r, e)}
                          className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-lg 
                                     transition-colors text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-500/10 dark:hover:bg-blue-500/20`}
                        >
                          {r}
                          <Volume2 className="w-3 h-3 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kun'yomi */}
                  <div className={`rounded-xl p-3 bg-green-50 border border-green-100 dark:bg-green-500/5 dark:border dark:border-green-500/15`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 text-green-600 dark:text-green-400/70`}>
                      訓読み Kun'yomi
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {displayKunyomi.map((r, i) => (
                        <button
                          key={i}
                          onClick={(e) => handlePlayAudio(r, e)}
                          className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-lg 
                                     transition-colors text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-500/10 dark:hover:bg-green-500/20`}
                        >
                          {r}
                          <Volume2 className="w-3 h-3 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mnemonic */}
                {mnemonic && (
                  <div className={`rounded-xl p-3 bg-purple-50 border border-purple-100 dark:bg-purple-500/5 dark:border dark:border-purple-500/15`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 text-purple-600 dark:text-purple-400/70`}>
                      💡 Mnemonic
                    </p>
                    <p className={`text-xs leading-relaxed text-foreground/80`}>
                      {mnemonic}
                    </p>
                  </div>
                )}

                {/* Radicals */}
                {radicals.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium text-muted-foreground`}>
                      Radicals:
                    </span>
                    {radicals.map((r, i) => (
                      <span
                        key={i}
                        className={`text-sm px-2 py-0.5 rounded-lg font-medium bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border dark:border-gray-700`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {/* Example words */}
                {examples.length > 0 && (
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 text-muted-foreground`}>
                      Example Words
                    </p>
                    <div className="space-y-1.5">
                      {examples.slice(0, 3).map((ex, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 bg-gray-50 border border-gray-100 dark:bg-gray-800/60 dark:border dark:border-gray-700/50`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium text-foreground`}>
                              {ex.word}
                            </span>
                            <span className={`text-xs text-muted-foreground`}>
                              {ex.reading}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs text-muted-foreground`}>
                              {ex.meaning}
                            </span>
                            <button
                              onClick={(e) => handlePlayAudio(ex.word, e)}
                              className={`transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300`}
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // ────────────────────────────────────────────────────────
  //  FULL FLIP CARD — used in dedicated Kanji study mode
  // ────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          {/* ── FRONT ── */}
          <div
            className={`rounded-3xl p-8 shadow-2xl border bg-gradient-to-br from-white to-gray-50 border-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-700`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              {displayLevel && (
                <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${
                  levelColors[displayLevel] || ''
                }`}>
                  JLPT {displayLevel}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-xs text-muted-foreground`}>
                  {displayStrokes} strokes
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setStarred(!starred)
                  }}
                  className={`transition-colors ${
                    starred
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400 dark:text-gray-600 dark:hover:text-yellow-400'
                  }`}
                >
                  <Star className={`w-5 h-5 ${starred ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Giant character */}
            <div className="text-center mb-6">
              <motion.span
                key={character}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-[120px] font-bold leading-none drop-shadow-2xl inline-block text-foreground`}
              >
                {character}
              </motion.span>
            </div>

            {/* Radicals */}
            {radicals.length > 0 && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`text-xs text-muted-foreground`}>
                  Radicals:
                </span>
                {radicals.map((r, i) => (
                  <span
                    key={i}
                    className={`text-sm px-2 py-0.5 rounded-lg font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300`}
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}

            <div className="text-center">
              <span className={`text-xs flex items-center justify-center gap-1 text-muted-foreground`}>
                <Eye className="w-3 h-3" /> Tap to reveal meaning
              </span>
            </div>
          </div>

          {/* ── BACK ── */}
          <div
            className={`absolute inset-0 rounded-3xl p-6 shadow-2xl border bg-gradient-to-br from-white to-gray-50 border-red-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-red-500/30`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Ghost character */}
            <span className={`absolute top-4 right-6 text-6xl font-bold select-none pointer-events-none text-gray-100 dark:text-white/5`}>
              {character}
            </span>

            {/* Meaning */}
            <div className="text-center mb-5">
              <p className={`text-2xl font-bold text-foreground`}>
                {displayMeaning}
              </p>
            </div>

            {/* Readings */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className={`rounded-xl p-3 bg-blue-50 border border-blue-100 dark:bg-blue-500/10 dark:border dark:border-blue-500/20`}>
                <p className={`text-xs font-semibold mb-1 text-blue-600 dark:text-blue-400`}>
                  音読み (On'yomi)
                </p>
                <div className="flex flex-wrap gap-1">
                  {displayOnyomi.map((r, i) => (
                    <button
                      key={i}
                      onClick={(e) => handlePlayAudio(r, e)}
                      className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-lg transition-colors text-blue-800 bg-blue-100 hover:bg-blue-200 dark:text-white dark:bg-blue-500/20 dark:hover:bg-blue-500/30`}
                    >
                      {r}
                      <Volume2 className="w-3 h-3 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
              <div className={`rounded-xl p-3 bg-green-50 border border-green-100 dark:bg-green-500/10 dark:border dark:border-green-500/20`}>
                <p className={`text-xs font-semibold mb-1 text-green-600 dark:text-green-400`}>
                  訓読み (Kun'yomi)
                </p>
                <div className="flex flex-wrap gap-1">
                  {displayKunyomi.map((r, i) => (
                    <button
                      key={i}
                      onClick={(e) => handlePlayAudio(r, e)}
                      className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-lg transition-colors text-green-800 bg-green-100 hover:bg-green-200 dark:text-white dark:bg-green-500/20 dark:hover:bg-green-500/30`}
                    >
                      {r}
                      <Volume2 className="w-3 h-3 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mnemonic */}
            {mnemonic && (
              <div className={`rounded-xl p-3 mb-4 bg-purple-50 border border-purple-100 dark:bg-purple-500/10 dark:border dark:border-purple-500/20`}>
                <p className={`text-xs font-semibold mb-1 text-purple-600 dark:text-purple-400`}>
                  💡 Mnemonic
                </p>
                <p className={`text-xs leading-relaxed text-foreground/80`}>
                  {mnemonic}
                </p>
              </div>
            )}

            {/* Example words */}
            {examples.length > 0 && (
              <div>
                <p className={`text-xs font-semibold mb-2 text-muted-foreground`}>
                  Examples
                </p>
                <div className="space-y-2">
                  {examples.slice(0, 2).map((ex, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 bg-gray-50 border border-gray-100 dark:bg-gray-700/50`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-medium text-foreground`}>
                          {ex.word}
                        </span>
                        <span className={`text-xs text-gray-400`}>
                          {ex.reading}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs text-muted-foreground`}>
                          {ex.meaning}
                        </span>
                        <button
                          onClick={(e) => handlePlayAudio(ex.word, e)}
                          className={`transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white`}
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      {showActions && revealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3"
        >
          <button
            onClick={handleReset}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setFlipped(false)
              setRevealed(false)
              onNext?.()
            }}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300`}
          >
            Again
          </button>
          <button
            onClick={handleMastered}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600
                       text-white font-semibold text-sm hover:opacity-90 transition-opacity
                       flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
          >
            <Zap className="w-4 h-4" />
            Got It! +10 XP
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default KanjiCard