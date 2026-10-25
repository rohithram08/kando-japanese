import { describe, it, expect, beforeAll, vi } from 'vitest'
import { normalizeAvatarConfig, makeDefaultConfig, humanizeOption, randomSeed, AVATAR_STYLES } from '../avatarConfig'
import {
  renderAvatarDataUri, getStyleControls, applyChoice, currentChoice, randomizeOptions, loadStyle,
} from '../avatarRenderer'

// Styles load on demand; the sync helpers below need them loaded first.
beforeAll(async () => { for (const s of AVATAR_STYLES) await loadStyle(s.id) })

// Must stay in sync with backend/src/services/avatarConfig.ts
const BACKEND_STRING = /^[A-Za-z0-9]{1,40}$/
const BACKEND_KEY = /^[A-Za-z][A-Za-z0-9]{0,39}$/

describe('normalizeAvatarConfig (mirrors the backend validator)', () => {
  const ok = { style: 'lorelei', seed: 'abc-1', options: { hair: 'variant01', hairColor: '2c1b18', glassesProbability: 100 } }

  it('accepts a good recipe and defaults options to {}', () => {
    expect(normalizeAvatarConfig(ok)).toEqual(ok)
    expect(normalizeAvatarConfig({ style: 'avataaars', seed: 'x' })).toEqual({ style: 'avataaars', seed: 'x', options: {} })
  })

  it('rejects non-objects, unknown styles, bad seeds and unsafe option names/values', () => {
    expect(normalizeAvatarConfig(null)).toBeNull()
    expect(normalizeAvatarConfig('x')).toBeNull()
    expect(normalizeAvatarConfig({ ...ok, style: 'bottts' })).toBeNull()
    expect(normalizeAvatarConfig({ ...ok, seed: '<script>' })).toBeNull()
    expect(normalizeAvatarConfig({ ...ok, seed: 'a'.repeat(65) })).toBeNull()
    expect(normalizeAvatarConfig({ ...ok, options: { 'a b': 'x' } })).toBeNull()
    expect(normalizeAvatarConfig({ ...ok, options: { hair: '"><img src=x>' } })).toBeNull()
    expect(normalizeAvatarConfig({ ...ok, options: { p: 101 } })).toBeNull()
    expect(normalizeAvatarConfig({ ...ok, options: { p: 1.5 } })).toBeNull()
    expect(normalizeAvatarConfig({ ...ok, options: Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`k${i}`, 'a'])) })).toBeNull()
  })

  it('makeDefaultConfig is valid and falls back to a known style', () => {
    expect(normalizeAvatarConfig(makeDefaultConfig())).not.toBeNull()
    expect(makeDefaultConfig('nope').style).toBe('avataaars')
    expect(randomSeed()).not.toBe(randomSeed())
  })

  it('humanizes option names', () => {
    expect(humanizeOption('shirtCrewNeck')).toBe('Shirt crew neck')
    expect(humanizeOption('variant03')).toBe('Style 3')
    expect(humanizeOption('winterHat1')).toBe('Winter hat 1')
  })
})

