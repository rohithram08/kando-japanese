// src/components/dashboard/StreakCard.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MOTIVATION = (streak) => {
  if (streak === 0) return { text: 'Start your streak today!', emoji: '💪', color: 'text-muted-foreground' }
  if (streak < 7) return { text: `${7 - streak} more day${7 - streak !== 1 ? 's' : ''} to a week streak!`, emoji: '🌟', color: 'text-blue-600 dark:text-blue-400' }
  if (streak < 30) return { text: `${30 - streak} days to monthly badge!`, emoji: '🏅', color: 'text-purple-600 dark:text-purple-400' }
  return { text: "Incredible dedication! You're a legend!", emoji: '🏆', color: 'text-yellow-600 dark:text-yellow-400' }
}

export default function StreakCard({ streak = 0 }) {
  const today = new Date().getDay()
  const motivation = MOTIVATION(streak)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="card-header">
        <div className="icon-badge bg-orange-50 dark:bg-orange-500/10">
          <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-foreground">Study Streak</h3>
          <p className="text-xs mt-0.5 text-muted-foreground">Stay consistent every day</p>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.span key={`emoji-${streak}`} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl">
            🔥
          </motion.span>
          <div className="text-right">
            <motion.span
              key={`val-${streak}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl font-bold block leading-none text-orange-500 dark:text-orange-400"
            >
              {streak}
            </motion.span>
            <span className="text-[10px] text-muted-foreground">days</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Week View */}
        <div className="flex gap-2">
          {WEEK_DAYS.map((day, i) => {
            const isToday = i === today
            const isPast = i < today
            const isStudied = isPast && i >= today - streak

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all ${
                    isToday
                      ? 'bg-red-500 text-white font-bold ring-2 ring-red-200 dark:ring-red-400/30 ring-offset-1 ring-offset-surface'
                      : isStudied
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-sm shadow-orange-400/20 dark:shadow-orange-500/20'
                        : 'bg-muted text-muted-foreground/60'
                  }`}
                >
                  {isStudied || isToday ? '🔥' : '○'}
                </motion.div>
                <span className={`text-[10px] font-medium ${isToday ? 'text-red-500 dark:text-red-400 font-bold' : 'text-muted-foreground/70'}`}>
                  {day}
                </span>
              </div>
            )
          })}
        </div>

        {/* Motivation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-border"
        >
          <span className="text-sm">{motivation.emoji}</span>
          <p className={`text-xs font-medium ${motivation.color}`}>{motivation.text}</p>
        </motion.div>

        {/* Milestone badges */}
        {streak >= 7 && (
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
              🌟 Week Streak
            </span>
            {streak >= 30 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
                🏅 Monthly
              </span>
            )}
            {streak >= 100 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-500/20">
                🏆 Legend
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
