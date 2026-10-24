// src/utils/profileStats.js
// Pure helpers that turn persisted data into what the Profile page shows,
// replacing the old hard-coded weekly chart / skill bars.

const pad = (n) => String(n).padStart(2, '0')
export const toLocalDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Monday→Sunday of the current week with the Wave XP earned on each day. */
export function buildWeeklyActivity(rows = [], now = new Date()) {
  const byDate = new Map()
  for (const r of Array.isArray(rows) ? rows : []) {
    const key = String(r?.date || '').slice(0, 10)
    if (key) byDate.set(key, (byDate.get(key) || 0) + (Number(r.xp ?? r.xpEarned) || 0))
  }
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const todayKey = toLocalDateKey(now)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = toLocalDateKey(d)
    return { index: i, date: key, xp: byDate.get(key) || 0, isToday: key === todayKey, isFuture: key > todayKey }
  })
}

// Rough JLPT-size targets used only to scale the progress bars.
const KANJI_GOAL = { N5: 100, N4: 300, N3: 650, N2: 1000, N1: 2000 }
const VOCAB_GOAL = { N5: 800, N4: 1500, N3: 3750, N2: 6000, N1: 10000 }
const pct = (value, goal) => (goal > 0 ? Math.min(100, Math.round(((Number(value) || 0) / goal) * 100)) : 0)

/** Only skills that we genuinely track (no invented listening/speaking numbers). */
export function buildSkillProgress({ storiesCompleted = 0, totalStories = 0, kanji = 0, vocab = 0, jlpt = 'N5' } = {}) {
  return {
    reading: pct(storiesCompleted, totalStories),
    kanji: pct(kanji, KANJI_GOAL[jlpt] || KANJI_GOAL.N5),
    vocab: pct(vocab, VOCAB_GOAL[jlpt] || VOCAB_GOAL.N5),
  }
}
