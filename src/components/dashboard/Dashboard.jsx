// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, GraduationCap, ChevronRight,
  ArrowRight, BookOpen, Languages, Layers, BookMarked,
  Sunrise, Sun, Moon, Mic,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useProgressStore } from '../../store/progressStore'
import { useReadingStore } from '../../store/readingStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useI18n, t } from '../../i18n'
import { getUserLevelProgress } from '../../utils/progressCalculator'
import { summarizeReadingProgress } from '../../utils/storyProgress'
import { allStories } from '../../data/reading/n5_stories'
import { sectionsByGroup, TINTS } from '../../config/sections'
import StreakCard from './StreakCard'
import ProgressChart from './ProgressChart'
import DailyGoal from './DailyGoal'
import StudyProgressAnalytics from './StudyProgressAnalytics'
import LearningInsightsCard from './LearningInsightsCard'
import { useStudyLevel } from '../../hooks/useStudyLevel'
import KandoSlimeLogo from '../mascot/KandoSlimeLogo'
import JellyStreakBadge from '../streak/JellyStreakBadge'
import WaveXPBadge from '../common/WaveXPBadge'
import DuolingoBanner from '../common/DuolingoBanner'

function StatValue({ value, loading }) {
  if (loading && value === 0) {
    return <div className="h-7 w-10 rounded-lg animate-pulse bg-muted" />
  }
  return (
    <motion.span
      key={value}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="text-2xl font-bold text-foreground tabular-nums"
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => navigate(section.path)}
      className={`card text-left p-4 flex flex-col gap-3 transition-all group ${tint.hoverBorder} hover:shadow-card-md cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className={`icon-badge w-10 h-10 ${tint.iconBg} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className={`w-5 h-5 ${tint.iconText}`} />
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{section.description}</p>
      </div>
      {statValue !== undefined && (
        <span className={`inline-flex items-center gap-1.5 self-start text-[11px] font-semibold px-2.5 py-0.5 rounded-full tabular-nums ${
          isUrgent ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20' : `${tint.iconBg} ${tint.iconText}`
        }`}>
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
    kanjiLearned,
    vocabLearned,
    srsReviewsDue,
    loadSRSDue,
    isStreakFrozen,
    checkAndMaintainStreak,
  } = useProgressStore()

  const rawProgressMap = useReadingStore((s) => s.progressMap)
  const progressMap = useMemo(() => rawProgressMap || {}, [rawProgressMap])
  const loadAllReadingProgress = useReadingStore((s) => s.loadAllProgress)
  const { unlocked: unlockedLevelList } = useStudyLevel()
  // Story totals only cover levels the user has unlocked.
  const availableStories = useMemo(
    () => allStories.filter((s) => unlockedLevelList.includes(s.level)),
    [unlockedLevelList],
  )
  const storySummary = useMemo(() => summarizeReadingProgress(progressMap, availableStories), [progressMap, availableStories])
  const completedStories = storySummary.completedCount

  const [loading, setLoading] = useState(true)

  const currentLevel = jlptLevel || profile?.currentLevel || profile?.current_level || 'N5'
  const currentStreak = streak ?? profile?.streakDays ?? profile?.streak_days ?? 0
  const currentXP = totalXP ?? profile?.xpPoints ?? profile?.xp_points ?? 0
  const displayName = profile?.displayName || profile?.display_name || profile?.username || 'Learner'
  const levelProgress = getUserLevelProgress(currentXP)

  // Reading progress must be loaded here too, otherwise the dashboard is wrong
  // after a refresh/login until the learner happens to open the Graded Reader.
  useEffect(() => {
    loadAllReadingProgress?.(!!user)
  }, [user, loadAllReadingProgress])

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
  }, [user, checkAndMaintainStreak, loadSRSDue])

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return {
        text: 'おはようございます',
        sub: t('dashboard.greeting_morning', displayLanguage, 'Good Morning'),
        Icon: Sunrise,
      }
    }
    if (hour < 18) {
      return {
        text: 'こんにちは',
        sub: t('dashboard.greeting_afternoon', displayLanguage, 'Good Afternoon'),
        Icon: Sun,
      }
    }
    return {
      text: 'こんばんは',
      sub: t('dashboard.greeting_evening', displayLanguage, 'Good Evening'),
      Icon: Moon,
    }
  }

  const greeting = getTimeGreeting()
  const GreetingIcon = greeting.Icon
  // Stories replaced Lessons: this stat now reflects real, persisted story completions.
  const stats = { lessonsCompleted: completedStories, kanjiLearned, vocabLearned, srsReviewsDue }

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
      {/* ── Lively Balanced Study Studio Hero ── */}
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-7 text-white bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 shadow-card-lg"
      >
        {/* Subtle Animated Wave Aura */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 18, 0], y: [0, -8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Greeting, Live Status Badges & Primary Actions */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-200/90 mb-1.5">
              <GreetingIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="font-jp tracking-wide text-white/95">{greeting.text}</span>
              <span className="text-white/30" aria-hidden="true">/</span>
              <span>{greeting.sub}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white truncate">
              {displayName}!
            </h1>

            <div className="flex items-center gap-2 mt-3.5 flex-wrap">
              <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/15 text-white tabular-nums">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                {currentLevel} · Lv.{levelProgress.level}
              </span>

              <JellyStreakBadge
                streak={currentStreak}
                isFrozen={isStreakFrozen}
                size="sm"
                variant="glass"
              />

              <WaveXPBadge
                xp={currentXP}
                size="sm"
                variant="glass"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/reading')}
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl py-2.5 px-4 text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{t('dashboard.continue_lesson', displayLanguage, 'Continue Graded Reader')}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-70 shrink-0" />
              </motion.button>

              {srsReviewsDue > 0 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/review')}
                  className="bg-white/15 hover:bg-white/20 backdrop-blur-md text-white rounded-xl py-2.5 px-4 text-sm font-medium flex items-center gap-2 border border-white/20 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="tabular-nums">
                    {t('dashboard.reviews_due', displayLanguage, { count: srsReviewsDue }, `${srsReviewsDue} Reviews Due`)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70 shrink-0" />
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/grammar')}
                  className="bg-white/15 hover:bg-white/20 backdrop-blur-md text-white rounded-xl py-2.5 px-4 text-sm font-medium flex items-center gap-2 border border-white/20 transition-colors cursor-pointer"
                >
                  <BookMarked className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span className="truncate">{t('dashboard.study_grammar', displayLanguage, 'Study Grammar')}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70 shrink-0" />
                </motion.button>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/speech')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/95 rounded-xl py-2.5 px-3.5 text-sm font-medium flex items-center gap-2 border border-white/15 transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Daily 10 Speech</span>
              </motion.button>
            </div>
          </div>

          {/* Right Side: Interactive Companion Stage & Live Level Ring (Eliminates Empty Right Void) */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0 lg:min-w-[270px]">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className="shrink-0"
            >
              <KandoSlimeLogo size={64} showBlossom animated />
            </motion.div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-white/95">Level {levelProgress.level} Progress</span>
                <span className="font-mono font-bold text-cyan-300 tabular-nums">{levelProgress.percent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(4, levelProgress.percent)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300"
                />
              </div>
              <p className="text-[11px] text-indigo-200/90 tabular-nums">
                {levelProgress.xpToNext} Wave XP to Level {levelProgress.level + 1}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Contextual Study Notice Bar ── */}
      <DuolingoBanner variant="auto" />

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statDefs.map((stat, i) => {
          const tint = TINTS[stat.tint]
          const value = stats[stat.key]
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              whileHover={{ y: -2 }}
              className="card p-4 cursor-default transition-shadow hover:shadow-card-md"
            >
              <div className="flex flex-col gap-3">
                <div className={`icon-badge w-9 h-9 ${tint.iconBg}`}>
                  <stat.icon className={`w-4 h-4 ${tint.iconText}`} />
                </div>
                <div>
                  <StatValue value={value} loading={loading} />
                  <div className="text-xs font-medium mt-0.5 text-muted-foreground">{stat.label}</div>
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


      {/* ── Story Progress & Quiz Performance (all derived from saved progress) ── */}
      <div className="grid lg:grid-cols-2 gap-4" data-testid="story-progress-section">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">{t('dashboard.story_progress_title', displayLanguage, 'Story Progress')}</h3>
            <span className="text-xs text-muted-foreground" data-testid="stories-of-total">
              {t('dashboard.stories_of_total', displayLanguage, { done: storySummary.completedCount, total: storySummary.totalStories }, `${storySummary.completedCount} of ${storySummary.totalStories} stories completed`)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-500"
              style={{ width: `${storySummary.totalStories ? Math.round((storySummary.completedCount / storySummary.totalStories) * 100) : 0}%` }}
            />
          </div>

          {storySummary.current ? (
            <button
              onClick={() => navigate(`/reading/${storySummary.current.story.id}`)}
              className="w-full text-left p-3 rounded-2xl bg-muted/50 border border-border hover:border-primary/40 transition-colors"
              data-testid="current-story"
            >
              <p className="text-[11px] font-semibold text-muted-foreground mb-0.5">{t('dashboard.currently_reading', displayLanguage, 'Currently reading')}</p>
              <p className="text-sm font-semibold text-foreground truncate">{storySummary.current.story.englishTitle || storySummary.current.story.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {storySummary.current.story.level} · {t('dashboard.sentence_progress', displayLanguage, { current: storySummary.current.sentenceNumber, total: storySummary.current.totalSentences }, `Sentence ${storySummary.current.sentenceNumber} of ${storySummary.current.totalSentences}`)}
              </p>
            </button>
          ) : (
            <button
              onClick={() => navigate('/reading')}
              className="w-full text-left p-3 rounded-2xl bg-muted/50 border border-border hover:border-primary/40 transition-colors text-sm font-semibold text-foreground"
            >
              {t('dashboard.start_story', displayLanguage, 'Pick your first story')}
            </button>
          )}

          {storySummary.recent.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">{t('dashboard.recently_completed', displayLanguage, 'Recently completed')}</p>
              <ul className="space-y-1">
                {storySummary.recent.map(({ story, score }) => (
                  <li key={story.id} className="flex items-center justify-between text-xs text-foreground">
                    <span className="truncate pr-2">{story.englishTitle || story.title}</span>
                    {score !== null && <span className="font-semibold text-muted-foreground">{score}%</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card p-5" data-testid="quiz-performance">
          <h3 className="font-bold text-sm text-foreground mb-3">{t('dashboard.quiz_performance', displayLanguage, 'Quiz Performance')}</h3>
          {storySummary.quizzesCompleted > 0 ? (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                <div className="text-xl font-bold text-foreground">{storySummary.quizzesCompleted}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{t('dashboard.quizzes_completed', displayLanguage, 'Quizzes completed')}</div>
              </div>
              <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                <div className="text-xl font-bold text-foreground">{storySummary.avgScore ?? 0}%</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{t('dashboard.avg_score', displayLanguage, 'Average score')}</div>
              </div>
              <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                <div className="text-xl font-bold text-foreground">{storySummary.bestScore ?? 0}%</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{t('dashboard.best_score', displayLanguage, 'Best score')}</div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{t('dashboard.no_quizzes', displayLanguage, 'Finish a story and its quiz to see your scores here.')}</p>
          )}

          <div className="mt-4" data-testid="dashboard-level-progress">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
              <span className="font-semibold">{t('dashboard.level_label', displayLanguage, { level: levelProgress.level }, `Level ${levelProgress.level}`)}</span>
              <span>{t('dashboard.wave_xp_to_next', displayLanguage, { xp: levelProgress.xpToNext, next: levelProgress.level + 1 }, `${levelProgress.xpToNext} Wave XP to Level ${levelProgress.level + 1}`)}</span>
            </div>
            <div className="h-2 rounded-full bg-cyan-950/20 dark:bg-cyan-900/40 border border-cyan-500/20 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-500" style={{ width: `${levelProgress.percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Comprehensive Study Progress & Skills Analytics ── */}
      <LearningInsightsCard />
      <StudyProgressAnalytics />

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
