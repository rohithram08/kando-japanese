// src/pages/KanjiPage.jsx  ── Professional JLPT Kanji Learning Platform
import React, {
  useState, useMemo, useCallback, useRef, useEffect
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Volume2, Layers, ChevronDown, ChevronUp,
  BookOpen, Grid3X3, List, X, Pen, RotateCcw,
  ChevronLeft, ChevronRight, Award, RefreshCw,
  Eraser, Lightbulb, Shuffle, Eye, EyeOff,
  CheckCircle2, XCircle, Target, PenTool, BookmarkPlus, Check
} from 'lucide-react'
import StrokeOrder from '../components/kanji/StrokeOrder'
import { useThemeStore } from '../store/themeStore'
import { useSettingsStore } from '../store/settingsStore'
import { useSRSStore } from '../store/srsStore'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { audioService } from '../services/audioService'
import { KANJI, LEVEL_META, DATA_COUNTS } from '../data/index'
import LevelSelector from '../components/common/LevelSelector'
import { useLevelState } from '../hooks/useStudyLevel'
import { getCurriculumMeaning, normalizeLocale, useI18n } from '../i18n'
import toast from 'react-hot-toast'


// ─────────────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────────────
const GROUPS_PER_PAGE = 20
const QUIZ_CHOICES    = 4

// ─────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────
const speak = (text) => audioService.speak(text).catch(() => {})
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

