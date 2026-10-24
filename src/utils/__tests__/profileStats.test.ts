import { describe, it, expect } from 'vitest'
import { buildWeeklyActivity, buildSkillProgress } from '../profileStats.js'

describe('buildWeeklyActivity', () => {
  // Fri 23 Oct 2026
  const now = new Date(2026, 9, 23, 10, 0, 0)

  it('returns Monday→Sunday of the current week with real Wave XP per day', () => {
    const rows = [
      { date: '2026-10-19', xp: 45 }, // Mon
      { date: '2026-10-22', xp: 100 }, // Thu
      { date: '2026-10-23', xp: 20 }, // Fri (today)
      { date: '2026-10-12', xp: 999 }, // previous week — ignored
    ]
    const week = buildWeeklyActivity(rows, now)
    expect(week.map((d) => d.date)).toEqual(['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'])
    expect(week.map((d) => d.xp)).toEqual([45, 0, 0, 100, 20, 0, 0])
    expect(week.find((d) => d.isToday)?.date).toBe('2026-10-23')
    expect(week.filter((d) => d.isFuture).length).toBe(2)
  })

  it('is all zeros (not fake data) for a new learner or bad input', () => {
    expect(buildWeeklyActivity([], now).every((d) => d.xp === 0)).toBe(true)
    expect(buildWeeklyActivity(undefined as any, now).length).toBe(7)
  })
})

describe('buildSkillProgress', () => {
  it('derives percentages from real counts and caps at 100', () => {
    expect(buildSkillProgress({ storiesCompleted: 5, totalStories: 250, kanji: 50, vocab: 400, jlpt: 'N5' })).toEqual({ reading: 2, kanji: 50, vocab: 50 })
    expect(buildSkillProgress({ storiesCompleted: 999, totalStories: 250, kanji: 5000, vocab: 1, jlpt: 'N5' }).reading).toBe(100)
  })
  it('is zero for a brand-new learner', () => {
    expect(buildSkillProgress()).toEqual({ reading: 0, kanji: 0, vocab: 0 })
  })
})
