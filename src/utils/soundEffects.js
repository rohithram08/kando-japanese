// src/utils/soundEffects.js
// Procedural Web Audio API sound synthesizer for playful, Duolingo-style UI feedback
// Zero external audio files required. Muted by default; AudioContext created only on user gesture.

let audioCtx = null
let soundEnabled = false

// Safe localStorage key
const SOUND_PREF_KEY = 'nihongo_ui_sound_enabled'

// Initialize preference if available (defaults to true for engaging audio feedback)
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(SOUND_PREF_KEY)
    soundEnabled = saved === null ? true : saved === 'true'
  } catch {
    soundEnabled = true
  }
}

/**
 * Returns whether UI sound effects are currently enabled.
 */
export function isSoundEnabled() {
  return soundEnabled
}

/**
 * Set sound enabled state and persist to localStorage.
 */
export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SOUND_PREF_KEY, String(soundEnabled))
    } catch {
      // Ignore localStorage restrictions
    }
  }
  return soundEnabled
}

/**
 * Toggle sound on/off.
 */
export function toggleSound() {
  return setSoundEnabled(!soundEnabled)
}

/**
 * Lazily initialize and resume the AudioContext on user interaction.
 */
function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null

  if (!audioCtx) {
    audioCtx = new AudioContextClass()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

/**
 * Play a light, playful pop/chirp sound (e.g. tile tap, button click).
 */
export function playPop() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    const now = ctx.currentTime
    osc.type = 'sine'
    // Pitch sweep from 480Hz up to 720Hz
    osc.frequency.setValueAtTime(480, now)
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.08)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.09)
  } catch {
    // Audio synthesis fallback
  }
}

/**
 * Play a cheerful double-chime (e.g. correct answer, +XP achievement).
 */
export function playChime() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const notes = [523.25, 659.25] // C5 and E5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + idx * 0.09

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.15, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.23)
    })
  } catch {
    // Audio synthesis fallback
  }
}

/**
 * Play an energetic, ascending 3-note chime for correct answers / quiz success.
 */
export function playSuccess() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    // C5 (523.25), E5 (659.25), G5 (783.99)
    const notes = [523.25, 659.25, 783.99]

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + idx * 0.08

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.18, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.26)
    })
  } catch {
    // Audio synthesis fallback
  }
}

/**
 * Play a gentle, dull double-tap sound for wrong answers (not harsh or grating).
 */
export function playError() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    // F3 (174.61), D3 (146.83)
    const notes = [174.61, 146.83]

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + idx * 0.1

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.15, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.19)
    })
  } catch {
    // Audio synthesis fallback
  }
}

/**
 * Play a sparkling match sound for matching game tiles.
 */
export function playMatch() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    // G5 (783.99), C6 (1046.50)
    const notes = [783.99, 1046.50]

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + idx * 0.07

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.2, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.23)
    })
  } catch {
    // Audio synthesis fallback
  }
}

/**
 * Play a celebratory fanfare for completing a daily goal, quiz, or level-up.
 */
export function playFanfare() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    // C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
    const notes = [
      { freq: 523.25, time: 0, dur: 0.12 },
      { freq: 659.25, time: 0.10, dur: 0.12 },
      { freq: 783.99, time: 0.20, dur: 0.14 },
      { freq: 1046.50, time: 0.32, dur: 0.45 },
    ]

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + time

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.2, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + dur + 0.01)
    })
  } catch {
    // Audio synthesis fallback
  }
}

/**
 * Play a soft swoosh sound (e.g. card flip, page transition).
 */
export function playSwoosh() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.12)
  } catch {
    // Audio synthesis fallback
  }
}

/**
 * Play a light, subtle tactile click sound for buttons and tabs.
 */
export function playClick() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.04)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.04)
  } catch {
    // Audio synthesis fallback
  }
}
