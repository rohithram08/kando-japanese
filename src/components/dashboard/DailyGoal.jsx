import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Check, Sparkles, TrendingUp } from 'lucide-react'
import { useDailyGoalsStore, GOAL_THRESHOLDS } from '../../store/dailyGoalsStore'
import { useProgressStore } from '../../store/progressStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useAuthStore } from '../../store/authStore'
import { useI18n } from '../../i18n'
import toast from 'react-hot-toast'
import { playFanfare } from '../../utils/soundEffects'
import { AnimatedLiquidWaveIcon } from '../common/WaveXPBadge'

export default function DailyGoal() {
  const { t } = useI18n()
  const user = useAuthStore((s) => s.user)
  const progress = useDailyGoalsStore()
  const dailyXP = useProgressStore((s) => s.dailyXP)
  const awardDailyGoalXP = useProgressStore((s) => s.awardDailyGoalXP)
  const xpGoal = useSettingsStore((s) => s.dailyGoal)

  const dailyGoals = [
    {
      id: 'lesson',
      label: t('dashboard.goal_lesson', 'Complete a story lesson'),
      emoji: '📚',
      xp: 15,
      category: t('nav.reading', 'Story Lessons'),
    },
    {
      id: 'review',
      label: t('dashboard.goal_review', { count: GOAL_THRESHOLDS.review }, `SRS Review (${GOAL_THRESHOLDS.review} cards)`),
      emoji: '🔄',
      xp: 20,
      category: t('nav.srs', 'Review'),
    },
    {
      id: 'kanji',
      label: t('dashboard.goal_kanji', { count: GOAL_THRESHOLDS.kanji }, `Study ${GOAL_THRESHOLDS.kanji} Kanji`),
      emoji: '漢',
      xp: 8,
      category: t('nav.kanji', 'Kanji'),
    },
    {
      id: 'chat',
      label: t('dashboard.goal_chat', 'Practice conversation'),
      emoji: '💬',
      xp: 10,
      category: t('nav.conversation', 'Speaking'),
    },
  ]

  const completed = dailyGoals
    .map((g) => g.id)
    .filter((id) => progress[id] >= GOAL_THRESHOLDS[id])

  const totalXP = dailyGoals.reduce((sum, g) => sum + g.xp, 0)
  const earnedXP = dailyGoals.filter((g) => completed.includes(g.id)).reduce((sum, g) => sum + g.xp, 0)
  const pct = (completed.length / dailyGoals.length) * 100
  const allDone = completed.length === dailyGoals.length
  const xpGoalPct = Math.min(100, Math.round((dailyXP / Math.max(1, xpGoal)) * 100))
  const xpGoalHit = dailyXP >= xpGoal

  const radius = 15.9
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    if (!allDone) return
    try {
      const today = new Intl.DateTimeFormat('en-CA').format(new Date())
      const claimedDate = localStorage.getItem('nihongo_daily_goal_claimed')
      if (claimedDate !== today) {
        localStorage.setItem('nihongo_daily_goal_claimed', today)
        awardDailyGoalXP(user?.id)
        playFanfare()
        toast.success(t('toast.daily_goal_bonus', 'Daily Goals Complete! Bonus +50 XP! 🎯'), { icon: '🌟' })
      }
    } catch {}
  }, [allDone, awardDailyGoalXP, user?.id, t])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card"
    >
      <div className="card-header">
        <div className="icon-badge bg-amber-50 dark:bg-amber-500/10">
          <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-foreground">
            {t('dashboard.daily_goals_title', 'Daily Goals')}
          </h3>
          <p className="text-xs mt-0.5 text-muted-foreground">
            {t('dashboard.daily_goals_desc', 'Complete tasks to earn XP')}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
          <AnimatedLiquidWaveIcon size={16} />
          {earnedXP}/{totalXP} Wave XP
        </div>
      </div>

      <div className="card-body">
        {/* Daily Wave XP Goal (from Settings → Study Preferences) */}
        <div className={`flex items-center gap-3 mb-5 p-3 rounded-xl border ${
          xpGoalHit
            ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20'
            : 'bg-muted/60 border-border'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            xpGoalHit ? 'bg-green-500 text-white' : 'bg-red-500/10 text-red-500 dark:text-red-400'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Daily Wave XP Goal</span>
              <span className={`text-xs font-bold ${xpGoalHit ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                {dailyXP}/{xpGoal} Wave XP
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full overflow-hidden bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpGoalPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${xpGoalHit ? 'bg-green-500' : 'bg-red-500'}`}
              />
            </div>
          </div>
        </div>

        {/* Progress Ring + Summary */}
        <div className="flex items-center gap-5 mb-5">
          <div className="relative w-[72px] h-[72px] flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r={radius} fill="none" strokeWidth="3" className="stroke-muted" />
              <motion.circle
                cx="18" cy="18" r={radius}
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className={allDone ? 'stroke-green-500' : 'stroke-red-500'}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{
                  strokeDasharray: `${(pct / 100) * circumference} ${circumference - (pct / 100) * circumference}`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {allDone ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                  <Sparkles className="w-5 h-5 text-green-500 dark:text-green-400" />
                </motion.div>
              ) : (
                <span className="text-sm font-bold text-foreground">{completed.length}/{dailyGoals.length}</span>
              )}
            </div>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">
              {completed.length === 0 && "Let's start today! 💪"}
              {completed.length > 0 && completed.length < dailyGoals.length && "Keep going! You're doing great!"}
              {allDone && t('dashboard.all_goals_done', 'All goals completed! 🎉')}
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              {allDone
                ? 'Come back tomorrow for new goals'
                : `${dailyGoals.length - completed.length} remaining today`}
            </p>

            <div className="mt-2.5 h-1.5 rounded-full overflow-hidden bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(earnedXP / totalXP) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${allDone ? 'from-green-400 to-emerald-500' : 'from-red-400 to-red-500'}`}
              />
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-2">
          {dailyGoals.map((goal, i) => {
            const isDone = completed.includes(goal.id)
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  isDone
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20'
                    : 'bg-muted/60 border-border hover:bg-muted'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-green-500 text-white' : 'bg-muted-foreground/15 text-muted-foreground'
                }`}>
                  {isDone ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <span className="text-sm">{goal.emoji}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium block ${isDone ? 'text-green-600 dark:text-green-400 line-through opacity-70' : 'text-foreground'}`}>
                    {goal.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{goal.category}</span>
                </div>

                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${
                  isDone ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'
                }`}>
                  {isDone ? <><Check className="w-3 h-3" />{t('common.complete', 'Done')}</> : <>+{goal.xp} Wave XP</>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}