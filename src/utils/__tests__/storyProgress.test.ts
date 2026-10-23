import { describe, it, expect } from 'vitest'
import { summarizeReadingProgress } from '../storyProgress.js'

const stories = [
  { id: 's1', title: 'One', englishTitle: 'One', level: 'N5', sentences: new Array(8).fill({}) },
  { id: 's2', title: 'Two', englishTitle: 'Two', level: 'N5', sentences: new Array(8).fill({}) },
  { id: 's3', title: 'Three', englishTitle: 'Three', level: 'N4', sentences: new Array(10).fill({}) },
]

describe('summarizeReadingProgress', () => {
  it('is all zeros for a brand-new learner (nothing hard-coded)', () => {
    const s = summarizeReadingProgress({}, stories)
    expect(s).toMatchObject({ totalStories: 3, completedCount: 0, quizzesCompleted: 0, avgScore: null, bestScore: null, current: null })
    expect(s.recent).toEqual([])
  })

  it('derives completed stories, quiz performance and the current story from saved progress', () => {
    const progressMap = {
      s1: { storyId: 's1', status: 'completed', quizScore: 100, completedAt: '2026-10-20T10:00:00Z', lastSentenceIndex: 7 },
      s2: { storyId: 's2', status: 'completed', quizScore: 60, completedAt: '2026-10-21T10:00:00Z', lastSentenceIndex: 7 },
      s3: { storyId: 's3', status: 'in_progress', quizScore: 0, updatedAt: '2026-10-22T08:00:00Z', lastSentenceIndex: 4 },
      ghost: { storyId: 'not-in-catalogue', status: 'completed', quizScore: 10 },
    }
    const s = summarizeReadingProgress(progressMap, stories)
    expect(s.completedCount).toBe(2)
    expect(s.quizzesCompleted).toBe(2)
    expect(s.avgScore).toBe(80)
    expect(s.bestScore).toBe(100)
    expect(s.current?.story.id).toBe('s3')
    expect(s.current).toMatchObject({ sentenceNumber: 5, totalSentences: 10 })
    expect(s.recent.map((r) => r.story.id)).toEqual(['s2', 's1']) // most recent first
  })

  it('does not call an untouched story "currently reading"', () => {
    const s = summarizeReadingProgress({ s1: { storyId: 's1', status: 'in_progress', lastSentenceIndex: 0 } }, stories)
    expect(s.current).toBeNull()
  })

  it('counts a failed quiz as completed (streak/progress rules) but keeps the real score', () => {
    const s = summarizeReadingProgress({ s1: { storyId: 's1', status: 'completed', quizScore: 0, completedAt: '2026-10-22T00:00:00Z' } }, stories)
    expect(s.quizzesCompleted).toBe(1)
    expect(s.avgScore).toBe(0)
  })
})
