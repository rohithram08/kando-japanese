import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react'
import { useI18n } from '../i18n'
import PitchContourVisualizer from '../components/pitch/PitchContourVisualizer'
import { getPitchAccent } from '../data/pitch/pitchData'
import { playSuccess, playError, playSwoosh, playClick } from '../utils/soundEffects'

// ── Practice Tracks ─────────────────────────────────────────────────────────

const PRACTICE_TRACKS = {
  sentences: {
    id: 'sentences',
    titleKey: 'speech.track_sentences',
    titleDefault: 'Everyday Sentences',
    icon: '🗣️',
    description: 'Natural phrases for daily conversation, travel, and requests',
    items: [
      { id: 's1', jp: 'おはようございます', reading: 'おはようございます', en: 'Good morning', romaji: 'Ohayou gozaimasu' },
      { id: 's2', jp: 'ありがとうございます', reading: 'ありがとうございます', en: 'Thank you very much', romaji: 'Arigatou gozaimasu' },
      { id: 's3', jp: '日本語を勉強しています', reading: 'にほんごをべんきょうしています', en: 'I am studying Japanese', romaji: 'Nihongo wo benkyou shite imasu' },
      { id: 's4', jp: 'もう一度言ってください', reading: 'もういちどいってください', en: 'Please say it again', romaji: 'Mou ichido itte kudasai' },
      { id: 's5', jp: 'わかりません', reading: 'わかりません', en: "I don't understand", romaji: 'Wakarimasen' },
      { id: 's6', jp: 'すみません、どこですか', reading: 'すみません、どこですか', en: 'Excuse me, where is it?', romaji: 'Sumimasen, doko desu ka' },
      { id: 's7', jp: 'いくらですか', reading: 'いくらですか', en: 'How much is it?', romaji: 'Ikura desu ka' },
      { id: 's8', jp: '電車はどこですか', reading: 'でんしゃはどこですか', en: 'Where is the train?', romaji: 'Densha wa doko desu ka' },
    ],
  },
  minimal_pairs: {
    id: 'minimal_pairs',
    titleKey: 'speech.track_minimal_pairs',
    titleDefault: 'Pitch Minimal Pairs',
    icon: '🎵',
    description: 'Crucial Tokyo pitch accent contrasts (chopsticks vs bridge vs edge, rain vs candy)',
    items: [
      { id: 'mp1_1', jp: '箸', word: '箸', reading: 'はし', en: 'chopsticks (① Atamadaka: H-L)', romaji: 'hashi', contrast: 'Contrast: 箸 (chopsticks [①]) vs 橋 (bridge [②]) vs 端 (edge [⓪])' },
      { id: 'mp1_2', jp: '橋', word: '橋', reading: 'はし', en: 'bridge (② Odaka: L-H-[L])', romaji: 'hashi', contrast: 'Contrast: 箸 (chopsticks [①]) vs 橋 (bridge [②]) vs 端 (edge [⓪])' },
      { id: 'mp1_3', jp: '端', word: '端', reading: 'はし', en: 'edge / corner (⓪ Heiban: L-H-[H])', romaji: 'hashi', contrast: 'Contrast: 箸 (chopsticks [①]) vs 橋 (bridge [②]) vs 端 (edge [⓪])' },
      { id: 'mp2_1', jp: '雨', word: '雨', reading: 'あめ', en: 'rain (① Atamadaka: H-L)', romaji: 'ame', contrast: 'Contrast: 雨 (rain [①]) vs 飴 (candy [⓪])' },
      { id: 'mp2_2', jp: '飴', word: '飴', reading: 'あめ', en: 'candy (⓪ Heiban: L-H-[H])', romaji: 'ame', contrast: 'Contrast: 雨 (rain [①]) vs 飴 (candy [⓪])' },
      { id: 'mp3_1', jp: '花', word: '花', reading: 'はな', en: 'flower (② Odaka: L-H-[L])', romaji: 'hana', contrast: 'Contrast: 花 (flower [②]) vs 鼻 (nose [⓪])' },
      { id: 'mp3_2', jp: '鼻', word: '鼻', reading: 'はな', en: 'nose (⓪ Heiban: L-H-[H])', romaji: 'hana', contrast: 'Contrast: 花 (flower [②]) vs 鼻 (nose [⓪])' },
      { id: 'mp4_1', jp: '雲', word: '雲', reading: 'くも', en: 'cloud (① Atamadaka: H-L)', romaji: 'kumo', contrast: 'Contrast: 雲 (cloud [①]) vs 蜘蛛 (spider [②])' },
      { id: 'mp4_2', jp: '蜘蛛', word: '蜘蛛', reading: 'くも', en: 'spider (② Odaka: L-H-[L])', romaji: 'kumo', contrast: 'Contrast: 雲 (cloud [①]) vs 蜘蛛 (spider [②])' },
      { id: 'mp5_1', jp: '酒', word: '酒', reading: 'さけ', en: 'sake / alcohol (⓪ Heiban: L-H-[H])', romaji: 'sake', contrast: 'Contrast: 酒 (sake [⓪]) vs 坂 (slope [②])' },
      { id: 'mp5_2', jp: '坂', word: '坂', reading: 'さか', en: 'slope / hill (② Odaka: L-H-[L])', romaji: 'saka', contrast: 'Contrast: 酒 (sake [⓪]) vs 坂 (slope [②])' },
    ],
  },
  verbs: {
    id: 'verbs',
    titleKey: 'speech.track_verbs',
    titleDefault: 'High-Frequency Verbs',
    icon: '⚡',
    description: 'Master authentic Tokyo intonation for fundamental action verbs',
    items: [
      { id: 'v1', jp: '食べる', word: '食べる', reading: 'たべる', en: 'to eat (② Nakadaka)', romaji: 'taberu' },
      { id: 'v2', jp: '飲む', word: '飲む', reading: 'のむ', en: 'to drink (① Atamadaka)', romaji: 'nomu' },
      { id: 'v3', jp: '行く', word: '行く', reading: 'いく', en: 'to go (⓪ Heiban)', romaji: 'iku' },
      { id: 'v4', jp: '来る', word: '来る', reading: 'くる', en: 'to come (① Atamadaka)', romaji: 'kuru' },
      { id: 'v5', jp: '見る', word: '見る', reading: 'みる', en: 'to see (① Atamadaka)', romaji: 'miru' },
      { id: 'v6', jp: '聞く', word: '聞く', reading: 'きく', en: 'to listen (⓪ Heiban)', romaji: 'kiku' },
      { id: 'v7', jp: '話す', word: '話す', reading: 'はなす', en: 'to speak (② Nakadaka)', romaji: 'hanasu' },
      { id: 'v8', jp: '買う', word: '買う', reading: 'かう', en: 'to buy (⓪ Heiban)', romaji: 'kau' },
    ],
  },
}

