// src/hooks/useNotificationEngine.js
//
// The "brain" behind the notification bell. Renders nothing — just watches
// real app state and turns meaningful changes into notifications:
//
//   • SRS reviews due           → live count, updates in place
//   • Streak milestones         → 3 / 7 / 14 / 30 / 100 / 365 days, one-shot
//                                  (only if Settings → Notifications → Streak Alerts is on)
//   • New badge earned          → diffed against getBadges(), one-shot
//                                  (only if Settings → Notifications → Achievement Alerts is on)
//   • JLPT level up             → N5 → N4 → N3 → N2 → N1, one-shot
//   • Daily goals all complete  → once per calendar day
//   • Weekly progress report    → once every 7 days, real stats
//                                  (only if Settings → Notifications → Weekly Report is on)
//   • Daily study reminder      → real browser notification at the configured
//                                  time if the user hasn't studied yet today
//                                  (only if Settings → Notifications → Daily Reminder is on)
//
// Mounted once in Layout.jsx (always present once the user is signed in),
// so it works no matter which page is currently open.

import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useDailyGoalsStore, GOAL_THRESHOLDS } from '../store/dailyGoalsStore'
import { useNotificationStore } from '../store/notificationStore'
import { useSettingsStore } from '../store/settingsStore'
import { getBadges, getJLPTLevel } from '../utils/progressCalculator'

const STREAK_MILESTONES = [3, 7, 14, 30, 100, 365]
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const todayKey = () => new Date().toISOString().split('T')[0]

