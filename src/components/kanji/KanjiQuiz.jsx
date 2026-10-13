import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, XCircle, Volume2, ArrowRight, RotateCcw,
  Trophy, Zap, Target, Clock, Star,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useProgressStore } from '../../store/progressStore'
import { XP_REWARDS, calculateQuizXP } from '../../utils/progressCalculator'
import { useAudio } from '../../hooks/useAudio'

const SAMPLE_QUIZ_DATA = [
  { id: 1, character: '山', meaning: 'mountain', onyomi: ['サン'], kunyomi: ['やま'], options: ['mountain', 'river', 'fire', 'tree'], type: 'meaning' },
  { id: 2, character: '水', meaning: 'water', onyomi: ['スイ'], kunyomi: ['みず'], options: ['water', 'earth', 'wind', 'sky'], type: 'meaning' },
  { id: 3, character: '火', meaning: 'fire', onyomi: ['カ'], kunyomi: ['ひ'], options: ['fire', 'water', 'stone', 'metal'], type: 'meaning' },
  { id: 4, character: '木', meaning: 'tree/wood', onyomi: ['モク'], kunyomi: ['き'], options: ['tree/wood', 'grass', 'flower', 'leaf'], type: 'meaning' },
  { id: 5, character: '人', meaning: 'person', onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'], options: ['person', 'hand', 'eye', 'mouth'], type: 'meaning' },
]

const QuizModes = {
  MEANING: 'meaning',
  READING: 'reading',
  WRITING: 'writing',
}

const KanjiQuiz = ({ kanjiList = SAMPLE_QUIZ_DATA, onComplete }) => {
  const { user, profile, updateProfile } = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const { awardQuizXP, awardKanjiXP } = useProgressStore()
  const { playAudio } = useAudio()

  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [timerActive, setTimerActive] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const [results, setResults] = useState([])
  const [quizMode, setQuizMode] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const initQuiz = useCallback((mode) => {
    const shuffled = [...kanjiList]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(10, kanjiList.length))
    setQuestions(shuffled)
    setQuizMode(mode)
    setCurrentIdx(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setResults([])
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowResult(false)
    setTimeLeft(15)
    setTimerActive(true)
  }, [kanjiList])

  const currentQuestion = questions[currentIdx]

  // Timer
  useEffect(() => {
    if (!timerActive || !currentQuestion || showResult) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(null)
          return 15
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, currentIdx, showResult])

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return
    setTimerActive(false)
    setSelectedAnswer(answer)

    const correct = answer === currentQuestion.meaning
    setIsCorrect(correct)
    setShowExplanation(true)

    const newStreak = correct ? streak + 1 : 0
    const newMaxStreak = Math.max(maxStreak, newStreak)
    setStreak(newStreak)
    setMaxStreak(newMaxStreak)

    // ── New XP system: flat rewards, no combo multiplier ──
    // Correct = base XP per question (we'll total it at the end)
    // XP is awarded at quiz completion, not per question
    const xpGained = correct ? XP_REWARDS.SRS_CARD_CORRECT : 0

    if (correct) {
      setScore(prev => prev + 1)
    }

    setResults(prev => [
      ...prev,
      {
        question: currentQuestion,
        answer,
        correct,
        xpGained,
        timeUsed: 15 - timeLeft,
      },
    ])
  }

  const handleNext = async () => {
    const nextIdx = currentIdx + 1
    if (nextIdx >= questions.length) {
      setShowResult(true)

      // ── Award XP at the end using new system ──
      const finalScorePercent = questions.length > 0
        ? Math.round((score / questions.length) * 100)
        : 0

      try {
        const result = await awardQuizXP(user?.id, finalScorePercent)
        if (result) {
          updateProfile({
            xp_points: result.newTotal,
            current_level: result.jlptLevel || profile?.current_level,
          })
        }
      } catch (err) {
        console.error('Error awarding kanji quiz XP:', err)
      }

      onComplete?.({ score, total: questions.length, maxStreak })
    } else {
      setCurrentIdx(nextIdx)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setShowExplanation(false)
      setTimeLeft(15)
      setTimerActive(true)
    }
  }

  const accuracy = results.length > 0
    ? Math.round((results.filter(r => r.correct).length / results.length) * 100)
    : 0

  // Calculate total XP earned using new system
  const totalXPEarned = questions.length > 0
    ? calculateQuizXP(Math.round((score / questions.length) * 100))
    : 0

  // Mode Selection Screen
  if (!quizMode) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-bold mb-2 text-foreground`}>
            Kanji Quiz
          </h2>
          <p className="text-muted-foreground">
            Choose your quiz mode to begin
          </p>
        </div>
        <div className="space-y-3">
          {[
            { mode: QuizModes.MEANING, title: 'Meaning Quiz', desc: 'Identify the meaning of each kanji', icon: '📖', color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-200 dark:border-blue-500/30', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
            { mode: QuizModes.READING, title: 'Reading Quiz', desc: "Choose the correct reading (on'yomi / kun'yomi)", icon: '🔊', color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-200 dark:border-purple-500/30', bgColor: 'bg-purple-50 dark:bg-purple-500/10' },
            { mode: QuizModes.WRITING, title: 'Writing Quiz', desc: 'Identify the kanji from its meaning', icon: '✏️', color: 'from-green-500 to-green-600', borderColor: 'border-green-200 dark:border-green-500/30', bgColor: 'bg-green-50 dark:bg-green-500/10' },
          ].map(({ mode, title, desc, icon, color, borderColor, bgColor }) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => initQuiz(mode)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${borderColor} ${bgColor} hover:border-opacity-60 transition-all group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                {icon}
              </div>
              <div className="text-left flex-1">
                <p className={`font-semibold text-foreground`}>{title}</p>
                <p className={`text-sm text-muted-foreground`}>{desc}</p>
              </div>
              <ArrowRight className={`w-5 h-5 transition-colors text-gray-400 group-hover:text-gray-800 dark:text-gray-500 dark:group-hover:text-white`} />
            </motion.button>
          ))}
        </div>
        <p className={`text-center text-xs mt-4 text-muted-foreground`}>
          {Math.min(10, kanjiList.length)} questions • 15 seconds per question
        </p>
      </div>
    )
  }

  // Final Results Screen
  if (showResult) {
    const rank = accuracy >= 90
      ? { label: 'Excellent!', icon: '🏆', color: 'text-yellow-500 dark:text-yellow-400' }
      : accuracy >= 70
        ? { label: 'Good Job!', icon: '🌟', color: 'text-blue-500 dark:text-blue-400' }
        : accuracy >= 50
          ? { label: 'Keep Going!', icon: '💪', color: 'text-orange-500 dark:text-orange-400' }
          : { label: 'Keep Practicing', icon: '📚', color: 'text-red-500 dark:text-red-400' }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto"
      >
        {/* Result Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="text-6xl mb-3"
          >
            {rank.icon}
          </motion.div>
          <h2 className={`text-3xl font-bold ${rank.color} mb-1`}>
            {rank.label}
          </h2>
          <p className="text-muted-foreground">Quiz Complete!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Score', value: `${score}/${questions.length}`, icon: Target, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20' },
            { label: 'Accuracy', value: `${accuracy}%`, icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 border-green-100 dark:bg-green-500/10 dark:border-green-500/20' },
            { label: 'Best Streak', value: `${maxStreak}x`, icon: Star, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20' },
            { label: 'XP Earned', value: `+${totalXPEarned}`, icon: Zap, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 border-yellow-100 dark:bg-yellow-500/10 dark:border-yellow-500/20' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-2xl p-4 ${bg}`}
            >
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-gray-500 text-xs dark:text-gray-400 dark:text-xs">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Question Review */}
        <div className={`border rounded-2xl overflow-hidden mb-6 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700`}>
          <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700`}>
            <p className={`font-semibold text-sm text-foreground`}>Review</p>
          </div>
          <div className={`divide-y max-h-52 overflow-y-auto divide-gray-100 dark:divide-gray-700/50`}>
            {results.map((result, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 ${
                  result.correct
                    ? 'bg-green-50/50 dark:bg-green-500/5'
                    : 'bg-red-50/50 dark:bg-red-500/5'
                }`}
              >
                {result.correct ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span className={`text-2xl font-bold w-8 text-center text-foreground`}>
                  {result.question.character}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate text-foreground`}>
                    {result.question.meaning}
                  </p>
                  {!result.correct && result.answer && (
                    <p className="text-xs text-red-400">You answered: {result.answer}</p>
                  )}
                  {!result.correct && !result.answer && (
                    <p className="text-xs text-red-400">Time out</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => initQuiz(quizMode)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white`}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setQuizMode(null)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-red-500/20 hover:opacity-90 transition-opacity"
          >
            <Trophy className="w-4 h-4" />
            New Mode
          </motion.button>
        </div>
      </motion.div>
    )
  }

  if (!currentQuestion) return null

  const timerPercent = (timeLeft / 15) * 100
  const timerColor = timeLeft > 8 ? 'bg-green-500' : timeLeft > 4 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs text-muted-foreground`}>
            {currentIdx + 1} / {questions.length}
          </span>
          {streak >= 2 && (
            <motion.span
              key={streak}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`text-xs px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 dark:border dark:border-orange-500/30`}
            >
              🔥 {streak}x Streak
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 text-yellow-500 dark:text-yellow-400`} />
          <span className={`font-bold text-sm text-yellow-600 dark:text-yellow-400`}>
            {score}/{currentIdx + (selectedAnswer !== null ? 1 : 0)} correct
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`h-1.5 rounded-full overflow-hidden bg-muted`}>
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
          animate={{ width: `${(currentIdx / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Timer */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 text-xs text-muted-foreground`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
        <div className={`h-1.5 rounded-full overflow-hidden bg-muted`}>
          <motion.div
            className={`h-full rounded-full transition-colors ${timerColor}`}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className={`rounded-3xl p-8 text-center shadow-xl border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
      >
        <p className={`text-xs mb-4 uppercase tracking-widest text-muted-foreground`}>
          {quizMode === QuizModes.MEANING
            ? 'What is the meaning of'
            : quizMode === QuizModes.READING
              ? 'What is the reading of'
              : 'Which kanji means'}
        </p>

        {/* Kanji Display */}
        <div className="relative inline-block mb-4">
          <motion.span
            key={currentQuestion.character}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`text-8xl font-bold block leading-none text-foreground`}
          >
            {quizMode === QuizModes.WRITING ? '？' : currentQuestion.character}
          </motion.span>
          <button
            onClick={() => playAudio(currentQuestion.character)}
            className={`absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {quizMode === QuizModes.WRITING && (
          <p className={`text-xl font-semibold mb-2 text-foreground`}>
            "{currentQuestion.meaning}"
          </p>
        )}

        {quizMode === QuizModes.MEANING && (
          <p className={`text-sm mb-2 text-muted-foreground`}>
            {currentQuestion.onyomi[0]} ・{currentQuestion.kunyomi[0]}
          </p>
        )}
      </motion.div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option, i) => {
          const isSelected = selectedAnswer === option
          const isAnswer = option === currentQuestion.meaning
          const isWrong = isSelected && !isCorrect

          let optionClass = 'bg-surface border-border text-foreground/80 hover:border-foreground/20 hover:bg-muted'

          if (selectedAnswer !== null) {
            if (isAnswer) {
              optionClass = 'bg-green-50 border-green-400 text-green-700 shadow-lg shadow-green-500/10 dark:bg-green-500/20 dark:border-green-500 dark:text-green-300 dark:shadow-lg dark:shadow-green-500/10'
            } else if (isWrong) {
              optionClass = 'bg-red-50 border-red-400 text-red-700 shadow-lg shadow-red-500/10 dark:bg-red-500/20 dark:border-red-500 dark:text-red-300 dark:shadow-lg dark:shadow-red-500/10'
            } else {
              optionClass = 'bg-muted border-border text-muted-foreground'
            }
          }

          return (
            <motion.button
              key={i}
              whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
              whileTap={selectedAnswer === null ? { scale: 0.97 } : {}}
              onClick={() => selectedAnswer === null && handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`relative p-4 rounded-2xl border font-medium text-sm transition-all ${optionClass}`}
            >
              {option}
              {selectedAnswer !== null && isAnswer && (
                <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-green-400" />
              )}
              {isWrong && (
                <XCircle className="absolute top-2 right-2 w-4 h-4 text-red-400" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Explanation + Next */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className={`rounded-2xl p-4 border ${
              isCorrect
                ? 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/30'
                : 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className={`font-semibold text-sm ${
                  isCorrect
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className={`text-xs text-foreground/80`}>
                <span className={`font-bold text-base mr-2 text-foreground`}>
                  {currentQuestion.character}
                </span>
                means{' '}
                <span className={`font-semibold text-foreground`}>
                  {currentQuestion.meaning}
                </span>
                {' · '}On: {currentQuestion.onyomi.join(', ')} · Kun: {currentQuestion.kunyomi.join(', ')}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-red-500/20 hover:opacity-90 transition-opacity"
            >
              {currentIdx + 1 >= questions.length ? (
                <>
                  <Trophy className="w-4 h-4" /> See Results
                </>
              ) : (
                <>
                  Next Question <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default KanjiQuiz