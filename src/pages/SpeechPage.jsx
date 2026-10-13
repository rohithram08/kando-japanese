import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, RefreshCw } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

const PRACTICE_SENTENCES = [
  { jp: 'おはようございます', en: 'Good morning', romaji: 'Ohayou gozaimasu' },
  { jp: 'ありがとうございます', en: 'Thank you very much', romaji: 'Arigatou gozaimasu' },
  { jp: '日本語を勉強しています', en: 'I am studying Japanese', romaji: 'Nihongo wo benkyou shite imasu' },
  { jp: 'もう一度言ってください', en: 'Please say it again', romaji: 'Mou ichido itte kudasai' },
  { jp: 'わかりません', en: "I don't understand", romaji: 'Wakarimasen' },
  { jp: 'すみません、どこですか', en: 'Excuse me, where is it?', romaji: 'Sumimasen, doko desu ka' },
  { jp: 'いくらですか', en: 'How much is it?', romaji: 'Ikura desu ka' },
  { jp: '電車はどこですか', en: 'Where is the train?', romaji: 'Densha wa doko desu ka' },
]

export default function SpeechPage() {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState(null)
  const [supported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  const recognitionRef = useRef(null)

  const current = PRACTICE_SENTENCES[currentIndex]

  const speak = (text) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (!supported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ja-JP'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript
      setTranscript(spoken)

      const normalize = (str) => str.replace(/\s/g, '').toLowerCase()
      const isCorrect = normalize(spoken) === normalize(current.jp)
      const similarity = calculateSimilarity(normalize(spoken), normalize(current.jp))

      setResult({
        spoken,
        isCorrect,
        similarity: Math.round(similarity * 100),
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

  const next = () => {
    setCurrentIndex((i) => (i + 1) % PRACTICE_SENTENCES.length)
    setTranscript('')
    setResult(null)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-1">🎤 Speech Practice</h1>
        <p className="text-pink-100 text-sm">Practice your Japanese pronunciation</p>
      </motion.div>

      {!supported && (
        <div className={`rounded-2xl p-4 text-sm border bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-400`}>
          ⚠️ Speech recognition is not supported in your browser. Try Chrome or Edge.
        </div>
      )}

      {/* Practice Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className={`rounded-2xl border shadow-sm p-6 bg-surface border-border`}
        >
          {/* Sentence Counter */}
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium text-muted-foreground`}>
              Sentence {currentIndex + 1} of {PRACTICE_SENTENCES.length}
            </span>
            <div className="flex gap-1">
              {PRACTICE_SENTENCES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex
                      ? 'w-4 bg-red-500'
                      : 'w-1.5 bg-gray-200 dark:w-1.5 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Japanese Sentence */}
          <div className="text-center mb-6">
            <p className={`text-4xl font-bold mb-2 text-foreground`}>
              {current.jp}
            </p>
            <p className={`text-sm text-muted-foreground`}>{current.romaji}</p>
            <p className={`text-sm mt-1 text-muted-foreground`}>{current.en}</p>
          </div>

          {/* Listen Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => speak(current.jp)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20`}
            >
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
          </div>

          {/* Record Button */}
          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isListening ? stopListening : startListening}
              disabled={!supported}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isListening
                  ? 'bg-red-500 shadow-red-500/30'
                  : 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'
              } disabled:opacity-40`}
            >
              {isListening ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <MicOff className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </motion.button>
          </div>

          {isListening && (
            <p className="text-center text-red-500 text-sm mt-3 animate-pulse">🎙️ Listening...</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl border shadow-sm p-5 bg-surface border-border`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold text-foreground`}>Result</h3>
              <span className={`text-2xl font-bold ${getScoreColor(result.similarity)}`}>
                {result.similarity}%
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className={`w-16 flex-shrink-0 text-muted-foreground`}>
                  You said:
                </span>
                <span className={`font-medium text-foreground`}>
                  {result.spoken}
                </span>
              </div>
              <div className="flex gap-2">
                <span className={`w-16 flex-shrink-0 text-muted-foreground`}>
                  Target:
                </span>
                <span className={`font-medium text-foreground`}>
                  {current.jp}
                </span>
              </div>
            </div>

            <div className={`mt-3 rounded-full h-2 bg-muted`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.similarity}%` }}
                className={`h-2 rounded-full ${
                  result.similarity >= 90
                    ? 'bg-green-500'
                    : result.similarity >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
              />
            </div>

            <p className="text-center mt-3 text-sm font-medium">
              {result.similarity >= 90
                ? '🎉 Excellent pronunciation!'
                : result.similarity >= 70
                  ? '👍 Good job! Keep practicing!'
                  : "💪 Keep practicing! You'll get it!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <button
        onClick={next}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-medium shadow-sm transition-colors border bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-800`}
      >
        <RefreshCw className="w-4 h-4" />
        Next Sentence
      </button>
    </div>
  )
}