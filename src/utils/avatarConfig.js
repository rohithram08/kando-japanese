// src/utils/avatarConfig.js
// ─────────────────────────────────────────────────────────────
// Lightweight (no DiceBear import) helpers for the customizable cartoon avatar.
// A config is a small recipe: { style, seed, options }. It mirrors the backend
// validator in backend/src/services/avatarConfig.ts - keep the two in sync.
//
// Styles: lorelei, openPeeps, notionists are CC0. avataaars (Pablo Stanley) is
// "free for personal and commercial use" via DiceBear.
// ─────────────────────────────────────────────────────────────

export const AVATAR_STYLES = [
  { id: 'avataaars', label: 'Classic' },
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'openPeeps', label: 'Sketch' },
  { id: 'notionists', label: 'Notion' },
]

const STYLE_IDS = AVATAR_STYLES.map((s) => s.id)
const SEED_RE = /^[A-Za-z0-9_-]{1,64}$/
const KEY_RE = /^[A-Za-z][A-Za-z0-9]{0,39}$/
const STR_RE = /^[A-Za-z0-9]{1,40}$/
const MAX_OPTIONS = 24

/** Returns a clean config, or null if `raw` is not a valid recipe. */
export function normalizeAvatarConfig(raw) {
  if (!raw || typeof raw !== 'object') return null
  if (!STYLE_IDS.includes(raw.style)) return null
  if (typeof raw.seed !== 'string' || !SEED_RE.test(raw.seed)) return null
  const options = {}
  const entries = Object.entries(raw.options ?? {})
  if (entries.length > MAX_OPTIONS) return null
  for (const [k, v] of entries) {
    if (!KEY_RE.test(k)) return null
    if (typeof v === 'number') {
      if (!Number.isInteger(v) || v < 0 || v > 100) return null
    } else if (typeof v !== 'string' || !STR_RE.test(v)) {
      return null
    }
    options[k] = v
  }
  return { style: raw.style, seed: raw.seed, options }
}

export function randomSeed() {
  const rand = typeof crypto !== 'undefined' && crypto.getRandomValues
    ? Array.from(crypto.getRandomValues(new Uint32Array(2)), (n) => n.toString(36)).join('')
    : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  return `k${rand}`.slice(0, 24)
}

/** A fresh avatar: the seed alone gives each user a different, stable starting face. */
export function makeDefaultConfig(style = 'avataaars', seed = randomSeed()) {
  return { style: STYLE_IDS.includes(style) ? style : 'avataaars', seed, options: {} }
}

/** "shirtCrewNeck" -> "Shirt crew neck", "variant03" -> "Style 3" */
export function humanizeOption(value) {
  const v = String(value)
  const variant = /^variant0*(\d+)$/i.exec(v)
  if (variant) return `Style ${variant[1]}`
  const spaced = v.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/([0-9])([A-Za-z])/g, '$1 $2')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
}
