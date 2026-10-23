import { useSettingsStore } from '../store/settingsStore'
import { t } from '../i18n'

export function detectTextLanguage(text) {
  if (!text || typeof text !== 'string') return 'ja-JP'

  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN'

  // Devanagari (Hindi) script
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN'

  // Korean Hangul
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return 'ko-KR'

  // Japanese Kana (Hiragana / Katakana)
  const kanaMatches = text.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || []
  // Kanji
  const kanjiMatches = text.match(/[\u4E00-\u9FAF]/g) || []
  const japaneseCharCount = kanaMatches.length + kanjiMatches.length

  // Latin letters (English, Romaji, etc.)
  const latinMatches = text.match(/[a-zA-Z]/g) || []
  const latinCharCount = latinMatches.length

  // If there are Japanese kana/kanji and they exceed or are equal to Latin letters,
  // or if there are no Latin letters, it is Japanese.
  if (japaneseCharCount > 0 && japaneseCharCount >= latinCharCount) {
    return 'ja-JP'
  }

  // If Latin letters predominate (e.g. English explanation with a few Japanese words),
  // speak in English!
  if (latinCharCount > 0) {
    return 'en-US'
  }

  // Default fallback
  return japaneseCharCount > 0 ? 'ja-JP' : 'en-US'
}

class AudioService {
  constructor() {
    this.synthesis = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null
    this.voices = []
    this.japaneseVoice = null
    this.currentUtterance = null
    this.activeUtterances = new Set()
    this.isPlaying = false
    this.sessionId = 0
    this.voiceListeners = new Set()

    this.loadVoices()
    this.setupVoiceListener()
  }

  setupVoiceListener() {
    if (this.synthesis) {
      this.synthesis.onvoiceschanged = () => {
        this.loadVoices()
        this.voiceListeners.forEach(listener => {
          try { listener() } catch {}
        })
      }
    }
  }

  onVoicesChanged(callback) {
    if (typeof callback !== 'function') return () => {}
    this.voiceListeners.add(callback)
    return () => this.voiceListeners.delete(callback)
  }

  loadVoices() {
    if (!this.synthesis) return

    this.voices = this.synthesis.getVoices()

    // Priority order for Japanese voices
    const priorities = [
      v => v.lang === 'ja-JP' && v.localService && v.name.includes('Female'),
      v => v.lang === 'ja-JP' && v.localService,
      v => v.lang === 'ja-JP' && v.name.includes('Kyoko'),
      v => v.lang === 'ja-JP' && v.name.includes('Otoya'),
      v => v.lang === 'ja-JP',
      v => v.lang && v.lang.startsWith('ja'),
    ]

    for (const priority of priorities) {
      const voice = this.voices.find(priority)
      if (voice) {
        this.japaneseVoice = voice
        break
      }
    }
  }

