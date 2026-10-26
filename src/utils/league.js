// src/utils/league.js
// Small, pure helpers for the league UI.

/** 3 -> 1 filled pip, 2 -> 2, 1 -> 3: more pips = closer to the top of the league. */
export function stagePips(stage) {
  return Math.min(3, Math.max(1, 4 - Number(stage || 3)))
}

/** "3d 4h", "5h 12m", "9m", "Ended" - for the week countdown. */
export function formatCountdown(secondsLeft) {
  const s = Math.floor(Number(secondsLeft))
  if (!Number.isFinite(s) || s <= 0) return 'Ended'
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${Math.max(1, m)}m`
}

/** English ordinal: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st ... */
export function ordinal(n) {
  const v = Math.abs(Math.floor(Number(n) || 0))
  const mod100 = v % 100
  if (mod100 >= 11 && mod100 <= 13) return `${v}th`
  return `${v}${{ 1: 'st', 2: 'nd', 3: 'rd' }[v % 10] || 'th'}`
}

/**
 * The one-line "what should I do now" message under the league header.
 * Returns { tone: 'good' | 'warn' | 'neutral', key, fallback, params }.
 */
export function leagueStatusMessage(board, rules) {
  if (!board) return null
  const { you } = board
  const min = rules?.minXpToPromote ?? 50
  if (you.zone === 'promotion') {
    if (!you.meetsMinXp) {
      return { tone: 'neutral', key: 'league.status_need_min', fallback: `Earn at least ${min} XP this week to be eligible for promotion.`, params: { min } }
    }
    return { tone: 'good', key: 'league.status_promotion', fallback: "You're in the promotion zone. Keep it up!", params: {} }
  }
  if (you.zone === 'demotion') {
    const xp = you.xpToNextRank ?? 1
    return { tone: 'warn', key: 'league.status_demotion', fallback: `You're in the demotion zone. ${xp} XP to climb a place.`, params: { xp } }
  }
  if (you.xpToPromotion != null) {
    return { tone: 'neutral', key: 'league.status_safe', fallback: `${you.xpToPromotion} XP to reach the promotion zone.`, params: { xp: you.xpToPromotion } }
  }
  return { tone: 'neutral', key: 'league.status_top', fallback: "You're at the top of the ladder. Defend your place!", params: {} }
}
