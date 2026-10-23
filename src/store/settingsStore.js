// src/store/settingsStore.js
//
// Single, global, persisted source of truth for every app preference shown
// on the Settings page. Previously these lived only in SettingsPage's local
// React state — saved to localStorage on "Save", but never actually read
// by anything else in the app, so toggles looked functional but did
// nothing. Now any component can `useSettingsStore()` and get the user's
// real, current preference.
//
// Side-effecting settings (animations, compact mode, font size) are applied
// to <html> the same way themeStore applies the dark class, so they take
// effect immediately and globally without every component needing to read
// the store directly.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeLocale, applyLocaleDirection } from '../i18n/languageUtils'

export const VALID_READER_SPEEDS = [0.8, 1.0, 1.2]

export function sanitizeReaderSpeed(speed) {
  const num = Number(speed)
  return VALID_READER_SPEEDS.includes(num) ? num : 1.0
}

export function sanitizeLanguage(lang) {
  if (!lang || typeof lang !== 'string') return 'en'
  return normalizeLocale(lang)
}

const DEFAULT_SETTINGS = {
  // General
  jlptLevel: 'N5',           // personal target level — used to default Lessons/Grammar/Vocab/Kanji to the right level
  displayLanguage: 'en',     // UI interface language code: 'en' | 'ta' | 'hi' | 'es', etc.
  explanationLanguage: 'en', // Learning support & explanation language for curriculum and AI Sensei
  nativeLanguage: 'en',      // User's mother tongue (demographic & profile)
  // Appearance
  fontSize: 'medium',        // 'small' | 'medium' | 'large'
  compactMode: false,
  animations: true,
  romaji: false,
  furigana: true,
  furiganaMode: 'adaptive',   // 'adaptive' | 'always' | 'reveal' | 'off'
  // Study
  dailyGoal: 10,              // daily XP target shown on the Dashboard
  autoPlay: true,             // auto-play vocab audio during Lessons specifically
  showTranslation: true,
  srsInterval: 'balanced',    // 'relaxed' | 'balanced' | 'intense' — multiplies SRS interval_days
  // Notifications
  dailyReminder: false,
  reminderTime: '09:00',
  streakAlert: true,
  achievementAlert: true,
  weeklyReport: false,
  // Audio
  speechRate: 1.10,
  speechPitch: 1.20,
  autoSpeak: false,           // auto-speak Japanese text outside of Lessons (Vocab/Kanji study)
  slowMode: false,
  // Story Reader (Phase 4.3B)
  readerSpeed: 1.0,           // 0.8 | 1.0 | 1.2
  readerAutoPlayNext: false,  // boolean
  // Privacy — no analytics/crash-reporting SDK is wired into this build,
  // so these are inert by design; saved for forward-compatibility.
  analytics: true,
  crashReports: true,
}

function applySideEffects(settings) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  // Text direction and language attribute for internationalization
  applyLocaleDirection(settings.displayLanguage || 'en')

  // Animations off → collapses all CSS transitions/animations site-wide,
  // reusing the same mechanism as prefers-reduced-motion in index.css.
  root.classList.toggle('reduce-motion', !settings.animations)

  // Compact mode → tightens card/section padding site-wide.
  root.classList.toggle('compact', settings.compactMode)

  // Font size → scales the root font-size, which every rem-based
  // Tailwind utility then inherits from.
  root.setAttribute('data-font-size', settings.fontSize)
}

/**
 * Migrates and synchronizes preferences between legacy 'nihongo-settings'
 * and canonical 'nihongo_settings' keys in localStorage.
 *
 * Deterministic merge rules:
 * 1. Canonical-only: leaves canonical intact.
 * 2. Legacy-only: migrates legacy into canonical with proper Zustand structure.
 * 3. Both exist: canonical takes precedence on collisions, while legacy backfills missing fields.
 * 4. Neither exists: returns null; defaults are maintained.
 * 5. Corrupted JSON: safely ignores corrupt entries; if canonical is corrupt but legacy is valid, recovers from legacy.
 */
export function migrateSettingsStorage(storage = (typeof window !== 'undefined' && window.localStorage ? window.localStorage : null)) {
  if (!storage) return null

  try {
    const rawCanonical = storage.getItem('nihongo_settings')
    const rawLegacy = storage.getItem('nihongo-settings')

    let canonicalState = null
    let legacyState = null

    if (rawCanonical) {
      try {
        const parsed = JSON.parse(rawCanonical)
        canonicalState = (parsed && typeof parsed === 'object' && 'state' in parsed) ? parsed.state : parsed
      } catch {
        canonicalState = null
      }
    }

    if (rawLegacy) {
      try {
        const parsed = JSON.parse(rawLegacy)
        legacyState = (parsed && typeof parsed === 'object' && 'state' in parsed) ? parsed.state : parsed
      } catch {
        legacyState = null
      }
    }

    // Determine target merged state
    let finalState = null

    if (canonicalState && legacyState) {
      finalState = { ...legacyState, ...canonicalState }
    } else if (canonicalState) {
      finalState = { ...canonicalState }
    } else if (legacyState) {
      finalState = { ...legacyState }
    }

    if (finalState && typeof finalState === 'object') {
      if (finalState.readerSpeed !== undefined) {
        finalState.readerSpeed = sanitizeReaderSpeed(finalState.readerSpeed)
      }
      if (finalState.readerAutoPlayNext !== undefined) {
        finalState.readerAutoPlayNext = Boolean(finalState.readerAutoPlayNext)
      }
      if (finalState.displayLanguage !== undefined) {
        finalState.displayLanguage = sanitizeLanguage(finalState.displayLanguage)
      }
      if (finalState.explanationLanguage !== undefined) {
        finalState.explanationLanguage = sanitizeLanguage(finalState.explanationLanguage)
      }
      if (finalState.nativeLanguage !== undefined) {
        finalState.nativeLanguage = sanitizeLanguage(finalState.nativeLanguage)
      }
      // Backward compatibility: if only nativeLanguage was persisted in legacy state
      if (!finalState.displayLanguage && finalState.nativeLanguage) {
        finalState.displayLanguage = finalState.nativeLanguage
      }
      if (!finalState.explanationLanguage) {
        finalState.explanationLanguage = finalState.displayLanguage || finalState.nativeLanguage || 'en'
      }

      storage.setItem('nihongo_settings', JSON.stringify({ state: finalState, version: 0 }))
      return finalState
    }
  } catch (err) {
    console.warn('Failed to migrate settings storage:', err)
  }

  return null
}

