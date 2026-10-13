// chatbot/ChatInterface.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, RefreshCw, Volume2, Bot, ChevronLeft,
  MessageSquare, Sparkles, Copy, Check, VolumeX,
  Maximize2, Minimize2, Info
} from 'lucide-react'
import { useAuthStore }  from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useDailyGoalsStore } from '../../store/dailyGoalsStore'
import { aiService }     from '../../services/aiService'
import SpeechInput       from './SpeechInput'
import ScenarioSelector  from './ScenarioSelector'
import toast from 'react-hot-toast'

/* ── Avatar lookup ──────────────────────────────────────── */
const AVATARS = [
  { id: 'avatar-1',  emoji: '🥷', bg: 'from-gray-700 to-gray-900'    },
  { id: 'avatar-2',  emoji: '🎌', bg: 'from-red-400 to-red-600'      },
  { id: 'avatar-3',  emoji: '🌸', bg: 'from-pink-400 to-pink-600'    },
  { id: 'avatar-4',  emoji: '⛩️', bg: 'from-orange-400 to-red-500'   },
  { id: 'avatar-5',  emoji: '🐉', bg: 'from-green-500 to-emerald-700'},
  { id: 'avatar-6',  emoji: '🗻', bg: 'from-blue-400 to-indigo-600'  },
  { id: 'avatar-7',  emoji: '🎎', bg: 'from-rose-400 to-rose-600'    },
  { id: 'avatar-8',  emoji: '🍣', bg: 'from-amber-400 to-orange-500' },
  { id: 'avatar-9',  emoji: '🎋', bg: 'from-emerald-400 to-teal-600' },
  { id: 'avatar-10', emoji: '🏯', bg: 'from-yellow-500 to-amber-600' },
  { id: 'avatar-11', emoji: '🎐', bg: 'from-cyan-400 to-blue-500'    },
  { id: 'avatar-12', emoji: '🐱', bg: 'from-violet-400 to-purple-600'},
  { id: 'avatar-13', emoji: '👺', bg: 'from-red-600 to-red-800'      },
  { id: 'avatar-14', emoji: '🦊', bg: 'from-orange-400 to-amber-500' },
  { id: 'avatar-15', emoji: '🎴', bg: 'from-indigo-500 to-purple-700'},
]

