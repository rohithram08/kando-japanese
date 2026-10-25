// src/utils/avatarRenderer.js
// ─────────────────────────────────────────────────────────────
// The ONLY module that imports DiceBear. Everything that needs it loads this file
// with a dynamic import() so the avatar library stays out of the main bundle.
// ─────────────────────────────────────────────────────────────

import { createAvatar } from '@dicebear/core'
import { normalizeAvatarConfig } from './avatarConfig'
// Styles are 300-500 kB each, so each is loaded on demand: someone with a "Classic" avatar
// downloads only that style, never the other three.
const STYLE_LOADERS = {
  avataaars: () => import('@dicebear/avataaars'),
  lorelei: () => import('@dicebear/lorelei'),
  openPeeps: () => import('@dicebear/open-peeps'),
  notionists: () => import('@dicebear/notionists'),
}
const STYLES = {} // id -> loaded style definition
const pending = {}

export function isStyleLoaded(id) {
  return Boolean(STYLES[id])
}

/** Loads a style once; resolves to true when it is ready (false for unknown styles). */
export function loadStyle(id) {
  if (STYLES[id]) return Promise.resolve(true)
  const loader = STYLE_LOADERS[id]
  if (!loader) return Promise.resolve(false)
  pending[id] ??= loader().then((mod) => { STYLES[id] = mod; return true })
  return pending[id]
}

const cache = new Map()

/** DiceBear wants arrays for list-type options (a bare string renders differently!). */
function toDiceBearOptions(config) {
  const out = { seed: config.seed }
  for (const [k, v] of Object.entries(config.options)) out[k] = typeof v === 'number' ? v : [v]
  return out
}

/** Loads the config's style if needed, then renders. Resolves to null for invalid configs. */
export async function renderAvatarDataUriAsync(rawConfig) {
  const config = normalizeAvatarConfig(rawConfig)
  if (!config || !(await loadStyle(config.style))) return null
  return renderAvatarDataUri(config)
}

/**
 * SVG data URI for a config, or null if the config is invalid OR its style has not been
 * loaded yet (use renderAvatarDataUriAsync / loadStyle first). Cached.
 */
export function renderAvatarDataUri(rawConfig) {
  const config = normalizeAvatarConfig(rawConfig)
  if (!config || !STYLES[config.style]) return null
  const key = JSON.stringify(config)
  const hit = cache.get(key)
  if (hit) return hit
  const uri = createAvatar(STYLES[config.style], toDiceBearOptions(config)).toDataUri()
  if (cache.size > 300) cache.clear()
  cache.set(key, uri)
  return uri
}

// Which options the creator exposes, per style (curated: the full schemas have ~20 knobs each).
const CONTROLS = {
  avataaars: [
    ['top', 'Hair'], ['hairColor', 'Hair colour'], ['skinColor', 'Skin'], ['eyes', 'Eyes'], ['eyebrows', 'Brows'],
    ['mouth', 'Mouth'], ['facialHair', 'Beard'], ['accessories', 'Glasses'], ['clothing', 'Outfit'],
    ['clothesColor', 'Outfit colour'], ['backgroundColor', 'Background'],
  ],
  lorelei: [
    ['hair', 'Hair'], ['hairColor', 'Hair colour'], ['skinColor', 'Skin'], ['eyes', 'Eyes'], ['eyebrows', 'Brows'],
    ['mouth', 'Mouth'], ['glasses', 'Glasses'], ['earrings', 'Earrings'], ['backgroundColor', 'Background'],
  ],
  openPeeps: [
    ['head', 'Hair'], ['face', 'Face'], ['facialHair', 'Beard'], ['accessories', 'Glasses'], ['skinColor', 'Skin'],
    ['clothingColor', 'Outfit colour'], ['backgroundColor', 'Background'],
  ],
  notionists: [
    ['hair', 'Hair'], ['eyes', 'Eyes'], ['brows', 'Brows'], ['lips', 'Mouth'], ['glasses', 'Glasses'],
    ['beard', 'Beard'], ['backgroundColor', 'Background'],
  ],
}

const BACKGROUNDS = ['transparent', 'b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf', 'fde68a', 'bbf7d0']

/**
 * Describes the creator's controls for a style, read from the style's own schema:
 *   { key, label, kind: 'enum' | 'color', values: string[], optional: boolean }
 * `optional` means a `<key>Probability` knob exists, so "none" is a valid choice.
 */
export function getStyleControls(styleId) {
  const style = STYLES[styleId]
  if (!style) return [] // not loaded yet
  const props = style.schema.properties
  const controls = []
  for (const [key, label] of CONTROLS[styleId] ?? []) {
    const spec = props[key]
    if (key === 'backgroundColor') {
      controls.push({ key, label, kind: 'color', values: BACKGROUNDS, optional: false })
      continue
    }
    if (!spec) continue
    const enumValues = spec.items?.enum ?? spec.enum
    if (enumValues) {
      controls.push({ key, label, kind: 'enum', values: enumValues, optional: Boolean(props[`${key}Probability`]) })
    } else if (Array.isArray(spec.default)) {
      controls.push({ key, label, kind: 'color', values: spec.default.filter((c) => /^[0-9a-fA-F]{6}$/.test(c)), optional: false })
    }
  }
  return controls
}

/** Returns a new options object with `key` set to `value` (null = "none" for optional controls). */
export function applyChoice(options, control, value) {
  const next = { ...options }
  const probKey = `${control.key}Probability`
  if (value === null) {
    delete next[control.key]
    next[probKey] = 0
  } else {
    next[control.key] = value
    if (control.optional) next[probKey] = 100
  }
  return next
}

/** What is currently selected for a control: a value, null (none) or undefined (style default). */
export function currentChoice(options, control) {
  const probKey = `${control.key}Probability`
  if (control.optional && options[probKey] === 0) return null
  return options[control.key]
}

/** A random but tasteful avatar for the "Surprise me" button. */
export function randomizeOptions(styleId, rng = Math.random) {
  const options = {}
  for (const control of getStyleControls(styleId)) {
    if (control.key === 'backgroundColor') continue
    if (control.optional && rng() < 0.55) {
      options[`${control.key}Probability`] = 0
      continue
    }
    const v = control.values[Math.floor(rng() * control.values.length)]
    if (v !== undefined) Object.assign(options, applyChoice({}, control, v))
  }
  return options
}
