import { describe, it, expect } from 'vitest'
import {
  isScenarioLocked, SCENARIO_UNLOCK_AFTER, getRecommendedScenarios, filterScenarios,
  countByCategory, readSavedConversations, formatDuration, splitHint,
} from '../conversationHelpers.js'

const S = (id: string, over: any = {}) => ({ id, title: id.toUpperCase(), titleJP: '', description: '', tags: [], category: 'Basics', difficulty: 'beginner', jlptLevel: 'N5', locked: false, ...over })
const scenarios = [
  S('a', { jlptLevel: 'N5' }), S('b', { jlptLevel: 'N4' }), S('c', { jlptLevel: 'N3', locked: true }),
  S('d', { jlptLevel: 'N5', category: 'Travel', difficulty: 'intermediate', tags: ['train'], title: 'Taking the Train', titleJP: '電車' }),
]

describe('scenario locking', () => {
  it('locked scenarios open after enough completions (they used to stay locked forever)', () => {
    expect(isScenarioLocked(scenarios[2], 0)).toBe(true)
    expect(isScenarioLocked(scenarios[2], SCENARIO_UNLOCK_AFTER - 1)).toBe(true)
    expect(isScenarioLocked(scenarios[2], SCENARIO_UNLOCK_AFTER)).toBe(false)
    expect(isScenarioLocked(scenarios[0], 0)).toBe(false)
  })
})

describe('getRecommendedScenarios', () => {
  it('prefers the learner level, then one level up, skips done and locked', () => {
    expect(getRecommendedScenarios(scenarios, { level: 'N5', completedIds: [] }).map((s) => s.id)).toEqual(['a', 'd', 'b'])
    expect(getRecommendedScenarios(scenarios, { level: 'N5', completedIds: ['a'] }).map((s) => s.id)).toEqual(['d', 'b'])
    expect(getRecommendedScenarios(scenarios, { level: 'N4', completedIds: [], limit: 1 }).map((s) => s.id)).toEqual(['b'])
  })
  it('includes unlocked ones once unlocked', () => {
    const ids = getRecommendedScenarios(scenarios, { level: 'N3', completedIds: ['x1', 'x2', 'x3', 'x4', 'x5'] }).map((s) => s.id)
    expect(ids[0]).toBe('c')
  })
})

describe('filterScenarios / countByCategory', () => {
  it('filters by text (title, Japanese title, tags), category and difficulty', () => {
    expect(filterScenarios(scenarios, { query: 'train' }).map((s) => s.id)).toEqual(['d'])
    expect(filterScenarios(scenarios, { query: '電車' }).map((s) => s.id)).toEqual(['d'])
    expect(filterScenarios(scenarios, { category: 'Travel' }).length).toBe(1)
    expect(filterScenarios(scenarios, { difficulty: 'intermediate' }).length).toBe(1)
    expect(filterScenarios(scenarios, { query: 'zzz' })).toEqual([])
  })
  it('counts per category incl. All', () => {
    expect(countByCategory(scenarios)).toEqual({ All: 4, Basics: 3, Travel: 1 })
  })
})

describe('readSavedConversations', () => {
  const mem = (data: Record<string, any>) => ({ getItem: (k: string) => (k in data ? JSON.stringify(data[k]) : null) }) as any
  const msg = (t: string) => ({ role: 'user', content: 'x', timestamp: t })
  it('lists conversations with real back-and-forth, newest first, ignoring a lone greeting and bad JSON', () => {
    const storage = mem({
      nihongo_conv_scenario_a: [msg('2026-10-20T10:00:00Z'), msg('2026-10-20T10:05:00Z')],
      nihongo_conv_scenario_b: [msg('2026-10-22T10:00:00Z')], // greeting only → ignored
      nihongo_conv_scenario_d: [msg('2026-10-21T10:00:00Z'), msg('2026-10-21T10:01:00Z'), msg('2026-10-21T10:02:00Z')],
      nihongo_conv_free_N5: [msg('2026-10-23T09:00:00Z'), msg('2026-10-23T09:02:00Z')],
    })
    const out = readSavedConversations(scenarios, ['N5', 'N4'], storage)
    expect(out.map((o: any) => (o.kind === 'free' ? `free:${o.level}` : o.scenario.id))).toEqual(['free:N5', 'd', 'a'])
    expect(out[1].count).toBe(3)
    const broken = { getItem: () => '{not json' } as any
    expect(readSavedConversations(scenarios, ['N5'], broken)).toEqual([])
  })
})

describe('small formatters', () => {
  it('formats durations and splits hints', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(125)).toBe('2:05')
    expect(splitHint('Introduce yourself with: 私は〜です')).toEqual({ label: 'Introduce yourself with', phrase: '私は〜です' })
    expect(splitHint('こんにちは')).toEqual({ label: '', phrase: 'こんにちは' })
  })
})
