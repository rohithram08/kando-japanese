// src/hooks/useStudyLevel.js
// ─────────────────────────────────────────────────────────────
// Single frontend entry point for "which JLPT levels may this user open?".
//
// Source of truth, in order:
//   1. profile.studyLevel  (server for signed-in users, local profile for guests)
//   2. settings.jlptLevel  (legacy "target level" — keeps existing guests working)
//   3. 'N5'
//
// Note: profile.currentLevel is an XP-derived rank and is NOT used for access.
// ─────────────────────────────────────────────────────────────

import { useCallback, useMemo, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { isValidLevel, unlockedLevels, isLevelUnlocked, nextLevel } from '../utils/levelAccess'

export function useStudyLevel() {
  const profileLevel = useAuthStore((s) => s.profile?.studyLevel)
  const legacyLevel = useSettingsStore((s) => s.jlptLevel)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  const studyLevel = isValidLevel(profileLevel) ? profileLevel : isValidLevel(legacyLevel) ? legacyLevel : 'N5'
  const unlocked = useMemo(() => unlockedLevels(studyLevel), [studyLevel])

  const setStudyLevel = useCallback(
    async (level) => {
      if (!isValidLevel(level)) return
      await updateProfile({ studyLevel: level })
      updateSettings?.({ jlptLevel: level }) // keep legacy consumers in sync
    },
    [updateProfile, updateSettings],
  )

  return {
    studyLevel,
    unlocked,
    isUnlocked: (level) => isLevelUnlocked(studyLevel, level),
    nextLevel: nextLevel(studyLevel),
    setStudyLevel,
  }
}

/**
 * Drop-in replacement for `useState(targetLevel || 'N5')` on content pages.
 * The returned level is always one the user has unlocked, even if the stored
 * selection becomes invalid (e.g. user lowers their study level).
 */
export function useLevelState() {
  const access = useStudyLevel()
  const [picked, setPicked] = useState(access.studyLevel)
  const level = access.unlocked.includes(picked) ? picked : access.studyLevel
  return [level, setPicked, access]
}
