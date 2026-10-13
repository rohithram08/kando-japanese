// src/components/lessons/LessonList.jsx
// Replaces the old hardcoded component — now reads from LESSONS data index

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock, Zap, BookOpen, ChevronRight, Lock } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { useProgressStore } from '../../store/progressStore'
import { LESSONS, LEVEL_META, LEVELS, DATA_COUNTS } from '../../data/index'
import LevelSelector from '../common/LevelSelector'

export default function LessonList() {
  const { resolvedTheme } = useThemeStore()
  const isDark  = resolvedTheme === 'dark'
  const navigate = useNavigate()
  const { lessonsCompleted, jlptLevel } = useProgressStore()

  const [level, setLevel] = useState(jlptLevel || 'N5')
  const meta = LEVEL_META[level]
  const lessons = LESSONS[level] || []

  // A lesson is "unlocked" if the user has completed the previous one
  // (order 1 is always unlocked)
  const isUnlocked = (lesson) => {
    if ((lesson.order || 1) === 1) return true
    return lessonsCompleted >= (lesson.order || 1) - 1
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${meta.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 75% 50%, white 0%, transparent 65%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 opacity-90" />
            <span className="text-sm font-medium opacity-90">Lessons</span>
          </div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="text-sm opacity-80 mt-1">{meta.description}</p>
          <p className="text-sm mt-2 opacity-90">
            <strong>{DATA_COUNTS.lessons[level]}</strong> lessons •{' '}
            <strong>{lessonsCompleted}</strong> completed
          </p>
        </div>
      </motion.div>

      {/* Level tabs */}
      <LevelSelector
        selected={level}
        onChange={setLevel}
        counts={DATA_COUNTS.lessons}
        isDark={isDark}
      />

      {/* Lesson cards */}
      <div className="space-y-3">
        {lessons.map((lesson, idx) => {
          const unlocked = isUnlocked(lesson)
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => unlocked && navigate(`/lessons/${level.toLowerCase()}/${lesson.order || idx + 1}`)}
              className={`
                flex items-start gap-4 p-4 rounded-2xl border transition-all
                ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                ${isDark
                  ? `bg-gray-900 border-gray-700/60 ${unlocked ? 'hover:border-gray-500 hover:shadow-lg hover:shadow-black/20' : ''}`
                  : `bg-white border-gray-100 ${unlocked ? 'hover:border-gray-200 hover:shadow-md' : ''}`
                }
                shadow-sm
              `}
            >
              {/* Order circle */}
              <div className={`
                w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold
                ${unlocked
                  ? `bg-gradient-to-br ${meta.gradient} text-white shadow-md`
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {unlocked ? lesson.order || idx + 1 : <Lock className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-foreground`}>
                  {lesson.title}
                </p>
                {lesson.titleJp && (
                  <p className={`text-sm text-muted-foreground`}>
                    {lesson.titleJp}
                  </p>
                )}
                {lesson.description && (
                  <p className={`text-sm mt-0.5 line-clamp-2 text-muted-foreground`}>
                    {lesson.description}
                  </p>
                )}
                {/* Grammar tags preview */}
                {lesson.grammar?.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {lesson.grammar.slice(0, 3).map((g, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500`}>{g}</span>
                    ))}
                    {lesson.grammar.length > 3 && (
                      <span className={`text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500`}>+{lesson.grammar.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Meta badges + arrow */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
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
                {unlocked && (
                  <ChevronRight className={`w-4 h-4 mt-1 text-muted-foreground`} />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}