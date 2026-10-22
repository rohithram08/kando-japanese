// src/store/notificationStore.js
// ─────────────────────────────────────────────────────────────────────────────
// Real notification inbox — Duolingo-style Slime notifications
// Derived from real app state (SRS due count, streaks, badges, daily goals, level
// changes) and stored here, persisted to localStorage so the inbox
// survives reloads.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_NOTIFICATIONS = 30

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [], // { id, type, category, icon, title, greeting, text, time, unread, link, primaryAction, secondaryAction, slimeMood, isExpanded }

      // Bookkeeping so one-shot notifications never re-fire
      seenBadgeIds: [],
      seenStreakMilestones: [],
      lastNotifiedJlptLevel: null,
      lastDailyGoalNotifDate: null,
      lastWeeklyReportAt: null,
      lastReminderFiredDate: null,
      snoozedUntil: {}, // { [id]: timestamp }

      /**
       * Add or update a notification.
       * If a notification with the same id already exists, it's replaced
       * in place (refreshing its timestamp + marking unread again) rather
       * than duplicated — this is what lets 'srs-due' track a live count.
       */
      upsert: (notif) => {
        set((state) => {
          // Check if snoozed
          const snoozeExpiry = state.snoozedUntil[notif.id]
          if (snoozeExpiry && Date.now() < snoozeExpiry) {
            return state // Still snoozed, skip
          }

          const existingIdx = state.notifications.findIndex((n) => n.id === notif.id)
          const entry = {
            unread: true,
            isExpanded: true,
            time: new Date().toISOString(),
            ...notif,
          }

          let next
          if (existingIdx >= 0) {
            next = [...state.notifications]
            next[existingIdx] = { ...next[existingIdx], ...entry }
          } else {
            next = [entry, ...state.notifications]
          }

          // Keep list from growing unbounded and preserve chronological order
          next = next
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, MAX_NOTIFICATIONS)

          return { notifications: next }
        })
      },

      /** Snooze a notification for a given duration in hours */
      snooze: (id, hours = 2) => {
        const until = Date.now() + hours * 60 * 60 * 1000
        set((state) => ({
          snoozedUntil: { ...state.snoozedUntil, [id]: until },
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, unread: false, isExpanded: false } : n
          ),
        }))
      },

      /** Remove a notification entirely */
      remove: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },

      /** Alias for remove */
      dismiss: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },

      markRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, unread: false } : n
          ),
        }))
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false })),
        }))
      },

      /** Empty the visible inbox only — dedupe memory (seen badges,
       *  streak milestones, etc.) is preserved, so already-earned
       *  achievements won't re-notify next time the engine runs. */
      clearNotifications: () => set({ notifications: [] }),

      /** Full reset — notifications AND dedupe memory. Used on logout so
       *  a different account on a shared device starts with a clean slate. */
      clearAll: () => {
        set({
          notifications: [],
          seenBadgeIds: [],
          seenStreakMilestones: [],
          lastNotifiedJlptLevel: null,
          lastDailyGoalNotifDate: null,
          lastWeeklyReportAt: null,
          lastReminderFiredDate: null,
          snoozedUntil: {},
        })
      },

      // ── One-shot dedupe helpers ──────────────────────────
      hasSeenBadge: (badgeId) => get().seenBadgeIds.includes(badgeId),
      markBadgeSeen: (badgeId) =>
        set((state) => ({ seenBadgeIds: [...new Set([...state.seenBadgeIds, badgeId])] })),

      hasSeenStreak: (milestone) => get().seenStreakMilestones.includes(milestone),
      markStreakSeen: (milestone) =>
        set((state) => ({
          seenStreakMilestones: [...new Set([...state.seenStreakMilestones, milestone])],
        })),
    }),
    {
      name: 'nihongo-notifications',
    }
  )
)

export default useNotificationStore
