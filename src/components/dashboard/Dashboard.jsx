// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, GraduationCap, Flame, Star, ChevronRight,
  Sparkles, ArrowRight, BookOpen, Languages, Layers, BookMarked,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useProgressStore } from '../../store/progressStore'
import { sectionsByGroup, TINTS } from '../../config/sections'
import StreakCard from './StreakCard'
import ProgressChart from './ProgressChart'
import DailyGoal from './DailyGoal'

const STAT_DEFS = [
  { label: 'Lessons Done', key: 'lessonsCompleted', icon: BookOpen, tint: 'blue' },
  { label: 'Kanji Learned', key: 'kanjiLearned', icon: Languages, tint: 'red' },
  { label: 'Vocabulary', key: 'vocabLearned', icon: Layers, tint: 'emerald' },
  { label: 'Reviews Due', key: 'srsReviewsDue', icon: RefreshCw, tint: 'orange' },
]

function StatValue({ value, loading }) {
  if (loading && value === 0) {
    return <div className="h-7 w-10 rounded-lg animate-pulse bg-muted" />
  }
  return (
    <motion.span
      key={value}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-2xl font-bold text-foreground"
    >
      {value}
    </motion.span>
  )
}

function SectionTile({ section, index, stats }) {
  const navigate = useNavigate()
  const tint = TINTS[section.tint]
  const Icon = section.icon
  const statValue = section.statKey ? stats[section.statKey] : undefined
  const isUrgent = section.urgent && statValue > 0

  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(section.path)}
      className={`card text-left p-4 flex flex-col gap-3 transition-all group ${tint.hoverBorder} hover:shadow-card-md`}
    >
      <div className="flex items-start justify-between">
        <div className={`icon-badge w-11 h-11 ${tint.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className={`w-5 h-5 ${tint.iconText}`} />
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{section.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{section.description}</p>
      </div>
      {statValue !== undefined && (
        <span className={`inline-flex items-center gap-1 self-start text-[11px] font-bold px-2 py-1 rounded-full ${
          isUrgent ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' : `${tint.iconBg} ${tint.iconText}`
        }`}>
          {isUrgent && <Sparkles className="w-3 h-3" />}
          {statValue} {section.statLabel}
        </span>
      )}
    </motion.button>
  )
}

export default function Dashboard() {
  const { profile, user } = useAuthStore()
  const navigate = useNavigate()
  const { lessonsCompleted, kanjiLearned, vocabLearned, srsReviewsDue, loadSRSDue } = useProgressStore()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    // Hard timeout — never show skeletons for more than 3 seconds
    const timeout = setTimeout(() => setLoading(false), 3000)

    loadSRSDue(user.id).finally(() => {
      clearTimeout(timeout)
      setLoading(false)
    })

    return () => clearTimeout(timeout)
  }, [user])

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'おはようございます', sub: 'Good Morning', emoji: '🌅' }
    if (hour < 18) return { text: 'こんにちは', sub: 'Good Afternoon', emoji: '☀️' }
    return { text: 'こんばんは', sub: 'Good Evening', emoji: '🌙' }
  }

  const greeting = getTimeGreeting()
  const stats = { lessonsCompleted, kanjiLearned, vocabLearned, srsReviewsDue }

  const learnSections = sectionsByGroup('learn')
  const practiceSections = sectionsByGroup('practice')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Greeting Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-red-400/10 rounded-full blur-2xl" />
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 right-8 text-5xl opacity-20 select-none"
          >🎌</motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-4 right-28 text-3xl opacity-10 select-none"
          >⛩️</motion.div>
        </div>

        <div className="relative">
          <p className="text-red-100 text-sm mb-0.5">{greeting.emoji} {greeting.text}</p>
          <p className="text-red-200/60 text-xs mb-1">{greeting.sub}</p>
          <h1 className="text-2xl font-bold">
            {profile?.display_name || profile?.username || 'Learner'}!
          </h1>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3" />
              {profile?.current_level || 'N5'}
            </span>
            <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Flame className="w-3 h-3" /> {profile?.streak_days || 0} Day Streak
            </span>
            <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Star className="w-3 h-3" />
              {(profile?.xp_points || 0).toLocaleString()} XP
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/lessons')}
              className="bg-white text-red-600 rounded-xl py-3 px-4 font-semibold
                         hover:bg-red-50 transition-all text-sm flex items-center gap-2 shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              Continue Lesson
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-50" />
            </motion.button>

            {srsReviewsDue > 0 ? (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/review')}
                className="bg-white/15 backdrop-blur-sm text-white rounded-xl py-3 px-4 font-semibold
                           hover:bg-white/25 transition-all text-sm flex items-center gap-2 border border-white/10"
              >
                <RefreshCw className="w-4 h-4" />
                {srsReviewsDue} Reviews Due
                <Sparkles className="w-3.5 h-3.5 ml-auto opacity-50" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/grammar')}
                className="bg-white/15 backdrop-blur-sm text-white rounded-xl py-3 px-4 font-semibold
                           hover:bg-white/25 transition-all text-sm flex items-center gap-2 border border-white/10"
              >
                <BookMarked className="w-4 h-4" />
                Study Grammar
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-50" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_DEFS.map((stat, i) => {
          const tint = TINTS[stat.tint]
          const value = stats[stat.key]
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="card relative p-4 overflow-hidden group cursor-default"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tint.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="flex flex-col gap-3">
                <div className={`icon-badge w-10 h-10 ${tint.iconBg}`}>
                  <stat.icon className={`w-5 h-5 ${tint.iconText}`} />
                </div>
                <div>
                  <StatValue value={value} loading={loading} />
                  <div className="text-[11px] font-medium mt-0.5 text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Streak + Daily Goal ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <StreakCard streak={profile?.streak_days || 0} />
        <DailyGoal />
      </div>

      {/* ── Level Progress Chart ── */}
      <ProgressChart level={profile?.current_level || 'N5'} />

      {/* ── Explore: Learn ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-foreground">Learn</h3>
          <span className="text-xs text-muted-foreground">Core study material</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {learnSections.map((section, i) => (
            <SectionTile key={section.id} section={section} index={i} stats={stats} />
          ))}
        </div>
      </motion.div>

      {/* ── Explore: Practice ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-foreground">Practice &amp; Review</h3>
          <span className="text-xs text-muted-foreground">Put it to use</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {practiceSections.map((section, i) => (
            <SectionTile key={section.id} section={section} index={i} stats={stats} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
