import { useSettingsStore } from '../store/settingsStore'
import { t } from '../i18n'

export const FEMALE_VOICE_NAMES = [
  'zira', 'jenny', 'aria', 'haruka', 'ayumi', 'sayaka', 'nanami', 'keiko',
  'kyoko', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona',
  'serena', 'allison', 'ava', 'susan', 'catherine', 'linda', 'hazel',
  'heera', 'kalpana', 'swara', 'priya', 'ananya', 'iniya', 'pallavi',
  'lekha', 'neerja', 'aditi', 'kavya'
]

export const MALE_VOICE_NAMES = [
  'david', 'mark', 'george', 'richard', 'alex', 'daniel', 'fred', 'tom',
  'oliver', 'guy', 'keita', 'ichiro', 'otoya', 'ravi', 'hemant', 'valluvar',
  'prabhat', 'madhav'
]

export function isFemaleVoice(voice) {
  if (!voice) return false
  if (voice.gender && String(voice.gender).toLowerCase() === 'female') return true
  const name = `${voice.name || ''} ${voice.voiceURI || ''}`.toLowerCase()
  if (/\bfemale\b|\bwoman\b|\bgirl\b/.test(name)) return true
  return FEMALE_VOICE_NAMES.some(fn => name.includes(fn))
}

export function isMaleVoice(voice) {
  if (!voice) return false
  if (voice.gender && String(voice.gender).toLowerCase() === 'male') return true
  const name = `${voice.name || ''} ${voice.voiceURI || ''}`.toLowerCase()
  if (/\bfemale\b/.test(name)) return false
  if (/\bmale\b|\bman\b|\bboy\b/.test(name)) return true
  return MALE_VOICE_NAMES.some(mn => name.includes(mn))
}

export function sanitizeForSpeech(raw) {
  if (!raw || typeof raw !== 'string') return ''

  let text = raw

  // 1. Remove markdown links and images: [text](url) -> text, ![alt](url) -> empty
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')

  // 2. Remove bracketed stage directions & emotion tags: [encouraging], [emotion: happy], (smiling warmly)
  text = text.replace(/\[(?:emotion|animation):\s*[^\]]+\]/gi, '')
  text = text.replace(/\[(?:encouraging|friendly|happy|sad|excited|gentle|warmly|softly|curious|proudly|thinking|nodding|smiling|bowing|waving|teaching|pointing)[^\]]*\]/gi, '')
  text = text.replace(/\((?:smiling|laughing|nodding|bowing|chuckle|giggle)[^)]*\)/gi, '')

  // 3. Remove asterisk action directions: *smiles warmly*, *laughs*, *adjusts glasses*
  text = text.replace(/\*(?:[^*]*(?:smile|laugh|nod|bow|wink|wave|clap|cheer|point|sigh|adjust|whisper|pause|think|warmly|softly|gently|proudly|encourag|giggle|chuckle)[^*]*)\*/gi, '')

  // 4. Strip bold/italic markdown characters while keeping words inside: **word** -> word, *word* -> word, __word__ -> word
  text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')

  // 5. Remove headers: # Header -> Header
  text = text.replace(/^[ \t]*#{1,6}[ \t]+/gm, '')

  // 6. Remove bullet markers at line start: - item, * item, + item, • item
  text = text.replace(/^[ \t]*[-*+•][ \t]+/gm, '')

  // 7. Remove blockquotes: > quote -> quote
  text = text.replace(/^[ \t]*>[ \t]*/gm, '')

  // 8. Remove inline code backticks: `code` -> code
  text = text.replace(/`([^`]+)`/g, '$1')

  // 9. Remove code fence blocks
  text = text.replace(/```[\s\S]*?```/g, '')

  // 10. Remove markdown table markers: |
  text = text.replace(/\|/g, ' ')

  // 11. Remove emojis, pictographs, variation selectors, and joiners
  text = text.replace(/[\p{Extended_Pictographic}\uFE0E\uFE0F\u200D]/gu, '')

  // 12. Strip stray markdown symbols: #, *, ~, _, ^, \
  text = text.replace(/[#*~\\^]/g, '')

  // 13. Split into lines, trim, add natural sentence-ending pauses for lines that lack them
  const lines = text.split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  const punctuatedLines = lines.map(line => {
    if (!/[.,!?;:。！？…]$/.test(line)) {
      return line + '.'
    }
    return line
  })

  text = punctuatedLines.join(' ')

  // 14. Collapse multiple whitespace and normalize punctuation
  text = text.replace(/[ \t]+/g, ' ')
  text = text.replace(/ +([.,!?。、！？])/g, '$1')
  text = text.replace(/([.,!?])\1+/g, '$1')
  text = text.trim()

  return text
}

export function findBestVoice(voices, targetLang) {
  if (!Array.isArray(voices) || voices.length === 0) return null

  const normalizedTarget = (targetLang || 'ja-JP').toLowerCase()
  const langPrefix = normalizedTarget.split('-')[0]

  // Filter voices matching target language or language family
  let matchingVoices = voices.filter(v => {
    const vLang = (v.lang || '').toLowerCase()
    return vLang === normalizedTarget || vLang.startsWith(langPrefix)
  })

  // If none match target language prefix, consider all voices
  if (matchingVoices.length === 0) {
    matchingVoices = voices
  }

  const scored = matchingVoices.map(voice => {
    let score = 0
    const vLang = (voice.lang || '').toLowerCase()
    const vName = (voice.name || '').toLowerCase()

    // Language specificity
    if (vLang === normalizedTarget) {
      score += 100
    } else if (vLang.startsWith(langPrefix)) {
      score += 50
    }

    // Gender preference — Hana Sensei is female
    if (isFemaleVoice(voice)) {
      score += 100
    } else if (isMaleVoice(voice)) {
      score -= 80
    }

    // Natural / Neural quality
    if (/natural|neural|online/i.test(vName)) {
      score += 25
    }

    // Local service
    if (voice.localService) {
      score += 10
    }

    return { voice, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored[0]?.voice || null
}

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
    this.japaneseVoice = findBestVoice(this.voices, 'ja-JP')
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

    // Clean markdown, stage directions, action tags, emojis, and hashtags before speech
    const cleanText = sanitizeForSpeech(text)
    if (!cleanText.trim()) return Promise.resolve()

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

      const utterance = new SpeechSynthesisUtterance(cleanText)

      const targetLang = options.lang || detectTextLanguage(cleanText)
      utterance.lang = targetLang
      utterance.rate = effectiveRate
      // Default to 1.15 pitch for Hana Sensei's cheerful, feminine voice tone
      utterance.pitch = options.pitch ?? prefs.speechPitch ?? 1.15
      utterance.volume = options.volume || 1.0

      const bestVoice = findBestVoice(this.voices, targetLang)
      if (bestVoice) {
        utterance.voice = bestVoice
      } else if (targetLang.startsWith('ja') && this.japaneseVoice) {
        utterance.voice = this.japaneseVoice
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

      const cleanText = sanitizeForSpeech(text)
      if (!cleanText.trim()) {
        resolve()
        return
      }

      this.stop()
      const currentSession = this.sessionId

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.85
      utterance.pitch = 1.15

      const bestVoice = findBestVoice(this.voices, 'ja-JP') || this.japaneseVoice
      if (bestVoice) {
        utterance.voice = bestVoice
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