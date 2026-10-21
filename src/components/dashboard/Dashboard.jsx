// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, GraduationCap, ChevronRight,
  Sparkles, ArrowRight, BookOpen, Languages, Layers, BookMarked,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useProgressStore } from '../../store/progressStore'
import { useReadingStore } from '../../store/readingStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useI18n, t } from '../../i18n'
import { getUserLevelProgress } from '../../utils/progressCalculator'
import { sectionsByGroup, TINTS } from '../../config/sections'
import StreakCard from './StreakCard'
import ProgressChart from './ProgressChart'
import DailyGoal from './DailyGoal'
import KandoSlimeLogo from '../mascot/KandoSlimeLogo'
import JellyStreakBadge from '../streak/JellyStreakBadge'
import WaveXPBadge from '../common/WaveXPBadge'

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

function SectionTile({ section, index, stats, displayLanguage }) {
  const navigate = useNavigate()
  const tint = TINTS[section.tint]
  const Icon = section.icon
  const statValue = section.statKey ? stats[section.statKey] : undefined
  const isUrgent = section.urgent && statValue > 0
  const label = t('nav.' + section.id, displayLanguage, section.label)

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
        <p className="text-sm font-semibold text-foreground">{label}</p>
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
  const { t } = useI18n()
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)
  const {
    totalXP,
    streak,
    jlptLevel,
    userLevel,
    lessonsCompleted,
    kanjiLearned,
    vocabLearned,
    srsReviewsDue,
    loadSRSDue,
    isStreakFrozen,
    checkAndMaintainStreak,
  } = useProgressStore()

  const progressMap = useReadingStore((s) => s.progressMap) || {}
  const completedStories = Object.values(progressMap).filter((p) => p?.status === 'completed').length

  const [loading, setLoading] = useState(true)

  const currentLevel = jlptLevel || profile?.currentLevel || profile?.current_level || 'N5'
  const currentStreak = streak ?? profile?.streakDays ?? profile?.streak_days ?? 0
  const currentXP = totalXP ?? profile?.xpPoints ?? profile?.xp_points ?? 0
  const displayName = profile?.displayName || profile?.display_name || profile?.username || 'Learner'
  const levelProgress = getUserLevelProgress(currentXP)

  useEffect(() => {
    checkAndMaintainStreak?.()
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
    if (hour < 12) {
      return {
        text: 'おはようございます',
        sub: t('dashboard.greeting_morning', displayLanguage, 'Good Morning'),
        emoji: '🌅',
      }
    }
    if (hour < 18) {
      return {
        text: 'こんにちは',
        sub: t('dashboard.greeting_afternoon', displayLanguage, 'Good Afternoon'),
        emoji: '☀️',
      }
    }
    return {
      text: 'こんばんは',
      sub: t('dashboard.greeting_evening', displayLanguage, 'Good Evening'),
      emoji: '🌙',
    }
  }

  const greeting = getTimeGreeting()
  const effectiveLessons = completedStories > 0 ? completedStories : lessonsCompleted
  const stats = { lessonsCompleted: effectiveLessons, kanjiLearned, vocabLearned, srsReviewsDue }

  const statDefs = [
    { label: t('dashboard.lessons_done', displayLanguage, 'Stories Completed'), key: 'lessonsCompleted', icon: BookOpen, tint: 'blue' },
    { label: t('dashboard.kanji_learned', displayLanguage, 'Kanji Learned'), key: 'kanjiLearned', icon: Languages, tint: 'cyan' },
    { label: t('dashboard.vocab_learned', displayLanguage, 'Vocabulary'), key: 'vocabLearned', icon: Layers, tint: 'emerald' },
    { label: t('dashboard.reviews_waiting', displayLanguage, 'Reviews Due'), key: 'srsReviewsDue', icon: RefreshCw, tint: 'orange' },
  ]

  const learnSections = sectionsByGroup('learn')
  const practiceSections = sectionsByGroup('practice')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Greeting Hero (100% Kando Slime Liquid Concept) ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-cyan-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-cyan-500/15 border border-cyan-400/30"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-400/20 rounded-full blur-2xl" />
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-3 right-6 opacity-70 select-none drop-shadow-lg"
          >
            <KandoSlimeLogo size={68} showBlossom animated />
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-4 right-28 text-3xl opacity-15 select-none"
          >⛩️</motion.div>
        </div>

        <div className="relative">
          <p className="text-cyan-100 text-sm mb-0.5">{greeting.emoji} {greeting.text}</p>
          <p className="text-cyan-200/80 text-xs mb-1 font-medium">{greeting.sub}</p>
          <h1 className="text-2xl font-bold tracking-tight">
            {displayName}!
          </h1>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20 text-white shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
              {currentLevel} · Lv.{userLevel}
            </span>

            {/* Jelly Streak (2D Animated Slime) */}
            <JellyStreakBadge
              streak={currentStreak}
              isFrozen={isStreakFrozen}
              size="sm"
              variant="glass"
            />

            {/* Wave XP (2D Animated Liquid Wave) */}
            <WaveXPBadge
              xp={currentXP}
              size="sm"
              variant="glass"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/reading')}
              className="bg-white text-cyan-700 hover:bg-cyan-50 rounded-xl py-3 px-4 font-bold
                         transition-all text-sm flex items-center gap-2 shadow-lg shadow-cyan-950/20"
            >
              <BookOpen className="w-4 h-4 text-cyan-600" />
              {t('dashboard.continue_lesson', displayLanguage, 'Continue Graded Reader')}
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-60" />
            </motion.button>

            {srsReviewsDue > 0 ? (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/review')}
                className="bg-white/20 backdrop-blur-md text-white rounded-xl py-3 px-4 font-semibold
                           hover:bg-white/30 transition-all text-sm flex items-center gap-2 border border-white/20"
              >
                <RefreshCw className="w-4 h-4" />
                {t('dashboard.reviews_due', displayLanguage, { count: srsReviewsDue }, `${srsReviewsDue} Reviews Due`)}
                <Sparkles className="w-3.5 h-3.5 ml-auto opacity-60" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/grammar')}
                className="bg-white/20 backdrop-blur-md text-white rounded-xl py-3 px-4 font-semibold
                           hover:bg-white/30 transition-all text-sm flex items-center gap-2 border border-white/20"
              >
                <BookMarked className="w-4 h-4" />
                {t('dashboard.study_grammar', displayLanguage, 'Study Grammar')}
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-60" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statDefs.map((stat, i) => {
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
        <StreakCard streak={currentStreak} />
        <DailyGoal />
      </div>

      {/* ── Level Progress Chart ── */}
      <ProgressChart level={currentLevel} />

      {/* ── Explore: Learn ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-foreground">{t('nav.learn', displayLanguage, 'Learn')}</h3>
          <span className="text-xs text-muted-foreground">{t('dashboard.core_materials', displayLanguage, 'Core study material')}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {learnSections.map((section, i) => (
            <SectionTile key={section.id} section={section} index={i} stats={stats} displayLanguage={displayLanguage} />
          ))}
        </div>
      </motion.div>

      {/* ── Explore: Practice ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-foreground">{t('nav.practice', displayLanguage, 'Practice & Review')}</h3>
          <span className="text-xs text-muted-foreground">{t('dashboard.put_to_use', displayLanguage, 'Put it to use')}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {practiceSections.map((section, i) => (
            <SectionTile key={section.id} section={section} index={i} stats={stats} displayLanguage={displayLanguage} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
