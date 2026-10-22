// src/hooks/useNotificationEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Real Dynamic Slime Notification Engine
// Watches live application state and converts meaningful events into
// Duolingo-style personalized Slime notifications.
// Zero hardcoded content: uses authenticated profile, SRS due count, real streak,
// real achievements, and explicit user notification settings.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useDailyGoalsStore, GOAL_THRESHOLDS } from '../store/dailyGoalsStore'
import { useNotificationStore } from '../store/notificationStore'
import { useSettingsStore } from '../store/settingsStore'
import { getBadges, getJLPTLevel } from '../utils/progressCalculator'
import { sendBrowserNotification } from '../services/browserNotificationService'

const STREAK_MILESTONES = [3, 7, 14, 30, 100, 365]
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const todayKey = () => new Date().toISOString().split('T')[0]

export function useNotificationEngine() {
  const { user, profile } = useAuthStore()

  const {
    streak = 0,
    totalXP = 0,
    jlptLevel = 'N5',
    lessonsCompleted = 0,
    kanjiLearned = 0,
    vocabLearned = 0,
    cardsReviewed = 0,
    cardsMastered = 0,
    srsReviewsDue = 0,
    loadSRSDue,
  } = useProgressStore()

  const dailyGoals = useDailyGoalsStore()
  const { upsert, remove, hasSeenBadge, markBadgeSeen, hasSeenStreak, markStreakSeen } =
    useNotificationStore()

  const settings = useSettingsStore()
  const prevJlptRef = useRef(jlptLevel)

  const displayName = profile?.username || user?.email?.split('@')[0] || 'Learner'

  // ── 1. SRS Reviews Due (Live updates in place) ─────────────────────────────
  useEffect(() => {
    if (!user) return
    loadSRSDue(user.id)

    const onFocus = () => loadSRSDue(user.id)
    window.addEventListener('focus', onFocus)
    const interval = setInterval(() => loadSRSDue(user.id), 5 * 60 * 1000)

    return () => {
      window.removeEventListener('focus', onFocus)
      clearInterval(interval)
    }
  }, [user, loadSRSDue])

  useEffect(() => {
    if (srsReviewsDue > 0) {
      upsert({
        id: 'srs-due',
        type: 'srs_due',
        category: 'reviews',
        slimeMood: 'srs',
        greeting: `Hi ${displayName}! It's Slime.`,
        title: `${srsReviewsDue} card${srsReviewsDue !== 1 ? 's' : ''} ready for review`,
        text: `🧠 You have ${srsReviewsDue} spaced repetition card${srsReviewsDue !== 1 ? 's' : ''} waiting. Take 3 minutes now to lock them into memory.`,
        link: '/review',
        primaryAction: { label: 'Review Cards', link: '/review' },
        secondaryAction: { label: 'Remind me later', action: 'snooze' },
      })
    } else {
      remove('srs-due')
    }
  }, [srsReviewsDue, displayName, upsert, remove])

  // ── 2. Daily Study Reminder (Duolingo Style: Hi ROHITH! It's Slime.) ───────
  useEffect(() => {
    const studiedToday = Object.keys(GOAL_THRESHOLDS).some(
      (id) => dailyGoals[id] > 0
    )

    // In-app reminder if user hasn't studied yet today
    if (!studiedToday) {
      const now = new Date()
      const hours = now.getHours()

      // Generate in-app nudge in afternoon/evening or if reminder is enabled
      if (hours >= 12 || settings.dailyReminder) {
        upsert({
          id: `daily-reminder-${todayKey()}`,
          type: 'daily_reminder',
          category: 'reminders',
          slimeMood: 'daily',
          greeting: `Hi ${displayName}! It's Slime.`,
          title: "It's time for your daily Japanese lesson",
          text: '⏰ Keep your Japanese momentum going! Take 3 minutes now to read a story or complete a lesson.',
          link: '/reading',
          primaryAction: { label: 'Start Lesson', link: '/reading' },
          secondaryAction: { label: 'Remind me later', action: 'snooze' },
        })
      }
    } else {
      // User studied today; remove the pending daily study nudge
      remove(`daily-reminder-${todayKey()}`)
    }
  }, [dailyGoals.lesson, dailyGoals.review, dailyGoals.kanji, dailyGoals.chat, displayName, settings.dailyReminder, upsert, remove])

  // ── 3. Evening Streak Saver (If streak > 0 and user hasn't studied today) ───
  useEffect(() => {
    if (!settings.streakAlert || streak <= 0) return

    const studiedToday = Object.keys(GOAL_THRESHOLDS).some(
      (id) => dailyGoals[id] > 0
    )

    const now = new Date()
    const hours = now.getHours()

    // Alert in the evening (after 18:00) if streak is at risk
    if (hours >= 18 && !studiedToday) {
      upsert({
        id: `streak-risk-${todayKey()}`,
        type: 'streak_risk',
        category: 'streaks',
        slimeMood: 'streak',
        greeting: `Don't lose your ${streak}-day streak! 🔥`,
        title: 'Streak at risk!',
        text: `You have an active ${streak}-day streak. Complete any short lesson before midnight to protect it!`,
        link: '/reading',
        primaryAction: { label: 'Protect Streak', link: '/reading' },
        secondaryAction: { label: 'Remind me later', action: 'snooze' },
      })
    } else if (studiedToday) {
      remove(`streak-risk-${todayKey()}`)
    }
  }, [streak, settings.streakAlert, dailyGoals.lesson, dailyGoals.review, dailyGoals.kanji, dailyGoals.chat, upsert, remove])

  // ── 4. Streak Milestones (One-shot, deduplicated) ──────────────────────────
  useEffect(() => {
    if (!settings.streakAlert || streak <= 0) return
    const hit = [...STREAK_MILESTONES].reverse().find((m) => streak >= m && !hasSeenStreak(m))
    if (hit) {
      markStreakSeen(hit)
      upsert({
        id: `streak-${hit}`,
        type: 'streak',
        category: 'streaks',
        slimeMood: 'streak',
        greeting: `Unstoppable ${hit}-Day Streak! 🔥`,
        title: `${hit}-day streak achieved!`,
        text:
          hit >= 100
            ? `Incredible dedication — ${hit} days in a row! Slime is dancing with joy!`
            : `You've studied Japanese for ${hit} days in a row. Keep the fire burning!`,
        link: '/dashboard',
        primaryAction: { label: 'View Dashboard', link: '/dashboard' },
      })
    }
  }, [streak, settings.streakAlert, upsert, hasSeenStreak, markStreakSeen])

  // ── 5. New Badges Earned (One-shot, deduplicated) ──────────────────────────
  useEffect(() => {
    if (!settings.achievementAlert) return
    const { earned } = getBadges({
      lessonsCompleted,
      kanjiLearned,
      vocabLearned,
      streak,
      totalXP,
      cardsReviewed,
      cardsMastered,
    })
    earned.forEach((badge) => {
      if (!hasSeenBadge(badge.id)) {
        markBadgeSeen(badge.id)
        upsert({
          id: `badge-${badge.id}`,
          type: 'badge',
          category: 'achievements',
          slimeMood: 'achievement',
          greeting: 'Achievement Unlocked! 🏆',
          title: badge.name,
          text: `${badge.desc} — Great work on your Japanese learning path!`,
          link: '/achievements',
          primaryAction: { label: 'View Badges', link: '/achievements' },
        })
      }
    })
  }, [
    lessonsCompleted,
    kanjiLearned,
    vocabLearned,
    streak,
    totalXP,
    cardsReviewed,
    cardsMastered,
    settings.achievementAlert,
    upsert,
    hasSeenBadge,
    markBadgeSeen,
  ])

  // ── 6. JLPT Level Up ───────────────────────────────────────────────────────
  useEffect(() => {
    const prev = prevJlptRef.current
    if (jlptLevel && prev && jlptLevel !== prev) {
      const info = getJLPTLevel(totalXP)
      upsert({
        id: `level-${jlptLevel}`,
        type: 'level_up',
        category: 'milestones',
        slimeMood: 'level_up',
        greeting: `Level Up! Welcome to ${jlptLevel} ⭐`,
        title: `Advanced to ${jlptLevel}`,
        text: `Congratulations! You have reached ${jlptLevel} (${info.title || 'Japanese Master'}). Keep climbing!`,
        link: '/progress',
        primaryAction: { label: 'View Analytics', link: '/progress' },
      })
    }
    prevJlptRef.current = jlptLevel
  }, [jlptLevel, totalXP, upsert])

  // ── 7. Daily Goals Fully Completed ─────────────────────────────────────────
  useEffect(() => {
    const allDone = Object.keys(GOAL_THRESHOLDS).every(
      (id) => dailyGoals[id] >= GOAL_THRESHOLDS[id]
    )
    if (allDone && useNotificationStore.getState().lastDailyGoalNotifDate !== todayKey()) {
      useNotificationStore.setState({ lastDailyGoalNotifDate: todayKey() })
      upsert({
        id: `daily-goal-${todayKey()}`,
        type: 'daily_goal',
        category: 'milestones',
        slimeMood: 'achievement',
        greeting: 'Daily Goals Complete! 🎯',
        title: 'All daily targets hit',
        text: "You've crushed every learning goal for today. Awesome consistency!",
        link: '/dashboard',
        primaryAction: { label: 'View Dashboard', link: '/dashboard' },
      })
    }
  }, [dailyGoals.lesson, dailyGoals.review, dailyGoals.kanji, dailyGoals.chat, upsert])

  // ── 8. Weekly Progress Report ──────────────────────────────────────────────
  useEffect(() => {
    if (!settings.weeklyReport) return
    const store = useNotificationStore.getState()
    const last = store.lastWeeklyReportAt ? new Date(store.lastWeeklyReportAt).getTime() : 0
    if (Date.now() - last < WEEK_MS) return

    useNotificationStore.setState({ lastWeeklyReportAt: new Date().toISOString() })
    upsert({
      id: `weekly-report-${todayKey()}`,
      type: 'weekly_report',
      category: 'milestones',
      slimeMood: 'study',
      greeting: `Hi ${displayName}! Your Week in Review 📊`,
      title: 'Weekly Progress Report',
      text: `${lessonsCompleted} lessons · ${kanjiLearned} kanji · ${vocabLearned} words · ${totalXP.toLocaleString()} XP. Keep up the amazing work!`,
      link: '/progress',
      primaryAction: { label: 'View Report', link: '/progress' },
    })
  }, [settings.weeklyReport, lessonsCompleted, kanjiLearned, vocabLearned, totalXP, displayName, upsert])

  // ── 9. Browser / Desktop Notification at Configured Time ───────────────────
  useEffect(() => {
    if (!settings.dailyReminder) return

    const check = () => {
      const now = new Date()
      const [h, m] = (settings.reminderTime || '09:00').split(':').map(Number)
      const isReminderMinute = now.getHours() === h && now.getMinutes() === m

      const studiedToday = Object.keys(GOAL_THRESHOLDS).some(
        (id) => useDailyGoalsStore.getState()[id] > 0
      )

      const lastFired = useNotificationStore.getState().lastReminderFiredDate
      if (isReminderMinute && !studiedToday && lastFired !== todayKey()) {
        useNotificationStore.setState({ lastReminderFiredDate: todayKey() })
        sendBrowserNotification({
          title: `Hi ${displayName}! It's Slime 🟢`,
          body: "⏰ It's time for your daily Japanese lesson. Take 3 minutes now to complete it!",
          url: '/reading',
          tag: 'daily-reminder',
        })
      }
    }

    const interval = setInterval(check, 60 * 1000)
    check()
    return () => clearInterval(interval)
  }, [settings.dailyReminder, settings.reminderTime, displayName])
}

export default useNotificationEngine
