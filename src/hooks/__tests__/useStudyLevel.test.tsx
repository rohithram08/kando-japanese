import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStudyLevel, useLevelState } from '../useStudyLevel'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'

const setProfile = (studyLevel?: string, currentLevel = 'N1') =>
  useAuthStore.setState({ profile: { id: 'u', currentLevel, studyLevel } as never })

describe('useStudyLevel', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, profile: null })
    useSettingsStore.setState({ jlptLevel: 'N5' } as never)
  })

  it('uses profile.studyLevel, ignoring the XP-derived currentLevel', () => {
    setProfile('N4', 'N1')
    const { result } = renderHook(() => useStudyLevel())
    expect(result.current.studyLevel).toBe('N4')
    expect(result.current.unlocked).toEqual(['N5', 'N4'])
    expect(result.current.isUnlocked('N3')).toBe(false)
  })

  it('falls back to the legacy settings level, then N5', () => {
    useSettingsStore.setState({ jlptLevel: 'N3' } as never)
    expect(renderHook(() => useStudyLevel()).result.current.unlocked).toEqual(['N5', 'N4', 'N3'])
    useSettingsStore.setState({ jlptLevel: 'bogus' } as never)
    expect(renderHook(() => useStudyLevel()).result.current.studyLevel).toBe('N5')
  })

  it('useLevelState never returns a locked level, even after the user lowers their level', () => {
    setProfile('N3')
    const { result } = renderHook(() => useLevelState())
    act(() => result.current[1]('N3'))
    expect(result.current[0]).toBe('N3')
    act(() => setProfile('N5'))
    expect(result.current[0]).toBe('N5')
  })
})
