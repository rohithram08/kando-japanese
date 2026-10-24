// src/utils/userIdentity.js
// ─────────────────────────────────────────────────────────────────────────────
// One place that knows how a user's identity is shaped, so the navbar, sidebar,
// profile page and settings can never disagree again.
//
//  • The API/User model is camelCase (avatarUrl, avatarId, xpPoints …) but several
//    screens read snake_case (avatar_url, xp_points …) — which silently returned
//    undefined (e.g. the navbar never showed the chosen avatar). `normalizeProfile`
//    accepts both.
//  • Uploaded avatars are stored as "/storage/avatars/<user>/<file>". The Vite dev
//    server (and most reverse proxies) only forward "/api", so that URL returned
//    index.html → a broken image. `resolveAvatarUrl` serves it through the API base.
// ─────────────────────────────────────────────────────────────────────────────

import { getAvatarPreset } from '../data/avatarData'

const API_BASE = String(import.meta.env?.VITE_API_URL || '/api').replace(/\/+$/, '')

export function resolveAvatarUrl(url) {
  if (!url || typeof url !== 'string') return null
  if (/^(data:|blob:|https?:\/\/)/i.test(url)) return url
  if (url.startsWith('/storage/')) return `${API_BASE}${url}`
  return url
}

const pick = (obj, ...keys) => {
  for (const k of keys) if (obj?.[k] !== undefined && obj?.[k] !== null && obj?.[k] !== '') return obj[k]
  return null
}

export function normalizeProfile(profile, fallbackUser) {
  const src = profile || fallbackUser || {}
  const username = String(pick(src, 'username') ?? pick(fallbackUser, 'username') ?? '').trim()
  return {
    id: pick(src, 'id'),
    email: pick(src, 'email') ?? pick(fallbackUser, 'email'),
    username: username || 'Learner',
    hasUsername: Boolean(username),
    avatarId: pick(src, 'avatarId', 'avatar_id'),
    avatarUrl: resolveAvatarUrl(pick(src, 'avatarUrl', 'avatar_url')),
    jlptLevel: pick(src, 'currentLevel', 'current_level') || 'N5',
    xp: Number(pick(src, 'xpPoints', 'xp_points')) || 0,
    streak: Number(pick(src, 'streakDays', 'streak_days')) || 0,
    createdAt: pick(src, 'createdAt', 'created_at'),
  }
}

/** What to draw for this user: { type: 'image' | 'emoji' | 'initial', ... } */
export function getAvatarDescriptor({ avatarUrl, avatarId, username } = {}) {
  const url = resolveAvatarUrl(avatarUrl)
  if (url) return { type: 'image', src: url }
  const preset = getAvatarPreset(avatarId)
  if (preset) return { type: 'emoji', emoji: preset.emoji, bg: preset.bg, label: preset.label }
  return { type: 'initial', letter: getInitial(username) }
}

export function getInitial(name) {
  const ch = Array.from(String(name || '').trim())[0]
  return (ch || 'U').toUpperCase()
}

// Username rules: 3–30 chars; letters (any script), numbers, "_", ".", "-" — no spaces.
export const USERNAME_MIN = 3
export const USERNAME_MAX = 30
const USERNAME_RE = /^[\p{L}\p{M}\p{N}_.-]+$/u // \p{M}: Tamil/Hindi vowel signs and virama are combining marks

/** Returns null when valid, otherwise an i18n key + fallback describing the problem. */
export function validateUsername(value) {
  const v = String(value ?? '').trim()
  if (!v) return { key: 'toast.name_required', fallback: 'Username cannot be empty' }
  if (v.length < USERNAME_MIN) return { key: 'settings.username_too_short', fallback: `Username must be at least ${USERNAME_MIN} characters`, params: { min: USERNAME_MIN } }
  if (v.length > USERNAME_MAX) return { key: 'settings.username_too_long', fallback: `Username can be at most ${USERNAME_MAX} characters`, params: { max: USERNAME_MAX } }
  if (!USERNAME_RE.test(v)) return { key: 'settings.username_invalid', fallback: 'Use letters, numbers, "_", "." or "-" only (no spaces)' }
  return null
}
