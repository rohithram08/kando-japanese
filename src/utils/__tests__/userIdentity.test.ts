import { describe, it, expect } from 'vitest'
import { normalizeProfile, resolveAvatarUrl, getAvatarDescriptor, validateUsername, getInitial } from '../userIdentity.js'

describe('normalizeProfile — camelCase API model and legacy snake_case', () => {
  it('reads the camelCase fields the API really returns (the navbar used to read only snake_case and never showed the avatar)', () => {
    const p = normalizeProfile({ username: 'rohith', email: 'r@x.com', avatarId: 'avatar-1', avatarUrl: null, currentLevel: 'N4', xpPoints: 732, streakDays: 2 })
    expect(p).toMatchObject({ username: 'rohith', avatarId: 'avatar-1', jlptLevel: 'N4', xp: 732, streak: 2 })
  })
  it('still understands snake_case records', () => {
    const p = normalizeProfile({ username: 'r', avatar_id: 'avatar-3', avatar_url: '/storage/avatars/u/a.png', current_level: 'N3', xp_points: 5, streak_days: 1 })
    expect(p).toMatchObject({ avatarId: 'avatar-3', avatarUrl: '/api/storage/avatars/u/a.png', jlptLevel: 'N3', xp: 5, streak: 1 })
  })
  it('falls back safely for missing/guest data and never derives a name from the email', () => {
    expect(normalizeProfile(null, null).username).toBe('Learner')
    expect(normalizeProfile({ email: 'secret@mail.com' }).username).toBe('Learner')
  })
})

describe('resolveAvatarUrl — uploaded avatars must be reachable', () => {
  it('serves /storage/... through the API base (the dev server only proxies /api)', () => {
    expect(resolveAvatarUrl('/storage/avatars/u1/a.png')).toBe('/api/storage/avatars/u1/a.png')
  })
  it('leaves absolute, data and blob URLs alone', () => {
    expect(resolveAvatarUrl('https://cdn.x/a.png')).toBe('https://cdn.x/a.png')
    expect(resolveAvatarUrl('data:image/png;base64,AAA')).toBe('data:image/png;base64,AAA')
    expect(resolveAvatarUrl('blob:http://localhost/1')).toBe('blob:http://localhost/1')
    expect(resolveAvatarUrl(null)).toBeNull()
  })
})

describe('getAvatarDescriptor', () => {
  it('prefers an uploaded photo, then a preset emoji, then the initial', () => {
    expect(getAvatarDescriptor({ avatarUrl: '/storage/avatars/u/a.png', avatarId: 'avatar-1', username: 'rohith' }).type).toBe('image')
    expect(getAvatarDescriptor({ avatarId: 'avatar-1', username: 'rohith' })).toMatchObject({ type: 'emoji', emoji: '🥷' })
    expect(getAvatarDescriptor({ username: 'rohith' })).toEqual({ type: 'initial', letter: 'R' })
  })
  it('uses a flag emoji that renders on Windows (🎌, not 🇯🇵 which shows as "JP")', () => {
    expect(getAvatarDescriptor({ avatarId: 'avatar-2' })).toMatchObject({ emoji: '🎌' })
  })
  it('handles non-Latin initials', () => {
    expect(getInitial('さくら')).toBe('さ')
  })
})

describe('validateUsername', () => {
  it('accepts normal handles incl. other scripts', () => {
    for (const ok of ['rohith', 'rohith_ram', 'Rohith.R-1', 'さくら', 'ரோகித்']) expect(validateUsername(ok)).toBeNull()
  })
  it('rejects empty, short, long and invalid characters', () => {
    expect(validateUsername('')?.key).toBe('toast.name_required')
    expect(validateUsername('ab')?.key).toBe('settings.username_too_short')
    expect(validateUsername('a'.repeat(31))?.key).toBe('settings.username_too_long')
    expect(validateUsername('rohith ram')?.key).toBe('settings.username_invalid')
    expect(validateUsername('rohith@mail.com')?.key).toBe('settings.username_invalid')
  })
})
