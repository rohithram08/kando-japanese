// src/utils/league.js
// Small, pure helpers for the league UI.

export const LEAGUES = [
  { id: 'wakaba', name: 'Wakaba', jp: '若葉', color: '#84cc16', gradient: 'from-lime-500 to-emerald-600', badge: 'bg-lime-500/15 text-lime-700 dark:text-lime-400' },
  { id: 'take',   name: 'Take',   jp: '竹',   color: '#10b981', gradient: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  { id: 'ume',    name: 'Ume',    jp: '梅',   color: '#a855f7', gradient: 'from-purple-500 to-indigo-600', badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-400' },
  { id: 'sakura', name: 'Sakura', jp: '桜',   color: '#f472b6', gradient: 'from-pink-500 to-rose-600', badge: 'bg-pink-500/15 text-pink-700 dark:text-pink-400' },
  { id: 'fuji',   name: 'Fuji',   jp: '富士', color: '#f59e0b', gradient: 'from-amber-500 to-yellow-600', badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' },
]

export const STAGES_PER_LEAGUE = 3
export const RUNG_COUNT = LEAGUES.length * STAGES_PER_LEAGUE // 15
export const TOP_RUNG = RUNG_COUNT - 1

const ROMAN = { 3: 'III', 2: 'II', 1: 'I' }

export function getRungDetails(rungIndex = 0) {
  const i = Math.min(Math.max(0, Math.floor(Number(rungIndex) || 0)), TOP_RUNG)
  const leagueIndex = Math.min(Math.floor(i / STAGES_PER_LEAGUE), LEAGUES.length - 1)
  const stage = (STAGES_PER_LEAGUE - (i % STAGES_PER_LEAGUE))
  const league = LEAGUES[leagueIndex]
  return {
    index: i,
    leagueIndex,
    league,
    stage,
    label: `${league.name} ${ROMAN[stage] || stage}`,
  }
}

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