/* ── User Avatar ────────────────────────────────────────── */
function UserAvatar({ profile, size = 'w-8 h-8', textSize = 'text-xs' }) {
  if (profile?.avatar_url) {
    return (
      <div className={`${size} rounded-full overflow-hidden flex-shrink-0 shadow-sm`}>
        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
      </div>
    )
  }
  if (profile?.avatar_id) {
    const av = AVATARS.find(a => a.id === profile.avatar_id)
    if (av) {
      return (
        <div className={`${size} rounded-full bg-gradient-to-br ${av.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <span className={textSize}>{av.emoji}</span>
        </div>
      )
    }
  }
  const letter = (profile?.username?.[0] || 'U').toUpperCase()
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold ${textSize} flex-shrink-0 shadow-sm`}>
      {letter}
    </div>
  )
}

/* ── Helper: detect if string is Japanese script ────────── */
const isJapaneseText = (text) => {
  if (!text) return false
  // Match hiragana, katakana, kanji, or Japanese punctuation
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3000-\u303F]/.test(text)
}

/* ── Helper: find best Japanese TTS voice ───────────────── */
const getJapaneseVoice = () => {
  const voices = window.speechSynthesis.getVoices()

  // Priority order: native ja voices → any ja voice
  const nativeJa = voices.find(
    (v) => v.lang.startsWith('ja') && v.localService
  )
  if (nativeJa) return nativeJa

  const anyJa = voices.find((v) => v.lang.startsWith('ja'))
  if (anyJa) return anyJa

  // Fallback: look for voice names containing 'japanese' or 'ja-JP'
  const byName = voices.find(
    (v) =>
      v.name.toLowerCase().includes('japanese') ||
      v.name.toLowerCase().includes('ja-jp') ||
      v.name.toLowerCase().includes('haruka') ||  // Windows
      v.name.toLowerCase().includes('kyoko') ||   // macOS
      v.name.toLowerCase().includes('nanami')     // Edge
  )
  return byName || null
}

/* ── Demo speech helper ─────────────────────────────────── */
const speakDemo = (text = 'こんにちは、日本語を練習しましょう！') => {
  if (!('speechSynthesis' in window)) {
    toast.error('Speech synthesis not supported in this browser')
    return
  }
  window.speechSynthesis.cancel()

  const utterance  = new SpeechSynthesisUtterance(text)
  utterance.lang   = 'ja-JP'
  utterance.rate   = 0.85
  utterance.pitch  = 1.0

  const jpVoice = getJapaneseVoice()
  if (jpVoice) utterance.voice = jpVoice

  window.speechSynthesis.speak(utterance)
  toast.success('🔊 Playing sample pronunciation', { duration: 2000 })
}

/* ════════════════════════════════════════════════════════ */
export default function ChatInterface() {
  const { profile }       = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const isDark            = resolvedTheme === 'dark'

  const [messages,      setMessages]      = useState([])
  const [input,         setInput]         = useState('')
  const [loading,       setLoading]       = useState(false)
  const [scenario,      setScenario]      = useState(null)
  const [showScenarios, setShowScenarios] = useState(true)
  const [copiedId,      setCopiedId]      = useState(null)
  const [speakingId,    setSpeakingId]    = useState(null)
  const [isFullscreen,  setIsFullscreen]  = useState(false)
  const [voicesReady,   setVoicesReady]   = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const scenarioRef    = useRef(null)

  /* ── Preload TTS voices ───────────────────────────────── */
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) setVoicesReady(true)
    }

    loadVoices()
    window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices)
    return () => {
      window.speechSynthesis?.removeEventListener?.('voiceschanged', loadVoices)
    }
  }, [])

  /* ── Auto-scroll ──────────────────────────────────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  /* ── Focus input after scenario pick ──────────────────── */
  useEffect(() => {
    if (!showScenarios && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [showScenarios])

  /* ── System prompt builder ────────────────────────────── */
  const buildSystemPrompt = useCallback((sc) => {
    const level = profile?.current_level || 'N5'
    const lang  = profile?.native_language || 'English'
    const context = sc?.systemPrompt || 'You are a friendly Japanese conversation partner.'

    return `You are a Japanese language tutor. Context: ${context}

CRITICAL RULES — follow these EXACTLY:

1. ALWAYS respond ONLY in valid JSON with this EXACT structure:
{
  "message": "<your response written in JAPANESE SCRIPT — hiragana, katakana, and kanji ONLY>",
  "romaji": "<the romaji romanization of the message>",
  "translation": "<${lang} translation of the message>",
  "corrections": null
}

2. The "message" field MUST use Japanese characters (日本語).
   ✅ CORRECT: "message": "こんにちは、私は日本人です。ここはコミュニティセンターです。"
   ❌ WRONG:   "message": "Konnichiwa, watashi wa nihonjin desu."
   NEVER put romaji or ${lang} in the "message" field.

3. The "romaji" field contains the Latin-alphabet reading of "message".
   Example: "romaji": "Konnichiwa, watashi wa nihonjin desu. Koko wa komyuniti sentā desu."

4. The "translation" field contains the ${lang} meaning.
   Example: "translation": "Hello, I am Japanese. This is a community center."

5. When the user makes a grammar or vocabulary mistake, include corrections:
{
  "message": "Japanese response in 日本語",
  "romaji": "romaji reading",
  "translation": "${lang} translation",
  "corrections": {
    "original": "what the user wrote",
    "corrected": "corrected version in 日本語",
    "explanation": "brief explanation in ${lang}"
  }
}

6. Use vocabulary and grammar appropriate for JLPT ${level}.
7. Keep responses natural and conversational (1–3 sentences).
8. If user writes in ${lang}, gently reply in Japanese (日本語 script) with translation.
9. NEVER output anything outside the JSON structure.
10. NEVER use romaji in the "message" field — ALWAYS use 日本語 characters.`
  }, [profile])

  /* ── Parse & validate AI response ─────────────────────── */
  const parseAIResponse = useCallback((response) => {
    let msg     = response.message     || ''
    let romaji  = response.romaji      || ''
    let trans   = response.translation || ''
    const corr  = response.corrections || null

    // FIX: If "message" contains romaji instead of Japanese, swap them
    if (msg && !isJapaneseText(msg)) {
      // The AI put romaji in message — check if romaji field has Japanese
      if (romaji && isJapaneseText(romaji)) {
        // Fields are swapped — fix it
        const temp = msg
        msg    = romaji
        romaji = temp
      } else {
        // Neither field has Japanese — use message as romaji, leave message as-is
        // This is a fallback; the AI really messed up
        if (!romaji) romaji = msg
        // Keep msg as romaji since we have nothing better
        // The user will at least see something
      }
    }

    // If we have Japanese message but no romaji, that's okay
    // If we have romaji but it looks like Japanese, swap
    if (romaji && isJapaneseText(romaji) && msg && !isJapaneseText(msg)) {
      const temp = msg
      msg    = romaji
      romaji = temp
    }

    return { message: msg, romaji, translation: trans, corrections: corr }
  }, [])

  /* ── Start conversation ───────────────────────────────── */
  const startConversation = async (selectedScenario) => {
    setScenario(selectedScenario)
    setShowScenarios(false)
    setLoading(true)
    setMessages([])
    aiService.resetHistory()

    try {
      const systemPrompt = buildSystemPrompt(selectedScenario)
      const rawResponse  = await aiService.startChat(systemPrompt, selectedScenario.id)
      const response     = parseAIResponse(rawResponse)

      setMessages([{
        id:          Date.now(),
        role:        'assistant',
        content:     response.message     || 'こんにちは！',
        romaji:      response.romaji      || '',
        translation: response.translation || '',
        corrections: null,
        timestamp:   new Date(),
      }])
    } catch (err) {
      console.error('Start conversation error:', err)
      toast.error(`Could not start conversation: ${err.message}`)
      setShowScenarios(true)
    } finally {
      setLoading(false)
    }
  }

  /* ── Send message ─────────────────────────────────────── */
  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = {
      id:        Date.now(),
      role:      'user',
      content:   input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    const currentInput = input.trim()
    setInput('')
    setLoading(true)
    useDailyGoalsStore.getState().addChat(1)

    if (inputRef.current) inputRef.current.style.height = 'auto'

    try {
      const systemPrompt = buildSystemPrompt(scenario)
      const rawResponse  = await aiService.chat(messages, currentInput, systemPrompt)
      const response     = parseAIResponse(rawResponse)

      setMessages(prev => [...prev, {
        id:          Date.now() + 1,
        role:        'assistant',
        content:     response.message     || 'すみません、もう一度お願いします。',
        romaji:      response.romaji      || '',
        translation: response.translation || '',
        corrections: response.corrections || null,
        timestamp:   new Date(),
      }])
    } catch (err) {
      console.error('Chat error:', err)
      toast.error(`Failed to get response: ${err.message}`)
      setMessages(prev => prev.filter(m => m.id !== userMsg.id))
      setInput(currentInput)
    } finally {
      setLoading(false)
    }
  }

  /* ── Reset ────────────────────────────────────────────── */
  const handleReset = () => {
    window.speechSynthesis?.cancel()
    setSpeakingId(null)
    setShowScenarios(true)
    setScenario(null)
    setMessages([])
    setInput('')
    aiService.resetHistory()
  }

  /* ── Text-to-speech (Japanese) ────────────────────────── */
  const speakText = useCallback((text, msgId) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Speech synthesis not supported')
      return
    }

    // Toggle off if already speaking this message
    if (speakingId === msgId) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }

    window.speechSynthesis.cancel()

    // Only speak Japanese text — if it's romaji, it'll sound wrong
    const textToSpeak = isJapaneseText(text) ? text : text
    // Even if romaji, we set lang=ja-JP and let the engine try

    const utterance    = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang     = 'ja-JP'
    utterance.rate     = 0.8      // Slightly slower for learners
    utterance.pitch    = 1.0
    utterance.volume   = 1.0

    // Find the best Japanese voice
    const jpVoice = getJapaneseVoice()
    if (jpVoice) {
      utterance.voice = jpVoice
    }

    utterance.onstart = () => setSpeakingId(msgId)
    utterance.onend   = () => setSpeakingId(null)
    utterance.onerror = (e) => {
      console.warn('TTS error:', e)
      setSpeakingId(null)
      toast.error('Could not play audio')
    }

    window.speechSynthesis.speak(utterance)
  }, [speakingId])

  /* ── Copy text ────────────────────────────────────────── */
  const copyText = async (text, msgId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(msgId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  /* ── Keyboard handler ─────────────────────────────────── */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  /* ── Auto-resize textarea ─────────────────────────────── */
  const handleInput = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
  }

  /* ── Quick-tip action handlers ────────────────────────── */
  const QUICK_TIPS = [
    {
      icon: '🎯',
      title: 'Practice',
      desc: 'Real-world scenarios',
      action: () => {
        if (!showScenarios) setShowScenarios(true)
        setTimeout(() => {
          scenarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
        toast('👈 Pick a scenario from the list to start!', { icon: '🎯', duration: 2500 })
      },
    },
    {
      icon: '✏️',
      title: 'Corrections',
      desc: 'Instant feedback',
      action: () => {
        toast(
          'Write in Japanese and AI Sensei will correct your grammar, spelling, and word choice in real time.',
          { icon: '✏️', duration: 3500 }
        )
      },
    },
    {
      icon: '🔊',
      title: 'Listen',
      desc: 'Native pronunciation',
      action: () => speakDemo(),
    },
  ]

  const messageCount = messages.filter(m => m.role === 'user').length

  /* ════════════════════════════════════════════════════════ */
  return (
    <div className={`
      flex flex-col lg:flex-row rounded-2xl overflow-hidden border
      ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[calc(100vh-8rem)]'}
      bg-surface border-border
    `}>

      {/* ══ LEFT PANEL — Scenario Selector ════════════════ */}
      <AnimatePresence>
        {showScenarios && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`
              flex-shrink-0 border-r overflow-hidden w-full lg:w-80
              border-gray-200 dark:border-gray-700/60
            `}
          >
            <div ref={scenarioRef} className="w-full lg:w-80 h-full flex flex-col">
              <ScenarioSelector
                onSelect={startConversation}
                selectedId={scenario?.id}
                loading={loading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ RIGHT PANEL — Chat ════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Header ─────────────────────────────────────── */}
        <div className={`
          flex items-center justify-between px-4 py-3 border-b flex-shrink-0
          border-gray-200 bg-gray-50/50 dark:border-gray-700/60 dark:bg-gray-900/50
        `}>
          <div className="flex items-center gap-3">
            {!showScenarios && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setShowScenarios(true)}
                className={`
                  w-8 h-8 rounded-xl flex items-center justify-center border transition-colors
                  text-gray-500 hover:text-gray-900 hover:bg-gray-100 border-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 dark:border-gray-700
                `}
                title="Browse scenarios"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            )}

            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-bold text-sm text-foreground`}>
                  AI Sensei
                </h2>
                {scenario && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border dark:border-blue-500/20`}>
                    {scenario.jlptLevel}
                  </span>
                )}
              </div>
              <p className={`text-xs text-muted-foreground`}>
                {scenario ? `${scenario.icon} ${scenario.title}` : 'Select a scenario to start'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messageCount > 0 && (
              <div className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-muted text-muted-foreground`}>
                <MessageSquare className="w-3 h-3" />
                {messageCount}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`
                hidden sm:flex w-8 h-8 rounded-xl items-center justify-center border transition-colors
                text-gray-500 hover:text-gray-900 hover:bg-gray-100 border-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 dark:border-gray-700
              `}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </motion.button>

            {messages.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className={`
                  flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-colors font-medium border
                  text-gray-500 hover:text-red-500 hover:bg-red-50 border-gray-200 hover:border-red-200 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 dark:border-gray-700 dark:hover:border-red-500/30
                `}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* ── Empty State ────────────────────────────────── */}
        {messages.length === 0 && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20 mb-6"
              >
                🤖
              </motion.div>
              <h3 className={`font-bold text-xl mb-2 text-foreground`}>
                {showScenarios ? 'Choose a Scenario' : 'Starting conversation…'}
              </h3>
              <p className={`text-sm max-w-sm mx-auto text-muted-foreground`}>
                {showScenarios
                  ? 'Pick a conversation scenario to start practicing Japanese with your AI tutor'
                  : 'Your AI sensei is preparing the conversation…'}
              </p>

              {showScenarios && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                  {QUICK_TIPS.map((tip, i) => (
                    <motion.button
                      key={tip.title}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={tip.action}
                      className={`
                        p-4 rounded-xl border text-center cursor-pointer
                        outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
                        transition-all duration-200 group
                        bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/60 dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-lg dark:hover:shadow-black/20
                      `}
                    >
                      <span className="text-2xl block transition-transform duration-200 group-hover:scale-110">
                        {tip.icon}
                      </span>
                      <p className={`text-xs font-semibold mt-2 transition-colors text-gray-800 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400`}>
                        {tip.title}
                      </p>
                      <p className={`text-[10px] mt-1 text-muted-foreground`}>
                        {tip.desc}
                      </p>
                      <span className={`
                        inline-block mt-2 text-[10px] font-medium opacity-0 group-hover:opacity-100
                        transition-opacity duration-200
                        text-blue-500 dark:text-blue-400
                      `}>
                        Click to try →
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ── Messages List ──────────────────────────────── */}
        {(messages.length > 0 || loading) && (
          <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-gray-50/30 dark:bg-gray-950/30`}>
            {scenario && messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-3 rounded-xl border mx-auto max-w-md bg-white border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50`}
              >
                <Info className={`w-4 h-4 flex-shrink-0 text-muted-foreground`} />
                <p className={`text-xs text-muted-foreground`}>
                  <span className="font-medium">{scenario.icon} {scenario.title}</span>
                  {' · '}{scenario.jlptLevel} · {scenario.estimatedTime}
                </p>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => {
                // For assistant messages, determine what's actually Japanese
                const isAssistant      = message.role === 'assistant'
                const contentIsJP      = isJapaneseText(message.content)
                const displayContent   = message.content
                const displayRomaji    = message.romaji
                const displayTranslation = message.translation

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {isAssistant && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1 shadow-md shadow-blue-500/20">
                        🤖
                      </div>
                    )}

                    <div className={`max-w-[80%] space-y-1.5 ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      {/* Bubble */}
                      <div className={`
                        rounded-2xl px-4 py-3 relative group
                        ${message.role === 'user'
                          ? 'bg-gradient-to-br from-red-500 to-red-600 text-white rounded-tr-md shadow-lg shadow-red-500/15'
                          : 'bg-white border border-gray-200 rounded-tl-md shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700/60 dark:rounded-tl-md'}
                      `}>
                        {/* Main text — should be Japanese for assistant */}
                        <p className={`
                          text-[15px] font-medium leading-relaxed
                          ${isAssistant ? 'font-jp' : ''}
                          ${message.role === 'user'
                            ? 'text-white'
                            : 'text-foreground'}
                        `}>
                          {displayContent}
                        </p>

                        {/* Romaji + translation + actions — assistant only */}
                        {isAssistant && (displayRomaji || displayTranslation) && (
                          <div className={`
                            mt-2.5 pt-2.5 space-y-1.5 border-t
                            border-border
                          `}>
                            {displayRomaji && (
                              <p className={`text-xs italic text-gray-400`}>
                                {displayRomaji}
                              </p>
                            )}
                            {displayTranslation && (
                              <p className={`text-xs text-gray-500 dark:text-gray-300`}>
                                {displayTranslation}
                              </p>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center gap-1 pt-1">
                              <button
                                type="button"
                                onClick={() => speakText(displayContent, message.id)}
                                className={`
                                  flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg
                                  transition-all cursor-pointer
                                  ${speakingId === message.id
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:text-gray-500 dark:hover:text-blue-400 dark:hover:bg-blue-500/10'}
                                `}
                              >
                                {speakingId === message.id
                                  ? <><VolumeX className="w-3 h-3" /> Stop</>
                                  : <><Volume2 className="w-3 h-3" /> Listen</>}
                              </button>
                              <button
                                type="button"
                                onClick={() => copyText(displayContent, message.id)}
                                className={`
                                  flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg
                                  transition-all cursor-pointer
                                  ${copiedId === message.id
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700'}
                                `}
                              >
                                {copiedId === message.id
                                  ? <><Check className="w-3 h-3" /> Copied</>
                                  : <><Copy className="w-3 h-3" /> Copy</>}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Corrections */}
                      <AnimatePresence>
                        {message.corrections && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`
                              rounded-xl p-3 border w-full
                              bg-yellow-50 border-yellow-200 dark:bg-yellow-500/5 dark:border-yellow-500/20
                            `}
                          >
                            <p className="text-xs font-bold text-yellow-500 mb-2 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3" />
                              Correction
                            </p>
                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2">
                                <span className="text-red-400 text-[10px] font-bold mt-0.5">✗</span>
                                <p className={`text-xs line-through text-gray-400`}>
                                  {message.corrections.original}
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 text-[10px] font-bold mt-0.5">✓</span>
                                <p className="text-xs text-green-500 font-medium font-jp">
                                  {message.corrections.corrected}
                                </p>
                              </div>
                              {message.corrections.explanation && (
                                <p className={`text-[11px] mt-1.5 pl-4 text-muted-foreground`}>
                                  💡 {message.corrections.explanation}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Timestamp */}
                      <p className={`text-[10px] px-1 ${
                        message.role === 'user'
                          ? 'text-gray-300 text-right dark:text-gray-600 dark:text-right'
                          : 'text-foreground/80'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="mt-1">
                        <UserAvatar profile={profile} size="w-8 h-8" textSize="text-xs" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-md shadow-blue-500/20">
                    🤖
                  </div>
                  <div className={`
                    rounded-2xl rounded-tl-md px-4 py-3
                    bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700/60
                  `}>
                    <div className="flex gap-1.5 items-center h-5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ── Input Area ─────────────────────────────────── */}
        {!showScenarios && (
          <div className={`
            flex-shrink-0 border-t px-4 py-3
            border-gray-200 bg-white dark:border-gray-700/60 dark:bg-gray-900/80
          `}>
            <div className="flex items-end gap-2">
              <SpeechInput
                onTranscript={(text) => setInput(prev => prev + text)}
                language="ja-JP"
                disabled={loading}
              />

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  placeholder="日本語で話しましょう… (Let's speak Japanese…)"
                  rows={1}
                  disabled={loading}
                  className={`
                    w-full resize-none rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    border transition-all max-h-32 disabled:opacity-50
                    bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
                  `}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="
                  w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600
                  rounded-xl flex items-center justify-center text-white
                  hover:from-blue-600 hover:to-indigo-700
                  disabled:opacity-40 disabled:cursor-not-allowed
                  shadow-lg shadow-blue-500/20 flex-shrink-0 transition-all
                "
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>

            <div className={`flex items-center justify-between mt-2 text-muted-foreground`}>
              <p className="text-[10px]">Enter to send · Shift+Enter for new line · 🎤 for voice</p>
              {input.length > 0 && <p className="text-[10px]">{input.length} chars</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}