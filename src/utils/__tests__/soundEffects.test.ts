import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  isSoundEnabled,
  setSoundEnabled,
  toggleSound,
  playPop,
  playChime,
  playSwoosh,
} from '../soundEffects'

describe('soundEffects utility', () => {
  beforeEach(() => {
    setSoundEnabled(false)
    vi.clearAllMocks()
  })

  it('starts muted by default', () => {
    expect(isSoundEnabled()).toBe(false)
  })

  it('toggles sound on and off correctly', () => {
    expect(toggleSound()).toBe(true)
    expect(isSoundEnabled()).toBe(true)

    expect(toggleSound()).toBe(false)
    expect(isSoundEnabled()).toBe(false)
  })

  it('does not create or invoke AudioContext when muted', () => {
    const audioContextSpy = vi.fn()
    ;(global as any).AudioContext = audioContextSpy

    setSoundEnabled(false)
    playPop()
    playChime()
    playSwoosh()

    expect(audioContextSpy).not.toHaveBeenCalled()
  })

  it('synthesizes sounds when enabled with mock AudioContext', () => {
    const mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }
    const mockOsc = {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }

    class MockAudioContext {
      state = 'running'
      currentTime = 10
      destination = {}
      createOscillator = vi.fn().mockReturnValue(mockOsc)
      createGain = vi.fn().mockReturnValue(mockGain)
      resume = vi.fn().mockResolvedValue(undefined)
    }

    ;(global as any).AudioContext = MockAudioContext

    setSoundEnabled(true)
    playPop()
    playChime()
    playSwoosh()

    expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalled()
    expect(mockOsc.start).toHaveBeenCalled()
    expect(mockOsc.stop).toHaveBeenCalled()
  })
})