// ─────────────────────────────────────────────────────────────────────
//  SHARED: Reading Badge
// ─────────────────────────────────────────────────────────────────────
function ReadingBadge({ label, readings, type, isDark }) {
  if (!readings || !readings.length) return null
  const cls = type === 'on'
    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/25'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25'
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm border ${cls}`}>
      <span className="font-bold text-xs opacity-50">{label}</span>
      <span className="font-medium">{readings.join('　')}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
//  BROWSE — Enhanced Detail Panel (sticky bottom, tabbed)
// ─────────────────────────────────────────────────────────────────────
function DetailPanel({ item, isDark, onClose, meta }) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('overview')
  const { isCardInSRS, addCardToSRS } = useSRSStore()
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)
  const displayMeaning = getCurriculumMeaning(item, activeLang)
  if (!item) return null

  const inDeck = isCardInSRS(item.id || item.kanji)

  const handleAddToSRS = (e) => {
    e?.stopPropagation()
    addCardToSRS('kanji', item.id || item.kanji, item.kanji)
  }

  const onR  = item.readings?.on?.filter(Boolean) || []
  const kunR = item.readings?.kun?.filter(r => r && r !== '-') || []

  const TABS = [
    { id: 'overview', label: t('common.explanation', 'Overview'),   icon: BookOpen  },
    { id: 'examples', label: t('common.examples', 'Examples'),   icon: Layers    },
    { id: 'study',    label: t('common.studyTips', 'Study Tips'), icon: Lightbulb },
  ]

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className={`sticky bottom-4 z-30 mx-auto rounded-2xl border shadow-2xl overflow-hidden bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-700/60`}
    >
      {/* Header */}
      <div className={`flex items-start gap-4 p-5 border-b border-border`}>
        <button
          onClick={() => speak(item.kanji)}
          className={`w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center
            text-5xl font-bold bg-gradient-to-br ${meta.gradient} text-white shadow-lg
            select-none hover:scale-105 active:scale-95 transition-transform`}
          title="Click to pronounce"
        >
          {item.kanji}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className={`text-xl font-bold text-foreground`}>
              {displayMeaning}
            </h2>
            <button onClick={() => speak(item.kanji)}
              className={`p-1.5 rounded-lg transition-colors hover:bg-red-50 hover:text-red-500 text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:text-gray-500`}>
              <Volume2 className="w-4 h-4" />
            </button>
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold bg-gradient-to-r ${meta.gradient} text-white`}>
              {item.level}
            </span>
            <button
              onClick={handleAddToSRS}
              title={inDeck ? 'In your SRS review deck' : 'Add to SRS review deck'}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                inDeck
                  ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                  : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20'
              }`}
            >
              {inDeck ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('common.inSrs', 'In SRS')}</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{t('common.addToSrs', '+ SRS')}</span>
                </>
              )}
            </button>
          </div>

          {activeLang !== 'en' && item.meaning && item.meaning !== displayMeaning && (
            <p className={`text-sm mt-0.5 font-medium text-muted-foreground`}>
              {item.meaning}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-2.5">
            <ReadingBadge label="音" readings={onR}  type="on"  isDark={isDark} />
            <ReadingBadge label="訓" readings={kunR} type="kun" isDark={isDark} />
            {item.strokeCount > 0 && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm border bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`}>
                <Pen className="w-3 h-3" />
                <span>{item.strokeCount} strokes</span>
              </div>
            )}
            {item.radical && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm border bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`}>
                <span className="text-xs opacity-60">部首</span>
                <span className="font-medium">{item.radical}</span>
              </div>
            )}
          </div>
        </div>

        <button onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors shrink-0 hover:bg-muted text-muted-foreground`}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab bar */}
      <div className={`relative flex border-b border-border`}>
        {TABS.map((t) => {
          const Icon  = t.icon
          const active = activeTab === t.id
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.label}</span>
              {active && (
                <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${meta.gradient} rounded-t`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="p-5 max-h-72 overflow-y-auto">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {onR.length > 0 && (
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground`}>
                  On Reading (音読み) · Chinese origin
                </p>
                <div className="flex flex-wrap gap-2">
                  {onR.map((r, i) => (
                    <button key={i} onClick={() => speak(r)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 dark:hover:bg-blue-500/20`}>
                      {r} <Volume2 className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {kunR.length > 0 && (
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground`}>
                  Kun Reading (訓読み) · Native Japanese
                </p>
                <div className="flex flex-wrap gap-2">
                  {kunR.map((r, i) => (
                    <button key={i} onClick={() => speak(r)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20`}>
                      {r} <Volume2 className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {item.strokeCount > 0 && (
                <div className={`rounded-xl p-3 bg-muted`}>
                  <p className={`text-xs font-medium mb-2 text-muted-foreground`}>Stroke Count</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 flex-wrap max-w-[80px]">
                      {Array.from({ length: Math.min(item.strokeCount, 16) }).map((_, i) => (
                        <div key={i}
                          className={`w-2 h-2 rounded-full bg-gradient-to-br ${meta.gradient}`}
                          style={{ opacity: 0.3 + (i / Math.min(item.strokeCount, 16)) * 0.7 }}
                        />
                      ))}
                    </div>
                    <span className={`text-2xl font-black text-foreground`}>
                      {item.strokeCount}
                    </span>
                  </div>
                </div>
              )}
              {item.radical && (
                <div className={`rounded-xl p-3 bg-muted`}>
                  <p className={`text-xs font-medium mb-2 text-muted-foreground`}>Radical (部首)</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold text-foreground`}>{item.radical}</span>
                    <button onClick={() => speak(item.radical)}
                      className={`p-1 rounded transition-colors text-muted-foreground hover:text-foreground`}>
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EXAMPLES ── */}
        {activeTab === 'examples' && (
          <div>
            {item.examples?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.examples.filter(ex => ex.word || typeof ex === 'string').map((ex, i) => {
                  const word    = ex.word    || ex
                  const reading = ex.reading || ''
                  const meaning = ex.meaning || ''
                  return (
                    <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl bg-muted`}>
                      <button onClick={() => speak(word)}
                        className={`mt-0.5 p-1.5 rounded-lg transition-colors shrink-0 hover:text-red-500 hover:bg-red-50 text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 dark:text-gray-600`}>
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className={`font-bold text-base text-foreground`}>{word}</span>
                          {reading && <span className={`text-xs text-muted-foreground`}>{reading}</span>}
                        </div>
                        {meaning && <p className={`text-xs mt-0.5 text-muted-foreground`}>{meaning}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className={`text-center py-10 text-muted-foreground`}>
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No examples available</p>
              </div>
            )}
          </div>
        )}

        {/* ── STUDY TIPS ── */}
        {activeTab === 'study' && (
          <div className="space-y-3">
            <div className={`p-4 rounded-xl border bg-amber-50 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/20`}>
              <div className="flex gap-2 mb-2">
                <Lightbulb className={`w-4 h-4 mt-0.5 text-amber-500 dark:text-amber-400`} />
                <p className={`text-sm font-semibold text-amber-700 dark:text-amber-400`}>Memory Tip</p>
              </div>
              <p className={`text-sm leading-relaxed text-foreground/80`}>
                Link <strong>{item.kanji}</strong> to <strong>&ldquo;{item.meaning}&rdquo;</strong>.
                {onR.length > 0 && <> The on-reading <strong>{onR[0]}</strong> appears in compound words.</>}
                {kunR.length > 0 && <> The kun-reading <strong>{kunR[0]}</strong> is used when it stands alone.</>}
                {item.strokeCount > 0 && <> It is written with <strong>{item.strokeCount} strokes</strong> — use the Practice tab to drill the stroke order.</>}
              </p>
            </div>

            <div className={`p-4 rounded-xl border bg-gray-50 border-gray-200 dark:bg-gray-800/60 dark:border-gray-700`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground`}>
                Quick Reference
              </p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {[
                  ['Character', item.kanji, true],
                  ['JLPT Level', item.level, false],
                  item.strokeCount > 0 && ['Strokes', item.strokeCount, false],
                  item.radical && ['Radical', item.radical, false],
                ].filter(Boolean).map(([label, val, big]) => (
                  <div key={label}>
                    <span className={`text-xs block mb-0.5 text-muted-foreground`}>{label}</span>
                    <span className={`font-bold ${big ? 'text-3xl' : 'text-base'} text-foreground`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border text-sm bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-500/5 dark:border-violet-500/20 dark:text-violet-300`}>
              💡 Switch to <strong>Flashcards</strong> or <strong>Practice</strong> to actively study this kanji.
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────
//  BROWSE — Kanji Card (list view)
// ─────────────────────────────────────────────────────────────────────
const KanjiCard = React.memo(function KanjiCard({ item, isDark, isOpen, onToggle }) {
  const meta = LEVEL_META[item.level]
  const onR  = item.readings?.on?.filter(Boolean) || []
  const kunR = item.readings?.kun?.filter(r => r && r !== '-') || []
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)
  const displayMeaning = getCurriculumMeaning(item, activeLang)
  const { isCardInSRS, addCardToSRS } = useSRSStore()
  const inDeck = isCardInSRS(item.id || item.kanji)

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
      className={`rounded-2xl border overflow-hidden cursor-pointer transition-shadow bg-white border-gray-100 hover:border-gray-300 hover:shadow-md dark:bg-gray-900 dark:border-gray-700/60 dark:hover:border-gray-600 shadow-sm`}
      onClick={onToggle}>

      <div className="flex items-center gap-4 p-4">
        <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-3xl font-bold bg-gradient-to-br ${meta.gradient} text-white shadow-md select-none`}>
          {item.kanji}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm text-foreground`}>
            {displayMeaning}
            {activeLang !== 'en' && item.meaning && item.meaning !== displayMeaning && (
              <span className={`ml-2 font-normal text-xs text-muted-foreground`}>{item.meaning}</span>
            )}
          </p>
          <div className="flex gap-3 mt-1 flex-wrap">
            {onR.length  > 0 && <span className={`text-xs text-blue-600 dark:text-blue-400`}><span className="opacity-60 mr-1">音</span>{onR.join('・')}</span>}
            {kunR.length > 0 && <span className={`text-xs text-emerald-600 dark:text-emerald-400`}><span className="opacity-60 mr-1">訓</span>{kunR.join('・')}</span>}
            {item.strokeCount > 0 && <span className={`text-xs text-muted-foreground`}>{item.strokeCount}画</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              addCardToSRS('kanji', item.id || item.kanji, item.kanji)
            }}
            title={inDeck ? 'In SRS deck' : 'Add to SRS'}
            className={`p-1.5 rounded-lg transition-colors ${
              inDeck
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                : 'hover:bg-amber-50 hover:text-amber-600 text-gray-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 dark:text-gray-600'
            }`}
          >
            {inDeck ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); speak(item.kanji) }}
            className={`p-1.5 rounded-lg transition-colors hover:bg-red-50 hover:text-red-500 text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:text-gray-600`}>
            <Volume2 className="w-4 h-4" />
          </button>
          {isOpen
            ? <ChevronUp   className={`w-4 h-4 text-muted-foreground`} />
            : <ChevronDown className={`w-4 h-4 text-muted-foreground`} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && item.examples?.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`px-4 pb-4 border-t border-border`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mt-3 mb-2 text-muted-foreground`}>Example Words</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.examples.filter(ex => ex.word || typeof ex === 'string').map((ex, i) => {
                  const word = ex.word || ex, reading = ex.reading || '', meaning = ex.meaning || ''
                  return (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-muted`}>
                      <button onClick={() => speak(word)} className={`p-1 rounded shrink-0 hover:text-red-500 text-gray-400 dark:hover:text-red-400 dark:text-gray-600`}>
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`font-medium text-sm text-foreground`}>{word}</span>
                          {reading && <span className={`text-xs text-muted-foreground`}>{reading}</span>}
                        </div>
                        {meaning && <p className={`text-xs text-muted-foreground`}>{meaning}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

// ─────────────────────────────────────────────────────────────────────
//  BROWSE — Study Group (grid)
// ─────────────────────────────────────────────────────────────────────
function StudyGroup({ kanji, groupIndex, isDark, meta, selectedId, onSelect }) {
  const start = groupIndex * GROUPS_PER_PAGE + 1
  const end   = start + kanji.length - 1
  const isCardInSRS = useSRSStore((s) => s.isCardInSRS)
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs font-semibold tracking-widest uppercase text-muted-foreground`}>
          Set {groupIndex + 1} &nbsp;·&nbsp; #{start}–{end}
        </span>
        <div className={`flex-1 h-px bg-muted`} />
        <span className={`text-xs text-foreground/80`}>{kanji.length} characters</span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-8">
        {kanji.map((item) => {
          const isSelected = selectedId === item.id
          const inDeck = isCardInSRS(item.id || item.kanji)
          return (
            <motion.button key={item.id} layout whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(isSelected ? null : item.id)} title={item.meaning}
              className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all text-center p-1 ${
                isSelected
                  ? `bg-gradient-to-br ${meta.gradient} text-white border-transparent shadow-lg scale-105`
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700/60 dark:hover:border-gray-500 dark:text-white'}`}>
              {inDeck && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm" title="In SRS" />
              )}
              <span className="text-xl font-bold leading-none">{item.kanji}</span>
              <span className={`text-[9px] leading-tight truncate w-full text-center px-0.5 ${
                isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                {item.meaning.split('/')[0]}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
//  FLASHCARD TAB
// ─────────────────────────────────────────────────────────────────────
function FlashcardTab({ kanji, isDark, meta }) {
  const [deck,       setDeck]       = useState(() => shuffle(kanji))
  const [index,      setIndex]      = useState(0)
  const [isFlipped,  setIsFlipped]  = useState(false)
  const [known,      setKnown]      = useState(new Set())
  const [unknown,    setUnknown]    = useState(new Set())
  const [showResult, setShowResult] = useState(false)
  const user = useAuthStore((s) => s.user)
  const awardKanjiXP = useProgressStore((s) => s.awardKanjiXP)
  const { isCardInSRS, addCardToSRS } = useSRSStore()
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)

  const card     = deck[index]
  const onR      = card?.readings?.on?.filter(Boolean) || []
  const kunR     = card?.readings?.kun?.filter(r => r && r !== '-') || []
  const progress = ((known.size + unknown.size) / deck.length) * 100

  const resetSession = useCallback(() => {
    setDeck(shuffle(kanji))
    setIndex(0); setIsFlipped(false)
    setKnown(new Set()); setUnknown(new Set()); setShowResult(false)
  }, [kanji])

  const markAndAdvance = useCallback((wasKnown) => {
    if (!card) return
    if (wasKnown) {
      setKnown(s => new Set([...s, card.id]))
      if (user?.id) {
        awardKanjiXP(user.id, card.id || card.kanji, 1, false)
      }
    } else {
      setUnknown(s => new Set([...s, card.id]))
    }
    if (index + 1 >= deck.length) { setShowResult(true); return }
    setIndex(i => i + 1)
    setIsFlipped(false)
  }, [card, index, deck.length, user?.id, awardKanjiXP])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (showResult) return
      if (e.code === 'Space') { e.preventDefault(); setIsFlipped(f => !f) }
      if (e.code === 'ArrowRight' && isFlipped) markAndAdvance(true)
      if (e.code === 'ArrowLeft'  && isFlipped) markAndAdvance(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFlipped, showResult, markAndAdvance])

  // ── Session complete ──
  if (showResult) {
    const pct    = Math.round((known.size / deck.length) * 100)
    const missed = deck.filter(k => unknown.has(k.id))
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 space-y-6">
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br ${meta.gradient} shadow-xl`}>
          <Award className="w-12 h-12 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold text-foreground`}>Session Complete!</h2>
          <p className={`text-sm mt-1 text-muted-foreground`}>{deck.length} cards reviewed</p>
        </div>
        <div className="flex justify-center gap-4">
          {[
            { label: 'Got it ✓', count: known.size,   clr: 'emerald' },
            { label: 'Missed ✗', count: unknown.size, clr: 'red'     },
            { label: 'Score',    count: `${pct}%`,    clr: 'blue'    },
          ].map(({ label, count, clr }) => (
            <div key={label} className={`text-center px-5 py-4 rounded-2xl ${
              isDark ? `bg-${clr}-500/10` : `bg-${clr}-50`}`}>
              <p className={`text-3xl font-black text-${clr}-500`}>{count}</p>
              <p className={`text-xs mt-1 ${isDark ? `text-${clr}-400` : `text-${clr}-600`}`}>{label}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <button onClick={resetSession}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r ${meta.gradient} text-white shadow hover:shadow-lg transition-shadow`}>
            <RefreshCw className="w-4 h-4" /> Study Again
          </button>
          {missed.length > 0 && (
            <>
              <button onClick={() => {
                setDeck(shuffle(missed))
                setIndex(0); setIsFlipped(false); setKnown(new Set()); setUnknown(new Set()); setShowResult(false)
              }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800`}>
                <RotateCcw className="w-4 h-4" /> Review Missed ({missed.length})
              </button>
              <button onClick={() => {
                let added = 0
                missed.forEach(m => {
                  if (!isCardInSRS(m.id || m.kanji)) {
                    addCardToSRS('kanji', m.id || m.kanji, m.kanji)
                    added++
                  }
                })
                toast.success(added > 0 ? `Added ${added} missed kanji to SRS deck!` : 'All missed kanji are already in SRS deck!')
              }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors">
                <BookmarkPlus className="w-4 h-4" /> Add Missed to SRS ({missed.length})
              </button>
            </>
          )}
        </div>
      </motion.div>
    )
  }

  if (!card) return null

  // ── Active card ──
  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className={`flex-1 h-2 rounded-full bg-muted`}>
          <div className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-500`}
            style={{ width: `${progress}%` }} />
        </div>
        <span className={`text-xs font-medium shrink-0 text-muted-foreground`}>
          {index + 1} / {deck.length}
        </span>
        <button onClick={resetSession} title="Shuffle & restart"
          className={`p-1.5 rounded-lg transition-colors text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800`}>
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4">
        <span className={`text-sm text-emerald-600 dark:text-emerald-400`}>✓ {known.size} known</span>
        <span className={`text-xs text-muted-foreground`}>·</span>
        <span className={`text-sm text-red-500 dark:text-red-400`}>✗ {unknown.size} missed</span>
      </div>

      {/* Flip card */}
      <div className="flex justify-center">
        <div className="relative cursor-pointer w-full max-w-md"
          style={{ perspective: 1200 }}
          onClick={() => setIsFlipped(f => !f)}>
          <motion.div className="relative w-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}>

            {/* Front */}
            <div className={`rounded-3xl border shadow-xl p-8 flex flex-col items-center justify-center min-h-64 bg-surface border-border`}
              style={{ backfaceVisibility: 'hidden' }}>
              <div className={`w-36 h-36 rounded-3xl flex items-center justify-center text-8xl font-bold bg-gradient-to-br ${meta.gradient} text-white shadow-xl mb-4 select-none`}>
                {card.kanji}
              </div>
              <p className={`text-sm text-muted-foreground`}>Tap to reveal</p>
              {card.strokeCount > 0 && (
                <p className={`text-xs mt-1 text-foreground/80`}>
                  {card.strokeCount} strokes
                </p>
              )}
            </div>

            {/* Back */}
            <div className={`absolute inset-0 rounded-3xl border shadow-xl p-8 flex flex-col items-center justify-center bg-surface border-border`}
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <span className={`text-4xl font-bold mb-3 select-none bg-gradient-to-br ${meta.gradient} bg-clip-text text-transparent`}>
                {card.kanji}
              </span>
              <h3 className={`text-2xl font-bold text-center text-foreground`}>
                {getCurriculumMeaning(card, activeLang)}
              </h3>
              {activeLang !== 'en' && card.meaning && card.meaning !== getCurriculumMeaning(card, activeLang) && (
                <p className={`text-sm mt-1 text-muted-foreground`}>{card.meaning}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                <ReadingBadge label="音" readings={onR}  type="on"  isDark={isDark} />
                <ReadingBadge label="訓" readings={kunR} type="kun" isDark={isDark} />
              </div>
              <button onClick={(e) => { e.stopPropagation(); speak(card.kanji) }}
                className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-muted`}>
                <Volume2 className="w-3.5 h-3.5" /> Pronounce
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => markAndAdvance(false)} disabled={!isFlipped}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border ${
            !isFlipped ? 'opacity-30 cursor-not-allowed' : ''
          } bg-red-50 text-red-600 hover:bg-red-100 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:border-red-500/20`}>
          <XCircle className="w-4 h-4" /> Missed
        </motion.button>

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setIsFlipped(f => !f)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800`}>
          {isFlipped ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isFlipped ? 'Hide' : 'Reveal'}
        </motion.button>

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => markAndAdvance(true)} disabled={!isFlipped}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border ${
            !isFlipped ? 'opacity-30 cursor-not-allowed' : ''
          } bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 dark:border-emerald-500/20`}>
          <CheckCircle2 className="w-4 h-4" /> Got it
        </motion.button>
      </div>

      <p className={`text-center text-xs text-foreground/80`}>
        Space to flip · ← Missed · → Got it
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
//  PRACTICE TAB — Writing Canvas
// ─────────────────────────────────────────────────────────────────────
function PracticeTab({ kanji, isDark, meta }) {
  const canvasRef        = useRef(null)
  const isDrawing        = useRef(false)
  const lastPos          = useRef(null)
  const allStrokes       = useRef([])
  const currentStroke    = useRef([])

  const [cardIndex,    setCardIndex]    = useState(0)
  const [strokeCount,  setStrokeCount]  = useState(0)
  const [showGuide,    setShowGuide]    = useState(true)
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)

  const card = kanji[cardIndex]
  const onR  = card?.readings?.on?.filter(Boolean) || []
  const kunR = card?.readings?.kun?.filter(r => r && r !== '-') || []

  const drawGrid = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(w / 2, 0);  ctx.lineTo(w / 2, h)
    ctx.moveTo(0, h / 2);  ctx.lineTo(w, h / 2)
    ctx.moveTo(0, 0);      ctx.lineTo(w, h)
    ctx.moveTo(w, 0);      ctx.lineTo(0, h)
    ctx.rect(w * 0.1, h * 0.1, w * 0.8, h * 0.8)
    ctx.stroke()
  }, [isDark])

  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    drawGrid(ctx, canvas.width, canvas.height)
    allStrokes.current.forEach(stroke => {
      if (stroke.length < 2) return
      ctx.beginPath()
      ctx.strokeStyle = isDark ? '#e5e7eb' : '#111827'
      ctx.lineWidth = 5
      ctx.lineCap   = 'round'
      ctx.lineJoin  = 'round'
      ctx.moveTo(stroke[0].x, stroke[0].y)
      stroke.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
      ctx.stroke()
    })
  }, [isDark, drawGrid])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = 400
    canvas.height = 400
    redrawAll()
  }, [cardIndex, isDark, redrawAll])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const src  = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left)  * (canvas.width  / rect.width),
      y: (src.clientY - rect.top)   * (canvas.height / rect.height),
    }
  }

  const startDraw = (e) => {
    e.preventDefault()
    const pos = getPos(e, canvasRef.current)
    isDrawing.current = true
    currentStroke.current = [pos]
    lastPos.current = pos
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.strokeStyle = isDark ? '#e5e7eb' : '#111827'
    ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    currentStroke.current.push(pos)
    lastPos.current = pos
  }

  const endDraw = () => {
    if (!isDrawing.current) return
    isDrawing.current = false
    if (currentStroke.current.length > 1) {
      allStrokes.current = [...allStrokes.current, currentStroke.current]
      setStrokeCount(allStrokes.current.length)
    }
    currentStroke.current = []
  }

  const clearCanvas = useCallback(() => {
    allStrokes.current = []
    setStrokeCount(0)
    redrawAll()
  }, [redrawAll])

  const undoStroke = () => {
    if (!allStrokes.current.length) return
    allStrokes.current = allStrokes.current.slice(0, -1)
    setStrokeCount(allStrokes.current.length)
    redrawAll()
  }

  const navigate = (dir) => {
    clearCanvas()
    setCardIndex(i => (i + dir + kanji.length) % kanji.length)
  }

  const targetStrokes = card?.strokeCount || 0
  const strokeStatus  = targetStrokes === 0
    ? null
    : strokeCount === 0   ? 'empty'
    : strokeCount <  targetStrokes ? 'under'
    : strokeCount === targetStrokes ? 'exact'
    : 'over'

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* Reference panel */}
        <div className={`rounded-2xl border p-5 bg-surface border-border`}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}
              className={`p-2 rounded-xl transition-colors hover:bg-muted text-muted-foreground`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className={`text-xs font-medium text-muted-foreground`}>
              {cardIndex + 1} / {kanji.length}
            </span>
            <button onClick={() => navigate(1)}
              className={`p-2 rounded-xl transition-colors hover:bg-muted text-muted-foreground`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <motion.div key={card?.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className={`w-40 h-40 rounded-3xl flex items-center justify-center text-8xl font-bold bg-gradient-to-br ${meta.gradient} text-white shadow-xl select-none cursor-pointer`}
              onClick={() => speak(card?.kanji)}>
              {card?.kanji}
            </motion.div>

            <div>
              <h3 className={`text-xl font-bold text-foreground`}>{getCurriculumMeaning(card, activeLang)}</h3>
              {activeLang !== 'en' && card?.meaning && card?.meaning !== getCurriculumMeaning(card, activeLang) && (
                <p className={`text-sm text-muted-foreground`}>{card?.meaning}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <ReadingBadge label="音" readings={onR}  type="on"  isDark={isDark} />
              <ReadingBadge label="訓" readings={kunR} type="kun" isDark={isDark} />
            </div>

            {targetStrokes > 0 && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`}>
                <Pen className="w-3.5 h-3.5" />
                Write with <strong>{targetStrokes} strokes</strong>
              </div>
            )}

            {/* Stroke dots visualiser */}
            {targetStrokes > 0 && (
              <div className="flex flex-wrap gap-1 justify-center max-w-xs">
                {Array.from({ length: targetStrokes }).map((_, i) => (
                  <div key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i < strokeCount
                        ? strokeStatus === 'over'
                          ? 'bg-amber-500'
                          : `bg-gradient-to-br ${meta.gradient}`
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            )}

            <button onClick={() => speak(card?.kanji)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted`}>
              <Volume2 className="w-4 h-4" /> Listen
            </button>
          </div>
        </div>

        {/* Canvas panel */}
        <div className={`rounded-2xl border p-5 bg-surface border-border`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-sm font-semibold text-foreground`}>Writing Practice</p>
              {targetStrokes > 0 && (
                <p className={`text-xs mt-0.5 font-medium ${
                  strokeStatus === 'exact' ? 'text-emerald-600 dark:text-emerald-400'
                  : strokeStatus === 'over' ? 'text-amber-600 dark:text-amber-400'
                  : 'text-muted-foreground'}`}>
                  {strokeCount} / {targetStrokes} strokes
                  {strokeStatus === 'exact' && ' ✓ Perfect!'}
                  {strokeStatus === 'over'  && ' — too many strokes'}
                </p>
              )}
            </div>
            <div className="flex gap-1.5">
              <button onClick={undoStroke} title="Undo last stroke"
                className={`p-2 rounded-xl transition-colors hover:bg-muted text-muted-foreground`}>
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={clearCanvas} title="Clear canvas"
                className={`p-2 rounded-xl transition-colors hover:bg-gray-100 text-gray-400 hover:text-red-500 dark:hover:bg-gray-800 dark:text-gray-500 dark:hover:text-red-400`}>
                <Eraser className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={`relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40`}>
            {showGuide && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none">
                <span style={{ fontSize: '160px', lineHeight: 1, opacity: 0.05, fontWeight: 900 }}
                  className="text-foreground">
                  {card?.kanji}
                </span>
              </div>
            )}
            <canvas ref={canvasRef}
              className="block w-full touch-none cursor-crosshair"
              style={{ maxHeight: 380, display: 'block' }}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
            />
          </div>

          <button onClick={() => setShowGuide(g => !g)}
            className={`mt-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg w-full justify-center transition-colors text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800`}>
            {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showGuide ? 'Hide' : 'Show'} guide character
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
//  QUIZ TAB
// ─────────────────────────────────────────────────────────────────────
function QuizTab({ kanji, isDark, meta }) {
  const [mode,      setMode]      = useState(null)
  const [qCount,    setQCount]    = useState(10)
  const [questions, setQuestions] = useState([])
  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [score,     setScore]     = useState(0)
  const [answers,   setAnswers]   = useState([])
  const [finished,  setFinished]  = useState(false)
  const user = useAuthStore((s) => s.user)
  const awardKanjiXP = useProgressStore((s) => s.awardKanjiXP)
  const { isCardInSRS, addCardToSRS } = useSRSStore()

  const getReading = (k) => {
    const oR = k.readings?.on?.filter(Boolean) || []
    const kR = k.readings?.kun?.filter(r => r && r !== '-') || []
    return [...oR, ...kR][0] || k.meaning
  }

  const buildQuestions = useCallback((m, count) => {
    const pool = shuffle(kanji).slice(0, Math.min(count, kanji.length))
    return pool.map(item => {
      const others  = shuffle(kanji.filter(k => k.id !== item.id)).slice(0, QUIZ_CHOICES - 1)
      const correct = m === 'meaning' ? item.meaning : getReading(item)
      const wrongs  = others.map(k => m === 'meaning' ? k.meaning : getReading(k))
      const options = shuffle([{ val: correct, ok: true }, ...wrongs.map(w => ({ val: w, ok: false }))])
      return {
        item, type: m,
        question:   item.kanji,
        choices:    options.map(o => o.val),
        correctIdx: options.findIndex(o => o.ok),
      }
    })
  }, [kanji])

  const startQuiz = (m) => {
    setMode(m); setQuestions(buildQuestions(m, qCount))
    setCurrent(0); setSelected(null); setScore(0); setAnswers([]); setFinished(false)
  }

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    const q       = questions[current]
    const correct = idx === q.correctIdx
    if (correct) {
      setScore(s => s + 1)
      if (user?.id) {
        awardKanjiXP(user.id, q.item.id || q.item.kanji, 1, false)
      }
    }
    setAnswers(a => [...a, { q, chosen: idx, correct }])
    setTimeout(() => {
      if (current + 1 >= questions.length) { setFinished(true); return }
      setCurrent(c => c + 1); setSelected(null)
    }, 900)
  }

  // ── Start screen ──
  if (!mode) {
    return (
      <div className="space-y-5">
        <div className={`rounded-2xl border p-6 bg-surface border-border`}>
          <h3 className={`font-bold text-lg mb-0.5 text-foreground`}>Quiz Settings</h3>
          <p className={`text-sm mb-5 text-muted-foreground`}>
            Choose your mode and question count to begin
          </p>

          <div className="space-y-5">
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground`}>
                Questions
              </p>
              <div className="flex gap-2">
                {[10, 20, kanji.length].map(n => (
                  <button key={n} onClick={() => setQCount(n)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      qCount === n
                        ? `bg-gradient-to-r ${meta.gradient} text-white border-transparent shadow`
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
                    {n === kanji.length ? `All (${n})` : n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground`}>
                Quiz Mode
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'meaning', icon: Target,   label: 'Meaning Quiz',  desc: 'See the kanji → choose its meaning', colorClass: 'text-blue-600 dark:text-blue-400'    },
                  { id: 'reading', icon: BookOpen, label: 'Reading Quiz',  desc: 'See the kanji → choose its reading', colorClass: 'text-emerald-600 dark:text-emerald-400' },
                ].map(({ id, icon: Icon, label, desc, colorClass }) => (
                  <button key={id} onClick={() => startQuiz(id)}
                    className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] bg-surface-muted border-border hover:bg-surface hover:border-border hover:shadow-md`}>
                    <Icon className={`w-6 h-6 mb-2 ${colorClass}`} />
                    <p className={`font-bold text-sm text-foreground`}>{label}</p>
                    <p className={`text-xs mt-0.5 text-muted-foreground`}>{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Results screen ──
  if (finished) {
    const pct   = Math.round((score / questions.length) * 100)
    const grade = pct >= 90 ? '🏆 Excellent!' : pct >= 70 ? '✨ Good Job!' : pct >= 50 ? '💪 Keep Going' : '📖 Keep Studying'
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
        <div className={`rounded-2xl border p-6 text-center bg-surface border-border`}>
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br ${meta.gradient} shadow-xl mb-4`}>
            <Award className="w-10 h-10 text-white" />
          </div>
          <p className={`text-lg font-bold text-foreground`}>{grade}</p>
          <p className={`text-5xl font-black mt-1 mb-0.5 bg-gradient-to-r ${meta.gradient} bg-clip-text text-transparent`}>{pct}%</p>
          <p className={`text-sm text-muted-foreground`}>{score} of {questions.length} correct</p>
          <div className="flex justify-center gap-3 mt-5 flex-wrap">
            <button onClick={() => setMode(null)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r ${meta.gradient} text-white shadow hover:shadow-lg transition-shadow`}>
              Try Again
            </button>
            <button onClick={() => startQuiz(mode)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800`}>
              New Quiz
            </button>
          </div>
          {answers.some(a => !a.correct) && (
            <button onClick={() => {
              let added = 0
              answers.filter(a => !a.correct).forEach(a => {
                const k = a.q.item
                if (!isCardInSRS(k.id || k.kanji)) {
                  addCardToSRS('kanji', k.id || k.kanji, k.kanji)
                  added++
                }
              })
              toast.success(added > 0 ? `Added ${added} missed kanji to SRS deck!` : 'All missed kanji are already in SRS deck!')
            }} className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors">
              <BookmarkPlus className="w-4 h-4" /> Add Missed Kanji to SRS ({answers.filter(a => !a.correct).length})
            </button>
          )}
        </div>

        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground`}>Review</p>
          <div className="space-y-2">
            {answers.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                a.correct
                  ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20'
                  : 'bg-red-50 border-red-200 dark:bg-red-500/5 dark:border-red-500/20'}`}>
                <span className={`text-2xl font-bold text-foreground`}>{a.q.item.kanji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold text-foreground`}>{a.q.item.meaning}</p>
                  {!a.correct && (
                    <p className={`text-xs mt-0.5 text-red-600 dark:text-red-400`}>
                      Your answer: {a.q.choices[a.chosen]}
                    </p>
                  )}
                </div>
                {a.correct
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  : <XCircle     className="w-5 h-5 text-red-500 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Active question ──
  const q = questions[current]
  if (!q) return null

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className={`flex-1 h-2 rounded-full bg-muted`}>
          <div className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-500`}
            style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>
        <span className={`text-xs font-medium shrink-0 text-muted-foreground`}>
          {current + 1}/{questions.length}
        </span>
        <span className={`text-xs font-semibold text-emerald-600 dark:text-emerald-400`}>
          ✓ {score}
        </span>
      </div>

      {/* Question card */}
      <div className={`rounded-2xl border p-8 text-center bg-surface border-border`}>
        <p className={`text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground`}>
          {q.type === 'meaning' ? 'What does this kanji mean?' : 'How do you read this kanji?'}
        </p>
        <div className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center text-7xl font-bold bg-gradient-to-br ${meta.gradient} text-white shadow-xl mb-4 select-none`}>
          {q.question}
        </div>
        {q.type === 'reading' && (
          <button onClick={() => speak(q.item.kanji)}
            className={`mx-auto flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted`}>
            <Volume2 className="w-3.5 h-3.5" /> Listen
          </button>
        )}
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {q.choices.map((choice, i) => {
          let state = 'idle'
          if (selected !== null) {
            if (i === q.correctIdx)  state = 'correct'
            else if (i === selected) state = 'wrong'
          }
          return (
            <motion.button key={i}
              whileHover={selected === null ? { scale: 1.02 } : {}}
              whileTap={selected === null ? { scale: 0.97 } : {}}
              onClick={() => handleAnswer(i)}
              className={`px-4 py-3.5 rounded-xl font-medium text-sm text-left border transition-all ${
                state === 'correct' ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500 dark:text-emerald-300'
                : state === 'wrong'   ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-500/20 dark:border-red-500 dark:text-red-300'
                : selected !== null   ? 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800/40 dark:border-gray-700/50 dark:text-gray-600'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-800'
              }`}>
              <span className={`inline-flex w-5 h-5 rounded-full items-center justify-center text-xs mr-2 font-bold bg-gray-100 dark:bg-gray-700`}>
                {String.fromCharCode(65 + i)}
              </span>
              {choice}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
//  SHARED: Stroke Order practice tab
// ─────────────────────────────────────────────────────────────────────
function StrokeTab({ kanji, isDark, meta }) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(new Set())
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)

  const card = kanji[index]

  const goNext = () => setIndex((i) => Math.min(i + 1, kanji.length - 1))
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0))

  const handleComplete = useCallback(() => {
    if (card) setDone((prev) => new Set([...prev, card.id]))
  }, [card])

  if (!card) return null

  const displayMeaning = getCurriculumMeaning(card, activeLang)

  return (
    <div className="space-y-4">
      {/* Kanji selector strip */}
      <div className="flex items-center gap-2">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-muted/70 disabled:opacity-40 text-foreground/80 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {kanji.map((k, i) => (
            <button
              key={k.id}
              onClick={() => setIndex(i)}
              className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border transition-all ${
                i === index
                  ? `bg-gradient-to-br ${meta.gradient} text-white border-transparent shadow-md`
                  : done.has(k.id)
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400'
                    : 'bg-surface border-border text-foreground/70 hover:border-foreground/20'
              }`}
            >
              {k.kanji}
            </button>
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={index === kanji.length - 1}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-muted/70 disabled:opacity-40 text-foreground/80 transition-colors shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        {index + 1} of {kanji.length} · {done.size} practiced this session
      </p>

      <StrokeOrder
        key={card.id}
        character={card.kanji}
        isDark={isDark}
        onComplete={handleComplete}
      />

      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{displayMeaning}</p>
        {(card.readings?.on?.length > 0 || card.readings?.kun?.length > 0) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {[...(card.readings?.on || []), ...(card.readings?.kun || [])].filter(Boolean).join('　')}
          </p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────
export default function KanjiPage() {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)

  const [level, setLevel, { unlocked }] = useLevelState()
  const [search,     setSearch]     = useState('')
  const [openId,     setOpenId]     = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [view,       setView]       = useState('grid')
  const [tab,        setTab]        = useState('browse')

  const meta     = LEVEL_META[level]
  const allKanji = KANJI[level] || []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allKanji
    const qClean = q.replace(/[-・.\s]/g, '')
    return allKanji.filter(k => {
      const locMeaning = getCurriculumMeaning(k, activeLang).toLowerCase()
      const onR  = (k.readings?.on  || []).join(' ').toLowerCase()
      const kunR = (k.readings?.kun || []).join(' ').toLowerCase()
      const onRClean = onR.replace(/[-・.\s]/g, '')
      const kunRClean = kunR.replace(/[-・.\s]/g, '')
      const romajiR = (k.readings?.romaji || []).join(' ').toLowerCase().replace(/[-・.\s]/g, '')
      return (
        k.kanji.includes(search.trim()) ||
        k.meaning.toLowerCase().includes(q) ||
        locMeaning.includes(q) ||
        onR.includes(q) || kunR.includes(q) ||
        (qClean && (onRClean.includes(qClean) || kunRClean.includes(qClean) || romajiR.includes(qClean))) ||
        (k.meaning_ta || '').includes(search.trim()) ||
        (k.meaning_hi || '').includes(search.trim())
      )
    })
  }, [search, allKanji, activeLang])

  const selectedItem = useMemo(
    () => filtered.find(k => k.id === selectedId) || null,
    [filtered, selectedId]
  )

  const groups = useMemo(() => {
    const chunks = []
    for (let i = 0; i < filtered.length; i += GROUPS_PER_PAGE)
      chunks.push(filtered.slice(i, i + GROUPS_PER_PAGE))
    return chunks
  }, [filtered])

  const handleLevelChange = useCallback((l) => {
    setLevel(l); setSearch(''); setOpenId(null); setSelectedId(null)
  }, [setLevel])

  const TABS = [
    { id: 'browse',    label: 'Browse',     icon: Grid3X3 },
    { id: 'flashcard', label: 'Flashcards', icon: BookOpen },
    { id: 'practice',  label: 'Practice',  icon: Pen     },
    { id: 'quiz',      label: 'Quiz',      icon: Target  },
    { id: 'stroke',    label: 'Stroke Order', icon: PenTool },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-16">

      {/* ── Hero banner ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${meta.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 75% 50%, white 0%, transparent 65%)' }} />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 opacity-90" />
              <span className="text-sm font-medium opacity-90">Kanji Study</span>
            </div>
            <h1 className="text-2xl font-bold">{meta.label}</h1>
            <p className="text-sm opacity-80 mt-1">{meta.description}</p>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="opacity-90"><strong>{DATA_COUNTS.kanji[level]}</strong> characters</span>
              {filtered.length !== DATA_COUNTS.kanji[level] && (
                <span className="opacity-70">{filtered.length} shown</span>
              )}
            </div>
          </div>
          <div className="hidden sm:flex flex-col gap-1.5 text-right shrink-0">
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-xs font-medium">
              {groups.length} study set{groups.length !== 1 ? 's' : ''}
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-xs">
              {GROUPS_PER_PAGE} kanji per set
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Level selector ── */}
      <LevelSelector selected={level} onChange={handleLevelChange} counts={DATA_COUNTS.kanji} isDark={isDark} levels={unlocked} />

      {/* ── Tab bar ── */}
      <div className={`flex rounded-2xl border overflow-hidden p-1 gap-1 bg-gray-100 border-gray-200 dark:bg-gray-900 dark:border-gray-700/60`}>
        {TABS.map(t => {
          const Icon   = t.icon
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? `bg-gradient-to-r ${meta.gradient} text-white shadow-sm`
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'}`}>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">

        {/* ─── BROWSE ─── */}
        {tab === 'browse' && (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className="flex gap-2">
              <div className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors bg-white border-gray-200 focus-within:border-gray-400 dark:bg-gray-900 dark:border-gray-700/60 dark:focus-within:border-gray-500`}>
                <Search className={`w-4 h-4 shrink-0 text-muted-foreground`} />
                <input type="text" placeholder="Search kanji, meaning, or reading…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setSelectedId(null) }}
                  className={`flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 dark:text-white dark:placeholder-gray-600`} />
                {search && (
                  <button onClick={() => setSearch('')}
                    className={`text-xs px-1.5 py-0.5 rounded text-muted-foreground hover:text-foreground`}>
                    Clear
                  </button>
                )}
              </div>

              <div className={`flex rounded-xl border overflow-hidden border-border`}>
                {[['grid', Grid3X3, 'Grid'], ['list', List, 'List']].map(([v, Icon, label]) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                      view === v
                        ? `bg-gradient-to-r ${meta.gradient} text-white`
                        : 'bg-white text-gray-500 hover:text-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className={`text-xs text-muted-foreground`}>
              {filtered.length} character{filtered.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>

            {filtered.length === 0 ? (
              <div className={`text-center py-20 rounded-2xl border border-border text-muted-foreground`}>
                <span className="text-5xl block mb-4">漢</span>
                <p className="font-semibold">No kanji found</p>
                <p className="text-sm mt-1 opacity-70">Try a different search term or level</p>
              </div>
            ) : view === 'list' ? (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {filtered.map(item => (
                    <KanjiCard key={item.id} item={item} isDark={isDark}
                      isOpen={openId === item.id}
                      onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div>
                {search ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    <AnimatePresence>
                      {filtered.map(item => {
                        const isSel = selectedId === item.id
                        return (
                          <motion.button key={item.id} layout whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            onClick={() => setSelectedId(isSel ? null : item.id)} title={item.meaning}
                            className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all text-center p-1 ${
                              isSel ? `bg-gradient-to-br ${meta.gradient} text-white border-transparent shadow-lg scale-105`
                              : 'bg-white border-gray-200 hover:border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700/60 dark:hover:border-gray-500 dark:text-white'}`}>
                            <span className="text-xl font-bold leading-none">{item.kanji}</span>
                            <span className={`text-[9px] leading-tight truncate w-full text-center px-0.5 ${isSel ? 'text-white/80' : 'text-muted-foreground'}`}>
                              {item.meaning.split('/')[0]}
                            </span>
                          </motion.button>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  groups.map((gk, i) => (
                    <StudyGroup key={i} kanji={gk} groupIndex={i} isDark={isDark} meta={meta}
                      selectedId={selectedId} onSelect={id => setSelectedId(id)} />
                  ))
                )}

                <AnimatePresence>
                  {selectedItem && (
                    <DetailPanel key={selectedItem.id} item={selectedItem} isDark={isDark}
                      meta={meta} onClose={() => setSelectedId(null)} />
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── FLASHCARDS ─── */}
        {tab === 'flashcard' && (
          <motion.div key={`fc-${level}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FlashcardTab kanji={allKanji} isDark={isDark} meta={meta} />
          </motion.div>
        )}

        {/* ─── PRACTICE ─── */}
        {tab === 'practice' && (
          <motion.div key={`pr-${level}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PracticeTab kanji={allKanji} isDark={isDark} meta={meta} />
          </motion.div>
        )}

        {/* ─── QUIZ ─── */}
        {tab === 'quiz' && (
          <motion.div key={`qz-${level}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizTab kanji={allKanji} isDark={isDark} meta={meta} />
          </motion.div>
        )}

        {/* ─── STROKE ORDER ─── */}
        {tab === 'stroke' && (
          <motion.div key={`so-${level}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StrokeTab kanji={allKanji} isDark={isDark} meta={meta} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}