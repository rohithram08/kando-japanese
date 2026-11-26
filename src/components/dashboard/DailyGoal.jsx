import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Check, TrendingUp, BookOpen, RefreshCw, MessageSquare, CheckCircle2 } from 'lucide-react'
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
      Icon: BookOpen,
      xp: 15,
      category: t('nav.reading', 'Story Lessons'),
    },
    {
      id: 'review',
      label: t('dashboard.goal_review', { count: GOAL_THRESHOLDS.review }, `SRS Review (${GOAL_THRESHOLDS.review} cards)`),
      Icon: RefreshCw,
      xp: 20,
      category: t('nav.srs', 'Review'),
    },
    {
      id: 'kanji',
      label: t('dashboard.goal_kanji', { count: GOAL_THRESHOLDS.kanji }, `Study ${GOAL_THRESHOLDS.kanji} Kanji`),
      kanjiGlyph: '漢',
      xp: 8,
      category: t('nav.kanji', 'Kanji'),
    },
    {
      id: 'chat',
      label: t('dashboard.goal_chat', 'Practice conversation'),
      Icon: MessageSquare,
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
        toast.success(t('toast.daily_goal_bonus', 'Daily Goals Complete! Bonus +50 Wave XP!'))
      }
    } catch {}
  }, [allDone, awardDailyGoalXP, user?.id, t])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
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
            {t('dashboard.daily_goals_desc', 'Complete tasks to earn Wave XP')}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-muted text-foreground border border-border tabular-nums">
          <AnimatedLiquidWaveIcon size={15} />
          {earnedXP}/{totalXP} Wave XP
        </div>
      </div>

      <div className="card-body">
        {/* Daily Wave XP Goal */}
        <div className={`flex items-center gap-3 mb-5 p-3 rounded-xl border ${
          xpGoalHit
            ? 'bg-emerald-500/10 border-emerald-500/25'
            : 'bg-surface-muted/60 border-border'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            xpGoalHit ? 'bg-emerald-500 text-white' : 'bg-primary/10 text-primary'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Daily Wave XP Goal</span>
              <span className={`text-xs font-semibold tabular-nums ${xpGoalHit ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                {dailyXP}/{xpGoal} Wave XP
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full overflow-hidden bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpGoalPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${xpGoalHit ? 'bg-emerald-500' : 'bg-primary'}`}
              />
            </div>
          </div>
        </div>

        {/* Progress Ring + Summary */}
        <div className="flex items-center gap-5 mb-5">
          <div className="relative w-[70px] h-[70px] flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r={radius} fill="none" strokeWidth="3" className="stroke-muted" />
              <motion.circle
                cx="18" cy="18" r={radius}
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className={allDone ? 'stroke-emerald-500' : 'stroke-primary'}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{
                  strokeDasharray: `${(pct / 100) * circumference} ${circumference - (pct / 100) * circumference}`,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {allDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <span className="text-sm font-bold text-foreground tabular-nums">{completed.length}/{dailyGoals.length}</span>
              )}
            </div>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">
              {completed.length === 0 && "Let's start today's study session"}
              {completed.length > 0 && completed.length < dailyGoals.length && 'Great momentum — keep going'}
              {allDone && t('dashboard.all_goals_done', 'All goals completed!')}
            </p>
            <p className="text-xs mt-1 text-muted-foreground tabular-nums">
              {allDone
                ? 'Come back tomorrow for new goals'
                : `${dailyGoals.length - completed.length} remaining today`}
            </p>

            <div className="mt-2.5 h-1.5 rounded-full overflow-hidden bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(earnedXP / totalXP) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${allDone ? 'bg-emerald-500' : 'bg-primary'}`}
              />
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-2">
          {dailyGoals.map((goal, i) => {
            const isDone = completed.includes(goal.id)
            const GoalIcon = goal.Icon
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors border ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-surface-muted/50 border-border hover:bg-surface-muted'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground border border-border/60'
                }`}>
                  {isDone ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : GoalIcon ? (
                    <GoalIcon className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold font-jp">{goal.kanjiGlyph}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium block ${isDone ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-75' : 'text-foreground'}`}>
                    {goal.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{goal.category}</span>
                </div>

                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 tabular-nums ${
                  isDone ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
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