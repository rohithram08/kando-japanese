// src/pages/ConversationPracticePage.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Send, Bot, Volume2, VolumeX,
  RotateCcw, Copy, Check, Sparkles, Clock, Target,
  Award, Bookmark, BookmarkCheck, Lightbulb, Languages,
  Mic, Trash2, Download, ChevronRight, ChevronLeft,
  Search, Maximize2, Minimize2, AlertCircle, CheckCircle2,
  Sliders, Coffee, Compass
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useDailyGoalsStore } from '../store/dailyGoalsStore'
import { useProgressStore } from '../store/progressStore'
import { aiService } from '../services/aiService'
import SpeechInput from '../components/chatbot/SpeechInput'
import ScenarioSelector, { SCENARIOS, CATEGORIES, DIFF_CONFIG } from '../components/chatbot/ScenarioSelector'
import { QUICK_REPLIES as BASE_QUICK_REPLIES, HINTS as BASE_HINTS, AI_RESPONSES as MOCK_RESPONSES } from '../data/chatData'
import HanaSenseiCharacter2D from '../components/sensei/HanaSenseiCharacter2D'
import toast from 'react-hot-toast'

/* ── Fallback quick replies generator ────────────────────────── */
const getQuickRepliesForScenario = (scenarioId, category) => {
  if (BASE_QUICK_REPLIES[scenarioId]) return BASE_QUICK_REPLIES[scenarioId]
  if (category === 'Basics') return ['こんにちは！', 'はじめまして！', 'お元気ですか？', 'よろしくお願いします']
  if (category === 'Daily Life') return ['すみません、お願いします', 'いくらですか？', 'これをください', 'ありがとうございます']
  if (category === 'Travel') return ['すみません、ここはどこですか？', '切符を一枚ください', '英語が話せますか？', '助けてください']
  if (category === 'Healthcare') return ['頭が痛いです', '熱があります', '薬をください', '大丈夫ですか？']
  if (category === 'Education') return ['質問があります', 'もう一度言ってください', 'わかりました', '宿題は何ですか？']
  if (category === 'Business') return ['お疲れ様です', 'お世話になっております', '承知いたしました', 'よろしくお願い申し上げます']
  if (category === 'Culture') return ['とても面白いですね', '日本の文化が好きです', 'おすすめは何ですか？', '写真を撮ってもいいですか？']
  return BASE_QUICK_REPLIES.free
}

/* ── Fallback hints generator ───────────────────────────────── */
const getHintsForScenario = (scenarioId, category) => {
  if (BASE_HINTS[scenarioId]) return BASE_HINTS[scenarioId]
  if (category === 'Basics') return ['Introduce yourself with: 私は〜です', 'Greet politely with: はじめまして', 'Ask a question with: 〜ですか？']
  if (category === 'Daily Life') return ['Order something: 〜をお願いします', 'Ask price: いくらですか？', 'Polite thank you: ありがとうございます']
  if (category === 'Travel') return ['Ask location: 〜はどこですか？', 'Ask for train: 〜行きの電車はどれですか？', 'Polite excuse: すみません']
  if (category === 'Healthcare') return ['State symptom: 〜が痛いです', 'Ask for medicine: 薬をください', 'Express condition: 気分が悪いです']
  if (category === 'Business') return ['Standard greeting: お疲れ様です', 'Polite acknowledgment: かしこまりました', 'Requesting check: ご確認ください']
  return BASE_HINTS.free
}

/* ── Helper: detect if string contains Japanese script ──────── */
const isJapaneseText = (text) => {
  if (!text) return false
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3000-\u303F]/.test(text)
}

/* ── Helper: find best Japanese TTS voice ───────────────────── */
const getJapaneseVoice = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  const nativeJa = voices.find((v) => v.lang.startsWith('ja') && v.localService)
  if (nativeJa) return nativeJa
  const anyJa = voices.find((v) => v.lang.startsWith('ja'))
  if (anyJa) return anyJa
  const byName = voices.find((v) =>
    v.name.toLowerCase().includes('japanese') ||
    v.name.toLowerCase().includes('ja-jp') ||
    v.name.toLowerCase().includes('haruka') ||
    v.name.toLowerCase().includes('kyoko') ||
    v.name.toLowerCase().includes('nanami')
  )
  return byName || null
}

