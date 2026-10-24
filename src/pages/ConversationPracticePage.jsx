// src/pages/ConversationPracticePage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Conversation Practice, restructured into two calm views:
//   hub  → choose how to practise (role-play / free talk), continue, browse
//   chat → one focused conversation with a slim header, a quiet feed, a coach
//          panel for hints/saved phrases and a single-line quick-reply bar
// All the AI / persistence / reward logic below is unchanged.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useDailyGoalsStore } from '../store/dailyGoalsStore'
import { useProgressStore } from '../store/progressStore'
import { aiService } from '../services/aiService'
import { SCENARIOS } from '../components/chatbot/ScenarioSelector'
import { QUICK_REPLIES as BASE_QUICK_REPLIES, HINTS as BASE_HINTS, AI_RESPONSES as MOCK_RESPONSES } from '../data/chatData'
import HanaSenseiCharacter2D from '../components/sensei/HanaSenseiCharacter2D'
import ConversationHub from '../components/conversation/ConversationHub'
import ChatTopBar from '../components/conversation/ChatTopBar'
import MessageBubble, { TypingIndicator } from '../components/conversation/MessageBubble'
import Composer from '../components/conversation/Composer'
import CoachPanel from '../components/conversation/CoachPanel'
import { normalizeProfile } from '../utils/userIdentity'
import { readSavedConversations } from '../utils/conversationHelpers'
import { useI18n } from '../i18n'
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
  const { t } = useI18n()
  const identity = normalizeProfile(profile, user)
  const { addXP } = useProgressStore()
  const { addChat } = useDailyGoalsStore()

  // Mode: 'scenario' | 'free'
  const [activeMode, setActiveMode] = useState('scenario')

  // View: 'hub' (choose) | 'chat' (practise). Tab inside the hub: 'scenario' | 'free'
  const [view, setView] = useState('hub')
  const [hubTab, setHubTab] = useState('scenario')
  const [coachOpen, setCoachOpen] = useState(false)
  
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0])
  const [completedScenarios, setCompletedScenarios] = useState(() => {
    try {
      const saved = localStorage.getItem('nihongo_completed_scenarios')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Free talk level
  const [freeTalkLevel, setFreeTalkLevel] = useState(identity.jlptLevel)

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


  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  // Timer counter for active study session
  useEffect(() => {
    if (view !== 'chat') return undefined
    timerRef.current = setInterval(() => {
      setSessionDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [view])

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
      toast.success(t('conversation.completed_toast', { title: selectedScenario.title }, `🎉 "${selectedScenario.title}" completed! +50 Wave XP`))
    } else {
      if (user?.id) {
        await addXP(10, user.id)
      } else {
        await addXP(10)
      }
      setSenseiCelebration(true)
      setTimeout(() => setSenseiCelebration(false), 3000)
      toast.success(t('conversation.review_toast', 'Practice review completed! +10 Wave XP'))
    }
  }

  // Open a conversation (the learner has chosen one in the hub)
  const openScenario = (scenario) => {
    setActiveMode('scenario')
    setSessionDuration(0)
    setMessages([])
    setCoachOpen(typeof window !== 'undefined' && window.innerWidth >= 1280)
    setView('chat')
    startScenarioChat(scenario, true)
  }

  const openFree = (level, topicStarter = null) => {
    setActiveMode('free')
    setFreeTalkLevel(level)
    setSessionDuration(0)
    setMessages([])
    setCoachOpen(typeof window !== 'undefined' && window.innerWidth >= 1280)
    setView('chat')
    startFreeChat(level, topicStarter, !topicStarter)
  }

  const backToHub = () => {
    window.speechSynthesis?.cancel()
    setSpeakingId(null)
    setCoachOpen(false)
    setIsFullscreen(false)
    setView('hub')
  }

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
      toast.error(t('conversation.no_speech', 'Speech synthesis not supported in this browser'))
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
  }, [slowAudio, speakingId, t])

  // Copy text helper
  const copyMessageText = (text, id) => {
    try {
      navigator.clipboard?.writeText(text)
    } catch (e) {
      console.debug('Clipboard unavailable:', e)
    }
    setCopiedId(id)
    toast.success(t('conversation.copied', 'Copied to clipboard!'))
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
    toast.success(t('conversation.exported', 'Conversation exported!'))
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
    toast.success(t('conversation.restarted', 'Conversation restarted'))
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

  const savedConversations = useMemo(
    () => (view === 'hub' ? readSavedConversations(SCENARIOS) : []),
    [view]
  )
  const savedPhrases = useMemo(() => messages.filter((m) => bookmarkedIds.has(m.id)), [messages, bookmarkedIds])
  const turns = useMemo(() => messages.filter((m) => m.role === 'user').length, [messages])
  const correctionCount = useMemo(() => messages.filter((m) => m.corrections).length, [messages])
  const alreadyCompleted = completedScenarios.includes(selectedScenario?.id)

  const toggleDisplay = (what) => {
    if (what === 'translations') setShowTranslations((v) => !v)
    if (what === 'romaji') setShowRomaji((v) => !v)
    if (what === 'slow') setSlowAudio((v) => !v)
  }

  const usePhrase = (phrase) => {
    setInput((prev) => (prev ? `${prev} ${phrase}` : phrase))
    setCoachOpen(window.innerWidth >= 1024)
    inputRef.current?.focus()
  }

  /* ── Hub ─────────────────────────────────────────────────────────────── */
  if (view === 'hub') {
    return (
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <ConversationHub
          username={identity.username}
          level={identity.jlptLevel}
          scenarios={SCENARIOS}
          completedIds={completedScenarios}
          savedConversations={savedConversations}
          tab={hubTab}
          onTabChange={setHubTab}
          freeLevel={freeTalkLevel}
          onFreeLevelChange={setFreeTalkLevel}
          levels={JLPT_LEVEL_PILLS}
          topics={FREE_TALK_TOPICS}
          onStartScenario={openScenario}
          onStartFree={openFree}
        />
      </div>
    )
  }

  /* ── Chat ────────────────────────────────────────────────────────────── */
  const isScenario = activeMode === 'scenario'
  const shell = isFullscreen
    ? 'fixed inset-0 z-50'
    : 'fixed inset-0 z-50 md:static md:z-auto md:h-[calc(100vh-5.5rem)] md:rounded-3xl md:border md:border-border'

  return (
    <div className={`flex flex-col overflow-hidden bg-background text-foreground ${shell}`} data-testid="conversation-chat">
      <ChatTopBar
        mode={activeMode}
        title={isScenario ? selectedScenario.title : t('conversation.free_title', 'Free talk with Hana-sensei (花先生)')}
        subtitle={isScenario ? selectedScenario.titleJP : t('conversation.free_sub', 'Open conversation')}
        icon={isScenario ? selectedScenario.icon : '💬'}
        level={isScenario ? selectedScenario.jlptLevel : freeTalkLevel}
        duration={sessionDuration}
        turns={turns}
        showTranslations={showTranslations}
        showRomaji={showRomaji}
        slowAudio={slowAudio}
        onToggle={toggleDisplay}
        onBack={backToHub}
        onExport={exportTranscript}
        onReset={handleReset}
        onFullscreen={() => setIsFullscreen((v) => !v)}
        isFullscreen={isFullscreen}
        canComplete={messages.length >= 2}
        alreadyCompleted={alreadyCompleted}
        onComplete={handleCompleteScenario}
      />

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-3 py-5 sm:px-5" data-testid="message-feed">
            <div className="mx-auto max-w-3xl space-y-5">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  showRomaji={showRomaji}
                  showTranslations={showTranslations}
                  speaking={speakingId === msg.id}
                  copied={copiedId === msg.id}
                  bookmarked={bookmarkedIds.has(msg.id)}
                  onSpeak={speakAudio}
                  onCopy={copyMessageText}
                  onBookmark={toggleBookmark}
                />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <Composer
            input={input}
            setInput={setInput}
            onSend={handleSendMessage}
            loading={loading}
            quickReplies={currentQuickReplies}
            inputRef={inputRef}
            coachOpen={coachOpen}
            onToggleCoach={() => setCoachOpen((v) => !v)}
          />
        </main>

        <CoachPanel
          open={coachOpen}
          onClose={() => setCoachOpen(false)}
          hints={currentHints}
          saved={savedPhrases}
          stats={{ duration: sessionDuration, turns, corrections: correctionCount }}
          onUsePhrase={usePhrase}
          onSpeak={speakAudio}
        />
      </div>

      {/* Scenario milestone celebration */}
      <AnimatePresence>
        {senseiCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed bottom-28 right-4 z-[70] flex max-w-sm items-center gap-4 rounded-3xl border border-amber-500/30 bg-surface/95 p-4 shadow-2xl backdrop-blur-md sm:right-8"
            role="status"
            aria-live="polite"
          >
            <HanaSenseiCharacter2D size="sm" state="celebrating" showStatusPill={false} interactive={false} />
            <div className="text-left">
              <div className="text-xs font-black uppercase tracking-wide text-amber-500">{t('conversation.mastered', 'Roleplay Mastered! 🎉')}</div>
              <div className="text-sm font-bold text-foreground">おめでとうございます！</div>
              <div className="text-[11px] text-muted-foreground">{t('conversation.proud', 'Hana-sensei is proud of your conversational progress!')}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
