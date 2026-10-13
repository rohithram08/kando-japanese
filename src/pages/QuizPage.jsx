import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../store/themeStore'
import MatchingGame from '../components/quiz/MatchingGame'

const QUIZ_MODES = [
  {
    id: 'matching',
    label: 'Matching Game',
    emoji: '🔗',
    description: 'Match kanji with their meanings',
    color: 'blue',
  },
  {
    id: 'lesson',
    label: 'Lesson Quiz',
    emoji: '📝',
    description: 'Take a quiz from a specific lesson',
    color: 'red',
  },
]

const COLOR_MAP_LIGHT = {
  blue: 'border-blue-200 bg-blue-50 hover:border-blue-400',
  red: 'border-red-200 bg-red-50 hover:border-red-400',
}

const COLOR_MAP_DARK = {
  blue: 'border-blue-500/20 bg-blue-500/10 hover:border-blue-500/40',
  red: 'border-red-500/20 bg-red-500/10 hover:border-red-500/40',
}

export default function QuizPage() {
  const navigate = useNavigate()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  const [activeMode, setActiveMode] = useState(null)

  const colorMap = isDark ? COLOR_MAP_DARK : COLOR_MAP_LIGHT

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-1">🧠 Quiz Center</h1>
        <p className="text-red-100 text-sm">Test your Japanese knowledge</p>
      </motion.div>

      {/* Mode Selector */}
      {!activeMode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUIZ_MODES.map((mode, i) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (mode.id === 'lesson') {
                  navigate('/lessons')
                } else {
                  setActiveMode(mode.id)
                }
              }}
              className={`p-6 rounded-2xl border-2 text-left transition-all shadow-sm ${colorMap[mode.color]}`}
            >
              <div className="text-4xl mb-3">{mode.emoji}</div>
              <h3 className={`font-bold text-lg text-foreground`}>
                {mode.label}
              </h3>
              <p className={`text-sm mt-1 text-muted-foreground`}>
                {mode.description}
              </p>
              {mode.id === 'lesson' && (
                <span
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full border bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400`}
                >
                  Select a lesson first →
                </span>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Matching Game */}
      {activeMode === 'matching' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => setActiveMode(null)}
            className={`flex items-center gap-2 text-sm mb-4 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white`}
          >
            ← Back to Quiz Center
          </button>
          <MatchingGame />
        </motion.div>
      )}
    </div>
  )
}