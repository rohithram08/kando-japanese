// src/pages/ChatDojo.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Send, Bot, User, Volume2,
  RotateCcw, BookOpen, Copy, Check,
  Zap, GraduationCap, Coffee,
  ShoppingBag, Plane, Heart, Briefcase, UtensilsCrossed,
  Lightbulb, Mic, MicOff,
  Settings2, Download, ArrowLeft,
  X, Clock, Award, Bookmark, BookmarkCheck,
  HelpCircle, ChevronDown, ChevronUp,
  CheckCircle2, Sparkles, Timer,
} from 'lucide-react'
import { useDailyGoalsStore } from '../store/dailyGoalsStore'
import { useI18n } from '../i18n'

const SCENARIOS = [
  { id: 'free',       label: 'Free Talk',      Icon: Coffee,          color: 'from-blue-500 to-cyan-500',     desc: 'Open conversation on any topic' },
  { id: 'restaurant', label: 'Restaurant',     Icon: UtensilsCrossed, color: 'from-orange-500 to-red-500',    desc: 'Order food, ask about the menu' },
  { id: 'shopping',   label: 'Shopping',       Icon: ShoppingBag,     color: 'from-pink-500 to-rose-500',     desc: 'Buy items, ask prices & sizes' },
  { id: 'travel',     label: 'Travel',         Icon: Plane,           color: 'from-violet-500 to-purple-500', desc: 'Navigate stations, ask directions' },
  { id: 'work',       label: 'Workplace',      Icon: Briefcase,       color: 'from-emerald-500 to-teal-500',  desc: 'Office keigo & business talk' },
  { id: 'dating',     label: 'Making Friends', Icon: Heart,           color: 'from-rose-500 to-pink-500',     desc: 'Casual introductions & hobbies' },
]

