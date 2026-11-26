// src/pages/SpeechPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Speech Lab & Daily 10 Pronunciation Studio
// Level-aware speech training powered by 7,800+ curriculum words (1,500+ per JLPT level),
// deterministic Daily 10 random word draws, Tokyo pitch contours, mora timing,
// and real-time speech recognition feedback.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Award,
  Calendar,
  BookOpen,
  MessageSquare,
  AudioLines,
  Zap,
  Repeat,
  RefreshCw,
  Check,
  Search,
  Dices,
} from 'lucide-react'
import { useI18n } from '../i18n'
import { useStudyLevel } from '../hooks/useStudyLevel'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import PitchContourVisualizer from '../components/pitch/PitchContourVisualizer'
import { getPitchAccent, segmentMorae } from '../data/pitch/pitchData'
import {
  SPEECH_TRACK_ORDER,
  getDailyRandomWords,
  getLevelWordCount,
  getLevelWordPool,
  getLocalDateKey,
  getStaticTrackItems,
} from '../data/speech/speechCorpus'
import { playSuccess, playError, playSwoosh, playClick } from '../utils/soundEffects'
import SEO from '../components/common/SEO'

const DAILY_STORAGE_KEY = 'kando_speech_daily_progress_v1'

const TRACK_ICONS = {
  daily_10: Calendar,
  word_bank: BookOpen,
  sentences: MessageSquare,
  minimal_pairs: AudioLines,
  verbs: Zap,
  shadowing: Repeat,
}

const POS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'noun', label: 'Nouns' },
  { id: 'verb', label: 'Verbs' },
  { id: 'adjective', label: 'Adjectives' },
  { id: 'other', label: 'Other' },
]

function normalizeJapaneseSpeech(text = '') {
  return String(text)
    .replace(/[、。！？\s.,!?「」『』・]/g, '')
    .replace(/[\u30a1-\u30f6]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .trim()
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i])
  for (let j = 0; j <= a.length; j += 1) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

function calculateSimilarity(spoken, targetJp, targetReading) {
  const normSpoken = normalizeJapaneseSpeech(spoken)
  if (!normSpoken) return 0

  const candidates = [normalizeJapaneseSpeech(targetJp), normalizeJapaneseSpeech(targetReading)].filter(Boolean)
  let bestScore = 0

  for (const target of candidates) {
    if (normSpoken === target) return 100
    const longer = normSpoken.length >= target.length ? normSpoken : target
    const shorter = normSpoken.length >= target.length ? target : normSpoken
    const distance = levenshtein(longer, shorter)
    const ratio = Math.max(0, Math.round(((longer.length - distance) / longer.length) * 100))
    if (ratio > bestScore) bestScore = ratio
  }

  return bestScore
}