export default function SpeechPage() {
  const { t } = useI18n()

  const [activeTrack, setActiveTrack] = useState('sentences')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [result, setResult] = useState(null)
  const [supported] = useState(() => typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window))
  const recognitionRef = useRef(null)

  const trackData = PRACTICE_TRACKS[activeTrack] || PRACTICE_TRACKS.sentences
  const items = trackData.items
  const current = items[currentIndex] || items[0]

  // Check if current item has verified pitch accent data
  const pitchData = useMemo(() => {
    return getPitchAccent(current.word || current.jp, current.reading)
  }, [current])

  // Reset result when moving to another item or track
  const handleSelectTrack = (trackId) => {
    playClick()
    setActiveTrack(trackId)
    setCurrentIndex(0)
    setResult(null)
  }

  const speak = useCallback((text, rate = 0.85) => {
    playClick()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.rate = rate
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const calculateSimilarity = (a, b) => {
    if (a === b) return 1
    const longer = a.length > b.length ? a : b
    const shorter = a.length > b.length ? b : a
    if (longer.length === 0) return 1
    const editDistance = levenshtein(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const levenshtein = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i])
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b[i - 1] === a[j - 1]
            ? matrix[i - 1][j - 1]
            : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
    return matrix[b.length][a.length]
  }

  const startListening = () => {
    if (!supported) return

    playSwoosh()
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ja-JP'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript

      const normalize = (str) => str.replace(/[\s、。！？,.!?]/g, '').toLowerCase()
      const targetText = current.reading || current.jp
      const targetWord = current.word || current.jp

      const normSpoken = normalize(spoken)
      const normTarget = normalize(targetText)
      const normWord = normalize(targetWord)

      const isExact = normSpoken === normTarget || normSpoken === normWord
      const similarityWord = calculateSimilarity(normSpoken, normWord)
      const similarityReading = calculateSimilarity(normSpoken, normTarget)
      const similarity = isExact ? 1 : Math.max(similarityWord, similarityReading)
      const score = Math.round(similarity * 100)

      if (score >= 70) {
        playSuccess()
      } else {
        playError()
      }

      setResult({
        spoken,
        isCorrect: isExact || score >= 80,
        similarity: score,
      })
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const handleNext = useCallback(() => {
    playClick()
    setCurrentIndex((i) => (i + 1) % items.length)
    setResult(null)
  }, [items.length])

  const handlePrev = useCallback(() => {
    playClick()
    setCurrentIndex((i) => (i - 1 + items.length) % items.length)
    setResult(null)
  }, [items.length])

  // Keyboard navigation: ArrowRight / ArrowLeft to browse, Space to trigger speech
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-500'
    if (score >= 65) return 'text-amber-500'
    return 'text-red-500'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-xl shadow-amber-500/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎤</span>
              <h1 className="text-2xl font-black tracking-tight">{t('nav.speech', 'Speech & Pitch Practice')}</h1>
            </div>
            <p className="text-amber-100 text-sm">
              {t('speech.subtitle', 'Master Tokyo pitch accent contours, minimal pairs & pronunciation')}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            Tokyo NHK Grounded
          </span>
        </div>

        {/* Practice Tracks Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {Object.values(PRACTICE_TRACKS).map((track) => {
            const isActive = activeTrack === track.id
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-orange-600 shadow-md scale-102'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
              >
                <span>{track.icon}</span>
                <span className="truncate">{t(track.titleKey, track.titleDefault)}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {!supported && (
        <div className="rounded-2xl p-4 text-sm border bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300">
          ⚠️ Speech recognition is not supported in this browser. Try Google Chrome or Microsoft Edge for live microphone practice.
        </div>
      )}

      {/* Main Practice Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTrack}_${currentIndex}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border shadow-sm p-6 bg-surface border-border space-y-6"
        >
          {/* Card Top Bar: Item Index & Step Dots */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide uppercase text-muted-foreground">
              {t('common.item', 'Item')} {currentIndex + 1} / {items.length}
            </span>
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex
                      ? 'w-5 bg-orange-500'
                      : 'w-1.5 bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Contrast Note (for minimal pairs) */}
          {current.contrast && (
            <div className="rounded-xl px-3.5 py-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-200/60 dark:border-orange-500/20 text-xs font-medium text-orange-800 dark:text-orange-300">
              💡 {current.contrast}
            </div>
          )}

          {/* Primary Japanese Word / Sentence */}
          <div className="text-center pt-2">
            <p className="text-4xl sm:text-5xl font-black mb-2 text-foreground tracking-tight">
              {current.jp}
            </p>
            {current.reading && current.reading !== current.jp && (
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {current.reading}
              </p>
            )}
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {current.romaji}
            </p>
            <p className="text-base font-semibold text-foreground/80 mt-1">
              {current.en}
            </p>
          </div>

          {/* Pitch Accent Visualizer (Embedded when available) */}
          {pitchData && (
            <div className="pt-2 pb-1">
              <PitchContourVisualizer
                word={current.word || current.jp}
                reading={current.reading || current.jp}
                showParticle={true}
                compact={false}
              />
            </div>
          )}

          {/* Audio Listening Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => speak(current.jp, 0.95)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 dark:text-orange-300 border border-orange-200/50 dark:border-orange-500/20 active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('speech.listen_normal', 'Listen Normal')} (1.0x)</span>
            </button>
            <button
              onClick={() => speak(current.jp, 0.7)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all bg-muted hover:bg-muted/80 text-foreground border border-border/60 active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span>{t('speech.listen_slow', 'Slow Pace')} (0.7x)</span>
            </button>
          </div>

          {/* Record Microphone Button */}
          <div className="flex flex-col items-center justify-center pt-2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={isListening ? stopListening : startListening}
              disabled={!supported}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isListening
                  ? 'bg-rose-500 shadow-rose-500/40 ring-4 ring-rose-400/30'
                  : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20'
              } disabled:opacity-40 cursor-pointer`}
            >
              {isListening ? (
                <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 0.9 }}>
                  <MicOff className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </motion.button>
            <p className="text-xs font-bold mt-3 text-muted-foreground">
              {isListening
                ? t('speech.listening', '🎙️ Listening... speak clearly in Japanese')
                : t('speech.tap_to_speak', 'Tap to speak & check pronunciation')}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Recognition Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border shadow-sm p-5 bg-surface border-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${result.similarity >= 80 ? 'text-green-500' : 'text-amber-500'}`} />
                <h3 className="font-bold text-foreground">{t('speech.pronunciation_score', 'Pronunciation Result')}</h3>
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
                <span className="font-bold text-foreground">
                  {result.spoken || '(silence)'}
                </span>
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
                    ? 'bg-green-500'
                    : result.similarity >= 65
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
              />
            </div>

            <p className="text-center text-xs font-bold text-foreground/80 pt-1">
              {result.similarity >= 85
                ? '🎉 Excellent Tokyo pronunciation! Flawless rhythm.'
                : result.similarity >= 65
                  ? '👍 Good attempt! Listen to the 0.7x slow pace and try again.'
                  : '💪 Keep practicing! Match the high/low mora pitch curve.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all border bg-surface border-border text-foreground hover:bg-muted active:scale-98"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('common.previous', 'Previous')}</span>
        </button>
        <button
          onClick={handleNext}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all border bg-surface border-border text-foreground hover:bg-muted active:scale-98"
        >
          <span>{t('common.next', 'Next')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}