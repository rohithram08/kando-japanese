// src/components/dashboard/StudyProgressAnalytics.jsx
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, GraduationCap, Activity, Eye, Pen,
  Volume2, MessageCircle, Languages, BookMarked,
  Award, Star, Shield, Medal, Trophy, Crown,
  Clock, Zap, CheckCircle2, ChevronRight
} from 'lucide-react'
import { useProgressStore } from '../../store/progressStore'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useI18n } from '../../i18n'
import { useStudyLevel } from '../../hooks/useStudyLevel'

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']

const LEVEL_DETAILS = {
  N5: { kanji: 80,  vocab: 800,   grammar: 80,  label: 'Beginner',     color: 'emerald' },
  N4: { kanji: 170, vocab: 1500,  grammar: 165, label: 'Elementary',   color: 'blue'    },
  N3: { kanji: 370, vocab: 3750,  grammar: 250, label: 'Intermediate', color: 'yellow'  },
  N2: { kanji: 1000, vocab: 6000, grammar: 350, label: 'Advanced',     color: 'orange'  },
  N1: { kanji: 2000, vocab: 10000, grammar: 450, label: 'Fluent',      color: 'red'     },
}

const SKILL_AREAS = [
  { key: 'reading',   label: 'Reading',    Icon: Eye,           color: 'from-blue-500 to-cyan-500',    tintBg: 'bg-blue-500/15 text-blue-500' },
  { key: 'writing',   label: 'Writing',    Icon: Pen,           color: 'from-purple-500 to-pink-500',  tintBg: 'bg-purple-500/15 text-purple-500' },
  { key: 'listening', label: 'Listening',  Icon: Volume2,       color: 'from-emerald-500 to-teal-500', tintBg: 'bg-emerald-500/15 text-emerald-500' },
  { key: 'speaking',  label: 'Speaking',   Icon: MessageCircle, color: 'from-orange-500 to-amber-500', tintBg: 'bg-orange-500/15 text-orange-500' },
  { key: 'grammar',   label: 'Grammar',    Icon: Languages,     color: 'from-rose-500 to-red-500',     tintBg: 'bg-rose-500/15 text-rose-500' },
  { key: 'vocab',     label: 'Vocabulary', Icon: BookMarked,    color: 'from-cyan-500 to-blue-500',    tintBg: 'bg-cyan-500/15 text-cyan-500' },
]

const MILESTONES = [
  { xp: 100,   label: 'Novice',  icon: Shield },
  { xp: 500,   label: 'Learner', icon: Star   },
  { xp: 1000,  label: 'Student', icon: Award  },
  { xp: 2500,  label: 'Scholar', icon: Medal  },
  { xp: 5000,  label: 'Expert',  icon: Trophy },
  { xp: 10000, label: 'Master',  icon: Crown  },
]

// Mocked realistic 7-day learning rhythm
const WEEKLY_HABIT = [
  { day: 'Mon', minutes: 25, completed: true },
  { day: 'Tue', minutes: 35, completed: true },
  { day: 'Wed', minutes: 20, completed: true },
  { day: 'Thu', minutes: 45, completed: true },
  { day: 'Fri', minutes: 30, completed: true },
  { day: 'Sat', minutes: 50, completed: false },
  { day: 'Sun', minutes: 15, completed: false },
]

