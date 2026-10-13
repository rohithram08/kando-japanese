// src/components/dashboard/ProgressChart.jsx
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { BarChart3, TrendingUp, BookOpen, Clock } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { getStreakHistory } from '../../api/progress'

// Recharts renders raw SVG and needs literal color values on stroke/fill —
// it can't read Tailwind classes or CSS custom properties, so this is the
// one place a resolved isDark boolean is genuinely necessary.
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2.5 rounded-xl border shadow-xl bg-surface border-border text-foreground">
      <p className="text-xs font-semibold mb-1.5 text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-bold">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const LEVEL_PROGRESS = {
  N5: { percent: 35, next: 'N4', color: 'from-green-400 to-emerald-500' },
  N4: { percent: 20, next: 'N3', color: 'from-blue-400 to-blue-600' },
  N3: { percent: 15, next: 'N2', color: 'from-purple-400 to-purple-600' },
  N2: { percent: 10, next: 'N1', color: 'from-orange-400 to-red-500' },
  N1: { percent: 5, next: null, color: 'from-yellow-400 to-amber-500' },
}

export default function ProgressChart({ level }) {
  const { user } = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  const [data, setData] = useState([])
  const [activeMetric, setActiveMetric] = useState('both') // 'lessons' | 'minutes' | 'both'

  useEffect(() => {
    if (user?.id) loadProgressData()
  }, [user?.id])

  const loadProgressData = async () => {
    try {
      const res = await getStreakHistory()
      const rawStreaks = Array.isArray(res) ? res : (res?.streaks ?? [])

      const formatted = rawStreaks.slice(-14).map((s) => ({
        date: new Date(s.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        lessons: s.lessonsCompleted ?? s.lessons_completed ?? 0,
        minutes: Math.round((s.minutesStudied ?? s.minutes_studied ?? 0) / 60),
      }))

      setData(formatted)
    } catch (err) {
      console.error('ProgressChart error:', err)
      setData([])
    }
  }

  const totalLessons = data.reduce((sum, d) => sum + d.lessons, 0)
  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0)
  const avgLessons = data.length > 0 ? (totalLessons / data.length).toFixed(1) : 0
  const avgMinutes = data.length > 0 ? (totalMinutes / data.length).toFixed(0) : 0
  const levelInfo = LEVEL_PROGRESS[level] || LEVEL_PROGRESS.N5

  const SUMMARY = [
    { label: 'Total Lessons', value: totalLessons, icon: BookOpen, color: 'text-red-500 dark:text-red-400' },
    { label: 'Total Minutes', value: totalMinutes, icon: Clock, color: 'text-blue-500 dark:text-blue-400' },
    { label: 'Avg Lessons/Day', value: avgLessons, icon: TrendingUp, color: 'text-green-500 dark:text-green-400' },
    { label: 'Avg Min/Day', value: avgMinutes, icon: BarChart3, color: 'text-purple-500 dark:text-purple-400' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
      <div className="card-header">
        <div className="icon-badge bg-blue-50 dark:bg-blue-500/10">
          <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-foreground">Learning Progress</h3>
          <p className="text-xs mt-0.5 text-muted-foreground">Last 14 days activity</p>
        </div>

        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          {[
            { key: 'both', label: 'All' },
            { key: 'lessons', label: 'Lessons' },
            { key: 'minutes', label: 'Time' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                activeMetric === m.key ? 'bg-surface text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {SUMMARY.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="text-center p-2.5 rounded-xl bg-muted/60"
            >
              <stat.icon className={`w-3.5 h-3.5 mx-auto mb-1 ${stat.color}`} />
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-[9px] font-medium text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        {data.length > 0 ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="gradientLessons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradientMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: isDark ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: isDark ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {(activeMetric === 'both' || activeMetric === 'lessons') && (
                  <Area
                    type="monotone" dataKey="lessons" stroke="#ef4444" fill="url(#gradientLessons)"
                    strokeWidth={2.5} dot={{ fill: '#ef4444', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }} name="Lessons"
                  />
                )}
                {(activeMetric === 'both' || activeMetric === 'minutes') && (
                  <Area
                    type="monotone" dataKey="minutes" stroke="#3b82f6" fill="url(#gradientMinutes)"
                    strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} name="Minutes"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center gap-3 rounded-xl bg-muted/50">
            <div className="text-4xl">📈</div>
            <p className="text-sm font-medium text-muted-foreground">Start studying to see your progress!</p>
            <p className="text-xs text-muted-foreground/70">Your daily activity will appear here</p>
          </div>
        )}

        {data.length > 0 && (
          <div className="flex items-center justify-center gap-5 mt-3 text-muted-foreground">
            {(activeMetric === 'both' || activeMetric === 'lessons') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-medium">Lessons</span>
              </div>
            )}
            {(activeMetric === 'both' || activeMetric === 'minutes') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-medium">Minutes</span>
              </div>
            )}
          </div>
        )}

        {/* Level Progress */}
        <div className="mt-5 pt-5 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">{level ?? 'N5'} Progress</span>
            <span className="text-xs font-bold text-red-500 dark:text-red-400">{levelInfo.percent}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.percent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              className={`h-full rounded-full bg-gradient-to-r ${levelInfo.color} relative overflow-hidden`}
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground/70">{level}</span>
            <span className="text-[10px] text-muted-foreground/70">{levelInfo.next ? `Next: ${levelInfo.next}` : 'Max Level'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
