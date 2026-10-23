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
  // Google 日本語 is female
  if (name.includes('google 日本語')) return true
  // Google US English is default female
  if (name.includes('google us english')) return true
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

export function isJapaneseChar(char) {
  const code = char.charCodeAt(0)
  if (code >= 0x3040 && code <= 0x309f) return true // Hiragana
  if (code >= 0x30a0 && code <= 0x30ff) return true // Katakana
  if (code >= 0x4e00 && code <= 0x9faf) return true // Kanji
  if (code >= 0x3400 && code <= 0x4dbf) return true // Rare Kanji
  if (code >= 0x3000 && code <= 0x303f) return true // Japanese punctuation (、 。 ・ 「 」)
  if (code >= 0xff00 && code <= 0xffef) return true // Fullwidth forms (？ ！ ： （ ）)
  return false
}

export function isTamilChar(char) {
  const code = char.charCodeAt(0)
  return code >= 0x0b80 && code <= 0x0bff
}

export function isHindiChar(char) {
  const code = char.charCodeAt(0)
  return code >= 0x0900 && code <= 0x097f
}

export function isNeutralChar(char) {
  return /^[\s.,!?:;'"()\[\]\/\-—~…0-9\u3000-\u303F\uFF00-\uFFEF]+$/.test(char)
}

export function localeToTtsLang(locale) {
  if (!locale) return 'en-US'
  const prefix = locale.split('-')[0].toLowerCase()
  switch (prefix) {
    case 'ta': return 'ta-IN'
    case 'hi': return 'hi-IN'
    case 'ja': return 'ja-JP'
    case 'ko': return 'ko-KR'
    case 'zh': return locale.toLowerCase().includes('tw') || locale.toLowerCase().includes('hant') ? 'zh-TW' : 'zh-CN'
    case 'es': return 'es-ES'
    case 'fr': return 'fr-FR'
    case 'de': return 'de-DE'
    case 'pt': return 'pt-BR'
    case 'vi': return 'vi-VN'
    case 'id': return 'id-ID'
    default: return 'en-US'
  }
}

export function detectBaseLanguage(text, userPreferredLocale = 'en') {
  if (!text || typeof text !== 'string') return 'en-US'

  // If there are Tamil characters in the text, it is Tamil!
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN'

  // If Devanagari characters, it is Hindi!
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN'

  // If Korean Hangul
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return 'ko-KR'

  // If there are Latin letters (English text), it is English (or user's European locale)
  const latinMatches = text.match(/[a-zA-Z]/g) || []
  if (latinMatches.length > 0) {
    const prefLang = localeToTtsLang(userPreferredLocale)
    if (['es-ES', 'fr-FR', 'de-DE', 'pt-BR', 'it-IT'].includes(prefLang)) {
      return prefLang
    }
    return 'en-US'
  }

  // Pure Japanese kana/kanji
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
    return 'ja-JP'
  }

  return 'en-US'
}

export function segmentMultilingualText(text, baseLang = 'en-US') {
  if (!text || typeof text !== 'string') return []

  const rawSegments = []
  let currentSegment = { text: '', lang: '' }

  const getCharLang = (char) => {
    if (isJapaneseChar(char)) return 'ja-JP'
    if (isTamilChar(char)) return 'ta-IN'
    if (isHindiChar(char)) return 'hi-IN'
    if (isNeutralChar(char)) return 'neutral'
    return baseLang
  }

  const chars = Array.from(text)
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const charLang = getCharLang(char)

    if (!currentSegment.lang) {
      currentSegment.lang = charLang === 'neutral' ? baseLang : charLang
      currentSegment.text += char
    } else if (charLang === 'neutral') {
      currentSegment.text += char
    } else if (charLang === currentSegment.lang) {
      currentSegment.text += char
    } else {
      if (currentSegment.text.trim()) {
        rawSegments.push({ ...currentSegment })
      }
      currentSegment = { text: char, lang: charLang }
    }
  }

  if (currentSegment.text.trim()) {
    rawSegments.push({ ...currentSegment })
  }

  // Merge adjacent segments with identical language
  const merged = []
  for (const seg of rawSegments) {
    if (merged.length > 0 && merged[merged.length - 1].lang === seg.lang) {
      merged[merged.length - 1].text += seg.text
    } else {
      merged.push(seg)
    }
  }

  // Trim edge separators like dashes or colons that belong between languages
  return merged
    .map(s => {
      const trimmed = s.text.replace(/^[ \t—\-:]+|[ \t—\-:]+$/g, '').trim()
      return { text: trimmed, lang: s.lang }
    })
    .filter(s => s.text.length > 0)
}

