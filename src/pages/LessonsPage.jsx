// src/pages/LessonsPage.jsx
import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Zap, BookOpen, ChevronDown, ChevronUp,
  MessageSquare, Search, Volume2, Target,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../store/themeStore'
import { useSettingsStore } from '../store/settingsStore'
import { LESSONS, LEVEL_META, LEVELS, DATA_COUNTS } from '../data/index'
import LevelSelector from '../components/common/LevelSelector'
import { useI18n } from '../i18n'
import { audioService } from '../services/audioService'

// ── Single lesson card ────────────────────────────────────────
const LessonCard = React.forwardRef(function LessonCard({ lesson, isDark, isOpen, onToggle }, ref) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const meta = LEVEL_META[lesson.level]

  const speak = (text) => {
    audioService.speak(text).catch(() => {})
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`rounded-2xl border overflow-hidden transition-shadow bg-white border-gray-100 hover:border-gray-200 hover:shadow-md dark:bg-gray-900 dark:border-gray-700/60 dark:hover:border-gray-600 shadow-sm`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-3 group"
      >
        {/* Order badge */}
        <div className={`
          w-9 h-9 shrink-0 rounded-xl flex items-center justify-center
          text-sm font-bold bg-gradient-to-br ${meta.gradient} text-white shadow-md
        `}>
          {lesson.order || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`font-semibold text-foreground`}>
                {lesson.title}
              </p>
              {lesson.titleJp && (
                <p className={`text-sm text-muted-foreground`}>
                  {lesson.titleJp}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {lesson.duration && (
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground`}>
                  <Clock className="w-3 h-3" />
                  {lesson.duration}
                </span>
              )}
              {lesson.xp && (
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400`}>
                  <Zap className="w-3 h-3" />
                  {lesson.xp} XP
                </span>
              )}
            </div>
          </div>

          {lesson.description && (
            <p className={`text-sm mt-1 text-muted-foreground`}>
              {lesson.description}
            </p>
          )}
        </div>

        <span className={`shrink-0 mt-1 text-muted-foreground`}>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Expanded body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-5 pt-0 space-y-4 border-t border-border`}>

              {/* Grammar patterns */}
              {lesson.grammar?.length > 0 && (
                <div className="mt-4">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5 text-muted-foreground`}>
                    <BookOpen className="w-3.5 h-3.5" /> {t('nav.grammar', 'Grammar')} {t('common.pattern', 'Patterns')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.grammar.map((g, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                          isDark
                            ? `${LEVEL_META[lesson.level].darkBg} ${LEVEL_META[lesson.level].darkBorder} ${LEVEL_META[lesson.level].darkText}`
                            : `${LEVEL_META[lesson.level].lightBg} ${LEVEL_META[lesson.level].lightBorder} ${LEVEL_META[lesson.level].lightText}`
                        }`}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary */}
              {lesson.vocabulary?.length > 0 && (
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground`}>
                    {t('nav.vocabulary', 'Key Vocabulary')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.vocabulary.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => speak(v)}
                        className={`text-sm px-3 py-1 rounded-lg border transition-colors flex items-center gap-1 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white`}
                      >
                        <Volume2 className="w-3 h-3 opacity-50" />
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dialogue */}
              {lesson.dialogue?.length > 0 && (
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5 text-muted-foreground`}>
                    <MessageSquare className="w-3.5 h-3.5" /> {t('nav.conversation', 'Sample Dialogue')}
                  </p>
                  <div className="space-y-2">
                    {lesson.dialogue.map((line, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 p-3 rounded-xl bg-muted`}
                      >
                        {line.speaker && (
                          <span className={`text-xs shrink-0 font-medium mt-0.5 px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400`}>
                            {line.speaker}
                          </span>
                        )}
                        <button
                          onClick={() => speak(line.jp)}
                          className={`p-1 shrink-0 rounded-lg transition-colors hover:text-red-500 text-gray-400 dark:hover:text-red-400 dark:text-gray-600`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <p className={`text-sm font-medium text-foreground`}>
                            {line.jp}
                          </p>
                          <p className={`text-xs mt-0.5 text-muted-foreground`}>
                            {line.en}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercises preview */}
              {lesson.exercises?.length > 0 && (
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground`}>
                    {t('common.practice', 'Exercises')} ({lesson.exercises.length})
                  </p>
                  <div className="space-y-2">
                    {lesson.exercises.slice(0, 2).map((ex, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-sm bg-blue-50/60 border-blue-100 dark:bg-gray-800/60 dark:border-gray-700/50`}
                      >
                        <p className={`font-medium text-foreground/80`}>
                          {ex.question}
                        </p>
                        <p className={`text-xs mt-1 italic text-muted-foreground`}>
                          Type: {ex.type}
                        </p>
                      </div>
                    ))}
                    {lesson.exercises.length > 2 && (
                      <p className={`text-xs text-center text-muted-foreground`}>
                        +{lesson.exercises.length - 2} {t('common.practice', 'more exercises')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Cultural note */}
              {lesson.culturalNote && (
                <div className={`p-3 rounded-xl text-sm bg-purple-50 border border-purple-100 text-purple-800 dark:bg-purple-500/5 dark:border dark:border-purple-500/10 dark:text-purple-300/80`}>
                  <p className="font-semibold text-xs uppercase tracking-wide opacity-70 mb-1">🎌 Cultural Note</p>
                  {lesson.culturalNote}
                </div>
              )}

              {/* Action Buttons: Launch Interactive Lesson & Take Quiz */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    const lvl = (lesson.level || 'n5').toLowerCase()
                    const day = lesson.day || lesson.order || 1
                    navigate(`/lessons/${lvl}/${day}`)
                  }}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t('lessons.start_interactive', 'Interactive Lesson')}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/quiz/${lesson.id}`)
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-muted hover:bg-muted/80 text-foreground border border-border transition-all active:scale-95 cursor-pointer"
                >
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>{t('lessons.take_quiz', 'Practice Quiz')}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

// ── Page ──────────────────────────────────────────────────────
export default function LessonsPage() {
  const { t } = useI18n()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const targetLevel = useSettingsStore((s) => s.jlptLevel)

  const [level,  setLevel]  = useState(targetLevel || 'N5')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(null)

  const meta = LEVEL_META[level]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return LESSONS[level]
    return LESSONS[level].filter((l) =>
      l.title.toLowerCase().includes(q) ||
      (l.titleJp || '').includes(search) ||
      (l.description || '').toLowerCase().includes(q) ||
      (l.grammar || []).some((g) => g.toLowerCase().includes(q)) ||
      (l.vocabulary || []).some((v) => v.includes(search))
    )
  }, [level, search])

  const handleLevelChange = useCallback((l) => {
    setLevel(l)
    setSearch('')
    setOpenId(null)
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${meta.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 60%)' }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 opacity-90" />
            <span className="text-sm font-medium opacity-90">{t('nav.lessons', 'Structured Lessons')}</span>
          </div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="text-sm opacity-80 mt-1">{meta.description}</p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="opacity-90">
              <strong>{DATA_COUNTS.lessons[level]}</strong> {t('nav.lessons', 'lessons')}
            </span>
            {filtered.length !== DATA_COUNTS.lessons[level] && (
              <span className="opacity-70">{filtered.length} {t('common.complete', 'shown')}</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="space-y-3">
        <LevelSelector
          selected={level}
          onChange={handleLevelChange}
          counts={DATA_COUNTS.lessons}
          isDark={isDark}
        />
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-white border-gray-200 focus-within:border-gray-300 dark:bg-gray-900 dark:border-gray-700/60 dark:focus-within:border-gray-500`}>
          <Search className={`w-4 h-4 shrink-0 text-muted-foreground`} />
          <input
            type="text"
            placeholder={t('common.search', 'Search lessons, grammar, or vocabulary…')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 dark:text-white dark:placeholder-gray-600`}
          />
          {search && (
            <button onClick={() => setSearch('')} className={`text-xs text-muted-foreground`}>
              {t('kana.clear', 'Clear')}
            </button>
          )}
        </div>
      </div>

      <p className={`text-sm text-muted-foreground`}>
        {filtered.length} {t('nav.lessons', 'lessons')}
      </p>

      {/* Cards */}
      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isDark={isDark}
              isOpen={openId === lesson.id}
              onToggle={() => setOpenId(openId === lesson.id ? null : lesson.id)}
            />
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-16 rounded-2xl border border-border text-muted-foreground`}
          >
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t('common.error', 'No lessons found')}</p>
            <p className="text-sm mt-1">{t('common.retry', 'Try adjusting your search')}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}