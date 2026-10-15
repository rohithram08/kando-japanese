// src/pages/ProgressPage.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, BookOpen, Flame, Star, Trophy, Target,
  Calendar, Clock, Zap, Award, ChevronRight, ChevronDown,
  ChevronUp, BarChart3, PieChart, Activity, BookMarked,
  GraduationCap, Layers, RefreshCw, CheckCircle2, Circle,
  ArrowUpRight, ArrowDownRight, Minus, Sparkles, Crown,
  Medal, Shield, Lock, Unlock, Brain, Eye, Pen,
  MessageCircle, Volume2, Languages, Swords,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { getProgress } from '../api/progress'
import { useI18n } from '../i18n'

// ── Constants ────────────────────────────────────────────
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']

const LEVEL_DETAILS = {
  N5: { kanji: 80,  vocab: 800,   grammar: 80,  label: 'Beginner',     color: 'green'  },
  N4: { kanji: 170, vocab: 1500,  grammar: 165, label: 'Elementary',   color: 'blue'   },
  N3: { kanji: 370, vocab: 3750,  grammar: 250, label: 'Intermediate', color: 'yellow' },
  N2: { kanji: 1000, vocab: 6000, grammar: 350, label: 'Advanced',     color: 'orange' },
  N1: { kanji: 2000, vocab: 10000, grammar: 450, label: 'Fluent',      color: 'red'    },
}

const SKILL_AREAS = [
  { key: 'reading',   label: 'Reading',    Icon: Eye,            color: 'blue' },
  { key: 'writing',   label: 'Writing',    Icon: Pen,            color: 'purple' },
  { key: 'listening', label: 'Listening',  Icon: Volume2,        color: 'green' },
  { key: 'speaking',  label: 'Speaking',   Icon: MessageCircle,  color: 'orange' },
  { key: 'grammar',   label: 'Grammar',    Icon: Languages,      color: 'red' },
  { key: 'vocab',     label: 'Vocabulary', Icon: BookMarked,     color: 'cyan' },
]

// ── Simulated weekly data (replace with real data) ───────
const WEEKLY_ACTIVITY = [
  { day: 'Mon', minutes: 25, lessons: 2 },
  { day: 'Tue', minutes: 40, lessons: 3 },
  { day: 'Wed', minutes: 15, lessons: 1 },
  { day: 'Thu', minutes: 55, lessons: 4 },
  { day: 'Fri', minutes: 30, lessons: 2 },
  { day: 'Sat', minutes: 60, lessons: 5 },
  { day: 'Sun', minutes: 20, lessons: 1 },
]

const RECENT_ACHIEVEMENTS = [
  { id: 1, title: 'First Steps',       desc: 'Complete your first lesson',      icon: '🎯', unlocked: true,  date: '2 days ago' },
  { id: 2, title: 'Word Collector',    desc: 'Learn 50 vocabulary words',       icon: '📚', unlocked: true,  date: '1 day ago' },
  { id: 3, title: 'Kanji Apprentice',  desc: 'Study 20 kanji characters',       icon: '漢', unlocked: true,  date: 'Today' },
  { id: 4, title: 'Week Warrior',      desc: 'Maintain a 7-day streak',         icon: '🔥', unlocked: false, date: null },
  { id: 5, title: 'Grammar Guru',      desc: 'Complete all N5 grammar lessons',  icon: '📖', unlocked: false, date: null },
  { id: 6, title: 'Conversation Star', desc: '50 messages in Chat Dojo',         icon: '💬', unlocked: false, date: null },
  { id: 7, title: 'SRS Master',        desc: 'Master 100 SRS cards',            icon: '🧠', unlocked: false, date: null },
  { id: 8, title: 'Polyglot Path',     desc: 'Reach N4 level',                  icon: '👑', unlocked: false, date: null },
]

const MILESTONES = [
  { xp: 100,   label: 'Novice',       icon: Shield,  unlocked: true },
  { xp: 500,   label: 'Learner',      icon: Star,    unlocked: true },
  { xp: 1000,  label: 'Student',      icon: Award,   unlocked: false },
  { xp: 2500,  label: 'Scholar',      icon: Medal,   unlocked: false },
  { xp: 5000,  label: 'Expert',       icon: Trophy,  unlocked: false },
  { xp: 10000, label: 'Master',       icon: Crown,   unlocked: false },
]

// ── Helper ───────────────────────────────────────────────
const formatNumber = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

