// src/store/dailyGoalsStore.js
//
// Tracks today's progress toward the 4 daily goals shown in <DailyGoal />.
// Purely local (localStorage via zustand/persist) and resets automatically
// when the calendar date changes — no database schema changes required.
//
// Other features call the `add*` actions when the user does the relevant
// activity (SRSReview review card, KanjiPage mark-as-studied, a chat
// message sent, a lesson completed) so the dashboard checklist reflects
// real activity instead of only ever tracking lessons.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const GOAL_THRESHOLDS = {
  lesson: 1,
  review: 10,
  kanji: 5,
  chat: 1,
}

const todayKey = () => new Date().toISOString().split('T')[0]

const freshDay = () => ({
  date: todayKey(),
  lesson: 0,
  review: 0,
  kanji: 0,
  chat: 0,
})

export const useDailyGoalsStore = create(
  persist(
    (set, get) => ({
      ...freshDay(),

      /** Call at the top of any read/write path to roll over a new day. */
      _ensureToday: () => {
        if (get().date !== todayKey()) set(freshDay())
      },

      addLesson: (n = 1) => {
        get()._ensureToday()
        set((s) => ({ lesson: s.lesson + n }))
      },
      addReview: (n = 1) => {
        get()._ensureToday()
        set((s) => ({ review: s.review + n }))
      },
      addKanji: (n = 1) => {
        get()._ensureToday()
        set((s) => ({ kanji: s.kanji + n }))
      },
      addChat: (n = 1) => {
        get()._ensureToday()
        set((s) => ({ chat: s.chat + n }))
      },

      /** ['lesson', 'review', ...] — ids that have hit their threshold today */
      getCompletedIds: () => {
        get()._ensureToday()
        const s = get()
        return Object.keys(GOAL_THRESHOLDS).filter((id) => s[id] >= GOAL_THRESHOLDS[id])
      },
    }),
    { name: 'nihongo-daily-goals' }
  )
)
