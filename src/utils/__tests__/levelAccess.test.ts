import { describe, it, expect } from 'vitest'
import {
  LEVEL_ORDER,
  unlockedLevels,
  isLevelUnlocked,
  nextLevel,
  unlockedRangeLabel,
  levelFromContentId,
  isValidLevel,
} from '../levelAccess'
import { KANJI, VOCABULARY, GRAMMAR } from '../../data/index'
import { allStories } from '../../data/reading/n5_stories'

describe('levelAccess', () => {
  it('is cumulative: N5 -> N5, N4 -> N5+N4, N3 -> N5+N4+N3 ...', () => {
    expect(unlockedLevels('N5')).toEqual(['N5'])
    expect(unlockedLevels('N4')).toEqual(['N5', 'N4'])
    expect(unlockedLevels('N3')).toEqual(['N5', 'N4', 'N3'])
    expect(unlockedLevels('N2')).toEqual(['N5', 'N4', 'N3', 'N2'])
    expect(unlockedLevels('N1')).toEqual(LEVEL_ORDER)
  })

  it('falls back to N5 for invalid input', () => {
    expect(unlockedLevels(undefined as unknown as string)).toEqual(['N5'])
    expect(unlockedLevels('N9')).toEqual(['N5'])
    expect(isValidLevel('N9')).toBe(false)
  })

  it('isLevelUnlocked', () => {
    expect(isLevelUnlocked('N5', 'N4')).toBe(false)
    expect(isLevelUnlocked('N3', 'N5')).toBe(true)
    expect(isLevelUnlocked('N3', 'N3')).toBe(true)
    expect(isLevelUnlocked('N3', 'N2')).toBe(false)
  })

  it('nextLevel / range label', () => {
    expect(nextLevel('N5')).toBe('N4')
    expect(nextLevel('N1')).toBeNull()
    expect(unlockedRangeLabel('N5')).toBe('N5')
    expect(unlockedRangeLabel('N3')).toBe('N5–N3')
  })

  it('infers level from content id formats', () => {
    expect(levelFromContentId('n5v001')).toBe('N5')
    expect(levelFromContentId('n3_001')).toBe('N3')
    expect(levelFromContentId('n2g001')).toBe('N2')
    expect(levelFromContentId('story_n4_09')).toBe('N4')
    expect(levelFromContentId('x')).toBeNull()
  })

  // Guards the ID convention the backend relies on to enforce locks.
  it('every real content id maps back to its own level', () => {
    for (const lvl of LEVEL_ORDER) {
      for (const list of [KANJI[lvl], VOCABULARY[lvl], GRAMMAR[lvl]]) {
        for (const item of list as Array<{ id: string }>) {
          expect(levelFromContentId(item.id), item.id).toBe(lvl)
        }
      }
    }
    for (const story of allStories as Array<{ id: string; level: string }>) {
      expect(levelFromContentId(story.id), story.id).toBe(story.level)
    }
  })
})
