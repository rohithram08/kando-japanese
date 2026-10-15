import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useProgressStore } from '../../store/progressStore'
import { LESSONS, VOCABULARY, KANJI, GRAMMAR } from '../../data/index'
import { calculateQuizXP, XP_REWARDS } from '../../utils/progressCalculator'
import MultipleChoice from './MultipleChoice'
import FillBlank from './FillBlank'
import { useI18n, getCurriculumMeaning } from '../../i18n'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'

export default function QuizEngine() {
  const { lessonId } = useParams()
  const { user, profile, updateProfile } = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const { t, locale } = useI18n()
  const isDark = resolvedTheme === 'dark'
  const { awardQuizXP } = useProgressStore()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(300)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    loadQuiz()
    return () => clearInterval(timerRef.current)
  }, [lessonId])

  useEffect(() => {
    if (!loading && !quizComplete && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            finishQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [loading, quizComplete, questions])

  const loadQuiz = async () => {
    try {
      const allLessons = Object.values(LESSONS).flat()
      const lesson = allLessons.find(l =>
        l.id === lessonId ||
        l.id?.toLowerCase() === lessonId?.toLowerCase() ||
        `${l.level?.toLowerCase()}_day${l.order}` === lessonId?.toLowerCase() ||
        `${l.level?.toLowerCase()}-day${l.order}` === lessonId?.toLowerCase() ||
        `day${l.order}` === lessonId?.toLowerCase()
      ) || allLessons[0]

      const level = lesson?.level || 'N5'
      const vocabPool = VOCABULARY[level] || VOCABULARY.N5 || []
      const kanjiPool = KANJI[level] || KANJI.N5 || []
      const grammarPool = GRAMMAR[level] || GRAMMAR.N5 || []

      const vocab = (lesson?.vocabulary || []).map(word => {
        return vocabPool.find(v => v.word === word || v.word?.includes(word) || word?.includes(v.word)) || {
          id: `v_${word}`,
          word,
          reading: word,
          meaning_en: word,
        }
      })

      const quizQuestions = generateQuizFromLesson(lesson, vocab.length > 0 ? vocab : vocabPool.slice(0, 5), kanjiPool.slice(0, 4), grammarPool.slice(0, 3))

      setQuiz({ time_limit_seconds: 300, passing_score: 70 })
      setTimeLeft(300)
      setQuestions(quizQuestions)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  const generateQuizFromLesson = (lesson, vocab = [], kanji = [], grammar = []) => {
    const questions = []

    // If lesson has predefined exercises, add them first
    if (lesson?.exercises && Array.isArray(lesson.exercises)) {
      lesson.exercises.forEach((ex, idx) => {
        if (ex.type === 'multiple' && ex.options && ex.answer) {
          questions.push({
            type: 'multiple_choice',
            question: ex.question,
            options: ex.options,
            correct: ex.options.indexOf(ex.answer),
            explanation: `Correct answer: ${ex.answer}`,
          })
        }
      })
    }

    const allVocabMeanings = (VOCABULARY[lesson?.level || 'N5'] || []).map(v => getCurriculumMeaning(v, locale) || v.meaning_en || v.meaning).filter(Boolean)
    const allKanjiMeanings = (KANJI[lesson?.level || 'N5'] || []).map(k => getCurriculumMeaning(k, locale) || k.meaning_en || k.meaning).filter(Boolean)

    const getWrongAnswers = (correct, pool, count = 3) => {
      const wrong = pool.filter(m => m !== correct)
      const shuffled = wrong.sort(() => Math.random() - 0.5)
      const picked = shuffled.slice(0, count)
      const fallbacks = ['None of the above', "I don't know", 'Something else']
      while (picked.length < count) {
        picked.push(fallbacks[picked.length])
      }
      return picked
    }

    vocab.slice(0, 3).forEach(v => {
      const meaning = getCurriculumMeaning(v, locale) || v?.meaning_en || v?.meaning
      if (!meaning || !v?.word) return
      const wrongAnswers = getWrongAnswers(meaning, allVocabMeanings)
      const allOptions = [meaning, ...wrongAnswers]
      const shuffled = allOptions.sort(() => Math.random() - 0.5)
      questions.push({
        type: 'multiple_choice',
        question: t('quiz.what_does_mean', { word: v.word }, `What does "${v.word}" mean?`),
        question_jp: v.word,
        options: shuffled,
        correct: shuffled.indexOf(meaning),
        explanation: `${v.word} (${v.reading || ''}) means "${meaning}"`,
      })
    })

    kanji.slice(0, 2).forEach(k => {
      const char = k?.character || k?.kanji
      const meaning = getCurriculumMeaning(k, locale) || k?.meaning_en || k?.meaning
      if (!meaning || !char) return
      const wrongAnswers = getWrongAnswers(meaning, allKanjiMeanings)
      const allOptions = [meaning, ...wrongAnswers]
      const shuffled = allOptions.sort(() => Math.random() - 0.5)
      questions.push({
        type: 'multiple_choice',
        question: t('quiz.what_is_kanji_meaning', { kanji: char }, `What is the meaning of 「${char}」?`),
        question_jp: char,
        options: shuffled,
        correct: shuffled.indexOf(meaning),
        explanation: `${char} means "${meaning}"`,
      })
    })

    grammar.slice(0, 2).forEach(g => {
      const meaning = getCurriculumMeaning(g, locale) || g?.meaning_en || g?.meaning
      if (!meaning || !g?.pattern) return
      const allGrammarMeanings = (GRAMMAR[lesson?.level || 'N5'] || []).map(gp => getCurriculumMeaning(gp, locale) || gp.meaning_en || gp.meaning).filter(Boolean)
      const wrongAnswers = getWrongAnswers(meaning, allGrammarMeanings)
      const allOptions = [meaning, ...wrongAnswers]
      const shuffled = allOptions.sort(() => Math.random() - 0.5)
      questions.push({
        type: 'multiple_choice',
        question: `What does "${g.pattern}" mean?`,
        options: shuffled,
        correct: shuffled.indexOf(meaning),
        explanation: g.explanation_en || g.explanation || `${g.pattern} means "${meaning}"`,
      })
    })

    return questions.sort(() => Math.random() - 0.5)
  }

  const handleAnswer = (answerIndex) => {
    if (showFeedback) return
    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const isCorrect = answerIndex === questions[currentQ].correct
    if (isCorrect) setScore(prev => prev + 1)

    setAnswers(prev => [
      ...prev,
      {
        question: currentQ,
        selected: answerIndex,
        correct: questions[currentQ].correct,
        isCorrect,
      },
    ])

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)
      if (currentQ + 1 >= questions.length) {
        finishQuiz()
      } else {
        setCurrentQ(prev => prev + 1)
      }
    }, 1500)
  }

  // ── Finish quiz using new XP system ───────────────────
  const finishQuiz = async () => {
    clearInterval(timerRef.current)
    setQuizComplete(true)

    const finalScore = questions.length > 0
      ? Math.round((score / questions.length) * 100)
      : 0
    const passed = finalScore >= (quiz?.passing_score || 70)

    if (passed) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }

    if (!user?.id) {
      // Guest mode - no server XP submission, show score toast without error
      if (passed) {
        toast.success(`Quiz passed! ${finalScore}% 🎉 (Sign in to save progress)`)
      } else {
        toast(`${finalScore}% - Keep practicing! 💪 (Sign in to save progress)`)
      }
      return
    }

    try {
      // Award XP using the unified system with lessonId
      const result = await awardQuizXP(user.id, finalScore, lessonId)

      if (result && updateProfile) {
        updateProfile({
          xp_points: result.newTotal,
          current_level: result.jlptLevel || profile?.current_level,
        })
      }

      const xpGained = result?.xpGained !== undefined ? result.xpGained : calculateQuizXP(finalScore)

      if (xpGained === 0) {
        if (passed) {
          toast.success(`Quiz passed! ${finalScore}% (Already completed)`)
        } else {
          toast(`Quiz completed! ${finalScore}% (Already completed)`)
        }
      } else {
        if (passed) {
          toast.success(`Quiz passed! +${xpGained} XP! 🎉`)
        } else {
          toast(`+${xpGained} XP for trying! Keep practicing 💪`)
        }
      }
    } catch (err) {
      console.error('Error awarding quiz XP:', err)
    }
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            📝
          </motion.div>
          <p className="text-muted-foreground">
            Preparing your quiz...
          </p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😅</div>
        <p className={`text-lg font-semibold text-gray-500 dark:text-gray-300`}>
          No questions available
        </p>
        <p className={`text-sm mt-2 text-muted-foreground`}>
          This lesson has no vocabulary, kanji or grammar linked yet.
        </p>
        <button
          onClick={() => navigate('/lessons')}
          className="mt-6 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold"
        >
          ← Back to Lessons
        </button>
      </div>
    )
  }

  if (quizComplete) {
    const finalScore = Math.round((score / questions.length) * 100)
    const passed = finalScore >= (quiz?.passing_score || 70)
    const xpEarned = calculateQuizXP(finalScore)

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className={`rounded-3xl border shadow-lg p-8 text-center bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800`}>
          <div className="text-7xl mb-4">
            {finalScore >= 90 ? '🏆' : finalScore >= 70 ? '🎉' : '💪'}
          </div>
          <h2 className="text-2xl font-bold mb-1 text-foreground">
            {passed ? t('quiz.passed', 'Quiz Passed! Outstanding work! 🌸') : t('quiz.failed', 'Keep practicing and try again! 💪')}
          </h2>

          {/* Score Ring */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none"
                className="stroke-gray-100 dark:stroke-gray-800"
                strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={passed ? '#22c55e' : '#ef4444'}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 100' }}
                animate={{ strokeDasharray: `${finalScore} 100 - finalScore` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold text-foreground`}>
                {finalScore}%
              </span>
              <span className={`text-xs text-muted-foreground`}>{t('quiz.score_label', 'Score')}</span>
            </div>
          </div>

          {/* XP Earned */}
          <div className={`flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full mx-auto w-fit bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border dark:border-yellow-500/20`}>
            <span>⭐</span>
            <span className="font-bold text-sm">+{xpEarned} XP</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className={`rounded-xl p-3 bg-green-50 dark:bg-green-500/10`}>
              <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>{score}</div>
              <div className={`text-xs text-green-400 dark:text-green-500`}>{t('quiz.correct_label', 'Correct')}</div>
            </div>
            <div className={`rounded-xl p-3 bg-red-50 dark:bg-red-500/10`}>
              <div className={`text-2xl font-bold text-red-600 dark:text-red-400`}>{questions.length - score}</div>
              <div className={`text-xs text-red-400 dark:text-red-500`}>{t('quiz.incorrect_label', 'Wrong')}</div>
            </div>
            <div className={`rounded-xl p-3 bg-blue-50 dark:bg-blue-500/10`}>
              <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>{questions.length}</div>
              <div className={`text-xs text-blue-400 dark:text-blue-500`}>{t('quiz.total_label', 'Total')}</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="text-left mb-6 space-y-2">
            <h3 className={`font-bold text-sm mb-3 text-foreground/80`}>{t('quiz.review_label', 'Review:')}</h3>
            {questions.map((q, i) => {
              const answer = answers[i]
              return (
                <div key={i} className={`p-3 rounded-xl text-sm border ${
                  answer?.isCorrect
                    ? 'bg-green-50 border-green-100 dark:bg-green-500/5 dark:border-green-500/20'
                    : 'bg-red-50 border-red-100 dark:bg-red-500/5 dark:border-red-500/20'
                }`}>
                  <p className={`font-medium mb-1 text-foreground`}>
                    {i + 1}. {q.question}
                  </p>
                  {!answer?.isCorrect && (
                    <>
                      <p className="text-red-500 text-xs">✗ {q.options[answer?.selected]}</p>
                      <p className="text-green-600 text-xs">✓ {q.options[q.correct]}</p>
                    </>
                  )}
                  {q.explanation && (
                    <p className={`text-xs mt-1 italic text-muted-foreground`}>
                      {q.explanation}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/lessons')}
              className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              {passed ? `→ ${t('common.next', 'Next Lesson')}` : `← ${t('common.back', 'Back to Lesson')}`}
            </button>
            {!passed && (
              <button
                onClick={() => {
                  setCurrentQ(0)
                  setAnswers([])
                  setScore(0)
                  setQuizComplete(false)
                  setSelectedAnswer(null)
                  setShowFeedback(false)
                  setTimeLeft(quiz?.time_limit_seconds || 300)
                }}
                className={`w-full py-3 border-2 rounded-xl font-semibold transition-colors border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800`}
              >
                🔄 {t('common.retry', 'Try Again')}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  const currentQuestion = questions[currentQ]
  if (!currentQuestion) return null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Quiz Header */}
      <div className={`rounded-2xl border p-4 mb-4 shadow-sm bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium text-muted-foreground`}>
            Question {currentQ + 1} of {questions.length}
          </span>
          <div className={`flex items-center gap-2 font-mono font-bold text-sm px-3 py-1 rounded-full ${
            timeLeft < 60
              ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>
        <div className={`rounded-full h-2 bg-muted`}>
          <motion.div
            className="bg-red-500 h-2 rounded-full"
            animate={{ width: `${(currentQ / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
        >
          {currentQuestion.type === 'multiple_choice' && (
            <MultipleChoice
              question={currentQuestion}
              onAnswer={handleAnswer}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              lang={profile?.native_language || 'english'}
            />
          )}
          {currentQuestion.type === 'fill_blank' && (
            <FillBlank
              question={currentQuestion}
              onAnswer={handleAnswer}
              showFeedback={showFeedback}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}