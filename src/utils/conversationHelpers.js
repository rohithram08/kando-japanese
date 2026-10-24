// src/utils/conversationHelpers.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers behind the Conversation hub: lock rules, recommendations,
// "continue where you left off", filtering and formatting. No React in here so
// everything is unit-testable.
// ─────────────────────────────────────────────────────────────────────────────

export const COMPLETED_KEY = 'nihongo_completed_scenarios'
export const scenarioCacheKey = (id) => `nihongo_conv_scenario_${id}`
export const freeCacheKey = (level) => `nihongo_conv_free_${level}`

// Scenarios flagged `locked` used to stay locked forever (nothing ever unlocked
// them). They now open after the learner has finished this many scenarios.
export const SCENARIO_UNLOCK_AFTER = 5

export const isScenarioLocked = (scenario, completedCount = 0) =>
  Boolean(scenario?.locked) && completedCount < SCENARIO_UNLOCK_AFTER

const LEVEL_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1']

/** Scenarios to suggest: not done, not locked, closest to the learner's level first. */
export function getRecommendedScenarios(scenarios, { level = 'N5', completedIds = [], limit = 3 } = {}) {
  const done = new Set(completedIds)
  const base = Math.max(0, LEVEL_ORDER.indexOf(level))
  const distance = (sc) => {
    const i = LEVEL_ORDER.indexOf(sc.jlptLevel)
    // current level first, then one step up (a stretch), then easier levels
    return i === base ? 0 : i === base + 1 ? 1 : i < base ? 2 + (base - i) : 3 + (i - base)
  }
  return scenarios
    .map((sc, index) => ({ sc, index }))
    .filter(({ sc }) => !done.has(sc.id) && !isScenarioLocked(sc, completedIds.length))
    .sort((a, b) => distance(a.sc) - distance(b.sc) || a.index - b.index)
    .slice(0, limit)
    .map(({ sc }) => sc)
}

export function filterScenarios(scenarios, { query = '', category = 'All', difficulty = 'All' } = {}) {
  const q = query.trim().toLowerCase()
  return scenarios.filter((sc) => {
    if (category !== 'All' && sc.category !== category) return false
    if (difficulty !== 'All' && sc.difficulty !== difficulty) return false
    if (!q) return true
    return (
      sc.title.toLowerCase().includes(q) ||
      (sc.titleJP || '').includes(query.trim()) ||
      (sc.description || '').toLowerCase().includes(q) ||
      (sc.tags || []).some((t) => t.toLowerCase().includes(q))
    )
  })
}

export function countByCategory(scenarios) {
  const counts = { All: scenarios.length }
  for (const sc of scenarios) counts[sc.category] = (counts[sc.category] || 0) + 1
  return counts
}

function readMessages(storage, key) {
  try {
    const raw = storage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Saved conversations that have real back-and-forth (more than the opening
 * greeting), newest first — powers the "Continue" card.
 */
export function readSavedConversations(scenarios, levels = LEVEL_ORDER, storage = globalThis.localStorage) {
  if (!storage) return []
  const out = []
  const lastAt = (messages) => {
    const t = new Date(messages[messages.length - 1]?.timestamp || 0).getTime()
    return Number.isFinite(t) ? t : 0
  }
  for (const scenario of scenarios) {
    const messages = readMessages(storage, scenarioCacheKey(scenario.id))
    if (messages.length > 1) out.push({ kind: 'scenario', scenario, count: messages.length, lastAt: lastAt(messages) })
  }
  for (const level of levels) {
    const messages = readMessages(storage, freeCacheKey(level))
    if (messages.length > 1) out.push({ kind: 'free', level, count: messages.length, lastAt: lastAt(messages) })
  }
  return out.sort((a, b) => b.lastAt - a.lastAt)
}

export const formatDuration = (secs = 0) => {
  const s = Math.max(0, Math.floor(secs))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

/** "Introduce yourself with: 私は〜です" → { label: 'Introduce yourself with', phrase: '私は〜です' } */
export function splitHint(hint = '') {
  const idx = hint.indexOf(':')
  if (idx === -1) return { label: '', phrase: hint.trim() }
  return { label: hint.slice(0, idx).trim(), phrase: hint.slice(idx + 1).trim() }
}