function readDailyStorage() {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeDailyStorage(data) {
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export default function SpeechPage() {
  const { t, locale, displayLanguage } = useI18n()
  const { studyLevel, unlocked } = useStudyLevel()
  const userId = useAuthStore((s) => s.user?.id)
  const addXP = useProgressStore((s) => s.addXP)

  const effectiveLocale = useMemo(() => {
    const raw = displayLanguage || locale || 'en'
    return raw === 'ta' || raw === 'hi' ? raw : 'en'
  }, [displayLanguage, locale])

  const todayKey = useMemo(() => getLocalDateKey(), [])
  const unlockedCounts = useMemo(
    () =>
      unlocked.reduce((acc, lvl) => {
        acc[lvl] = getLevelWordCount(lvl)
        return acc
      }, {}),
    [unlocked]
  )

  const [pickedLevel, setPickedLevel] = useState(studyLevel)
  const hasPickedLevelRef = useRef(false)
  const selectedLevel = unlocked.includes(pickedLevel) ? pickedLevel : studyLevel

  const [activeTrack, setActiveTrack] = useState('daily_10')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dailyBatchOffset, setDailyBatchOffset] = useState(0)

  // Word Explorer state (1,500+ words per level)
  const [explorerQuery, setExplorerQuery] = useState('')
  const [explorerPos, setExplorerPos] = useState('all')
  const [explorerLimit, setExplorerLimit] = useState(24)

  // Daily progress state persisted per day + level
  const [dailyProgressMap, setDailyProgressMap] = useState(() => readDailyStorage())

  // Audio + Speech recognition state
  const [playbackRate, setPlaybackRate] = useState(0.95)
  const [isListening, setIsListening] = useState(false)
  const [result, setResult] = useState(null)
  const [supported] = useState(
    () => typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  )
  const recognitionRef = useRef(null)

  // Keep default level synced to studyLevel until user picks an unlocked tab manually
  useEffect(() => {
    if (!hasPickedLevelRef.current || !unlocked.includes(pickedLevel)) {
      setPickedLevel(studyLevel)
    }
  }, [studyLevel, unlocked, pickedLevel])

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.()
        window.speechSynthesis?.cancel?.()
      } catch {
        // Ignore cleanup errors
      }
    }
  }, [])

  const dailyBucketKey = `${todayKey}:${selectedLevel}:b${dailyBatchOffset}`
  const dailyBucket = dailyProgressMap[dailyBucketKey] || { completedIds: [], xpAwarded: false }
  const completedDailySet = useMemo(() => new Set(dailyBucket.completedIds || []), [dailyBucket])

  const dailyWords = useMemo(
    () => getDailyRandomWords(selectedLevel, todayKey, effectiveLocale, dailyBatchOffset, 10),
    [selectedLevel, todayKey, effectiveLocale, dailyBatchOffset]
  )

  const levelWordPool = useMemo(
    () => getLevelWordPool(selectedLevel, effectiveLocale),
    [selectedLevel, effectiveLocale]
  )

  const filteredExplorerWords = useMemo(() => {
    const q = explorerQuery.trim().toLowerCase()
    return levelWordPool.filter((item) => {
      if (explorerPos !== 'all') {
        const pos = String(item.pos || '').toLowerCase()
        if (explorerPos === 'other') {
          if (pos.includes('noun') || pos.includes('verb') || pos.includes('adj')) return false
        } else if (!pos.includes(explorerPos)) {
          return false
        }
      }
      if (!q) return true
      return (
        item.jp.toLowerCase().includes(q) ||
        item.reading.toLowerCase().includes(q) ||
        item.romaji.toLowerCase().includes(q) ||
        item.en.toLowerCase().includes(q)
      )
    })
  }, [levelWordPool, explorerPos, explorerQuery])

  const activeItems = useMemo(() => {
    if (activeTrack === 'daily_10') return dailyWords
    if (activeTrack === 'word_bank') {
      return filteredExplorerWords.length > 0 ? filteredExplorerWords : levelWordPool
    }
    return getStaticTrackItems(activeTrack, selectedLevel, unlocked)
  }, [activeTrack, dailyWords, filteredExplorerWords, levelWordPool, selectedLevel, unlocked])

  const safeIndex = Math.min(currentIndex, Math.max(0, activeItems.length - 1))
  const current = activeItems[safeIndex] || dailyWords[0] || levelWordPool[0]
  const activeTrackMeta = SPEECH_TRACK_ORDER.find((tr) => tr.id === activeTrack) || SPEECH_TRACK_ORDER[0]

  const pitchData = useMemo(() => {
    if (!current) return null
    return getPitchAccent(current.word || current.jp, current.reading)
  }, [current])

  const moraeList = useMemo(() => {
    if (!current) return []
    const src = current.reading || current.jp || ''
    return segmentMorae(src)
  }, [current])

  const markItemCompleted = useCallback(
    (itemId) => {
      if (!itemId) return
      setDailyProgressMap((prev) => {
        const existing = prev[dailyBucketKey] || { completedIds: [], xpAwarded: false }
        if (existing.completedIds.includes(itemId)) return prev

        const nextIds = [...existing.completedIds, itemId]
        const justFinishedAllTen = nextIds.length >= 10 && !existing.xpAwarded
        const nextMap = {
          ...prev,
          [dailyBucketKey]: {
            completedIds: nextIds,
            xpAwarded: existing.xpAwarded || justFinishedAllTen,
          },
        }
        writeDailyStorage(nextMap)

        if (justFinishedAllTen) {
          playSuccess()
          addXP?.(30, userId)
        }
        return nextMap
      })
    },
    [dailyBucketKey, addXP, userId]
  )

  const handleSelectLevel = (lvl) => {
    if (!unlocked.includes(lvl) || lvl === selectedLevel) return
    hasPickedLevelRef.current = true
    playClick()
    setPickedLevel(lvl)
    setCurrentIndex(0)
    setDailyBatchOffset(0)
    setExplorerQuery('')
    setExplorerLimit(24)
    setResult(null)
  }

  const handleSelectTrack = (trackId) => {
    playClick()
    setActiveTrack(trackId)
    setCurrentIndex(0)
    setResult(null)
  }

  const handleShuffleDaily = () => {
    playSwoosh()
    setDailyBatchOffset((prev) => prev + 1)
    setCurrentIndex(0)
    setResult(null)
  }

  const handleRandomBankWord = () => {
    const source = filteredExplorerWords.length > 0 ? filteredExplorerWords : levelWordPool
    if (source.length === 0) return
    playSwoosh()
    const randomIdx = Math.floor(Math.random() * source.length)
    setCurrentIndex(randomIdx)
    setResult(null)
  }

  const speak = useCallback((text, rate = playbackRate) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.rate = rate
      window.speechSynthesis.speak(utterance)
    } catch {
      // Ignore speech synthesis errors in restricted environments
    }
  }, [playbackRate])

  const startListening = () => {
    if (!supported || !current) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ja-JP'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    setResult(null)
    setIsListening(true)
    playClick()

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript
      const similarity = calculateSimilarity(spoken, current.jp, current.reading)

      setResult({ spoken, similarity })
      if (similarity >= 70) {
        playSuccess()
        if (activeTrack === 'daily_10') {
          markItemCompleted(current.id)
        }
      } else {
        playError()
      }
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      playError()
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const handleNext = useCallback(() => {
    if (activeItems.length === 0) return
    playSwoosh()
    setResult(null)
    setCurrentIndex((prev) => (prev + 1) % activeItems.length)
  }, [activeItems.length])

  const handlePrev = useCallback(() => {
    if (activeItems.length === 0) return
    playSwoosh()
    setResult(null)
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length)
  }, [activeItems.length])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-500'
    if (score >= 65) return 'text-amber-500'
    return 'text-rose-500'
  }

  const isCurrentDailyCompleted = activeTrack === 'daily_10' && current && completedDailySet.has(current.id)
  const dailyDoneCount = Math.min(completedDailySet.size, dailyWords.length)
  const explorerVisibleItems = useMemo(
    () => filteredExplorerWords.slice(0, explorerLimit),
    [filteredExplorerWords, explorerLimit]
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 pt-2 space-y-5">
      <SEO
        title="Speech Lab — Pronunciation, Pitch & Daily 10 Practice"
        description="Practice Japanese pronunciation and pitch accent with Daily 10 random words across 1,500+ vocabulary items per JLPT N5-N1 level."
        path="/speech"
      />

      {/* Studio Header Card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white shadow-lg border border-indigo-400/20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-orange-500/15 blur-3xl"
        />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('speech.title', 'Speech Lab')}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100/80 mt-0.5">
                {activeTrackMeta.description}
              </p>
            </div>

            {/* Daily 10 Status Badge & Equalizer Animation */}
            <div className="flex items-center gap-3 self-start sm:self-auto bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2.5">
              <div className="flex items-end gap-0.5 h-5" aria-hidden="true">
                {[0.55, 1, 0.7, 0.9, 0.45].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ scaleY: [h, 1, h * 0.5, 0.9, h] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.14,
                      ease: 'easeInOut',
                    }}
                    className="w-1 h-5 rounded-full bg-amber-300 origin-bottom"
                  />
                ))}
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                  Daily 10 ({selectedLevel})
                </div>
                <div className="text-sm font-extrabold text-white">
                  {dailyDoneCount} / {dailyWords.length || 10} Done
                </div>
              </div>
            </div>
          </div>

          {/* Unlocked JLPT Level Selector */}
          {unlocked.length > 1 ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10" role="group" aria-label="JLPT Level">
              <span className="text-xs font-semibold text-indigo-200 mr-1">
                {t('speech.your_level', 'Level')}:
              </span>
              {unlocked.map((lvl) => {
                const active = selectedLevel === lvl
                const count = unlockedCounts[lvl] || 0
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSelectLevel(lvl)}
                    aria-label={`${lvl} (${count.toLocaleString()} words)`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                    }`}
                  >
                    <span>{lvl}</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        active ? 'text-slate-800' : 'text-indigo-200/75'
                      }`}
                    >
                      {count.toLocaleString()}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}

          {/* Track Navigation Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1" role="tablist" aria-label="Speech Lab Tracks">
            {SPEECH_TRACK_ORDER.map((track) => {
              const Icon = TRACK_ICONS[track.id] || MessageSquare
              const active = activeTrack === track.id
              return (
                <button
                  key={track.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t(track.titleKey, track.titleDefault)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Track Specific Toolbar: Daily 10 Queue Strip */}
      {activeTrack === 'daily_10' && (
        <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm font-bold text-foreground">
                Today&apos;s {selectedLevel} Random 10
              </h2>
              <span className="text-xs text-muted-foreground">
                Drawn from {levelWordPool.length.toLocaleString()} {selectedLevel} words
              </span>
            </div>

            <div className="flex items-center gap-2">
              {dailyBucket.xpAwarded && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Award className="w-3.5 h-3.5" aria-hidden="true" />
                  +30 XP Earned
                </span>
              )}
              <button
                type="button"
                onClick={handleShuffleDaily}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Shuffle 10 New</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {dailyWords.map((wordItem, idx) => {
              const isSelected = idx === safeIndex
              const isDone = completedDailySet.has(wordItem.id)
              return (
                <button
                  key={wordItem.id}
                  type="button"
                  onClick={() => {
                    playClick()
                    setCurrentIndex(idx)
                    setResult(null)
                  }}
                  title={`${wordItem.jp} — ${wordItem.en}`}
                  className={`relative flex flex-col items-center justify-center rounded-xl py-1.5 px-1 text-center border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                      : isDone
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-border bg-background hover:bg-muted/60 text-foreground'
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-70">#{idx + 1}</span>
                  <span className="font-japanese text-xs font-bold truncate max-w-full px-0.5">
                    {wordItem.jp}
                  </span>
                  {isDone && (
                    <span
                      aria-label="Completed"
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Track Specific Toolbar: 1,000+ Word Explorer Filter & Picker */}
      {activeTrack === 'word_bank' && (
        <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                value={explorerQuery}
                onChange={(e) => {
                  setExplorerQuery(e.target.value)
                  setCurrentIndex(0)
                  setExplorerLimit(24)
                }}
                placeholder={`Filter ${levelWordPool.length.toLocaleString()} ${selectedLevel} words by kanji, kana, romaji, or meaning...`}
                aria-label="Filter vocabulary bank"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {POS_FILTERS.map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => {
                    setExplorerPos(pos.id)
                    setCurrentIndex(0)
                    setExplorerLimit(24)
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    explorerPos === pos.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleRandomBankWord}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors cursor-pointer"
              >
                <Dices className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Random</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {explorerVisibleItems.length.toLocaleString()} of{' '}
              {filteredExplorerWords.length.toLocaleString()} matching {selectedLevel} words
            </span>
          </div>

          {filteredExplorerWords.length === 0 ? (
            <div className="text-center py-4 text-xs text-muted-foreground">
              No words matched &ldquo;{explorerQuery}&rdquo;. Try clearing the search filter.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {explorerVisibleItems.map((item, idx) => {
                  const active = idx === safeIndex
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        playClick()
                        setCurrentIndex(idx)
                        setResult(null)
                      }}
                      className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                          : 'border-border/70 bg-background hover:bg-muted/50'
                      }`}
                    >
                      <div className="font-japanese text-sm font-bold text-foreground truncate">
                        {item.jp}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {item.reading !== item.jp ? `${item.reading} · ` : ''}
                        {item.en}
                      </div>
                    </button>
                  )
                })}
              </div>

              {explorerLimit < filteredExplorerWords.length && (
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => setExplorerLimit((prev) => prev + 36)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold border border-border bg-muted/40 hover:bg-muted text-foreground cursor-pointer"
                  >
                    Load 36 More Words ({filteredExplorerWords.length - explorerLimit} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Main Active Practice Card */}
      {current && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTrack}-${selectedLevel}-${current.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="rounded-3xl border shadow-sm p-6 sm:p-8 space-y-5 bg-surface border-border"
          >
            {/* Card Header Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-muted-foreground tracking-wider uppercase">
                  ITEM {safeIndex + 1} / {activeItems.length}
                </span>
                <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                  JLPT {current.level || selectedLevel}
                </span>
                {current.pos && (
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground capitalize">
                    {current.pos}
                  </span>
                )}
                {current.pitchTag && (
                  <span className="px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    {current.pitchTag}
                  </span>
                )}
              </div>

              {activeTrack === 'daily_10' ? (
                <button
                  type="button"
                  onClick={() => markItemCompleted(current.id)}
                  disabled={isCurrentDailyCompleted}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrentDailyCompleted
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isCurrentDailyCompleted ? 'Practiced Today' : 'Mark Practiced'}</span>
                </button>
              ) : (
                <div className="flex gap-1" aria-hidden="true">
                  {activeItems.slice(0, 12).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === safeIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Minimal Pair Contrast Banner */}
            {current.contrast && (
              <div className="bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/20 rounded-xl p-2.5 text-center text-xs font-bold text-amber-800 dark:text-amber-200">
                {current.contrast}
              </div>
            )}

            {/* Target Word / Phrase */}
            <div className="text-center space-y-2 py-2">
              <div className="font-japanese text-4xl sm:text-5xl font-black tracking-wide leading-snug text-foreground">
                {current.jp}
              </div>
              {current.reading && current.reading !== current.jp && (
                <p className="font-japanese text-lg font-bold text-primary/90">
                  {current.reading}
                </p>
              )}
              {current.romaji && (
                <p className="text-sm font-semibold text-muted-foreground tracking-wide">
                  {current.romaji}
                </p>
              )}
              <p className="text-base sm:text-lg font-bold text-foreground/85 pt-0.5">
                {current.en}
              </p>
            </div>

            {/* Pitch Contour OR Mora Rhythm Strip */}
            {pitchData ? (
              <div className="max-w-sm mx-auto">
                <PitchContourVisualizer
                  word={current.word || current.jp}
                  reading={current.reading}
                  showParticle
                />
              </div>
            ) : (
              moraeList.length > 0 && (
                <div className="max-w-md mx-auto rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-center space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Mora Timing Rhythm</span>
                    <span>{moraeList.length} {moraeList.length === 1 ? 'mora' : 'morae'}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {moraeList.map((mora, idx) => (
                      <span
                        key={`${mora}-${idx}`}
                        className="px-2.5 py-1 rounded-lg bg-card border border-border font-japanese text-sm font-bold text-foreground shadow-xs"
                      >
                        {mora}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Example Sentence Context when available */}
            {current.exampleJp && (
              <div className="rounded-2xl border border-border/60 bg-muted/25 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-japanese text-sm font-bold text-foreground">
                    {current.exampleJp}
                  </div>
                  {current.exampleEn && (
                    <div className="text-xs text-muted-foreground">{current.exampleEn}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => speak(current.exampleJp, playbackRate)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-card border border-border hover:bg-muted text-foreground transition-colors shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                  <span>Listen Example</span>
                </button>
              </div>
            )}

            {/* Native Audio Speed Controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-1">
              {[
                { rate: 1.0, label: t('speech.listen_normal', 'Listen Normal') + ' (1.0x)', accent: true },
                { rate: 0.85, label: 'Clear Pace (0.85x)', accent: false },
                { rate: 0.7, label: t('speech.listen_slow', 'Slow Pace') + ' (0.7x)', accent: false },
              ].map((opt) => (
                <button
                  key={opt.rate}
                  type="button"
                  onClick={() => {
                    setPlaybackRate(opt.rate)
                    speak(current.jp, opt.rate)
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
                    opt.accent
                      ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 dark:text-orange-300 border-orange-200/60 dark:border-orange-500/25'
                      : playbackRate === opt.rate
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-muted/60 hover:bg-muted text-foreground border-border/60'
                  }`}
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Animated Microphone Stage */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="relative flex items-center justify-center">
                {isListening && (
                  <>
                    <motion.span
                      animate={{ scale: [1, 1.45, 1], opacity: [0.45, 0, 0.45] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
                      className="absolute w-20 h-20 rounded-full bg-rose-500/40 pointer-events-none"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.75, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.4, delay: 0.35, ease: 'easeOut' }}
                      className="absolute w-20 h-20 rounded-full bg-orange-400/30 pointer-events-none"
                    />
                  </>
                )}

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!supported}
                  aria-label={isListening ? 'Stop recording pronunciation' : 'Start speaking pronunciation'}
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isListening
                      ? 'bg-rose-500 shadow-rose-500/40 ring-4 ring-rose-400/30 text-white'
                      : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25'
                  } disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed`}
                >
                  {isListening ? (
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.85 }}>
                      <MicOff className="w-8 h-8 text-white" />
                    </motion.div>
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </motion.button>
              </div>

              <p className="text-xs font-bold mt-3 text-muted-foreground text-center">
                {!supported
                  ? 'Live speech scoring works in Chromium browsers — use Listen + Mark Practiced anytime'
                  : isListening
                    ? t('speech.listening', 'Listening... speak clearly in Japanese')
                    : t('speech.tap_to_speak', 'Tap to speak & check pronunciation')}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Recognition Result Card */}
      <AnimatePresence>
        {result && current && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border shadow-sm p-5 bg-surface border-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award
                  className={`w-5 h-5 ${result.similarity >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}
                  aria-hidden="true"
                />
                <h3 className="font-bold text-foreground">
                  {t('speech.pronunciation_score', 'Pronunciation Result')}
                </h3>
              </div>
              <span className={`text-2xl font-black ${getScoreColor(result.similarity)}`}>
                {result.similarity}%
              </span>
            </div>

            <div className="space-y-1.5 text-sm bg-muted/40 rounded-2xl p-3.5 border border-border/40">
              <div className="flex gap-2">
                <span className="w-20 flex-shrink-0 text-xs font-bold text-muted-foreground uppercase">
                  {t('speech.you_said', 'You said')}:
                </span>
                <span className="font-bold text-foreground">{result.spoken || '(silence)'}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 flex-shrink-0 text-xs font-bold text-muted-foreground uppercase">
                  {t('speech.target', 'Target')}:
                </span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {current.reading || current.jp}
                </span>
              </div>
            </div>

            <div className="rounded-full h-2.5 bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.similarity}%` }}
                className={`h-full rounded-full transition-all ${
                  result.similarity >= 85
                    ? 'bg-emerald-500'
                    : result.similarity >= 65
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
              />
            </div>

            <p className="text-center text-xs font-bold text-foreground/80 pt-1">
              {result.similarity >= 85
                ? 'Excellent Tokyo pronunciation! Clean rhythm and clarity.'
                : result.similarity >= 65
                  ? 'Good attempt! Listen at 0.7x pace once more and match the mora beat.'
                  : 'Keep practicing! Match the high/low pitch curve and vowel length.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previous / Next Navigation */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all border bg-surface border-border text-foreground hover:bg-muted active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t('common.previous', 'Previous')}</span>
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all border bg-surface border-border text-foreground hover:bg-muted active:scale-95 cursor-pointer"
        >
          <span>{t('common.next', 'Next')}</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