export function sanitizeForSpeech(raw) {
  if (!raw || typeof raw !== 'string') return ''

  let text = raw

  // 1. Remove markdown links and images: [text](url) -> text, ![alt](url) -> empty
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')

  // 2. Remove bracketed stage directions & emotion tags: [encouraging], [emotion: happy], (smiling warmly)
  text = text.replace(/\[(?:emotion|animation):\s*[^\]]+\]/gi, '')
  text = text.replace(/\[(?:encouraging|friendly|happy|sad|excited|gentle|warmly|softly|curious|proudly|thinking|nodding|smiling|bowing|waving|teaching)[^\]]*\]/gi, '')
  text = text.replace(/\((?:smiling|laughing|nodding|bowing|chuckle|giggle)[^)]*\)/gi, '')

  // 3. Remove bullet markers at line start FIRST so they don't corrupt bold/italic asterisk matching
  text = text.replace(/^[ \t]*[-*+•][ \t]+/gm, '')

  // 4. Remove asterisk action directions like *smiles*, *laughs*, *nods*
  text = text.replace(/\*(?:[^*]*(?:smile|laugh|nod|bow|wink|sigh|adjusts? glasses|whisper|giggle|chuckle)[^*]*)\*/gi, '')

  // 5. Strip bold/italic markdown characters: **word** -> word, *word* -> word, __word__ -> word
  text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')

  // 6. Strip Romaji in parentheses following Japanese text:
  // e.g. お水 (omizu) -> お水
  // お水をください (Omizu o kudasai) -> お水をください
  // 道を教えてください (Michi o otsukusai kudasai) -> 道を教えてください
  text = text.replace(/([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+[\s]*)\([a-zA-Z\s~—\-_'"]+\)/g, '$1')

  // 7. Remove headers: # Header -> Header
  text = text.replace(/^[ \t]*#{1,6}[ \t]+/gm, '')

  // 8. Remove blockquotes: > quote -> quote
  text = text.replace(/^[ \t]*>[ \t]*/gm, '')

  // 9. Remove inline code backticks: `code` -> code
  text = text.replace(/`([^`]+)`/g, '$1')

  // 10. Remove code fence blocks
  text = text.replace(/```[\s\S]*?```/g, '')

  // 11. Remove markdown table markers: |
  text = text.replace(/\|/g, ' ')

  // 12. Remove emojis, pictographs, variation selectors, and joiners
  text = text.replace(/[\p{Extended_Pictographic}\uFE0E\uFE0F\u200D]/gu, '')

  // 13. Strip any stray markdown symbols remaining: #, *, ~, _, ^, \
  text = text.replace(/[#*~\\^]/g, '')

  // 14. Split into lines, trim, add natural sentence-ending pauses for lines that lack them
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

  // 15. Collapse multiple whitespace and normalize punctuation
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
      score -= 150
    }

    // Modern Neural / Natural / Google voices sound human and interactive (Gemini / ChatGPT style)
    if (/(?:natural|neural|online|google)/i.test(vName)) {
      score += 200
    }

    // Penalize legacy robotic desktop SAPI voices (e.g. Microsoft Zira Desktop, David Desktop)
    if (/\bdesktop\b/i.test(vName)) {
      score -= 80
    }

    // High quality preferred Japanese female voices (Hana Sensei's original voices)
    if (vName.includes('google 日本語') || vName.includes('nanami') || vName.includes('haruka') || vName.includes('kyoko')) {
      score += 50
    }

    // High quality preferred English female voices
    if (vName.includes('jenny') || vName.includes('aria') || vName.includes('samantha')) {
      score += 50
    }

    // Local service bonus for low latency
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

    // Clean markdown, stage directions, action tags, emojis, and redundant Romaji in parentheses before speech
    const cleanText = sanitizeForSpeech(text)
    if (!cleanText.trim()) return Promise.resolve()

    const prefs = useSettingsStore.getState()
    const baseRate = options.rate ?? prefs.speechRate ?? 0.88
    const effectiveRate = options.rate == null && prefs.slowMode ? Math.min(baseRate, 0.6) : baseRate

    // Detect actual language from text contents so numbers in English sentences are never spoken in Tamil!
    const baseLang = options.lang || detectBaseLanguage(cleanText, prefs.explanationLanguage || prefs.displayLanguage || 'en')

    // Segment text into language-specific fragments so Japanese words inside English/Tamil sentences
    // are spoken with the authentic Japanese female voice, and surrounding words are spoken in English/Tamil.
    const segments = segmentMultilingualText(cleanText, baseLang)
    if (segments.length === 0) return Promise.resolve()

    return new Promise((resolve, reject) => {
      // Invalidate any ongoing or queued utterances
      this.sessionId += 1
      const currentSession = this.sessionId

      if (this.synthesis) {
        this.synthesis.cancel()
      }

      this.isPlaying = true
      let currentIdx = 0

      const playNextSegment = () => {
        if (currentSession !== this.sessionId) return

        if (currentIdx >= segments.length) {
          this.isPlaying = false
          this.currentUtterance = null
          options.onEnd?.()
          resolve()
          return
        }

        const segment = segments[currentIdx]
        currentIdx += 1

        const utterance = new SpeechSynthesisUtterance(segment.text)
        utterance.lang = segment.lang
        utterance.rate = effectiveRate
        // Authentic human pitch (1.0 default)
        utterance.pitch = options.pitch ?? prefs.speechPitch ?? 1.0
        utterance.volume = options.volume || 1.0

        let bestVoice = findBestVoice(this.voices, segment.lang) || this.japaneseVoice
        // If the selected English voice is a legacy robotic desktop voice (e.g. Zira Desktop),
        // and we have a high-quality natural Japanese voice (e.g. Google 日本語 / Nanami / Kyoko),
        // prefer Hana Sensei's signature voice so she speaks with a unified, warm character!
        if (
          bestVoice &&
          /\bdesktop\b/i.test(bestVoice.name) &&
          this.japaneseVoice &&
          /(?:google|natural|neural|online)/i.test(this.japaneseVoice.name)
        ) {
          bestVoice = this.japaneseVoice
        }

        if (bestVoice) {
          utterance.voice = bestVoice
        }

        utterance.onstart = () => {
          if (currentSession !== this.sessionId) return
          if (currentIdx === 1) {
            options.onStart?.()
          }
        }

        utterance.onend = () => {
          this.activeUtterances.delete(utterance)
          if (currentSession !== this.sessionId) return
          playNextSegment()
        }

        utterance.onerror = (event) => {
          this.activeUtterances.delete(utterance)
          if (currentSession !== this.sessionId) return
          if (event.error !== 'interrupted' && event.error !== 'canceled') {
            const safeMessage = this.getErrorMessage(event.error)
            options.onError?.(event, safeMessage)
            // Attempt to continue to next segment rather than breaking the entire phrase
            playNextSegment()
          } else {
            this.isPlaying = false
            this.currentUtterance = null
            resolve()
          }
        }

        this.currentUtterance = utterance
        this.activeUtterances.add(utterance)
        this.synthesis.speak(utterance)
      }

      playNextSegment()
    })
  }

  // Speak at different speeds
  speakSlow(text) {
    return this.speak(text, { rate: 0.6 })
  }

  speakNormal(text) {
    return this.speak(text, { rate: 0.88 })
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
      utterance.rate = 0.88
      utterance.pitch = 1.0

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
export const speakJapanese = (text, rate = 0.88) => {
  return audioService.speak(text, { rate })
}
