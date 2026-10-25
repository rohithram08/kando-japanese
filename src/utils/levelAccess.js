// src/utils/levelAccess.js
// ─────────────────────────────────────────────────────────────
// JLPT level access rules (frontend mirror of backend levelService).
// Cumulative unlock: an N3 learner can open N5 + N4 + N3 content.
// ─────────────────────────────────────────────────────────────

export const LEVEL_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1']

export function isValidLevel(level) {
  return LEVEL_ORDER.includes(level)
}

/** Levels the user may open, easiest first. Invalid input falls back to N5. */
export function unlockedLevels(studyLevel) {
  const i = LEVEL_ORDER.indexOf(studyLevel)
  return LEVEL_ORDER.slice(0, (i === -1 ? 0 : i) + 1)
}

export function isLevelUnlocked(studyLevel, target) {
  return unlockedLevels(studyLevel).includes(target)
}

export function nextLevel(level) {
  const i = LEVEL_ORDER.indexOf(level)
  return i >= 0 && i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : null
}

/** Compact label for the unlocked range, e.g. "N5", "N5–N3". */
export function unlockedRangeLabel(studyLevel) {
  const list = unlockedLevels(studyLevel)
  return list.length === 1 ? list[0] : `${list[0]}–${list[list.length - 1]}`
}

/** Level encoded in a content id (n5v001, n3k001, n5_g001, story_n2_07); null if unknown. */
export function levelFromContentId(id) {
  const m = /^(?:story_)?n([1-5])(?![0-9])/i.exec(String(id || '').trim())
  return m ? `N${m[1]}` : null
}