const JLPT_LEVELS = [
  { level: 'N5', label: 'N5 · Beginner',    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30' },
  { level: 'N4', label: 'N4 · Elementary',  color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30' },
  { level: 'N3', label: 'N3 · Intermediate',color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { level: 'N2', label: 'N2 · Advanced',    color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  { level: 'N1', label: 'N1 · Fluent',      color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30' },
]

const QUICK_REPLIES = {
  free:       ['こんにちは！', '元気ですか？', '趣味は何ですか？', '日本語を勉強しています'],
  restaurant: ['メニューをください', 'おすすめは何ですか？', 'これをください', 'お会計お願いします'],
  shopping:   ['これはいくらですか？', 'もっと安いのはありますか？', '試着してもいいですか？', 'カードで払えますか？'],
  travel:     ['すみません、駅はどこですか？', '東京行きの電車はどれですか？', '片道切符をください', 'この電車は新宿に止まりますか？'],
  work:       ['お疲れ様です', '会議は何時からですか？', 'ご確認お願いいたします', '承知いたしました'],
  dating:     ['はじめまして！', 'どこから来ましたか？', '趣味は何ですか？', '今度一緒に遊びませんか？'],
}

const HINTS = {
  free:       ['Try introducing yourself with 私は〇〇です', 'Ask about hobbies: 趣味は何ですか？', 'Talk about weather: 今日はいい天気ですね'],
  restaurant: ['Ask for recommendations: おすすめは？', 'Order with: 〇〇をお願いします', 'Ask for the check: お会計お願いします'],
  shopping:   ['Ask the price: いくらですか？', 'Ask for a discount: 安くなりますか？', 'Say you want it: これをください'],
  travel:     ['Ask for directions: 〇〇はどこですか？', 'Buy a ticket: 切符をください', 'Confirm: 〇〇に止まりますか？'],
  work:       ['Greet colleagues: お疲れ様です', 'Ask about schedule: 予定を教えてください', 'Confirm: かしこまりました'],
  dating:     ['Introduce yourself: 私は〇〇です', 'Ask where from: どちらからですか？', 'Suggest meeting: また会いましょう'],
}

const AI_RESPONSES = {
  free: [
    { jp: 'こんにちは！今日はいい天気ですね。何について話しましょうか？', en: "Hello! It's nice weather today. What shall we talk about?", grammar: 'ね particle — seeking agreement', correction: null, newWords: ['天気 (てんき) — weather', '話す (はなす) — to talk'] },
    { jp: 'いいですね！私も日本語を教えるのが好きです。どのくらい勉強していますか？', en: "That's great! I also like teaching Japanese. How long have you been studying?", grammar: 'のが好き — expressing likes with verbs', correction: null, newWords: ['教える (おしえる) — to teach', '勉強 (べんきょう) — study'] },
    { jp: '素晴らしいですね！毎日少しずつ練習するのが大切ですよ。一緒に頑張りましょう！', en: "That's wonderful! Practicing a little every day is important. Let's do our best together!", grammar: 'のが大切 — expressing importance', correction: null, newWords: ['毎日 (まいにち) — every day', '練習 (れんしゅう) — practice', '頑張る (がんばる) — to do one\'s best'] },
    { jp: 'そうですか！好きな日本の食べ物はありますか？私はラーメンが大好きです。', en: "Is that so! Do you have a favorite Japanese food? I love ramen.", grammar: 'が大好き — expressing strong preference', correction: null, newWords: ['食べ物 (たべもの) — food', '大好き (だいすき) — love/really like'] },
  ],
  restaurant: [
    { jp: 'いらっしゃいませ！何名様ですか？お席にご案内いたします。', en: 'Welcome! How many people? I\'ll show you to your seat.', grammar: '何名様 — polite counter for people', correction: null, newWords: ['席 (せき) — seat', '案内 (あんない) — guidance'] },
    { jp: '本日のおすすめは天ぷら定食です。とても人気がありますよ。お飲み物はいかがですか？', en: "Today's recommendation is the tempura set meal. It's very popular. Would you like a drink?", grammar: 'いかがですか — polite "how about"', correction: null, newWords: ['定食 (ていしょく) — set meal', '飲み物 (のみもの) — drink'] },
    { jp: 'かしこまりました。少々お待ちください。お水もお持ちしますね。', en: 'Understood. Please wait a moment. I\'ll bring water as well.', grammar: 'お〜します — humble form of doing for someone', correction: null, newWords: ['少々 (しょうしょう) — a little/moment', '水 (みず) — water'] },
    { jp: 'お待たせいたしました。こちらが天ぷら定食です。ごゆっくりどうぞ。', en: 'Sorry for the wait. Here is the tempura set meal. Please enjoy at your leisure.', grammar: 'お待たせいたしました — humble apology for waiting', correction: null, newWords: ['ごゆっくり — at your leisure'] },
  ],
  shopping: [
    { jp: 'いらっしゃいませ！何かお探しですか？新商品がたくさん入りましたよ。', en: 'Welcome! Are you looking for something? We have lots of new items.', grammar: 'お探し — honorific form of 探す', correction: null, newWords: ['新商品 (しんしょうひん) — new product', '探す (さがす) — to look for'] },
    { jp: 'こちらは3,000円になります。色違いもございますよ。試着なさいますか？', en: 'This one is 3,000 yen. We also have other colors. Would you like to try it on?', grammar: 'なさいますか — honorific question', correction: null, newWords: ['色違い (いろちがい) — different color', '試着 (しちゃく) — fitting/trying on'] },
    { jp: 'はい、試着室はあちらです。サイズが合わなければお声がけください。', en: 'Yes, the fitting room is over there. If the size doesn\'t fit, please let me know.', grammar: '〜なければ — if not ~', correction: null, newWords: ['試着室 (しちゃくしつ) — fitting room', 'サイズ — size'] },
  ],
  travel: [
    { jp: '駅は、この道をまっすぐ行って、二つ目の信号を右に曲がってください。歩いて5分ぐらいです。', en: 'For the station, go straight, turn right at the second light. About a 5-minute walk.', grammar: 'て-form for sequential directions', correction: null, newWords: ['信号 (しんごう) — traffic light', '曲がる (まがる) — to turn'] },
    { jp: '新宿行きは3番線から出ます。次の電車は10分後です。快速と各停がありますが、どちらがいいですか？', en: 'Shinjuku-bound from platform 3. Next train in 10 min. Express or local — which do you prefer?', grammar: '〜行き — bound for ~', correction: null, newWords: ['快速 (かいそく) — express', '各停 (かくてい) — local'] },
    { jp: 'はい、この電車は新宿に止まりますよ。あと3駅です。降りるときにアナウンスがあります。', en: 'Yes, it stops at Shinjuku. 3 more stations. There\'ll be an announcement when to get off.', grammar: 'とき — when ~', correction: null, newWords: ['降りる (おりる) — to get off', 'アナウンス — announcement'] },
  ],
  work: [
    { jp: 'お疲れ様です。明日の会議の資料はもう準備できましたか？部長が確認したいそうです。', en: 'Good work. Are the materials for tomorrow\'s meeting ready? I hear the manager wants to check them.', grammar: '〜そうです — hearsay', correction: null, newWords: ['資料 (しりょう) — materials', '部長 (ぶちょう) — department manager'] },
    { jp: '会議は午後2時からです。会議室Bを予約してあります。プロジェクターも用意しましょうか？', en: 'Meeting from 2 PM. Room B is reserved. Shall I prepare the projector too?', grammar: '〜しましょうか — offering to do something', correction: null, newWords: ['予約 (よやく) — reservation', '用意 (ようい) — preparation'] },
    { jp: 'かしこまりました。すぐに対応いたします。他にご指示はございますか？', en: 'Understood. I\'ll handle it right away. Are there any other instructions?', grammar: 'ご指示 — honorific "instructions"', correction: null, newWords: ['対応 (たいおう) — handling', '指示 (しじ) — instructions'] },
  ],
  dating: [
    { jp: 'はじめまして！私はユキです。よろしくお願いします！どんな音楽が好きですか？', en: 'Nice to meet you! I\'m Yuki. What kind of music do you like?', grammar: 'どんな — what kind of', correction: null, newWords: ['音楽 (おんがく) — music'] },
    { jp: 'へぇ、面白いですね！私はJ-POPと料理が好きです。最近、新しいカフェを見つけました。', en: 'Oh interesting! I like J-POP and cooking. I recently found a new café.', grammar: '〜を見つけました — found ~', correction: null, newWords: ['最近 (さいきん) — recently', '見つける (みつける) — to find'] },
    { jp: 'いいですね！今度一緒にそのカフェに行きませんか？週末は空いていますか？', en: 'Great! Shall we go to that café together? Are you free on the weekend?', grammar: '〜ませんか — polite invitation', correction: null, newWords: ['週末 (しゅうまつ) — weekend', '空く (あく) — to be free'] },
  ],
}

const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const ChatDojo = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const [messages, setMessages]                 = useState([])
  const [input, setInput]                       = useState('')
  const [isTyping, setIsTyping]                 = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [selectedLevel, setSelectedLevel]       = useState('N5')
  const [showTranslation, setShowTranslation]   = useState(true)
  const [showGrammar, setShowGrammar]           = useState(true)
  const [autoSpeak, setAutoSpeak]               = useState(false)
  const [slowSpeech, setSlowSpeech]             = useState(false)
  const [copiedId, setCopiedId]                 = useState(null)
  const [showSettings, setShowSettings]         = useState(false)
  const [isListening, setIsListening]           = useState(false)
  const [messageCount, setMessageCount]         = useState(0)
  const [streak, setStreak]                     = useState(0)
  const [bookmarked, setBookmarked]             = useState(new Set())
  const [showHint, setShowHint]                 = useState(false)
  const [hintIndex, setHintIndex]               = useState(0)
  const [showEndModal, setShowEndModal]         = useState(false)
  const [sessionSeconds, setSessionSeconds]     = useState(0)
  const [sessionActive, setSessionActive]       = useState(false)
  const [wordsLearned, setWordsLearned]         = useState([])
  const [expandedMsg, setExpandedMsg]           = useState(null)

  const chatEndRef     = useRef(null)
  const inputRef       = useRef(null)
  const recognitionRef = useRef(null)
  const timerRef       = useRef(null)

  useEffect(() => {
    if (sessionActive) {
      timerRef.current = setInterval(() => setSessionSeconds(prev => prev + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [sessionActive])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (selectedScenario) inputRef.current?.focus()
  }, [selectedScenario])

  const toggleListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.')
      return
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = 'ja-JP'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (e) => { setInput(prev => prev + e.results[0][0].transcript); setIsListening(false) }
    recognition.onerror = () => setIsListening(false)
    recognition.onend   = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isListening])

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = slowSpeech ? 0.55 : 0.85
    window.speechSynthesis.speak(u)
  }, [slowSpeech])

  const copyText = useCallback((text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const toggleBookmark = (id) => {
    setBookmarked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectScenario = (scenarioId) => {
    setSelectedScenario(scenarioId)
    setMessages([])
    setMessageCount(0)
    setSessionSeconds(0)
    setSessionActive(true)
    setWordsLearned([])
    setStreak(0)
    setBookmarked(new Set())
    const greeting = AI_RESPONSES[scenarioId]?.[0]
    if (greeting) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          role: 'assistant',
          jp: greeting.jp,
          en: greeting.en,
          grammar: greeting.grammar,
          newWords: greeting.newWords || [],
          timestamp: new Date(),
        }])
        setWordsLearned(greeting.newWords || [])
        setIsTyping(false)
        if (autoSpeak) speak(greeting.jp)
      }, 1000)
    }
  }

  const handleSend = (text = input.trim()) => {
    if (!text || isTyping) return
    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setMessageCount(prev => prev + 1)
    setStreak(prev => prev + 1)
    useDailyGoalsStore.getState().addChat(1)
    setIsTyping(true)
    const responses = AI_RESPONSES[selectedScenario] || AI_RESPONSES.free
    const aiMsgCount = messages.filter(m => m.role === 'assistant').length
    const response = responses[Math.min(aiMsgCount, responses.length - 1)] ||
                     responses[Math.floor(Math.random() * responses.length)]
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        jp: response.jp,
        en: response.en,
        grammar: response.grammar,
        newWords: response.newWords || [],
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
      setWordsLearned(prev => { const all = [...prev, ...(response.newWords || [])]; return [...new Set(all)] })
      setIsTyping(false)
      if (autoSpeak) speak(response.jp)
    }, 1200 + Math.random() * 800)
  }

  const handleEndSession = () => {
    setSessionActive(false)
    clearInterval(timerRef.current)
    setShowEndModal(true)
  }

  const handleBack = () => {
    if (messages.length > 0) handleEndSession()
    else navigate(-1)
  }

  const handleEndConfirm = () => {
    setShowEndModal(false)
    setSelectedScenario(null)
    setMessages([])
    setMessageCount(0)
    setSessionSeconds(0)
    setWordsLearned([])
    setStreak(0)
  }

  const handleEndGoBack = () => { setShowEndModal(false); navigate(-1) }

  const handleExport = () => {
    const header = `Chat Dojo — ${SCENARIOS.find(s => s.id === selectedScenario)?.label}\nLevel: ${selectedLevel}\nDate: ${new Date().toLocaleDateString()}\nDuration: ${formatDuration(sessionSeconds)}\n${'─'.repeat(40)}\n\n`
    const body = messages.map(m =>
      m.role === 'user'
        ? `You: ${m.text}`
        : `Sensei: ${m.jp}\n  EN: ${m.en}\n  Grammar: ${m.grammar}`
    ).join('\n\n')
    const words = wordsLearned.length
      ? `\n\n${'─'.repeat(40)}\nWords Learned:\n${wordsLearned.map(w => `  • ${w}`).join('\n')}`
      : ''
    const blob = new Blob([header + body + words], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `chat-dojo-${selectedScenario}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getNextHint = () => {
    const hints = HINTS[selectedScenario] || HINTS.free
    setHintIndex(prev => (prev + 1) % hints.length)
    setShowHint(true)
  }

  const currentLevel    = JLPT_LEVELS.find(l => l.level === selectedLevel)
  const currentScenario = SCENARIOS.find(s => s.id === selectedScenario)

  // ── SCENARIO SELECTION SCREEN ──────────────────────────
  if (!selectedScenario) {
    return (
      <div className={`min-h-screen p-4 md:p-8 bg-background`}>
        <div className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </motion.button>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 text-foreground`}>
              Chat Dojo <span className="text-indigo-500">道場</span>
            </h1>
            <p className={`text-lg text-muted-foreground`}>
              Practice Japanese through real-life conversations
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <p className={`text-sm font-semibold mb-3 text-muted-foreground`}>Select your level</p>
            <div className="flex flex-wrap gap-2">
              {JLPT_LEVELS.map(({ level, label, color, bg }) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    selectedLevel === level
                      ? `${bg} ${color} border-current shadow-md`
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className={`text-sm font-semibold mb-3 text-muted-foreground`}>{t('sensei.scenario_mode', 'Choose a scenario')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCENARIOS.map(({ id, label, Icon, color, desc }, idx) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectScenario(id)}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-300 group overflow-hidden bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg dark:bg-gray-900 dark:border-gray-700/60 dark:hover:border-gray-600`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`font-bold text-base mb-1 text-foreground`}>{label}</h3>
                    <p className={`text-sm text-muted-foreground`}>{desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className={`mt-8 p-4 rounded-2xl border bg-indigo-50 border-indigo-100 dark:bg-indigo-500/5 dark:border-indigo-500/20`}
          >
            <div className="flex items-start gap-3">
              <Lightbulb className={`w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400`} />
              <div>
                <p className={`font-semibold text-sm mb-1 text-indigo-700 dark:text-indigo-300`}>Pro Tips</p>
                <ul className={`text-sm space-y-1 text-indigo-600/70 dark:text-indigo-400/70`}>
                  <li>• Type in Japanese or English — Sensei responds in Japanese</li>
                  <li>• 🎤 Mic button for voice input practice</li>
                  <li>• 🔊 Speaker icon to hear pronunciation</li>
                  <li>• 💡 Use hints when you're stuck</li>
                  <li>• 🔖 Bookmark important messages to review later</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── END SESSION MODAL ──────────────────────────────────
  const EndModal = () => (
    <AnimatePresence>
      {showEndModal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowEndModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl bg-surface border-border`}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-1 text-foreground`}>Session Complete!</h2>
              <p className={`text-sm text-muted-foreground`}>Great practice in {currentScenario?.label}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: MessageCircle, label: 'Messages',      value: messageCount,                  color: 'text-blue-400',   bg: 'bg-blue-500/10' },
                { icon: Clock,         label: 'Duration',      value: formatDuration(sessionSeconds), color: 'text-green-400',  bg: 'bg-green-500/10' },
                { icon: BookOpen,      label: 'Words Learned', value: wordsLearned.length,            color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { icon: Zap,           label: 'Streak',        value: streak,                         color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className={`p-3 rounded-2xl border text-center bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/60`}>
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mx-auto mb-1.5`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className={`text-lg font-bold text-foreground`}>{value}</p>
                  <p className={`text-xs text-muted-foreground`}>{label}</p>
                </div>
              ))}
            </div>

            {wordsLearned.length > 0 && (
              <div className={`mb-6 p-3 rounded-2xl border max-h-32 overflow-y-auto bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700/40`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground`}>Words Learned</p>
                <div className="flex flex-wrap gap-1.5">
                  {wordsLearned.map((word, i) => (
                    <span key={i} className={`px-2 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border dark:border-indigo-500/20`}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {bookmarked.size > 0 && (
              <div className={`mb-6 flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-yellow-50 border border-yellow-100 text-yellow-700 dark:bg-yellow-500/5 dark:border dark:border-yellow-500/20 dark:text-yellow-300`}>
                <BookmarkCheck className="w-4 h-4" />
                {bookmarked.size} message{bookmarked.size > 1 ? 's' : ''} bookmarked for review
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handleExport}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700`}
              >
                <Download className="w-4 h-4" /> Export Conversation
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleEndConfirm}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-shadow"
                >
                  <RotateCcw className="w-4 h-4" /> New Session
                </button>
                <button
                  onClick={handleEndGoBack}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800`}
                >
                  <ArrowLeft className="w-4 h-4" /> Leave
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ── CHAT SCREEN ────────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col bg-background`}>
      <EndModal />

      {/* Header */}
      <div className={`sticky top-0 z-30 border-b backdrop-blur-xl bg-white/80 border-gray-200 dark:bg-gray-950/80 dark:border-gray-800`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className={`p-2 rounded-xl transition-colors hover:bg-gray-100 text-gray-500 hover:text-gray-900 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white`}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentScenario?.color} flex items-center justify-center shadow-md`}>
              {currentScenario && <currentScenario.Icon className="w-4 h-4 text-white" />}
            </div>
            <div>
              <p className={`font-bold text-sm text-foreground`}>{currentScenario?.label}</p>
              <p className={`text-xs ${currentLevel?.color}`}>{currentLevel?.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground`}>
              <Timer className="w-3 h-3" />
              {formatDuration(sessionSeconds)}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-colors hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white`}
            >
              <Settings2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleEndSession}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:border dark:border-red-500/20`}
            >
              End
            </motion.button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`border-t px-4 py-3 bg-gray-50/80 border-gray-100 dark:bg-gray-900/50 dark:border-gray-800`}
            >
              <div className="max-w-4xl mx-auto flex flex-wrap gap-3">
                {[
                  { label: 'Show Translation', state: showTranslation, set: setShowTranslation },
                  { label: 'Show Grammar',     state: showGrammar,     set: setShowGrammar },
                  { label: 'Auto Speak',       state: autoSpeak,       set: setAutoSpeak },
                  { label: 'Slow Speech',      state: slowSpeech,      set: setSlowSpeech },
                ].map(({ label, state, set }) => (
                  <button
                    key={label}
                    onClick={() => set(!state)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      state
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                        : 'bg-white text-gray-500 border-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className={`w-3 h-3 ${state ? 'opacity-100' : 'opacity-40'}`} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-gradient-to-br from-rose-500 to-pink-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>

              <div className={`max-w-[80%] space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                {msg.role === 'user' ? (
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-md">
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ) : (
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-md shadow-sm border bg-surface border-border`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-base font-medium leading-relaxed text-foreground`}>{msg.jp}</p>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => speak(msg.jp)} className={`p-1 rounded-lg transition-colors text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:text-gray-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10`}>
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => copyText(msg.jp, msg.id)} className={`p-1 rounded-lg transition-colors text-gray-400 hover:text-green-500 hover:bg-green-50 dark:text-gray-500 dark:hover:text-green-400 dark:hover:bg-green-500/10`}>
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => toggleBookmark(msg.id)} className={`p-1 rounded-lg transition-colors ${bookmarked.has(msg.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400'}`}>
                          {bookmarked.has(msg.id) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {showTranslation && msg.en && (
                      <p className={`text-xs mt-1 text-muted-foreground`}>{msg.en}</p>
                    )}

                    {showGrammar && msg.grammar && (
                      <div className={`mt-2 flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg w-fit bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300`}>
                        <GraduationCap className="w-3 h-3" />
                        {msg.grammar}
                      </div>
                    )}

                    {msg.newWords?.length > 0 && (
                      <button
                        onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}
                        className={`mt-2 flex items-center gap-1 text-xs font-medium transition-colors text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {msg.newWords.length} new word{msg.newWords.length > 1 ? 's' : ''}
                        {expandedMsg === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}

                    <AnimatePresence>
                      {expandedMsg === msg.id && msg.newWords?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {msg.newWords.map((word, i) => (
                              <span key={i} className={`px-2 py-1 rounded-lg text-xs bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-500/10 dark:text-purple-300 dark:border dark:border-purple-500/20`}>
                                {word}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <p className={`text-[10px] px-1 text-muted-foreground`}>
                  {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className={`px-4 py-3 rounded-2xl rounded-tl-md border bg-surface border-border`}>
                <div className="flex gap-1 items-center h-5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className={`w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Hint Banner */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className={`mx-4 mb-2 p-3 rounded-xl border flex items-start gap-2 bg-yellow-50 border-yellow-100 dark:bg-yellow-500/5 dark:border-yellow-500/20`}
          >
            <Lightbulb className={`w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-500 dark:text-yellow-400`} />
            <p className={`text-sm flex-1 text-yellow-700 dark:text-yellow-300`}>
              {(HINTS[selectedScenario] || HINTS.free)[hintIndex]}
            </p>
            <button onClick={() => setShowHint(false)} className={`text-yellow-400 dark:text-yellow-500`}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Replies */}
      <div className="max-w-4xl mx-auto w-full px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(QUICK_REPLIES[selectedScenario] || []).map((reply) => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-500/50 dark:hover:text-indigo-300`}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className={`border-t px-4 py-3 bg-white/90 border-gray-200 dark:bg-gray-950/90 dark:border-gray-800 backdrop-blur-xl`}>
        <div className="max-w-4xl mx-auto flex gap-2 items-end">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={getNextHint}
            className={`p-2.5 rounded-xl transition-colors flex-shrink-0 hover:bg-gray-100 text-gray-400 hover:text-yellow-500 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-yellow-400`}
            title="Get hint"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>

          <div className={`flex-1 flex items-end gap-2 px-3 py-2 rounded-2xl border transition-all bg-gray-50 border-gray-200 focus-within:border-indigo-300 focus-within:bg-white dark:bg-gray-900 dark:border-gray-700 dark:focus-within:border-indigo-500/50`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder={t('sensei.ask_placeholder', 'Type in Japanese or English…')}
              rows={1}
              className={`flex-1 bg-transparent text-sm resize-none outline-none min-h-[24px] max-h-[120px] text-gray-900 placeholder-gray-400 dark:text-white dark:placeholder-gray-500`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={toggleListening}
              className={`p-1 rounded-lg transition-colors flex-shrink-0 mb-0.5 ${
                isListening
                  ? 'text-red-400 animate-pulse'
                  : 'text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
              input.trim() && !isTyping
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ChatDojo