export function useNotificationEngine() {
  const { user } = useAuthStore()

  const {
    streak, totalXP, jlptLevel, lessonsCompleted,
    kanjiLearned, vocabLearned, cardsReviewed, cardsMastered,
    srsReviewsDue, loadSRSDue,
  } = useProgressStore()

  const dailyGoals = useDailyGoalsStore()
  const { upsert, remove, hasSeenBadge, markBadgeSeen, hasSeenStreak, markStreakSeen } =
    useNotificationStore()

  const settings = useSettingsStore()

  // Track the previous level so we only notify on the *transition*, not
  // every render at the same level.
  const prevJlptRef = useRef(jlptLevel)

  // ── 1. SRS reviews due — fetch on mount, on focus, and periodically ──
  useEffect(() => {
    if (!user) return
    loadSRSDue(user.id)

    const onFocus = () => loadSRSDue(user.id)
    window.addEventListener('focus', onFocus)
    const interval = setInterval(() => loadSRSDue(user.id), 5 * 60 * 1000) // every 5 min

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
        icon: '🔄',
        title: 'Reviews waiting',
        text: `${srsReviewsDue} card${srsReviewsDue !== 1 ? 's' : ''} ready for SRS review`,
        link: '/review',
      })
    } else {
      remove('srs-due')
    }
  }, [srsReviewsDue, upsert, remove])

  // ── 2. Streak milestones (respects the real "Streak Alerts" setting) ──
  useEffect(() => {
    if (!settings.streakAlert) return
    if (streak <= 0) return
    const hit = [...STREAK_MILESTONES].reverse().find((m) => streak >= m && !hasSeenStreak(m))
    if (hit) {
      markStreakSeen(hit)
      upsert({
        id: `streak-${hit}`,
        type: 'streak',
        icon: '🔥',
        title: `${hit}-day streak!`,
        text: hit >= 100
          ? `Incredible dedication — ${hit} days in a row!`
          : `You've studied ${hit} days in a row. Keep it going!`,
        link: '/dashboard',
      })
    }
  }, [streak, settings.streakAlert, upsert, hasSeenStreak, markStreakSeen])

  // ── 3. New badges earned (respects the real "Achievement Alerts" setting) ──
  useEffect(() => {
    if (!settings.achievementAlert) return
    const { earned } = getBadges({
      lessonsCompleted, kanjiLearned, vocabLearned, streak, totalXP,
      cardsReviewed, cardsMastered,
    })
    earned.forEach((badge) => {
      if (!hasSeenBadge(badge.id)) {
        markBadgeSeen(badge.id)
        upsert({
          id: `badge-${badge.id}`,
          type: 'badge',
          icon: '🏆',
          title: 'Achievement unlocked!',
          text: `${badge.name} — ${badge.desc}`,
          link: '/achievements',
        })
      }
    })
  }, [lessonsCompleted, kanjiLearned, vocabLearned, streak, totalXP, cardsReviewed, cardsMastered, settings.achievementAlert, upsert, hasSeenBadge, markBadgeSeen])

  // ── 4. JLPT level up ───────────────────────────────────────
  useEffect(() => {
    const prev = prevJlptRef.current
    if (jlptLevel && prev && jlptLevel !== prev) {
      const info = getJLPTLevel(totalXP)
      upsert({
        id: `level-${jlptLevel}`,
        type: 'level_up',
        icon: info.emoji || '⭐',
        title: `Welcome to ${jlptLevel}!`,
        text: `You've advanced to the ${jlptLevel} level — ${info.title || ''}`.trim(),
        link: '/progress',
      })
    }
    prevJlptRef.current = jlptLevel
  }, [jlptLevel, totalXP, upsert])

  // ── 5. Daily goals fully complete (once per day) ───────────
  useEffect(() => {
    const allDone = Object.keys(GOAL_THRESHOLDS).every(
      (id) => dailyGoals[id] >= GOAL_THRESHOLDS[id]
    )
    if (allDone && useNotificationStore.getState().lastDailyGoalNotifDate !== todayKey()) {
      useNotificationStore.setState({ lastDailyGoalNotifDate: todayKey() })
      upsert({
        id: `daily-goal-${todayKey()}`,
        type: 'daily_goal',
        icon: '🎯',
        title: 'All daily goals complete!',
        text: "You've hit every goal today. Great work!",
        link: '/dashboard',
      })
    }
  }, [dailyGoals.lesson, dailyGoals.review, dailyGoals.kanji, dailyGoals.chat, upsert])

  // ── 6. Weekly progress report (real stats, once every 7 days) ──────
  // This is an in-app notification rather than an email — there's no
  // backend email service wired into this build, so a real notification
  // summarizing real numbers is the honest version of this feature.
  useEffect(() => {
    if (!settings.weeklyReport) return
    const store = useNotificationStore.getState()
    const last = store.lastWeeklyReportAt ? new Date(store.lastWeeklyReportAt).getTime() : 0
    if (Date.now() - last < WEEK_MS) return

    useNotificationStore.setState({ lastWeeklyReportAt: new Date().toISOString() })
    upsert({
      id: `weekly-report-${todayKey()}`,
      type: 'weekly_report',
      icon: '📊',
      title: 'Your week in review',
      text: `${lessonsCompleted} lessons · ${kanjiLearned} kanji · ${vocabLearned} words · ${totalXP.toLocaleString()} XP total. Keep it up!`,
      link: '/progress',
    })
  }, [settings.weeklyReport, lessonsCompleted, kanjiLearned, vocabLearned, totalXP])

  // ── 7. Daily study reminder (real browser notification) ────────────
  // Checks every minute while the app is open; fires a native
  // Notification at the configured time if the user hasn't completed
  // any daily goal yet today. Browser notifications require the tab to
  // be open (no service-worker push in this build) and explicit
  // permission, which is requested only when the setting is turned on.
  useEffect(() => {
    if (!settings.dailyReminder) return
    if (typeof Notification === 'undefined') return

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const check = () => {
      if (Notification.permission !== 'granted') return
      const now = new Date()
      const [h, m] = (settings.reminderTime || '09:00').split(':').map(Number)
      const isReminderMinute = now.getHours() === h && now.getMinutes() === m

      const studiedToday = Object.keys(GOAL_THRESHOLDS).some(
        (id) => useDailyGoalsStore.getState()[id] > 0
      )

      const lastFired = useNotificationStore.getState().lastReminderFiredDate
      if (isReminderMinute && !studiedToday && lastFired !== todayKey()) {
        useNotificationStore.setState({ lastReminderFiredDate: todayKey() })
        new Notification('Time to study! 🎌', {
          body: "You haven't studied yet today — even 5 minutes keeps your streak alive.",
          icon: '/favicon.svg',
        })
      }
    }

    const interval = setInterval(check, 60 * 1000)
    check()
    return () => clearInterval(interval)
  }, [settings.dailyReminder, settings.reminderTime])
}

export default useNotificationEngine