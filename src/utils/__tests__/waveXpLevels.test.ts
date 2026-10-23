import { describe, it, expect } from 'vitest'
import {
  getUserLevel,
  getUserLevelProgress,
  getLevelStartXP,
  getXPForLevel,
  calculateStoryQuizXP,
  calculateStoryRewards,
  XP_REWARDS,
} from '../progressCalculator.js'
import {
  getUserLevel as beGetUserLevel,
  getUserLevelProgress as beGetUserLevelProgress,
  calculateStoryRewards as beCalculateStoryRewards,
} from '../../../backend/src/services/progressCalculator'

describe('Wave XP leveling', () => {
  it('uses clearly defined thresholds: level N starts at the sum of the costs of levels 2..N', () => {
    expect([1, 2, 3, 4, 5, 6].map(getLevelStartXP)).toEqual([0, 30, 90, 190, 340, 550])
    expect(getXPForLevel(2)).toBe(30)
    expect(getXPForLevel(3)).toBe(60)
  })

  it('reports the correct level on both sides of every threshold', () => {
    for (let level = 2; level <= 30; level++) {
      const start = getLevelStartXP(level)
      expect(getUserLevel(start - 1)).toBe(level - 1)
      expect(getUserLevel(start)).toBe(level)
    }
  })

  it('keeps displayed progress consistent with the XP balance for every XP value', () => {
    let previousPercent = 0
    let previousLevel = 1
    for (let xp = 0; xp <= 5000; xp++) {
      const p = getUserLevelProgress(xp)
      expect(p.level).toBe(getUserLevel(xp))
      expect(p.xpIntoLevel).toBe(xp - getLevelStartXP(p.level))
      expect(p.xpIntoLevel).toBeGreaterThanOrEqual(0)
      expect(p.xpIntoLevel).toBeLessThan(p.xpForNext) // never "full" before levelling up
      expect(p.xpIntoLevel + p.xpToNext).toBe(p.xpForNext)
      expect(p.percent).toBeGreaterThanOrEqual(0)
      expect(p.percent).toBeLessThanOrEqual(99)
      if (p.level === previousLevel) expect(p.percent).toBeGreaterThanOrEqual(previousPercent)
      else expect(p.xpIntoLevel).toBe(0) // fresh level starts at 0 progress
      previousPercent = p.percent
      previousLevel = p.level
    }
  })

  it('regression: right after levelling up the bar starts empty (it used to show 33% at 30 XP)', () => {
    expect(getUserLevelProgress(30)).toMatchObject({ level: 2, xpIntoLevel: 0, xpForNext: 60, percent: 0 })
    expect(getUserLevelProgress(90)).toMatchObject({ level: 3, xpIntoLevel: 0, xpForNext: 100, percent: 0 })
  })

  it('treats bad input as 0 XP', () => {
    expect(getUserLevelProgress(-5).level).toBe(1)
    expect(getUserLevelProgress(Number.NaN).level).toBe(1)
  })
})

describe('Story Wave XP rewards', () => {
  it('pays story + quiz with a score-proportional bonus', () => {
    expect(calculateStoryQuizXP(0)).toBe(XP_REWARDS.STORY_QUIZ_COMPLETE)
    expect(calculateStoryQuizXP(100)).toBe(XP_REWARDS.STORY_QUIZ_COMPLETE + XP_REWARDS.STORY_QUIZ_BONUS)
    expect(calculateStoryRewards(100)).toEqual({ storyXp: 40, quizXp: 60, total: 100 })
    expect(calculateStoryRewards(0)).toEqual({ storyXp: 40, quizXp: 30, total: 70 })
    expect(calculateStoryRewards(200).total).toBe(100) // clamped
  })

  it('matches the backend exactly (frontend <-> backend parity)', () => {
    for (let score = 0; score <= 100; score += 5) {
      expect(calculateStoryRewards(score)).toEqual(beCalculateStoryRewards(score))
    }
    for (const xp of [0, 29, 30, 89, 90, 1234, 99999]) {
      expect(getUserLevel(xp)).toBe(beGetUserLevel(xp))
      expect(getUserLevelProgress(xp)).toEqual(beGetUserLevelProgress(xp))
    }
  })
})