const JLPT_LEVEL_PILLS = [
  { level: 'N5', label: 'N5 Beginner', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  { level: 'N4', label: 'N4 Elementary', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  { level: 'N3', label: 'N3 Intermediate', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  { level: 'N2', label: 'N2 Advanced', color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
  { level: 'N1', label: 'N1 Fluent', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
]

const FREE_TALK_TOPICS = [
  { id: 'daily', label: 'Daily Life & Routines', starter: 'こんにちは！普段の休日はどのように過ごしていますか？' },
  { id: 'food', label: 'Japanese Cuisine', starter: '日本の食べ物で一番好きなものは何ですか？ラーメンですか、寿司ですか？' },
  { id: 'travel', label: 'Travel in Japan', starter: '日本で行ってみたい場所はありますか？東京、京都、それとも北海道ですか？' },
  { id: 'hobbies', label: 'Hobbies & Media', starter: '最近ハマっている趣味や、好きなアニメ・音楽はありますか？' },
  { id: 'study', label: 'Japanese Study', starter: '日本語の勉強で一番難しいと感じることは何ですか？漢字ですか、文法ですか？' },
]

export default function ConversationPracticePage() {
  const { profile, user } = useAuthStore()
  const { addXP } = useProgressStore()
  const { addChat } = useDailyGoalsStore()

  // Mode: 'scenario' | 'free'
  const [activeMode, setActiveMode] = useState('scenario')
  
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0])
  const [showScenarioDrawer, setShowScenarioDrawer] = useState(true)
  const [completedScenarios, setCompletedScenarios] = useState(() => {
    try {
      const saved = localStorage.getItem('nihongo_completed_scenarios')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Free talk level
  const [freeTalkLevel, setFreeTalkLevel] = useState(profile?.current_level || 'N5')

  // Chat conversation state
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [speakingId, setSpeakingId] = useState(null)
  const [slowAudio, setSlowAudio] = useState(false)
  const [showRomaji, setShowRomaji] = useState(true)
  const [showTranslations, setShowTranslations] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const [sessionDuration, setSessionDuration] = useState(0)
  const [senseiCelebration, setSenseiCelebration] = useState(false)

  const currentSenseiState = useMemo(() => {
    if (senseiCelebration) return 'celebrating'
    if (loading) return 'thinking'
    if (input.trim().length > 0) return 'listening'
    return 'idle'
  }, [senseiCelebration, loading, input])

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  // Timer counter for active study session
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSessionDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Auto-scroll on new message
  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading])

  // Build System Prompt
  const buildSystemPrompt = useCallback((mode, sc, level) => {
    const userLevel = mode === 'scenario' ? (sc?.jlptLevel || 'N5') : level
    const lang = profile?.native_language || 'English'
    const context = mode === 'scenario'
      ? (sc?.systemPrompt || `Roleplay scenario: ${sc?.title}. Practice authentic conversation.`)
      : `Free conversation with a friendly Japanese tutor named Hana-sensei. Help the student practice conversational Japanese.`

    return `You are a Japanese language tutor named Hana-sensei. Context: ${context}

CRITICAL RULES:
1. ALWAYS respond ONLY in valid JSON with this EXACT structure:
{
  "message": "<your response in JAPANESE SCRIPT: kanji, hiragana, katakana>",
  "romaji": "<the romaji reading of your response>",
  "translation": "<${lang} translation of your response>",
  "grammar": "<brief key grammar point or particle usage in 1 line>",
  "corrections": null
}

2. The "message" field MUST be written in Japanese characters (日本語). NEVER write English or Romaji in the "message" field.
3. If the user makes a grammar, particle, or vocabulary mistake, provide constructive corrections:
{
  "message": "<Japanese continuation in 日本語>",
  "romaji": "<romaji reading>",
  "translation": "<${lang} translation>",
  "grammar": "<grammar note>",
  "corrections": {
    "original": "<what the student typed incorrectly>",
    "corrected": "<natural Japanese correction in 日本語>",
    "explanation": "<concise explanation in ${lang}>"
  }
}
4. Match vocabulary and sentence length to JLPT ${userLevel}. Keep responses engaging (1–3 sentences).
5. Output ONLY valid JSON without markdown formatting.`
  }, [profile])

  // Parse AI response safely
  const parseAIResponse = useCallback((response) => {
    let msg = response?.message || ''
    let romaji = response?.romaji || ''
    let trans = response?.translation || ''
    const grammar = response?.grammar || ''
    const corr = response?.corrections || null

    if (msg && !isJapaneseText(msg) && romaji && isJapaneseText(romaji)) {
      const temp = msg
      msg = romaji
      romaji = temp
    }

    return {
      message: msg || 'こんにちは！今日も頑張りましょう！',
      romaji,
      translation: trans,
      grammar,
      corrections: corr,
    }
  }, [])

  // Start scenario conversation
  const startScenarioChat = useCallback(async (scenario, restoreCache = true) => {
    setSelectedScenario(scenario)
    setLoading(true)

    const cacheKey = `nihongo_conv_scenario_${scenario.id}`
    if (restoreCache) {
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed)
            setLoading(false)
            if (window.innerWidth < 1024) {
              setShowScenarioDrawer(false)
            }
            return
          }
        }
      } catch (e) {
        console.debug('Failed to restore scenario conversation:', e)
      }
    }

    setMessages([])
    aiService.resetHistory()

    try {
      const systemPrompt = buildSystemPrompt('scenario', scenario, scenario.jlptLevel)
      const rawResponse = await aiService.startChat(systemPrompt, scenario.title)
      const parsed = parseAIResponse(rawResponse)

      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: parsed.message,
        romaji: parsed.romaji,
        translation: parsed.translation,
        grammar: parsed.grammar,
        corrections: null,
        timestamp: new Date(),
      }])
    } catch (err) {
      console.warn('Backend AI startChat offline, using rich mock fallback:', err.message)
      const mockList = MOCK_RESPONSES[scenario.id] || MOCK_RESPONSES.free
      const fallback = mockList[0] || {
        jp: `いらっしゃいませ！${scenario.titleJP}へようこそ。何から始めましょうか？`,
        en: `Welcome to ${scenario.title}! What shall we start with?`,
        grammar: 'へようこそ — Welcome to ~',
        newWords: [],
      }
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: fallback.jp,
        romaji: '',
        translation: fallback.en,
        grammar: fallback.grammar,
        corrections: null,
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
      if (window.innerWidth < 1024) {
        setShowScenarioDrawer(false)
      }
    }
  }, [buildSystemPrompt, parseAIResponse])

  // Start free conversation
  const startFreeChat = useCallback(async (level, topicStarter, restoreCache = true) => {
    setLoading(true)
    const cacheKey = `nihongo_conv_free_${level}`
    if (restoreCache && !topicStarter) {
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed)
            setLoading(false)
            return
          }
        }
      } catch (e) {
        console.debug('Failed to restore free conversation:', e)
      }
    }

    setMessages([])
    aiService.resetHistory()

    const greetingText = topicStarter || 'こんにちは！私は花先生（Hana-sensei）です。今日はどんなことについて話しましょうか？'

    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: greetingText,
      romaji: 'Konnichiwa! Watashi wa Hana-sensei desu. Kyou wa donna koto ni tsuite hanashimashou ka?',
      translation: "Hello! I'm Hana-sensei. What shall we talk about today?",
      grammar: '〜について話す — to talk about ~',
      corrections: null,
      timestamp: new Date(),
    }])
    setLoading(false)
  }, [])

  // Persist conversation on message update
  useEffect(() => {
    if (messages.length === 0) return
    const key = activeMode === 'scenario'
      ? `nihongo_conv_scenario_${selectedScenario?.id}`
      : `nihongo_conv_free_${freeTalkLevel}`
    try {
      localStorage.setItem(key, JSON.stringify(messages))
    } catch (e) {
      console.debug('Failed to cache conversation:', e)
    }
  }, [messages, activeMode, selectedScenario?.id, freeTalkLevel])

  // Scenario completion action with duplicate handling
  const handleCompleteScenario = async () => {
    if (!selectedScenario || activeMode !== 'scenario') return
    const isAlreadyCompleted = completedScenarios.includes(selectedScenario.id)

    if (!isAlreadyCompleted) {
      const nextCompleted = [...completedScenarios, selectedScenario.id]
      setCompletedScenarios(nextCompleted)
      try {
        localStorage.setItem('nihongo_completed_scenarios', JSON.stringify(nextCompleted))
      } catch (e) {
        console.debug('Failed to store completed scenarios:', e)
      }
      if (user?.id) {
        await addXP(50, user.id)
      } else {
        await addXP(50)
      }
      setSenseiCelebration(true)
      setTimeout(() => setSenseiCelebration(false), 4500)
      toast.success(`🎉 "${selectedScenario.title}" completed! +50 XP`)
    } else {
      if (user?.id) {
        await addXP(10, user.id)
      } else {
        await addXP(10)
      }
      setSenseiCelebration(true)
      setTimeout(() => setSenseiCelebration(false), 3000)
      toast.success(`Practice review completed! +10 XP`)
    }
  }

  // Initial load
  useEffect(() => {
    if (activeMode === 'scenario') {
      startScenarioChat(selectedScenario, true)
    } else {
      startFreeChat(freeTalkLevel, null, true)
    }
  }, [activeMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Send message
  const handleSendMessage = async (textToSend = input.trim()) => {
    if (!textToSend || loading) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Gamification rewards
    addChat(1)
    if (user?.id) {
      addXP(15, user.id)
    } else {
      addXP(15)
    }

    try {
      const systemPrompt = activeMode === 'scenario'
        ? buildSystemPrompt('scenario', selectedScenario, selectedScenario.jlptLevel)
        : buildSystemPrompt('free', null, freeTalkLevel)

      const rawResponse = await aiService.chat(messages, textToSend, systemPrompt)
      const parsed = parseAIResponse(rawResponse)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: parsed.message,
          romaji: parsed.romaji,
          translation: parsed.translation,
          grammar: parsed.grammar,
          corrections: parsed.corrections,
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      console.warn('AI chat error, using intelligent fallback:', err.message)
      const fallbackList = MOCK_RESPONSES[selectedScenario?.id] || MOCK_RESPONSES.free
      const randomFallback = fallbackList[Math.floor(Math.random() * fallbackList.length)] || {
        jp: 'いいですね！とても自然な日本語です。続けて話しましょう！',
        en: "That's great! Very natural Japanese. Let's keep talking!",
        grammar: '〜ましょう — polite proposal/invitation',
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: randomFallback.jp,
          romaji: '',
          translation: randomFallback.en,
          grammar: randomFallback.grammar,
          corrections: null,
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Audio speech synthesis
  const speakAudio = useCallback((text, msgId) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      toast.error('Speech synthesis not supported in this browser')
      return
    }

    if (speakingId === msgId) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = slowAudio ? 0.6 : 0.85
    utterance.pitch = 1.0

    const jpVoice = getJapaneseVoice()
    if (jpVoice) utterance.voice = jpVoice

    utterance.onstart = () => setSpeakingId(msgId)
    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)

    window.speechSynthesis.speak(utterance)
  }, [slowAudio, speakingId])

  // Copy text helper
  const copyMessageText = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Toggle bookmark
  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Export transcript
  const exportTranscript = () => {
    const lines = messages.map((m) => {
      const speaker = m.role === 'user' ? 'Student' : 'Hana-sensei'
      let line = `[${speaker}]: ${m.content}`
      if (m.translation) line += `\n   Translation: ${m.translation}`
      if (m.corrections) line += `\n   Correction: "${m.corrections.original}" -> "${m.corrections.corrected}" (${m.corrections.explanation})`
      return line
    })
    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nihongo-conversation-${activeMode}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Conversation exported!')
  }

  // Reset conversation
  const handleReset = () => {
    window.speechSynthesis?.cancel()
    setSpeakingId(null)
    const key = activeMode === 'scenario'
      ? `nihongo_conv_scenario_${selectedScenario?.id}`
      : `nihongo_conv_free_${freeTalkLevel}`
    try {
      localStorage.removeItem(key)
    } catch {}
    if (activeMode === 'scenario') {
      startScenarioChat(selectedScenario, false)
    } else {
      startFreeChat(freeTalkLevel, null, false)
    }
    toast.success('Conversation restarted')
  }

  const currentQuickReplies = useMemo(() => {
    if (activeMode === 'scenario') {
      return getQuickRepliesForScenario(selectedScenario.id, selectedScenario.category)
    }
    return BASE_QUICK_REPLIES.free
  }, [activeMode, selectedScenario])

  const currentHints = useMemo(() => {
    if (activeMode === 'scenario') {
      return getHintsForScenario(selectedScenario.id, selectedScenario.category)
    }
    return BASE_HINTS.free
  }, [activeMode, selectedScenario])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] bg-background text-foreground overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 h-screen' : ''}`}>
      
      {/* ── Top Workspace Bar ──────────────────────────────────────── */}
      <header className="px-4 py-3 border-b border-border bg-surface flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        
        {/* Left: Title & Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-sm">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-foreground">
                Conversation Practice
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                会話練習
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Interactive roleplay scenarios & open dialogue with live grammar corrections
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Segmented Control) */}
        <div className="flex items-center p-1 rounded-xl bg-muted border border-border">
          <button
            type="button"
            onClick={() => setActiveMode('scenario')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'scenario'
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>🎭 Scenario Roleplay</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">49</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('free')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'free'
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>💬 Free Talk</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-500">AI</span>
          </button>
        </div>

        {/* Right: Controls & Stats */}
        <div className="flex items-center gap-2">
          {/* Session Timer Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-xs font-mono text-muted-foreground border border-border/50">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(sessionDuration)}</span>
          </div>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setSlowAudio((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
              slowAudio ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-surface border-border text-muted-foreground'
            }`}
            title="Toggle normal vs slow audio playback"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{slowAudio ? '0.6x' : '0.85x'}</span>
          </button>

          {/* Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowTranslations((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              showTranslations ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface border-border text-muted-foreground'
            }`}
            title="Toggle English translations"
          >
            EN
          </button>

          {/* Romaji Toggle */}
          <button
            type="button"
            onClick={() => setShowRomaji((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              showRomaji ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface border-border text-muted-foreground'
            }`}
            title="Toggle Romaji romanization"
          >
            Romaji
          </button>

          {/* Export Transcript */}
          <button
            type="button"
            onClick={exportTranscript}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Export conversation transcript"
            aria-label="Export transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Reset conversation"
            aria-label="Reset chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:block"
            title="Toggle fullscreen"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Main Workspace Body ───────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Left Sidebar Drawer (Only for Scenario Mode) ─────────── */}
        {activeMode === 'scenario' && (
          <aside className={`w-80 md:w-96 border-r border-border bg-surface flex flex-col flex-shrink-0 transition-all z-20 ${
            showScenarioDrawer ? 'translate-x-0' : '-translate-x-full absolute inset-y-0 left-0'
          }`}>
            <ScenarioSelector
              selectedId={selectedScenario?.id}
              loading={loading}
              onSelect={(sc) => startScenarioChat(sc, false)}
              completedIds={completedScenarios}
            />
          </aside>
        )}

        {/* ── Chat Arena ────────────────────────────────────────────── */}
        <section className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
          
          {/* Arena Header Banner */}
          <div className="px-4 py-2.5 border-b border-border bg-surface/60 backdrop-blur-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              {activeMode === 'scenario' && (
                <button
                  type="button"
                  onClick={() => setShowScenarioDrawer((prev) => !prev)}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1 shrink-0"
                >
                  {showScenarioDrawer ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span className="hidden sm:inline">{showScenarioDrawer ? 'Hide Scenarios' : 'Select Scenario'}</span>
                </button>
              )}

              {activeMode === 'scenario' ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 flex items-center justify-center">
                    <HanaSenseiCharacter2D size="xs" state={currentSenseiState} showStatusPill={false} />
                  </div>
                  <span className="text-xl shrink-0" role="img" aria-label="scenario icon">{selectedScenario?.icon || '🍜'}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-sm text-foreground truncate">{selectedScenario?.title}</h2>
                      <span className="text-xs text-muted-foreground font-medium hidden md:inline">({selectedScenario?.titleJP})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border shrink-0">
                        {selectedScenario?.jlptLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {selectedScenario?.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 flex items-center justify-center">
                    <HanaSenseiCharacter2D size="xs" state={currentSenseiState} showStatusPill={false} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-sm text-foreground">Hana-sensei (花先生)</h2>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                        Online AI Tutor
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Open conversational practice adapted to your learning level
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Scenario Completion Button */}
            {activeMode === 'scenario' && messages.length >= 2 && (
              <button
                type="button"
                onClick={handleCompleteScenario}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
                  completedScenarios.includes(selectedScenario?.id)
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
                data-testid="complete-scenario-btn"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {completedScenarios.includes(selectedScenario?.id)
                    ? 'Completed (Practice +10 XP)'
                    : 'Complete Scenario (+50 XP)'}
                </span>
                <span className="sm:hidden">
                  {completedScenarios.includes(selectedScenario?.id) ? '✓ Done' : '+50 XP'}
                </span>
              </button>
            )}

            {/* Level selection for Free Talk Mode */}
            {activeMode === 'free' && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline">JLPT Level:</span>
                {JLPT_LEVEL_PILLS.map((pill) => (
                  <button
                    key={pill.level}
                    type="button"
                    onClick={() => {
                      setFreeTalkLevel(pill.level)
                      startFreeChat(pill.level)
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      freeTalkLevel === pill.level ? pill.color : 'bg-surface border-border text-muted-foreground'
                    }`}
                  >
                    {pill.level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Topic Starters for Free Talk Mode */}
          {activeMode === 'free' && messages.length <= 1 && (
            <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span>Conversation Starters:</span>
              </span>
              {FREE_TALK_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSendMessage(topic.starter)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-surface border border-border hover:border-primary/40 text-foreground shrink-0 transition-colors"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Message Feed ────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user'
              const isBookmarked = bookmarkedIds.has(msg.id)

              return (
                <div
                  key={msg.id}
                  data-testid="chat-message"
                  data-role={msg.role}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${isUser ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-full">
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0 mt-1 shadow-sm flex items-center justify-center">
                        <HanaSenseiCharacter2D size="xs" state="idle" showStatusPill={false} />
                      </div>
                    )}

                    <div className="flex flex-col">
                      {/* Bubble */}
                      <div className={`p-4 rounded-2xl relative shadow-sm ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-surface border border-border text-foreground rounded-tl-sm'
                      }`}>
                        
                        {/* Japanese text */}
                        <div className="text-base sm:text-lg font-medium leading-relaxed">
                          {msg.content}
                        </div>

                        {/* Romaji */}
                        {!isUser && showRomaji && msg.romaji && (
                          <div className="text-xs text-muted-foreground font-mono mt-1 pt-1 border-t border-border/40">
                            {msg.romaji}
                          </div>
                        )}

                        {/* English translation */}
                        {!isUser && showTranslations && msg.translation && (
                          <div className="text-xs text-muted-foreground italic font-sans mt-1">
                            {msg.translation}
                          </div>
                        )}

                        {/* Grammar keynote */}
                        {!isUser && msg.grammar && (
                          <div className="mt-2 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 rounded-md px-2 py-0.5 inline-block">
                            💡 {msg.grammar}
                          </div>
                        )}

                        {/* Audio & Copy action buttons */}
                        <div className="mt-2 flex items-center gap-1.5 pt-1 border-t border-border/20 text-xs text-muted-foreground">
                          <button
                            type="button"
                            onClick={() => speakAudio(msg.content, msg.id)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title="Listen to Japanese pronunciation"
                            aria-label="Listen audio"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${speakingId === msg.id ? 'text-primary animate-pulse' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyMessageText(msg.content, msg.id)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title="Copy text"
                            aria-label="Copy text"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleBookmark(msg.id)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title="Bookmark phrase"
                            aria-label="Bookmark"
                          >
                            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Live Grammar Corrections Card (Appears if user made a mistake) */}
                      {!isUser && msg.corrections && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs animate-in fade-in">
                          <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Grammar Tip & Correction</span>
                          </div>
                          <div className="space-y-1">
                            <div className="line-through text-muted-foreground">
                              ❌ {msg.corrections.original}
                            </div>
                            <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                              ✅ {msg.corrections.corrected}
                            </div>
                            <div className="text-muted-foreground text-[11px] pt-1">
                              {msg.corrections.explanation}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 flex items-center justify-center">
                  <HanaSenseiCharacter2D size="xs" state="thinking" showStatusPill={false} />
                </div>
                <div className="p-3 rounded-2xl bg-surface border border-border flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-300" />
                  <span className="ml-1 text-[11px] font-medium text-muted-foreground">Thinking... 考え中</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Contextual Hints & Quick Replies Bar ────────────────── */}
          <div className="px-4 pt-2 pb-1 border-t border-border bg-surface flex flex-col gap-2">
            
            {/* Quick Reply Chips */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <span className="text-[11px] font-bold text-muted-foreground shrink-0 uppercase tracking-wider">
                Quick:
              </span>
              {currentQuickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  type="button"
                  data-testid="quick-reply-btn"
                  onClick={() => handleSendMessage(reply)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full text-xs bg-muted hover:bg-muted/80 text-foreground border border-border/80 shrink-0 transition-colors disabled:opacity-50"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Contextual Hints Drawer */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <span className="text-[11px] font-bold text-amber-500 shrink-0 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                <span>Hints:</span>
              </span>
              {currentHints.map((hint, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0"
                >
                  {hint}
                </span>
              ))}
            </div>
          </div>

          {/* ── Input Box & Voice Controls ─────────────────────────── */}
          <div className="p-4 border-t border-border bg-surface">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response in Japanese (Hiragana, Katakana, Kanji) or English..."
                disabled={loading}
                data-testid="conversation-input"
                className="flex-1 px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />

              {/* Speech Recognition Mic Input */}
              <SpeechInput
                onTranscript={(transcript) => {
                  setInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
                }}
                disabled={loading}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-primary/20"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </section>
      </div>

      {/* ── Scenario Milestone Celebration Overlay ── */}
      <AnimatePresence>
        {senseiCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed bottom-24 right-8 z-50 p-4 rounded-3xl bg-surface/95 backdrop-blur-md border border-amber-500/30 shadow-2xl flex items-center gap-4 max-w-sm pointer-events-none"
            role="status"
            aria-live="polite"
          >
            <HanaSenseiCharacter2D
              size="sm"
              state="celebrating"
              showStatusPill={false}
              interactive={false}
            />
            <div className="text-left">
              <div className="text-xs font-black text-amber-500 uppercase tracking-wide">
                Roleplay Mastered! 🎉
              </div>
              <div className="text-sm font-bold text-foreground">
                おめでとうございます！
              </div>
              <div className="text-[11px] text-muted-foreground">
                Hana-sensei is proud of your conversational progress!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