export default function StudyProgressAnalytics() {
  const { t } = useI18n()
  const progress = useProgressStore()
  const { profile } = useAuthStore()

  // Access level (user-controlled), not the XP-derived rank, so this card agrees with what is unlocked.
  const { studyLevel: currentLevel } = useStudyLevel()
  const currentXP = progress.totalXP || profile?.xpPoints || 0
  const kanjiLearned = progress.kanjiLearned || 0
  const vocabLearned = progress.vocabLearned || 0
  const lessonsCompleted = progress.lessonsCompleted || 0
  const streak = progress.streak || profile?.streakDays || 0

  const levelDetails = LEVEL_DETAILS[currentLevel] || LEVEL_DETAILS.N5
  const currentLevelIndex = LEVELS.indexOf(currentLevel)

  // Level completion percentages
  const kanjiPct = Math.min(Math.round((kanjiLearned / levelDetails.kanji) * 100), 100)
  const vocabPct = Math.min(Math.round((vocabLearned / levelDetails.vocab) * 100), 100)
  const grammarPct = Math.min(Math.round(((lessonsCompleted * 4) / levelDetails.grammar) * 100), 100)
  const overallLevelPct = Math.round((kanjiPct + vocabPct + grammarPct) / 3)

  // Skill scores (0 - 100)
  const skillScores = useMemo(() => ({
    reading:   Math.min(Math.max(lessonsCompleted * 8, 25), 100),
    writing:   Math.min(Math.max(kanjiLearned * 4, 15), 100),
    listening: Math.min(Math.max(lessonsCompleted * 6, 20), 100),
    speaking:  Math.min(Math.max(Math.round(currentXP / 40), 18), 100),
    grammar:   Math.min(Math.max(lessonsCompleted * 7, 22), 100),
    vocab:     Math.min(Math.max(Math.round((vocabLearned / 50) * 100), 20), 100),
  }), [lessonsCompleted, kanjiLearned, currentXP, vocabLearned])

  // Current & next milestones
  const currentMilestone = MILESTONES.reduce((acc, m) => (currentXP >= m.xp ? m : acc), MILESTONES[0])
  const nextMilestone = MILESTONES.find(m => currentXP < m.xp) || MILESTONES[MILESTONES.length - 1]
  const milestoneProgress = nextMilestone && nextMilestone.xp > 0
    ? Math.min(Math.round((currentXP / nextMilestone.xp) * 100), 100)
    : 100

  return (
    <div className="space-y-4" data-testid="study-progress-analytics">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Study Progress & Skills Analytics
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your JLPT competency journey, study rhythm, and skill breakdown
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          JLPT {currentLevel} Path
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── 1. JLPT Level Journey ── */}
        <div className="card p-5 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span className="font-bold text-sm text-foreground">JLPT Level Journey</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500">
                {levelDetails.label} · {overallLevelPct}% Ready
              </span>
            </div>

            {/* Stepped Level Nodes */}
            <div className="flex items-center justify-between relative mb-5 px-1">
              {/* Connecting Line */}
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-muted -z-0" />
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 transition-all duration-700 -z-0"
                style={{ width: `${Math.max((currentLevelIndex / (LEVELS.length - 1)) * 92, 0)}%` }}
              />

              {LEVELS.map((lvl, idx) => {
                const isPassed = idx < currentLevelIndex
                const isCurrent = idx === currentLevelIndex
                return (
                  <div key={lvl} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/25 scale-110'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      {isPassed ? '✓' : lvl}
                    </div>
                    <span className="text-[10px] font-semibold mt-1 text-muted-foreground">{lvl}</span>
                  </div>
                )
              })}
            </div>

            {/* Target Breakdown for Current Level */}
            <div className="space-y-2.5">
              {/* Kanji Target */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-muted-foreground">Kanji Target ({currentLevel})</span>
                  <span className="font-bold text-foreground tabular-nums">
                    {kanjiLearned} / {levelDetails.kanji} <span className="text-muted-foreground font-normal">({kanjiPct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${kanjiPct}%` }} />
                </div>
              </div>

              {/* Vocab Target */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-muted-foreground">Vocabulary Target ({currentLevel})</span>
                  <span className="font-bold text-foreground tabular-nums">
                    {vocabLearned} / {levelDetails.vocab} <span className="text-muted-foreground font-normal">({vocabPct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${vocabPct}%` }} />
                </div>
              </div>

              {/* Grammar Target */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-muted-foreground">Grammar Points Target</span>
                  <span className="font-bold text-foreground tabular-nums">
                    {Math.min(lessonsCompleted * 4, levelDetails.grammar)} / {levelDetails.grammar} <span className="text-muted-foreground font-normal">({grammarPct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${grammarPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Tier Progress */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <currentMilestone.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">{currentMilestone.label} Title</div>
                <div className="text-[10px] text-muted-foreground">Next: {nextMilestone.label} ({nextMilestone.xp} XP)</div>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-500 tabular-nums">
              {milestoneProgress}%
            </span>
          </div>
        </div>

        {/* ── 2. Skills Competency Breakdown ── */}
        <div className="card p-5 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-sm text-foreground">Skills Competency Breakdown</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">6 Core Areas</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {SKILL_AREAS.map(({ key, label, Icon, color, tintBg }) => {
                const score = skillScores[key] || 0
                return (
                  <div key={key} className="p-3 rounded-xl bg-muted/30 border border-border/80 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-6 h-6 rounded-md ${tintBg} flex items-center justify-center`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground truncate">{label}</span>
                      </div>
                      <span className="text-xs font-bold tabular-nums text-foreground">{score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weekly Habit Tracker Preview */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> Weekly Study Rhythm
              </span>
              <span className="text-[11px] font-bold text-primary">~180 mins / week</span>
            </div>
            <div className="flex items-center justify-between gap-1.5">
              {WEEKLY_HABIT.map(({ day, minutes, completed }) => (
                <div key={day} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                      completed
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    {minutes}m
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground mt-1">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
