import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useProgressStore } from '../../store/progressStore'
import { useDailyGoalsStore } from '../../store/dailyGoalsStore'
import { normalizeLocale, useI18n } from '../../i18n'
import { getLesson } from '../../api/lessons'
import { completeLesson as apiCompleteLesson } from '../../api/progress'
import { XP_REWARDS } from '../../utils/progressCalculator'
import VocabCard from './VocabCard'
import GrammarCard from './GrammarCard'
import KanjiCard from './KanjiCard'
import toast from 'react-hot-toast'
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle, Clock,
  Zap, ChevronLeft, X, Star, Trophy, Sparkles,
  GraduationCap, Target
} from 'lucide-react'

export default function LessonViewer() {
  const { level, day } = useParams()
  const { user, profile, updateProfile } = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const { incrementLessons } = useProgressStore()
  const addLessonGoal = useDailyGoalsStore((s) => s.addLesson)
  const navigate = useNavigate()
  const { t, locale } = useI18n()

  const [lesson, setLesson] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    loadLesson()
  }, [level, day])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goBack()
      if (e.key === 'ArrowRight') goForward()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentSection])

  const loadLesson = async () => {
    try {
      setLoading(true)
      const dayNum = parseInt(day, 10) || 1
      const res = await getLesson(level.toUpperCase(), dayNum)
      const data = res.lesson || res
      setLesson(data)
    } catch (err) {
      console.error('Failed to load lesson:', err)
      toast.error('Lesson not found')
    } finally {
      setLoading(false)
    }
  }

  const buildSections = () => {
    if (!lesson) return []
    const sections = []

    sections.push({
      type: 'intro',
      title: `${t('common.day', 'Day')} ${day}: ${lesson.title || lesson.title_en || ''}`,
      content: lesson.description,
    })

    const vocabList = lesson.vocabulary || lesson.lesson_vocabulary?.map(lv => lv.vocabulary) || []
    if (vocabList.length > 0) {
      sections.push({
        type: 'vocabulary',
        title: t('nav.vocabulary', 'Vocabulary'),
        icon: '📝',
        items: vocabList.map((v, i) => typeof v === 'string' ? { id: `v-${i}`, word: v, reading: v, meaning: v } : v),
        count: vocabList.length,
      })
    }

    const kanjiList = lesson.kanji || lesson.lesson_kanji?.map(lk => lk.kanji) || []
    if (kanjiList.length > 0) {
      sections.push({
        type: 'kanji',
        title: t('nav.kanji', 'Kanji'),
        icon: '漢',
        items: kanjiList.map((k, i) => typeof k === 'string' ? { id: `k-${i}`, character: k, meaning: k } : k),
        count: kanjiList.length,
      })
    }

    const grammarList = lesson.grammar || lesson.lesson_grammar?.map(lg => lg.grammar_points) || []
    if (grammarList.length > 0) {
      sections.push({
        type: 'grammar',
        title: t('nav.grammar', 'Grammar'),
        icon: '📖',
        items: grammarList.map((g, i) => typeof g === 'string' ? { id: `g-${i}`, pattern: g, meaning: g, explanation: g } : g),
        count: grammarList.length,
      })
    }

    sections.push({ type: 'complete', title: t('lessons.complete_title', 'Lesson Complete!') })
    return sections
  }

  const sections = buildSections()
  const currentSec = sections[currentSection]
  const progress = ((currentSection + 1) / sections.length) * 100
  const lang = locale
  const timeElapsed = Math.floor((Date.now() - startTime) / 1000)

  const goBack = useCallback(() => {
    setCurrentSection(prev => Math.max(0, prev - 1))
  }, [])

  const goForward = useCallback(() => {
    setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))
  }, [sections.length])

  const completeLesson = async () => {
    if (completing || !lesson) return
    setCompleting(true)

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    try {
      const res = await apiCompleteLesson({
        lessonId: lesson.id,
        score: 100,
        timeSpentSeconds: timeSpent,
      })

      incrementLessons()
      addLessonGoal(1)

      const xpResult = res?.xpResult
      if (xpResult) {
        useProgressStore.setState((s) => ({
          totalXP: xpResult.totalXP ?? s.totalXP,
          userLevel: xpResult.newLevel ?? s.userLevel,
          streak: xpResult.streakDays ?? s.streak,
          dailyXP: s.dailyXP + (xpResult.xpGained || 0),
        }))

        if (xpResult.badgesAwarded && xpResult.badgesAwarded.length > 0) {
          xpResult.badgesAwarded.forEach((b) => {
            toast.success(`New badge: ${b.badgeName || b.badgeType}`, {
              duration: 4000,
              icon: '🏆',
            })
          })
        }
      }

      const xpGained = xpResult?.xpGained !== undefined ? xpResult.xpGained : XP_REWARDS.LESSON_GREAT
      if (xpGained > 0) {
        toast.success(`+${xpGained} XP! Lesson Complete! 🎉`)
      } else {
        toast.success('Lesson Complete! (Already earned XP) 👍')
      }
      navigate(`/quiz/${lesson.id}`)
    } catch (err) {
      console.error('Failed to complete lesson via API:', err)
      toast.error('Failed to save progress')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-5xl"
        >
          🎌
        </motion.div>
        <p className="text-muted-foreground">
          Loading lesson...
        </p>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-5xl">📭</div>
        <p className="text-muted-foreground">
          Lesson not found
        </p>
        <button
          onClick={() => navigate('/lessons')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700`}
        >
          ← Back to Lessons
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Top Bar ── */}
      <div className={`sticky top-0 z-30 rounded-2xl p-3 sm:p-4 mb-4 backdrop-blur-xl border bg-white/90 border-gray-100 shadow-sm dark:bg-gray-900/90 dark:border-gray-800`}>
        {/* Level & back */}
        <div className="flex items-center justify-between mb-2.5">
          <button
            onClick={() => navigate('/lessons')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white`}
          >
            <ChevronLeft className="w-4 h-4" />
            {level} · Day {day}
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground`}>
              {currentSection + 1} / {sections.length}
            </span>
          </div>
        </div>

        {/* Section indicators (dots) */}
        <div className="flex items-center gap-1.5 mb-2.5">
          {sections.map((sec, i) => (
            <button
              key={i}
              onClick={() => setCurrentSection(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSection
                  ? 'bg-red-500 flex-[2]'
                  : i < currentSection
                    ? 'bg-emerald-400 flex-1 dark:bg-emerald-500/50 dark:flex-1'
                    : 'bg-gray-200 flex-1 dark:bg-gray-700 dark:flex-1'
              }`}
              title={sec.title}
            />
          ))}
        </div>

        {/* Section labels */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {sections.map((sec, i) => (
            <button
              key={i}
              onClick={() => setCurrentSection(i)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg 
                         whitespace-nowrap transition-all cursor-pointer ${
                i === currentSection
                  ? 'bg-red-50 text-red-600 font-semibold border border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:font-semibold dark:border dark:border-red-500/20'
                  : i < currentSection
                    ? 'text-emerald-600/70 hover:text-emerald-600 dark:text-emerald-500/70 dark:hover:text-emerald-400'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400'
              }`}
            >
              {i < currentSection && <CheckCircle className="w-3 h-3" />}
              {sec.icon && <span className="text-xs">{sec.icon}</span>}
              <span>{sec.type === 'intro' ? t('lessons.intro', 'Intro') : sec.type === 'complete' ? t('lessons.done', 'Done') : sec.title}</span>
              {sec.count && (
                <span className={`text-[10px] text-muted-foreground`}>
                  ({sec.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`rounded-2xl border p-5 sm:p-6 bg-white border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800`}
        >
          {/* ── Intro ── */}
          {currentSec?.type === 'intro' && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-red-50 dark:bg-red-500/10 dark:border dark:border-red-500/20`}
              >
                <GraduationCap className={`w-10 h-10 text-red-500 dark:text-red-400`} />
              </motion.div>

              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-2xl sm:text-3xl font-extrabold mb-3 text-foreground`}
              >
                {currentSec.title}
              </motion.h1>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`leading-relaxed max-w-md mx-auto mb-8 text-muted-foreground`}
              >
                {currentSec.content || `Let's learn new Japanese in today's lesson!`}
              </motion.p>

              {/* Lesson content summary */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-3 flex-wrap"
              >
                {sections.find(s => s.type === 'vocabulary')?.items?.length > 0 && (
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm 
                                   font-medium transition-colors bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border dark:border-red-500/20`}>
                    <span>📝</span>
                    <span>{sections.find(s => s.type === 'vocabulary')?.items?.length} {t('nav.vocabulary', 'Vocabulary')}</span>
                  </div>
                )}
                {sections.find(s => s.type === 'kanji')?.items?.length > 0 && (
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm 
                                   font-medium transition-colors bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border dark:border-blue-500/20`}>
                    <span className="font-bold">漢</span>
                    <span>{sections.find(s => s.type === 'kanji')?.items?.length} {t('nav.kanji', 'Kanji')}</span>
                  </div>
                )}
                {sections.find(s => s.type === 'grammar')?.items?.length > 0 && (
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm 
                                   font-medium transition-colors bg-green-50 text-green-600 border border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border dark:border-green-500/20`}>
                    <span>📖</span>
                    <span>{sections.find(s => s.type === 'grammar')?.items?.length} {t('nav.grammar', 'Grammar')}</span>
                  </div>
                )}
              </motion.div>

              {/* Time estimate */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground`}
              >
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ~{lesson?.duration || lesson?.estimated_minutes || 15}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  +{lesson?.xp || lesson?.xp_reward || 50} XP
                </span>
              </motion.div>
            </div>
          )}

          {/* ── Vocabulary ── */}
          {currentSec?.type === 'vocabulary' && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-red-50 dark:bg-red-500/10 dark:border dark:border-red-500/20`}>
                  📝
                </div>
                <div>
                  <h2 className={`text-xl font-bold text-foreground`}>
                    {currentSec.title}
                  </h2>
                  <p className={`text-xs text-muted-foreground`}>
                    {currentSec.items?.length} words to learn
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {currentSec.items?.map((vocab, i) => (
                  <VocabCard key={vocab.id || i} vocab={vocab} lang={lang} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* ── Kanji ── */}
          {currentSec?.type === 'kanji' && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:border dark:border-blue-500/20 dark:text-blue-400`}>
                  漢
                </div>
                <div>
                  <h2 className={`text-xl font-bold text-foreground`}>
                    {currentSec.title}
                  </h2>
                  <p className={`text-xs text-muted-foreground`}>
                    {currentSec.items?.length} characters to learn
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {currentSec.items?.map((kanji, i) => (
                  <KanjiCard key={kanji.id || i} kanji={kanji} compact showActions={false} />
                ))}
              </div>
            </div>
          )}

          {/* ── Grammar ── */}
          {currentSec?.type === 'grammar' && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-green-50 dark:bg-green-500/10 dark:border dark:border-green-500/20`}>
                  📖
                </div>
                <div>
                  <h2 className={`text-xl font-bold text-foreground`}>
                    {currentSec.title}
                  </h2>
                  <p className={`text-xs text-muted-foreground`}>
                    {currentSec.items?.length} grammar points
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {currentSec.items?.map((grammar, i) => (
                  <GrammarCard key={grammar.id || i} grammar={grammar} lang={lang} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* ── Complete ── */}
          {currentSec?.type === 'complete' && (
            <div className="text-center py-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="mb-6"
              >
                <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center bg-yellow-50 dark:bg-yellow-500/10 dark:border dark:border-yellow-500/20`}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: 2 }}
                    className="text-5xl"
                  >
                    🎉
                  </motion.div>
                </div>
              </motion.div>

              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl sm:text-3xl font-extrabold mb-2 text-foreground`}
              >
                {t('quiz.passed', 'Great Work!')}
              </motion.h2>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`mb-6 text-muted-foreground`}
              >
                You've completed Day {day} of JLPT {level}!
              </motion.p>

              {/* Stats summary */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`inline-flex items-center gap-4 px-6 py-3 rounded-2xl mb-8 bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border dark:border-gray-700`}
              >
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold text-lg">
                    +{lesson?.xp || lesson?.xp_reward || XP_REWARDS.LESSON_GREAT} XP
                  </span>
                </div>
                <div className={`w-px h-6 bg-muted`} />
                <div className={`flex items-center gap-1.5 text-sm text-muted-foreground`}>
                  <Clock className="w-4 h-4" />
                  <span>{Math.round((Date.now() - startTime) / 60000)} min</span>
                </div>
              </motion.div>

              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={completeLesson}
                disabled={completing}
                className="px-10 py-4 bg-gradient-to-r from-red-500 to-red-600
                           text-white rounded-2xl font-bold text-lg hover:shadow-xl
                           hover:shadow-red-500/20 transition-all disabled:opacity-50
                           flex items-center gap-2 mx-auto"
              >
                {completing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    {t('quiz.take_quiz', 'Take Quiz')}
                  </>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation Buttons ── */}
      <div className="flex gap-3 mt-4 mb-20">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goBack}
          disabled={currentSection === 0}
          className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm flex items-center 
                      justify-center gap-2 transition-all disabled:opacity-30 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600`}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.previous', 'Previous')}
        </motion.button>

        {currentSec?.type !== 'complete' && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goForward}
            className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white 
                       rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-red-500/20 
                       transition-all flex items-center justify-center gap-2"
          >
            {t('common.next', 'Next')}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  )
}