describe.each(AVATAR_STYLES.map((s) => s.id))('avatar style %s', (style) => {
  let controls: ReturnType<typeof getStyleControls> = []
  beforeAll(() => { controls = getStyleControls(style) })

  it('exposes controls read from the style schema', () => {
    expect(controls.length).toBeGreaterThan(4)
    expect(controls.some((c) => c.kind === 'enum')).toBe(true)
    expect(controls.some((c) => c.key === 'backgroundColor')).toBe(true)
  })

  // If any real DiceBear value failed the backend allow-list, saving that avatar would 400.
  it('every selectable value passes the backend character allow-list', () => {
    for (const c of controls) {
      expect(c.key, c.key).toMatch(BACKEND_KEY)
      expect(`${c.key}Probability`).toMatch(BACKEND_KEY)
      for (const v of c.values) expect(v, `${style}.${c.key}`).toMatch(BACKEND_STRING)
    }
  })

  it('renders an SVG data URI, deterministically for the same recipe', () => {
    const cfg = { style, seed: 'kando', options: {} }
    const a = renderAvatarDataUri(cfg)
    expect(a).toMatch(/^data:image\/svg\+xml/)
    expect(renderAvatarDataUri(cfg)).toBe(a)
    expect(renderAvatarDataUri({ ...cfg, seed: 'other' })).not.toBe(a)
  })

  it('every choice of every control produces a valid, renderable recipe', () => {
    for (const c of controls) {
      for (const v of c.values) {
        const cfg = { style, seed: 'kando', options: applyChoice({}, c, v) }
        expect(normalizeAvatarConfig(cfg), `${c.key}=${v}`).not.toBeNull()
        expect(renderAvatarDataUri(cfg)).toMatch(/^data:image\/svg\+xml/)
      }
    }
  })

  it('randomize always yields valid recipes', () => {
    for (let i = 0; i < 25; i++) {
      const cfg = { style, seed: randomSeed(), options: randomizeOptions(style) }
      expect(normalizeAvatarConfig(cfg)).not.toBeNull()
      expect(renderAvatarDataUri(cfg)).not.toBeNull()
    }
  })
})

describe('choice helpers', () => {
  let glasses: ReturnType<typeof getStyleControls>[number]
  beforeAll(() => { glasses = getStyleControls('lorelei').find((c) => c.key === 'glasses')! })

  it('optional controls support "none" via the Probability knob', () => {
    expect(glasses.optional).toBe(true)
    expect(applyChoice({}, glasses, null)).toEqual({ glassesProbability: 0 })
    expect(applyChoice({}, glasses, 'variant01')).toEqual({ glasses: 'variant01', glassesProbability: 100 })
    expect(currentChoice({ glassesProbability: 0 }, glasses)).toBeNull()
    expect(currentChoice({ glasses: 'variant01', glassesProbability: 100 }, glasses)).toBe('variant01')
    expect(currentChoice({}, glasses)).toBeUndefined()
  })

  it('"none" actually removes the feature from the picture', () => {
    const on = renderAvatarDataUri({ style: 'lorelei', seed: 's', options: applyChoice({}, glasses, 'variant01') })
    const off = renderAvatarDataUri({ style: 'lorelei', seed: 's', options: applyChoice({}, glasses, null) })
    expect(on).not.toBe(off)
  })

  // DiceBear needs list options as arrays; a bare string renders a *different* picture.
  it('passes list options to DiceBear as arrays (matches a direct, correct DiceBear call)', async () => {
    const { createAvatar } = await import('@dicebear/core')
    const avataaars = await import('@dicebear/avataaars')
    const expected = createAvatar(avataaars, { seed: 's', top: ['hat'], topProbability: 100, hairColor: ['2c1b18'] }).toDataUri()
    expect(renderAvatarDataUri({ style: 'avataaars', seed: 's', options: { top: 'hat', topProbability: 100, hairColor: '2c1b18' } })).toBe(expected)
  })
})

describe('on-demand style loading', () => {
  it('renders null until a style is loaded, then renders - and leaves the other styles unloaded', async () => {
    vi.resetModules() // fresh module instance => nothing loaded yet
    const fresh = await import('../avatarRenderer')
    const cfg = { style: 'notionists', seed: 'x', options: {} }

    expect(fresh.isStyleLoaded('notionists')).toBe(false)
    expect(fresh.renderAvatarDataUri(cfg)).toBeNull()
    expect(fresh.getStyleControls('notionists')).toEqual([])

    expect(await fresh.renderAvatarDataUriAsync(cfg)).toMatch(/^data:image\/svg\+xml/)
    expect(fresh.isStyleLoaded('notionists')).toBe(true)
    expect(fresh.isStyleLoaded('lorelei')).toBe(false) // the point: one style, not all four
    expect(await fresh.renderAvatarDataUriAsync({ style: 'nope', seed: 'x', options: {} })).toBeNull()
  })
})