// Migrate legacy key 'nihongo-settings' -> 'nihongo_settings' if needed on module load
if (typeof window !== 'undefined' && window.localStorage) {
  migrateSettingsStorage(window.localStorage)
}

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      hydrated: false,

      /** Update one or more settings at once and apply side-effects. */
      updateSettings: (patch) => {
        const sanitizedPatch = { ...patch }
        if (sanitizedPatch.readerSpeed !== undefined) {
          sanitizedPatch.readerSpeed = sanitizeReaderSpeed(sanitizedPatch.readerSpeed)
        }
        if (sanitizedPatch.readerAutoPlayNext !== undefined) {
          sanitizedPatch.readerAutoPlayNext = Boolean(sanitizedPatch.readerAutoPlayNext)
        }
        if (sanitizedPatch.displayLanguage !== undefined) {
          sanitizedPatch.displayLanguage = sanitizeLanguage(sanitizedPatch.displayLanguage)
        }
        if (sanitizedPatch.explanationLanguage !== undefined) {
          sanitizedPatch.explanationLanguage = sanitizeLanguage(sanitizedPatch.explanationLanguage)
        }
        if (sanitizedPatch.nativeLanguage !== undefined) {
          sanitizedPatch.nativeLanguage = sanitizeLanguage(sanitizedPatch.nativeLanguage)
        }
        const next = { ...get(), ...sanitizedPatch }
        set(sanitizedPatch)
        applySideEffects(next)
      },

      /** Convenience helper for changing display & interface language */
      setDisplayLanguage: (lang) => {
        get().updateSettings({ displayLanguage: lang })
      },

      /** Convenience helper for changing learning explanation language */
      setExplanationLanguage: (lang) => {
        get().updateSettings({ explanationLanguage: lang })
      },

      /** Convenience helper for changing native language (mother tongue) */
      setNativeLanguage: (lang) => {
        get().updateSettings({ nativeLanguage: lang })
      },

      /** Convenience helper for setting story reader playback speed */
      setReaderSpeed: (speed) => {
        get().updateSettings({ readerSpeed: sanitizeReaderSpeed(speed) })
      },

      /** Convenience helper for setting story reader autoplay preference */
      setReaderAutoPlayNext: (enabled) => {
        get().updateSettings({ readerAutoPlayNext: Boolean(enabled) })
      },

      /** Apply current settings to the DOM — call once on app boot. */
      init: () => {
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const migratedState = migrateSettingsStorage(window.localStorage)
            if (migratedState && typeof migratedState === 'object') {
              get().updateSettings(migratedState)
            }
          } catch {}
        }

        const state = get()
        const sanitizedSpeed = sanitizeReaderSpeed(state.readerSpeed)
        const sanitizedAutoPlay = Boolean(state.readerAutoPlayNext)
        if (state.readerSpeed !== sanitizedSpeed || state.readerAutoPlayNext !== sanitizedAutoPlay) {
          set({ readerSpeed: sanitizedSpeed, readerAutoPlayNext: sanitizedAutoPlay })
        }
        applySideEffects(get())
        set({ hydrated: true })
      },

      resetToDefaults: () => {
        set({ ...DEFAULT_SETTINGS, hydrated: true })
        applySideEffects(DEFAULT_SETTINGS)
      },
    }),
    {
      name: 'nihongo_settings',
      // Don't persist the transient hydration flag or actions — destructured
      // here only to exclude them from `rest`.
      partialize: (state) => {
        const {
          hydrated: _hydrated,
          updateSettings: _updateSettings,
          setDisplayLanguage: _setDisplayLanguage,
          setExplanationLanguage: _setExplanationLanguage,
          setNativeLanguage: _setNativeLanguage,
          setReaderSpeed: _setReaderSpeed,
          setReaderAutoPlayNext: _setReaderAutoPlayNext,
          init: _init,
          resetToDefaults: _resetToDefaults,
          ...rest
        } = state
        return rest
      },
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState
        }
        const merged = { ...currentState, ...persistedState }
        merged.readerSpeed = sanitizeReaderSpeed(merged.readerSpeed)
        merged.readerAutoPlayNext = Boolean(merged.readerAutoPlayNext)
        if (merged.displayLanguage !== undefined) {
          merged.displayLanguage = sanitizeLanguage(merged.displayLanguage)
        }
        if (merged.explanationLanguage !== undefined) {
          merged.explanationLanguage = sanitizeLanguage(merged.explanationLanguage)
        }
        if (merged.nativeLanguage !== undefined) {
          merged.nativeLanguage = sanitizeLanguage(merged.nativeLanguage)
        }
        if (!merged.displayLanguage && merged.nativeLanguage) {
          merged.displayLanguage = merged.nativeLanguage
        }
        if (!merged.explanationLanguage) {
          merged.explanationLanguage = merged.displayLanguage || merged.nativeLanguage || 'en'
        }
        return merged
      },
    }
  )
)