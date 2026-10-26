import { describe, it, expect } from 'vitest'
import { stagePips, formatCountdown, ordinal, leagueStatusMessage } from '../league'

describe('league helpers', () => {
  it('stage pips: III=1, II=2, I=3 (more pips = closer to the top of the league)', () => {
    expect([3, 2, 1].map(stagePips)).toEqual([1, 2, 3])
    // not a valid stage -> treated as the entry stage (1 pip) rather than showing a misleading badge
    expect(stagePips(undefined)).toBe(1)
    expect(stagePips(0)).toBe(1)
  })

  it('formats the week countdown', () => {
    expect(formatCountdown(3 * 86400 + 4 * 3600 + 59)).toBe('3d 4h')
    expect(formatCountdown(5 * 3600 + 12 * 60)).toBe('5h 12m')
    expect(formatCountdown(9 * 60)).toBe('9m')
    expect(formatCountdown(20)).toBe('1m')
    expect(formatCountdown(0)).toBe('Ended')
    expect(formatCountdown(-5)).toBe('Ended')
    expect(formatCountdown(Number.NaN)).toBe('Ended')
  })

  it('ordinals, including the 11-13 exceptions', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101, 111].map(ordinal)).toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '101st', '111th'])
  })

  describe('leagueStatusMessage', () => {
    const rules = { minXpToPromote: 50 }
    const board = (you: Record<string, unknown>) => ({ you: { rank: 5, xp: 100, zone: 'safe', xpToNextRank: 10, xpToPromotion: 40, meetsMinXp: true, ...you } })

    it('promotion zone with enough XP is encouraging; without it explains the minimum', () => {
      expect(leagueStatusMessage(board({ zone: 'promotion' }), rules)).toMatchObject({ tone: 'good', key: 'league.status_promotion' })
      expect(leagueStatusMessage(board({ zone: 'promotion', meetsMinXp: false }), rules)).toMatchObject({ tone: 'neutral', key: 'league.status_need_min', params: { min: 50 } })
    })
    it('demotion zone warns and says how far to climb', () => {
      expect(leagueStatusMessage(board({ zone: 'demotion', xpToNextRank: 7 }), rules)).toMatchObject({ tone: 'warn', params: { xp: 7 } })
    })
    it('safe zone shows the gap to promotion; the top rung has none', () => {
      expect(leagueStatusMessage(board({}), rules)).toMatchObject({ key: 'league.status_safe', params: { xp: 40 } })
      expect(leagueStatusMessage(board({ xpToPromotion: null }), rules)).toMatchObject({ key: 'league.status_top' })
    })
    it('returns null without a board', () => expect(leagueStatusMessage(null, rules)).toBeNull())
  })
})