  isSupported() {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      !!window.speechSynthesis &&
      typeof SpeechSynthesisUtterance !== 'undefined'
    )
  }

  hasJapaneseVoice() {
    return !!this.japaneseVoice || (Array.isArray(this.voices) && this.voices.some(v => v.lang && v.lang.startsWith('ja')))
  }

  speak(text, options = {}) {
    if (!this.isSupported() || !text) return Promise.resolve()

    // Pull real user preferences as defaults — explicit `options` still win,
    // so call sites like speakSlow() can override deliberately.
    const prefs = useSettingsStore.getState()
    const baseRate = options.rate ?? prefs.speechRate ?? 0.85
    const effectiveRate = options.rate == null && prefs.slowMode ? Math.min(baseRate, 0.6) : baseRate

    return new Promise((resolve, reject) => {
      // Invalidate any ongoing or queued utterances
      this.sessionId += 1
      const currentSession = this.sessionId

      if (this.synthesis) {
        this.synthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)

      const targetLang = options.lang || detectTextLanguage(text)
      utterance.lang = targetLang
      utterance.rate = effectiveRate
      utterance.pitch = options.pitch ?? prefs.speechPitch ?? 1.0
      utterance.volume = options.volume || 1.0

      if (targetLang === 'ja-JP' && this.japaneseVoice) {
        utterance.voice = this.japaneseVoice
      } else {
        const langPrefix = targetLang.split('-')[0].toLowerCase()
        const matchedVoice =
          this.voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase() && v.localService) ||
          this.voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
          this.voices.find(v => v.lang.toLowerCase().startsWith(langPrefix) && v.localService) ||
          this.voices.find(v => v.lang.toLowerCase().startsWith(langPrefix))

        if (matchedVoice) {
          utterance.voice = matchedVoice
        } else if (targetLang.startsWith('ja') && this.japaneseVoice) {
          utterance.voice = this.japaneseVoice
        }
      }

      utterance.onstart = () => {
        if (currentSession !== this.sessionId) return
        this.isPlaying = true
        options.onStart?.()
      }

      utterance.onend = () => {
        this.activeUtterances.delete(utterance)
        if (currentSession !== this.sessionId) return
        this.isPlaying = false
        this.currentUtterance = null
        options.onEnd?.()
        resolve()
      }

      utterance.onerror = (event) => {
        this.activeUtterances.delete(utterance)
        if (currentSession !== this.sessionId) return
        this.isPlaying = false
        this.currentUtterance = null
        // Don't reject or trigger error callback on 'interrupted' errors as they are intentional cancels
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          const safeMessage = this.getErrorMessage(event.error)
          options.onError?.(event, safeMessage)
          if (options.rejectOnError) {
            reject(event)
          } else {
            resolve()
          }
        } else {
          resolve()
        }
      }

      this.currentUtterance = utterance
      this.activeUtterances.add(utterance)
      this.synthesis.speak(utterance)
    })
  }

  // Speak at different speeds
  speakSlow(text) {
    return this.speak(text, { rate: 0.6 })
  }

  speakNormal(text) {
    return this.speak(text, { rate: 0.85 })
  }

  speakFast(text) {
    return this.speak(text, { rate: 1.1 })
  }

  // Speak with furigana (reads the reading, not kanji)
  speakWithReading(text, reading) {
    return this.speak(reading || text)
  }

  // Stop current speech
  stop() {
    this.sessionId += 1
    if (this.synthesis) {
      this.synthesis.cancel()
      this.isPlaying = false
      this.currentUtterance = null
    }
    this.activeUtterances.clear()
  }

  // Pause speech
  pause() {
    if (this.synthesis && this.isPlaying) {
      this.synthesis.pause()
    }
  }

  // Resume speech
  resume() {
    if (this.synthesis) {
      this.synthesis.resume()
    }
  }

  // Speak a full sentence with word highlighting
  speakWithHighlight(text, onWordBoundary) {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve()
        return
      }

      this.stop()
      const currentSession = this.sessionId

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.85

      if (this.japaneseVoice) {
        utterance.voice = this.japaneseVoice
      }

      utterance.onstart = () => {
        if (currentSession !== this.sessionId) return
        this.isPlaying = true
      }

      utterance.onboundary = (event) => {
        if (currentSession !== this.sessionId) return
        if (event.name === 'word') {
          onWordBoundary?.(event.charIndex, event.charLength)
        }
      }

      utterance.onend = () => {
        this.activeUtterances.delete(utterance)
        if (currentSession !== this.sessionId) return
        this.isPlaying = false
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = () => {
        this.activeUtterances.delete(utterance)
        if (currentSession !== this.sessionId) return
        this.isPlaying = false
        this.currentUtterance = null
        resolve()
      }

      this.currentUtterance = utterance
      this.activeUtterances.add(utterance)
      this.synthesis.speak(utterance)
    })
  }

  // Get available Japanese voices info
  getJapaneseVoices() {
    return Array.isArray(this.voices) ? this.voices.filter(v => v.lang && v.lang.startsWith('ja')) : []
  }

  // Returns user-friendly localized error message for speech issues
  getErrorMessage(_errorCode = '') {
    if (!this.isSupported()) {
      return t('audio.not_supported', 'Speech synthesis is not supported in this browser')
    }
    if (!this.hasJapaneseVoice()) {
      return t('audio.voice_unavailable', 'No Japanese voice available on this device')
    }
    return t('audio.playback_failed', 'Audio playback failed')
  }

  getVoiceInfo() {
    return {
      total: Array.isArray(this.voices) ? this.voices.length : 0,
      japanese: this.getJapaneseVoices().length,
      hasJapaneseVoice: this.hasJapaneseVoice(),
      selectedVoice: this.japaneseVoice?.name || t('audio.default_voice', 'Default Voice'),
      supported: this.isSupported()
    }
  }
}

// Export singleton instance
export const audioService = new AudioService()

// Helper function for quick speak
export const speakJapanese = (text, rate = 0.85) => {
  return audioService.speak(text, { rate })
}