const getChangeIndicator = (change) => {
  if (change > 0) return { Icon: ArrowUpRight, color: 'text-green-500', label: `+${change}` }
  if (change < 0) return { Icon: ArrowDownRight, color: 'text-red-500', label: `${change}` }
  return { Icon: Minus, color: 'text-gray-400', label: '0' }
}

// ══════════════════════════════════════════════════════════
// ── PROGRESS BAR COMPONENT ───────────────────────────────
// ══════════════════════════════════════════════════════════
const ProgressBar = ({ value, max, color = 'indigo', height = 'h-2', showLabel = false, animated = true }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  const colorMap = {
    indigo:  'from-indigo-500 to-purple-500',
    green:   'from-green-500 to-emerald-500',
    blue:    'from-blue-500 to-cyan-500',
    red:     'from-red-500 to-pink-500',
    yellow:  'from-yellow-500 to-orange-500',
    orange:  'from-orange-500 to-red-500',
    purple:  'from-purple-500 to-pink-500',
    cyan:    'from-cyan-500 to-blue-500',
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs font-medium text-muted-foreground`}>
            {value} / {max}
          </span>
          <span className={`text-xs font-bold text-foreground/80`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className={`w-full ${height} rounded-full overflow-hidden bg-muted`}>
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`${height} rounded-full bg-gradient-to-r ${colorMap[color] || colorMap.indigo}`}
        />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// ── MAIN COMPONENT ───────────────────────────────────────
// ══════════════════════════════════════════════════════════
export default function ProgressPage() {
  const { t } = useI18n()
  const { user, profile } = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const navigate = useNavigate()

  const [stats, setStats]                 = useState(null)
  const [loading, setLoading]             = useState(true)
  const [activeTab, setActiveTab]         = useState('overview')
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  useEffect(() => {
    if (user?.id) loadStats()
  }, [user?.id])

  const loadStats = async () => {
    try {
      const data = await getProgress()
      setStats({
        lessons:  data.lessonsCompleted || 0,
        kanji:    data.kanjiLearned || 0,
        vocab:    data.vocabLearned || 0,
        mastered: data.cardsMastered || 0,
      })
    } catch (err) {
      console.error('Error loading progress stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const currentLevel      = profile?.current_level || 'N5'
  const currentLevelIndex = LEVELS.indexOf(currentLevel)
  const levelDetails      = LEVEL_DETAILS[currentLevel]
  const xp                = profile?.xp_points || 0
  const streakDays        = profile?.streak_days || 0
  const totalMinutes      = WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.minutes, 0)
  const avgMinutes        = Math.round(totalMinutes / 7)
  const maxMinutes        = Math.max(...WEEKLY_ACTIVITY.map(d => d.minutes))

  // Skill percentages (simulated — replace with real data)
  const skillData = useMemo(() => ({
    reading:   Math.min(((stats?.lessons || 0) * 5), 100),
    writing:   Math.min(((stats?.kanji || 0) * 2), 100),
    listening: Math.min(35, 100),
    speaking:  Math.min(20, 100),
    grammar:   Math.min(((stats?.lessons || 0) * 3), 100),
    vocab:     Math.min(((stats?.vocab || 0) / 8), 100),
  }), [stats])

  // Current milestone
  const currentMilestone = MILESTONES.reduce((acc, m) => (xp >= m.xp ? m : acc), MILESTONES[0])
  const nextMilestone    = MILESTONES.find(m => xp < m.xp) || MILESTONES[MILESTONES.length - 1]

  const TABS = [
    { id: 'overview',     label: 'Overview',      Icon: BarChart3 },
    { id: 'skills',       label: 'Skills',        Icon: Activity },
    { id: 'achievements', label: 'Achievements',  Icon: Trophy },
  ]

  // ── Card wrapper ────────────────────────────────────
  const Card = ({ children, className = '', ...props }) => (
    <div
      className={`
        rounded-2xl border shadow-sm transition-colors
        bg-surface border-border
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )

  // ══════════════════════════════════════════════════════
  // ── RENDER ────────────────────────────────────────────
  // ══════════════════════════════════════════════════════
  return (
    <div className={`min-h-screen p-4 md:p-8 bg-background`}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Hero Header ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-6 md:p-8 text-white"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Your Progress</h1>
                  <p className="text-green-100 text-sm">Track your Japanese learning journey</p>
                </div>
              </div>

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  { icon: Flame,  value: streakDays,         label: 'Day Streak',   color: 'bg-orange-500/20' },
                  { icon: Zap,    value: formatNumber(xp),   label: 'Total XP',     color: 'bg-yellow-500/20' },
                  { icon: Clock,  value: `${totalMinutes}m`, label: 'This Week',    color: 'bg-blue-500/20' },
                  { icon: Target, value: currentLevel,       label: 'Current Level', color: 'bg-red-500/20' },
                ].map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-lg font-bold leading-none">{value}</p>
                      <p className="text-[11px] text-green-100">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level badge */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl">
                <span className="text-3xl font-black">{currentLevel}</span>
              </div>
              <p className="text-sm font-semibold mt-2">{levelDetails.label}</p>
              <p className="text-[11px] text-green-100">Level {currentLevelIndex + 1} of {LEVELS.length}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Tab Navigation ───────────────────────────── */}
        <div className={`
          flex gap-1 p-1 rounded-2xl
          bg-gray-100 dark:bg-gray-900 dark:border dark:border-gray-700/60
        `}>
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                text-sm font-semibold transition-all duration-200
                ${activeTab === id
                  ? 'bg-white text-gray-900 shadow-md dark:bg-gray-800 dark:text-white dark:shadow-md'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* ── OVERVIEW TAB ───────────────────────────── */}
        {/* ══════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ── JLPT Level Journey ─────────────────── */}
              <Card className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className={`w-5 h-5 text-indigo-500 dark:text-indigo-400`} />
                    <h2 className={`font-bold text-lg text-foreground`}>
                      JLPT Level Journey
                    </h2>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-lg text-xs font-bold
                    bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400
                  `}>
                    Currently {currentLevel}
                  </span>
                </div>

                {/* Level progress bar */}
                <div className="flex items-center gap-3 mb-6">
                  {LEVELS.map((level, i) => (
                    <React.Fragment key={level}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring' }}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div className={`
                          relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm
                          border-2 transition-all duration-300
                          ${i < currentLevelIndex
                            ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30'
                            : i === currentLevelIndex
                              ? 'bg-gradient-to-br from-red-500 to-pink-600 border-red-500 text-white shadow-lg shadow-red-500/30 ring-4 ring-red-500/20'
                              : 'bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
                          }
                        `}>
                          {i < currentLevelIndex ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : i === currentLevelIndex ? (
                            <span className="text-base font-black">{level}</span>
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}

                          {/* Current indicator pulse */}
                          {i === currentLevelIndex && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-semibold ${
                          i === currentLevelIndex
                            ? 'text-red-600 dark:text-red-400'
                            : i < currentLevelIndex
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-muted-foreground'
                        }`}>
                          {level}
                        </span>
                      </motion.div>

                      {i < LEVELS.length - 1 && (
                        <div className={`flex-1 h-1 rounded-full mb-6 transition-colors ${
                          i < currentLevelIndex
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : 'bg-muted'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Level breakdown */}
                <div className={`
                  grid grid-cols-3 gap-3 p-4 rounded-2xl
                  bg-muted
                `}>
                  {[
                    { label: t('nav.kanji', 'Kanji'),      current: stats?.kanji || 0,   total: levelDetails.kanji,   color: 'red' },
                    { label: t('nav.vocabulary', 'Vocabulary'),  current: stats?.vocab || 0,   total: levelDetails.vocab,   color: 'blue' },
                    { label: t('nav.grammar', 'Grammar'),     current: stats?.lessons || 0, total: levelDetails.grammar, color: 'green' },
                  ].map(({ label, current, total, color }) => (
                    <div key={label} className="text-center">
                      <p className={`text-xs font-semibold mb-2 text-muted-foreground`}>
                        {label}
                      </p>
                      <p className={`text-lg font-bold mb-1 text-foreground`}>
                        {current}<span className={`text-sm font-normal text-muted-foreground`}>/{total}</span>
                      </p>
                      <ProgressBar value={current} max={total} color={color} height="h-1.5" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* ── Stats Grid ─────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t('dashboard.lessons_done', 'Lessons Done'),    value: stats?.lessons || 0,  icon: BookOpen,   color: 'blue',   change: 3,  path: '/lessons' },
                  { label: t('dashboard.kanji_learned', 'Kanji Studied'),   value: stats?.kanji || 0,   icon: Pen,        color: 'red',    change: 5,  path: '/kanji' },
                  { label: t('dashboard.vocab_learned', 'Words Learned'),   value: stats?.vocab || 0,   icon: BookMarked, color: 'green',  change: 12, path: '/vocabulary' },
                  { label: t('common.mastered', 'Cards Mastered'),  value: stats?.mastered || 0, icon: Brain,     color: 'purple', change: 8,  path: '/srs-review' },
                ].map(({ label, value, icon: Icon, color, change, path }, i) => {
                  const changeInfo = getChangeIndicator(change)
                  const colorStyles = {
                    blue:   { bg: 'bg-blue-50 dark:bg-blue-500/10',   iconBg: 'from-blue-500 to-cyan-500',     text: 'text-blue-600 dark:text-blue-400' },
                    red:    { bg: 'bg-red-50 dark:bg-red-500/10',    iconBg: 'from-red-500 to-pink-500',      text: 'text-red-600 dark:text-red-400' },
                    green:  { bg: 'bg-green-50 dark:bg-green-500/10',  iconBg: 'from-green-500 to-emerald-500', text: 'text-green-600 dark:text-green-400' },
                    purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', iconBg: 'from-purple-500 to-pink-500',   text: 'text-purple-600 dark:text-purple-400' },
                  }
                  const cs = colorStyles[color]

                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Card
                        className="p-4 md:p-5 cursor-pointer hover:shadow-md transition-shadow group"
                        onClick={() => navigate(path)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`
                            w-10 h-10 rounded-xl bg-gradient-to-br ${cs.iconBg}
                            flex items-center justify-center shadow-md
                          `}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className={`flex items-center gap-1 text-xs font-semibold ${changeInfo.color}`}>
                            <changeInfo.Icon className="w-3 h-3" />
                            {changeInfo.label}
                          </div>
                        </div>

                        {loading ? (
                          <div className={`h-8 w-16 rounded-lg animate-pulse bg-muted`} />
                        ) : (
                          <p className={`text-2xl md:text-3xl font-bold text-foreground`}>
                            {formatNumber(value)}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs font-medium text-muted-foreground`}>{label}</p>
                          <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground`} />
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* ── Weekly Activity + XP/Streak ─────────── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Weekly Activity Chart */}
                <Card className="md:col-span-2 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <Activity className={`w-5 h-5 text-cyan-500 dark:text-cyan-400`} />
                      <h3 className={`font-bold text-foreground`}>
                        Weekly Activity
                      </h3>
                    </div>

                    <div className={`flex gap-1 p-0.5 rounded-lg bg-muted`}>
                      {['week', 'month'].map(p => (
                        <button
                          key={p}
                          onClick={() => setSelectedPeriod(p)}
                          className={`
                            px-3 py-1 rounded-md text-xs font-semibold transition-colors capitalize
                            ${selectedPeriod === p
                              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                              : 'text-muted-foreground'
                            }
                          `}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bar chart */}
                  <div className="flex items-end gap-2 h-40 mb-3">
                    {WEEKLY_ACTIVITY.map(({ day, minutes }, i) => (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <span className={`text-[10px] font-bold text-muted-foreground`}>
                          {minutes}m
                        </span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(minutes / maxMinutes) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                          className={`
                            w-full rounded-xl min-h-[8px] transition-colors
                            ${minutes === maxMinutes
                              ? 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20'
                              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                            }
                          `}
                        />
                        <span className={`text-[11px] font-medium text-muted-foreground`}>
                          {day}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary row */}
                  <div className={`
                    flex items-center justify-between px-4 py-3 rounded-xl
                    bg-muted
                  `}>
                    <div className="text-center">
                      <p className={`text-lg font-bold text-foreground`}>{totalMinutes}m</p>
                      <p className={`text-[10px] text-muted-foreground`}>Total</p>
                    </div>
                    <div className={`w-px h-8 bg-muted`} />
                    <div className="text-center">
                      <p className={`text-lg font-bold text-foreground`}>{avgMinutes}m</p>
                      <p className={`text-[10px] text-muted-foreground`}>Avg/Day</p>
                    </div>
                    <div className={`w-px h-8 bg-muted`} />
                    <div className="text-center">
                      <p className={`text-lg font-bold text-foreground`}>
                        {WEEKLY_ACTIVITY.reduce((s, d) => s + d.lessons, 0)}
                      </p>
                      <p className={`text-[10px] text-muted-foreground`}>Lessons</p>
                    </div>
                  </div>
                </Card>

                {/* XP & Streak */}
                <div className="space-y-4">
                  {/* XP Card */}
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-medium text-muted-foreground`}>Total XP</p>
                        <p className={`text-xl font-bold text-yellow-600 dark:text-yellow-400`}>
                          {formatNumber(xp)}
                        </p>
                      </div>
                    </div>

                    <ProgressBar
                      value={xp % 1000}
                      max={1000}
                      color="yellow"
                      showLabel
                    />

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <currentMilestone.icon className={`w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400`} />
                        <span className={`text-xs font-semibold text-muted-foreground`}>
                          {currentMilestone.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] text-muted-foreground`}>Next:</span>
                        <span className={`text-xs font-bold text-foreground/80`}>
                          {nextMilestone.label}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Streak Card */}
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-medium text-muted-foreground`}>Day Streak</p>
                        <p className={`text-xl font-bold text-orange-600 dark:text-orange-400`}>
                          {streakDays}
                        </p>
                      </div>
                    </div>

                    {/* Weekly streak dots */}
                    <div className="flex items-center justify-between mb-3">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                        const isActive = i < Math.min(streakDays, 7)
                        return (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div className={`
                              w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold
                              ${isActive
                                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md'
                                : 'bg-muted text-muted-foreground'
                              }
                            `}>
                              {isActive ? '🔥' : day}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <p className={`text-xs text-center text-muted-foreground`}>
                      {streakDays >= 7
                        ? '🌟 Amazing! Week streak achieved!'
                        : streakDays >= 3
                          ? `🔥 7 - streakDays more days to complete the week!`
                          : 'Keep going! Build your daily habit.'
                      }
                    </p>
                  </Card>
                </div>
              </div>

              {/* ── Recent Achievements Preview ────────── */}
              <Card className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 text-yellow-500 dark:text-yellow-400`} />
                    <h3 className={`font-bold text-foreground`}>
                      Recent Achievements
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className={`text-xs font-semibold flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300`}
                  >
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {RECENT_ACHIEVEMENTS.filter(a => a.unlocked).map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`
                        flex-shrink-0 w-36 p-3 rounded-2xl border text-center
                        bg-yellow-50 border-yellow-100 dark:bg-yellow-500/5 dark:border-yellow-500/20
                      `}
                    >
                      <div className="text-2xl mb-1">{a.icon}</div>
                      <p className={`text-xs font-bold mb-0.5 text-foreground`}>
                        {a.title}
                      </p>
                      <p className={`text-[10px] text-muted-foreground`}>
                        {a.date}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* ── SKILLS TAB ───────────────────────────────  */}
          {/* ══════════════════════════════════════════════ */}
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Skill Breakdown */}
              <Card className="p-5 md:p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Swords className={`w-5 h-5 text-purple-500 dark:text-purple-400`} />
                  <h3 className={`font-bold text-lg text-foreground`}>
                    Skill Breakdown
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SKILL_AREAS.map(({ key, label, Icon, color }, i) => {
                    const pct = skillData[key] || 0
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`
                          p-4 rounded-2xl border
                          bg-gray-50 border-gray-100 dark:bg-gray-800/30 dark:border-gray-700/40
                        `}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isDark ? `text-${color}-400` : `text-${color}-500`}`} />
                            <span className={`text-sm font-semibold text-foreground`}>
                              {label}
                            </span>
                          </div>
                          <span className={`text-sm font-bold text-foreground/80`}>
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                        <ProgressBar value={pct} max={100} color={color} height="h-2.5" />
                        <p className={`text-[11px] mt-2 text-muted-foreground`}>
                          {pct >= 80 ? '🌟 Excellent!' : pct >= 50 ? '📈 Good progress' : pct >= 20 ? '💪 Keep practicing' : '🎯 Just getting started'}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>

              {/* Milestone Timeline */}
              <Card className="p-5 md:p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Award className={`w-5 h-5 text-yellow-500 dark:text-yellow-400`} />
                  <h3 className={`font-bold text-lg text-foreground`}>
                    XP Milestones
                  </h3>
                </div>

                <div className="relative">
                  {/* Vertical line */}
                  <div className={`absolute left-6 top-0 bottom-0 w-0.5 bg-muted`} />

                  <div className="space-y-4">
                    {MILESTONES.map(({ xp: reqXp, label, icon: Icon, unlocked }, i) => {
                      const isReached = xp >= reqXp
                      return (
                        <motion.div
                          key={label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 relative"
                        >
                          <div className={`
                            relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center
                            border-2 transition-all flex-shrink-0
                            ${isReached
                              ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                              : 'bg-white border-gray-200 text-gray-400 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-600'
                            }
                          `}>
                            {isReached ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`font-bold text-sm ${isReached ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {label}
                              </p>
                              <span className={`text-xs font-mono ${isReached ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground/80'}`}>
                                {formatNumber(reqXp)} XP
                              </span>
                            </div>
                            {isReached && (
                              <p className={`text-[11px] text-green-600 dark:text-green-400`}>
                                ✓ Achieved
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </Card>

              {/* Level Requirements */}
              <Card className="p-5 md:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Target className={`w-5 h-5 text-red-500 dark:text-red-400`} />
                  <h3 className={`font-bold text-lg text-foreground`}>
                    {currentLevel} Requirements
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: `Kanji (${stats?.kanji || 0}/${levelDetails.kanji})`,     value: stats?.kanji || 0,   max: levelDetails.kanji,   color: 'red',   icon: '漢' },
                    { label: `Vocabulary (${stats?.vocab || 0}/${levelDetails.vocab})`, value: stats?.vocab || 0,   max: levelDetails.vocab,   color: 'blue',  icon: '📝' },
                    { label: `Grammar (${stats?.lessons || 0}/${levelDetails.grammar})`, value: stats?.lessons || 0, max: levelDetails.grammar, color: 'green', icon: '📖' },
                  ].map(({ label, value, max, color, icon }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{icon}</span>
                          <span className={`text-sm font-medium text-foreground/80`}>{label}</span>
                        </div>
                        <span className={`text-xs font-bold text-muted-foreground`}>
                          {max > 0 ? ((value / max) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                      <ProgressBar value={value} max={max} color={color} height="h-2.5" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* ── ACHIEVEMENTS TAB ─────────────────────────  */}
          {/* ══════════════════════════════════════════════ */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Unlocked',  value: RECENT_ACHIEVEMENTS.filter(a => a.unlocked).length,  icon: Unlock, color: 'green' },
                  { label: 'Locked',    value: RECENT_ACHIEVEMENTS.filter(a => !a.unlocked).length, icon: Lock,   color: 'gray' },
                  { label: 'Total',     value: RECENT_ACHIEVEMENTS.length,                           icon: Trophy, color: 'yellow' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <Card key={label} className="p-4 text-center">
                    <Icon className={`w-5 h-5 mx-auto mb-1.5 ${
                      color === 'green' ? 'text-green-500 dark:text-green-400' :
                      color === 'yellow' ? 'text-yellow-500 dark:text-yellow-400' :
                      'text-muted-foreground'
                    }`} />
                    <p className={`text-2xl font-bold text-foreground`}>{value}</p>
                    <p className={`text-xs text-muted-foreground`}>{label}</p>
                  </Card>
                ))}
              </div>

              {/* Achievement list */}
              <Card className="p-5 md:p-6">
                <h3 className={`font-bold text-lg mb-5 text-foreground`}>
                  All Achievements
                </h3>

                <div className="space-y-3">
                  {(showAllAchievements ? RECENT_ACHIEVEMENTS : RECENT_ACHIEVEMENTS.slice(0, 5)).map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl border transition-colors
                        ${a.unlocked
                          ? 'bg-yellow-50/50 border-yellow-100 dark:bg-yellow-500/5 dark:border-yellow-500/20'
                          : 'bg-gray-50 border-gray-100 opacity-60 dark:bg-gray-800/30 dark:border-gray-700/40 dark:opacity-60'
                        }
                      `}
                    >
                      <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0
                        ${a.unlocked
                          ? 'bg-yellow-100 dark:bg-yellow-500/10'
                          : 'bg-muted'
                        }
                      `}>
                        {a.unlocked ? a.icon : '🔒'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm text-foreground`}>
                          {a.title}
                        </p>
                        <p className={`text-xs text-muted-foreground`}>
                          {a.desc}
                        </p>
                      </div>

                      {a.unlocked ? (
                        <div className="flex flex-col items-end flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mb-0.5" />
                          <span className={`text-[10px] text-muted-foreground`}>{a.date}</span>
                        </div>
                      ) : (
                        <Lock className={`w-5 h-5 flex-shrink-0 text-foreground/80`} />
                      )}
                    </motion.div>
                  ))}
                </div>

                {RECENT_ACHIEVEMENTS.length > 5 && (
                  <button
                    onClick={() => setShowAllAchievements(!showAllAchievements)}
                    className={`
                      w-full mt-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5
                      transition-colors
                      bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700
                    `}
                  >
                    {showAllAchievements ? (
                      <><ChevronUp className="w-4 h-4" /> Show Less</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> Show All ({RECENT_ACHIEVEMENTS.length})</>
                    )}
                  </button>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}