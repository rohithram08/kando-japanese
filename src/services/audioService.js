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

export const INLINE_PARTICLE_MAP = {
  'は': 'wah',
  'が': 'gah',
  'を': 'oh',
  'に': 'nee',
  'で': 'deh',
  'と': 'toh',
  'も': 'moh',
  'へ': 'eh',
  'の': 'noh',
  'ね': 'neh',
  'よ': 'yoh',
  'から': 'kara',
  'まで': 'made',
  'です': 'desu',
  'だ': 'da',
  'ます': 'masu',
}

export function expandInlineParticles(text) {
  if (!text) return ''
  let res = text

  // 1. Expand Japanese characters
  for (const [p, romaji] of Object.entries(INLINE_PARTICLE_MAP)) {
    // Match isolated particle surrounded by spaces, quotes, punctuation, or string edges
    const regex = new RegExp('(^|[\\s"\'(\\[])' + p + '([\\s"\'.,!?;:)\\]]|$)', 'g')
    res = res.replace(regex, `$1${romaji}$2`)
    // Run twice for adjacent particles (e.g. "は" and "が")
    res = res.replace(regex, `$1${romaji}$2`)
  }

  // 2. Expand isolated Latin particle words in English text so TTS engines never spell them out as letters
  // e.g. "ga" -> "gah" (prevents English TTS pronouncing "g - a" or "Georgia")
  res = res.replace(/(^|[\s"'(])\bga\b([\s"'.,!?;:)]|$)/gi, '$1gah$2')
  res = res.replace(/(^|[\s"'(])\bwa\b([\s"'.,!?;:)]|$)/gi, '$1wah$2')
  res = res.replace(/(^|[\s"'(])\bka\b([\s"'.,!?;:)]|$)/gi, '$1kah$2')

  return res
}

export function segmentMultilingualText(text, baseLang = 'en-US') {
  if (!text || typeof text !== 'string') return []

  // Break text into logical clauses / sentences at natural speech pause boundaries:
  // - Newlines
  // - Colons or dashes separating labels from content
  // - Sentence terminators followed by whitespace (., !, ?, 。, ！？)
  const clauseDelimRegex = /(?<=[.!?。！？\n])\s+|(?<=[—\-:]\s+)|(?=\s+[—\-]\s+)/g
  const rawClauses = text
    .split(clauseDelimRegex)
    .map(c => c.trim())
    .filter(Boolean)

  const segments = []

  for (const clause of rawClauses) {
    // Count Japanese Kana/Kanji characters vs Latin/Tamil/Hindi characters
    const jaChars = (clause.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length
    const latinChars = (clause.match(/[a-zA-Z]/g) || []).length
    const tamilChars = (clause.match(/[\u0B80-\u0BFF]/g) || []).length
    const hindiChars = (clause.match(/[\u0900-\u097F]/g) || []).length

    // If the clause is pure or predominantly Japanese:
    // Speak with authentic Japanese voice (ja-JP)
    if (jaChars > 0 && jaChars >= latinChars && jaChars >= tamilChars && jaChars >= hindiChars) {
      segments.push({ text: clause, lang: 'ja-JP' })
    }
    // If the clause is Tamil:
    else if (tamilChars > 0 && tamilChars >= latinChars) {
      const expanded = expandInlineParticles(clause)
      segments.push({ text: expanded, lang: 'ta-IN' })
    }
    // If the clause is Hindi:
    else if (hindiChars > 0 && hindiChars >= latinChars) {
      const expanded = expandInlineParticles(clause)
      segments.push({ text: expanded, lang: 'hi-IN' })
    }
    // Otherwise it is English (or other baseLang European language):
    else {
      // In English sentences, isolated Japanese particles (like は in "how we use は to talk")
      // are phonetically expanded to their natural pronunciations ("how we use wa to talk"),
      // preventing the browser from cutting the sentence in half and pausing for 1 second!
      const expanded = expandInlineParticles(clause)
      segments.push({ text: expanded, lang: baseLang === 'ja-JP' ? 'ja-JP' : (baseLang || 'en-US') })
    }
  }

  // Merge consecutive segments with the same language so they speak as ONE continuous utterance
  const merged = []
  for (const seg of segments) {
    if (merged.length > 0 && merged[merged.length - 1].lang === seg.lang) {
      merged[merged.length - 1].text += ' ' + seg.text
    } else {
      merged.push({ ...seg })
    }
  }

  return merged
    .map(s => ({
      text: s.text.replace(/^[ \t—\-:]+|[ \t—\-:]+$/g, '').trim(),
      lang: s.lang
    }))
    .filter(s => s.text.length > 0)
}

export function sanitizeForSpeech(raw) {
  if (!raw || typeof raw !== 'string') return ''

  let text = raw

  // 1. Remove markdown links and images: [text](url) -> text, ![alt](url) -> empty
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')

  // 2. Remove all grammatical labels, part-of-speech tags, emotion tags, and system annotations in brackets:
  // e.g. [noun], [topic], [particle], [verb], [subject], [object], [adjective], [encouraging], [emotion: happy], [Next Logical Step]
  text = text.replace(/\[\s*(?:noun|verb|adjective|adv|particle|topic|subject|object|grammar|encouraging|happy|sad|excited|gentle|warmly|softly|curious|proudly|thinking|nodding|smiling|bowing|waving|teaching|emotion|animation|next logical step|note|hint|tip)[^\]]*\]/gi, '')

  // 3. Remove grammatical tags and parenthetical notes:
  // e.g. (noun), (topic), (particle), (verb), (adjective), (Note: ...), (hint: ...)
  text = text.replace(/\((?:noun|verb|adjective|adv|particle|topic|subject|object|grammatical|polite|informal|colloquial|transitive|intransitive|note|hint|tip)[^)]*\)/gi, '')

  // 4. Remove bullet markers at line start FIRST so they don't corrupt bold/italic asterisk matching
  text = text.replace(/^[ \t]*[-*+•][ \t]+/gm, '')

  // 5. Remove asterisk action directions like *smiles*, *laughs*, *nods*
  text = text.replace(/\*(?:[^*]*(?:smile|laugh|nod|bow|wink|sigh|adjusts? glasses|whisper|giggle|chuckle)[^*]*)\*/gi, '')

  // 6. Strip bold/italic markdown characters: **word** -> word, *word* -> word, __word__ -> word
  text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')

  // 7. Strip Romaji in parentheses following Japanese text:
  // e.g. お水 (omizu) -> お水
  // 猫はかわいいです。(Neko wa kawaii desu.) -> 猫はかわいいです。
  // が (ga) -> が
  // は (wa) -> は
  // 道を教えてください (Michi o otsukusai kudasai) -> 道を教えてください
  text = text.replace(/([\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+[\s]*)\([a-zA-Z0-9\s~—\-_'".!?、。]+\)/g, '$1')
  text = text.replace(/([\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+[\s]*)\[[a-zA-Z0-9\s~—\-_'".!?、。]+\]/g, '$1')

  // 8. Remove headers: # Header -> Header
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

  // 14. Split into lines, filter out standalone Romaji lines following Japanese lines,
  // and add natural sentence-ending pauses for lines that lack them.
  const rawLines = text.split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  const englishStopWords = new Set([
    'the', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'can', 'could', 'should', 'may', 'might', 'must', 'this',
    'that', 'these', 'those', 'which', 'what', 'where', 'when', 'why', 'how',
    'because', 'about', 'with', 'from', 'into', 'for', 'you', 'your', 'we', 'our',
    'they', 'their', 'she', 'her', 'he', 'his', 'it', 'its'
  ])

  const spokenLines = []
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i]
    const lineHasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(line)
    const prevLine = spokenLines[spokenLines.length - 1] || ''
    const prevHasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(prevLine)

    // If the previous line had Japanese (e.g. "私は 猫 が 好きです。"):
    // and this line has NO Japanese and is a standalone Romaji reading (e.g. "Watashi wa neko ga suki desu.")
    // or parenthetical reading like "(Neko wa kawaii desu.)":
    if (!lineHasJapanese && prevHasJapanese) {
      if (/^(?:romaji|reading|kana|furigana):\s*/i.test(line)) {
        continue // Skip explicit Romaji line
      }

      // Skip parenthetical reading line following Japanese
      if (/^\s*\([^)]*\)\s*$/.test(line)) {
        continue
      }

      const words = line.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
      const hasEnglishStopWord = words.some(w => englishStopWords.has(w))

      if (words.length > 0 && !hasEnglishStopWord) {
        // Japanese Romaji words end in vowels (a, i, u, e, o) or 'n'
        const vowelEndCount = words.filter(w => /[aiueon]$/.test(w)).length
        if (vowelEndCount >= words.length * 0.7) {
          // This is a pure Romaji line right after Japanese text; omit from speech synthesis!
          continue
        }
      }
    }

    spokenLines.push(line)
  }

  const punctuatedLines = spokenLines.map(line => {
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

    // High quality preferred Hindi female voices
    if (vName.includes('swara') || vName.includes('kalpana') || vName.includes('google हिन्दी') || vName.includes('google hindi') || vName.includes('heera')) {
      score += 60
    }

    // High quality preferred Tamil female voices
    if (vName.includes('pallavi') || vName.includes('iniya') || vName.includes('google தமிழ்') || vName.includes('google tamil')) {
      score += 60
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
    // 16-18 year old female voice: brisk, snappy conversational rate (1.10)
    const baseRate = options.rate ?? prefs.speechRate ?? 1.10
    const effectiveRate = options.rate == null && prefs.slowMode ? Math.min(baseRate, 0.7) : baseRate

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
        // 16-18 year old female anime tutor pitch (1.20 bright, youthful tone)
        utterance.pitch = options.pitch ?? prefs.speechPitch ?? 1.20
        utterance.volume = options.volume || 1.0

        // Use authentic best voice for the segment's exact language (English voices for English, Japanese for Japanese, etc.)
        const bestVoice = findBestVoice(this.voices, segment.lang) || this.japaneseVoice

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
