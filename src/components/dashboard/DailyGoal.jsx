// src/components/dashboard/DailyGoal.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Target, Check, Zap, Sparkles, TrendingUp } from 'lucide-react'
import { useDailyGoalsStore, GOAL_THRESHOLDS } from '../../store/dailyGoalsStore'
import { useProgressStore } from '../../store/progressStore'
import { useSettingsStore } from '../../store/settingsStore'

const DAILY_GOALS = [
  { id: 'lesson', label: 'Complete a lesson', emoji: '📚', xp: 15, category: 'Lessons' },
  { id: 'review', label: `SRS Review (${GOAL_THRESHOLDS.review} cards)`, emoji: '🔄', xp: 20, category: 'Review' },
  { id: 'kanji', label: `Study ${GOAL_THRESHOLDS.kanji} Kanji`, emoji: '漢', xp: 8, category: 'Kanji' },
  { id: 'chat', label: 'Practice conversation', emoji: '💬', xp: 10, category: 'Speaking' },
]

export default function DailyGoal() {
  const progress = useDailyGoalsStore()
  const dailyXP = useProgressStore((s) => s.dailyXP)
  const xpGoal = useSettingsStore((s) => s.dailyGoal)
  const completed = DAILY_GOALS
    .map((g) => g.id)
    .filter((id) => progress[id] >= GOAL_THRESHOLDS[id])

  const totalXP = DAILY_GOALS.reduce((sum, g) => sum + g.xp, 0)
  const earnedXP = DAILY_GOALS.filter((g) => completed.includes(g.id)).reduce((sum, g) => sum + g.xp, 0)
  const pct = (completed.length / DAILY_GOALS.length) * 100
  const allDone = completed.length === DAILY_GOALS.length
  const xpGoalPct = Math.min(100, Math.round((dailyXP / Math.max(1, xpGoal)) * 100))
  const xpGoalHit = dailyXP >= xpGoal

  const radius = 15.9
  const circumference = 2 * Math.PI * radius

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
          <h3 className="font-bold text-sm text-foreground">Daily Goals</h3>
          <p className="text-xs mt-0.5 text-muted-foreground">Complete tasks to earn XP</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20">
          <Zap className="w-3 h-3" />
          {earnedXP}/{totalXP} XP
        </div>
      </div>

      <div className="card-body">
        {/* Daily XP Goal (from Settings → Study Preferences) */}
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
              <span className="text-xs font-semibold text-foreground">Daily XP Goal</span>
              <span className={`text-xs font-bold ${xpGoalHit ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                {dailyXP}/{xpGoal} XP
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
                <span className="text-sm font-bold text-foreground">{completed.length}/{DAILY_GOALS.length}</span>
              )}
            </div>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">
              {completed.length === 0 && "Let's start today! 💪"}
              {completed.length > 0 && completed.length < DAILY_GOALS.length && "Keep going! You're doing great!"}
              {allDone && 'All goals completed! 🎉'}
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              {allDone
                ? 'Come back tomorrow for new goals'
                : `${DAILY_GOALS.length - completed.length} goal${DAILY_GOALS.length - completed.length !== 1 ? 's' : ''} remaining today`}
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
          {DAILY_GOALS.map((goal, i) => {
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
                  {isDone ? <><Check className="w-3 h-3" />Done</> : <>+{goal.xp} XP</>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}