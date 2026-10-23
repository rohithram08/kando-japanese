// src/pages/ProfilePage.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Upload, X, User, Trophy, Flame, Star,
  Award, Target, BookOpen, TrendingUp, BarChart3,
  GraduationCap, UserPlus, UserCheck, MessageCircle,
  Settings, Zap, Eye, Pen, Volume2, Languages,
  BookMarked, Brain, Shield, Medal, Crown,
  Lock, ChevronDown, ChevronUp, CheckCircle2, ArrowLeft,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useSettingsStore } from '../store/settingsStore'
import { useNavigate } from 'react-router-dom'
import { getProgress, getStreakHistory } from '../api/progress'
import { updateProfile } from '../api/users'
import { uploadAvatar } from '../api/upload'
import { useI18n } from '../i18n'
import {
  LEVEL_DATA,
  RANKS,
  LEVEL_DETAILS,
  computeSkillData,
} from '../config/gamificationConfig'
import { ACHIEVEMENTS } from '../data/achievementsData'
import toast from 'react-hot-toast'

// ── Avatar Collection ──────────────────────────────────────
const AVATARS = [
  { id: 'avatar-1',  emoji: '🥷',  label: 'Ninja',       bg: 'from-gray-700 to-gray-900' },
  { id: 'avatar-2',  emoji: '🎌',  label: 'Japan Flag',  bg: 'from-red-400 to-red-600' },
  { id: 'avatar-3',  emoji: '🌸',  label: 'Sakura',      bg: 'from-pink-400 to-pink-600' },
  { id: 'avatar-4',  emoji: '⛩️',  label: 'Torii Gate',  bg: 'from-orange-400 to-red-500' },
  { id: 'avatar-5',  emoji: '🐉',  label: 'Dragon',      bg: 'from-green-500 to-emerald-700' },
  { id: 'avatar-6',  emoji: '🗻',  label: 'Mt. Fuji',    bg: 'from-blue-400 to-indigo-600' },
  { id: 'avatar-7',  emoji: '🎎',  label: 'Dolls',       bg: 'from-rose-400 to-rose-600' },
  { id: 'avatar-8',  emoji: '🍣',  label: 'Sushi',       bg: 'from-amber-400 to-orange-500' },
  { id: 'avatar-9',  emoji: '🎋',  label: 'Tanabata',    bg: 'from-emerald-400 to-teal-600' },
  { id: 'avatar-10', emoji: '🏯',  label: 'Castle',      bg: 'from-yellow-500 to-amber-600' },
  { id: 'avatar-11', emoji: '🎐',  label: 'Wind Chime',  bg: 'from-cyan-400 to-blue-500' },
  { id: 'avatar-12', emoji: '🐱',  label: 'Cat',         bg: 'from-violet-400 to-purple-600' },
  { id: 'avatar-13', emoji: '👺',  label: 'Tengu',       bg: 'from-red-600 to-red-800' },
  { id: 'avatar-14', emoji: '🦊',  label: 'Fox',         bg: 'from-orange-400 to-amber-500' },
  { id: 'avatar-15', emoji: '🎴',  label: 'Hanafuda',    bg: 'from-indigo-500 to-purple-700' },
]

const RANK_ICONS = {
  Shield, Star, Award, Medal, Trophy, Crown
}

const MILESTONES_CONFIG = [
  { reqXp: 100,   labelKey: 'milestones.first_steps', fallback: 'First Steps',    Icon: Star },
  { reqXp: 500,   labelKey: 'milestones.xp_hunter',   fallback: 'XP Hunter',      Icon: Zap },
  { reqXp: 1000,  labelKey: 'milestones.scholar',     fallback: 'Scholar',        Icon: BookOpen },
  { reqXp: 2500,  labelKey: 'milestones.n5_grad',     fallback: 'N5 Graduate',    Icon: GraduationCap },
  { reqXp: 5000,  labelKey: 'milestones.n4_chal',     fallback: 'N4 Challenger',  Icon: Trophy },
  { reqXp: 10000, labelKey: 'milestones.n3_warrior',  fallback: 'N3 Warrior',     Icon: Crown },
]

const SKILL_ITEMS = [
  { key: 'reading',   labelKey: 'skill.reading',   fallback: 'Reading',    Icon: Eye,            color: 'blue'   },
  { key: 'writing',   labelKey: 'skill.writing',   fallback: 'Writing',    Icon: Pen,            color: 'purple' },
  { key: 'listening', labelKey: 'skill.listening', fallback: 'Listening',  Icon: Volume2,        color: 'green'  },
  { key: 'speaking',  labelKey: 'skill.speaking',  fallback: 'Speaking',   Icon: MessageCircle,  color: 'orange' },
  { key: 'grammar',   labelKey: 'skill.grammar',   fallback: 'Grammar',    Icon: Languages,      color: 'red'    },
  { key: 'vocab',     labelKey: 'skill.vocab',     fallback: 'Vocabulary', Icon: BookMarked,     color: 'cyan'   },
]

// ── Helpers ────────────────────────────────────────────────
const formatNumber = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

// ── Animated Counter ──────────────────────────────────────
function AnimatedCounter({ value, duration = 1.5 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = null
    const num = typeof value === 'number' ? value : 0
    if (!num) { setDisplay(0); return }
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * num))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value, duration])
  return <span>{display.toLocaleString()}</span>
}

// ── Weekly Activity Chart ─────────────────────────────────
function WeeklyActivityChart({ locale = 'en' }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    let mounted = true
    getStreakHistory()
      .then((res) => {
        if (!mounted) return
        const raw = Array.isArray(res) ? res : (res?.streaks ?? [])
        setHistory(raw)
      })
      .catch(() => {
        if (mounted) setHistory([])
      })
    return () => { mounted = false }
  }, [])

  const last7Days = useMemo(() => {
    const today = new Date()
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const match = history.find((h) => h.date === dateStr || h.date?.startsWith(dateStr))
      let dayName = ''
      try {
        dayName = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d)
      } catch {
        dayName = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(d)
      }
      const xpEarned = match?.xpEarned ?? match?.xp_earned ?? (match?.lessonsCompleted ? match.lessonsCompleted * 50 : 0)
      days.push({
        dayName,
        xp: xpEarned,
        isToday: i === 0,
      })
    }
    return days
  }, [history, locale])

  const maxVal = Math.max(...last7Days.map((d) => d.xp), 100)

  return (
    <div className="flex items-end justify-between gap-2 h-32 px-2">
      {last7Days.map((item, i) => {
        const height = Math.max((item.xp / maxVal) * 100, 4)
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <motion.div
              className="relative w-full flex justify-center"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
            >
              <div
                className={`w-full max-w-[32px] rounded-t-lg relative group cursor-pointer transition-colors ${
                  item.isToday
                    ? 'bg-gradient-to-t from-purple-600 to-purple-400'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
                style={{ minHeight: 4 }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 bg-gray-800 text-white dark:bg-gray-700 dark:text-white pointer-events-none">
                  {item.xp} XP
                </div>
              </div>
            </motion.div>
            <span className={`text-[10px] font-medium ${item.isToday ? 'text-purple-500 font-bold' : 'text-muted-foreground'}`}>
              {item.dayName}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Streak Calendar ───────────────────────────────────────
function StreakCalendar({ streakDays, hasStudiedToday = false }) {
  const count = 28
  const days = useMemo(() => {
    const today = new Date()
    const pastStreakAllowance = streakDays - (hasStudiedToday ? 1 : 0)
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (count - 1 - i))
      const isToday = i === count - 1
      const isActive = isToday
        ? hasStudiedToday
        : (pastStreakAllowance > 0 && i >= (count - 1) - pastStreakAllowance)
      return { date: d, active: isActive, today: isToday }
    })
  }, [streakDays, hasStudiedToday])

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {['M','T','W','T','F','S','S'].map((d, i) => (
        <div key={i} className="text-center text-[9px] font-bold pb-1 text-muted-foreground">{d}</div>
      ))}
      {days.map((day, i) => (
        <motion.div key={i}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: i * 0.012 }}
          className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-all ${
            day.today
              ? day.active
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white ring-2 ring-emerald-400 ring-offset-1'
                : 'border-2 border-dashed border-purple-400 text-purple-600 dark:text-purple-300 animate-pulse'
              : day.active
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
              : 'bg-muted text-muted-foreground'
          }`}
          title={day.today ? (day.active ? 'Streak recorded today!' : 'Pending today') : day.active ? 'Streak completed' : ''}
        >
          {day.active || day.today ? day.date.getDate() : ''}
        </motion.div>
      ))}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────
function ProgressBar({ value, max, color = 'purple', height = 'h-2' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const colors = {
    purple: 'from-purple-500 to-purple-400',
    green:  'from-green-500 to-emerald-400',
    blue:   'from-blue-500 to-blue-400',
    red:    'from-red-500 to-rose-400',
    yellow: 'from-yellow-500 to-amber-400',
  }
  return (
    <div className={`w-full ${height} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full rounded-full bg-gradient-to-r ${colors[color] || colors.purple}`}
      />
    </div>
  )
}

// ── Mock Social Data ──────────────────────────────────────
const MOCK_FOLLOWERS = [
  { id: 'user-1', name: 'SakuraChan',   emoji: '🌸', bg: 'from-pink-400 to-pink-600',      level: 'N4', xp: 2400 },
  { id: 'user-2', name: 'KanjiMaster',  emoji: '⛩️', bg: 'from-green-500 to-emerald-700',  level: 'N3', xp: 5200 },
  { id: 'user-3', name: 'TokyoDrifter', emoji: '🗻', bg: 'from-orange-400 to-red-500',      level: 'N5', xp: 800  },
  { id: 'user-4', name: 'NihonGoGo',   emoji: '🎌', bg: 'from-blue-400 to-indigo-600',     level: 'N4', xp: 1900 },
  { id: 'user-6', name: 'SushiLover',  emoji: '🍣', bg: 'from-amber-400 to-orange-500',    level: 'N5', xp: 450  },
]
const MOCK_FOLLOWING = [
  { id: 'user-2', name: 'KanjiMaster',  emoji: '⛩️', bg: 'from-green-500 to-emerald-700',  level: 'N3', xp: 5200 },
  { id: 'user-3', name: 'TokyoDrifter', emoji: '🗻', bg: 'from-orange-400 to-red-500',      level: 'N5', xp: 800  },
  { id: 'user-5', name: 'SenseiMode',  emoji: '🥷', bg: 'from-gray-700 to-gray-900',        level: 'N2', xp: 8100 },
]

// ── User List Item ────────────────────────────────────────
function UserListItem({ u, isFollowing, onToggleFollow, onViewProfile }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => onViewProfile(u.id)}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${u.bg} flex-shrink-0`}>{u.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate hover:underline text-foreground">{u.name}</div>
          <div className="text-xs truncate text-muted-foreground">{u.level} · {u.xp.toLocaleString()} XP</div>
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => onToggleFollow(u.id)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
          isFollowing
            ? 'bg-gray-100 text-gray-500 border border-gray-200 hover:border-red-300 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400 dark:border dark:border-gray-700 dark:hover:border-red-500/50 dark:hover:text-red-400'
            : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm shadow-purple-500/20'
        }`}
      >
        {isFollowing ? <><UserCheck className="w-3.5 h-3.5" /> Following</> : <><UserPlus className="w-3.5 h-3.5" /> Follow</>}
      </motion.button>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════
// ── MAIN COMPONENT ────────────────────────────────────────
// ══════════════════════════════════════════════════════════
export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuthStore()
  const progress = useProgressStore()
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || 'en')
  const { t } = useI18n()
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const [uploadLoading, setUploadLoading]             = useState(false)
  const [showAvatarPicker, setShowAvatarPicker]       = useState(false)
  const [selectedAvatar, setSelectedAvatar]           = useState(profile?.avatar_id || null)
  const [avatarUrl, setAvatarUrl]                     = useState(profile?.avatar_url || null)
  const [previewUrl, setPreviewUrl]                   = useState(null)
  const [showFollowersModal, setShowFollowersModal]   = useState(false)
  const [followersTab, setFollowersTab]               = useState('followers')
  const [stats, setStats]                             = useState(null)
  const [activeTab, setActiveTab]                     = useState('overview')
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [followingIds, setFollowingIds]               = useState(['user-2', 'user-3', 'user-5'])

  useEffect(() => {
    if (profile) {
      setSelectedAvatar(profile.avatar_id || null)
      setAvatarUrl(profile.avatar_url || null)
    }
  }, [profile])

  useEffect(() => {
    if (user?.id) loadStats()
  }, [user?.id])

  const loadStats = async () => {
    try {
      const data = await getProgress()
      setStats({
        lessons: data.lessonsCompleted || 0,
        kanji: data.kanjiLearned || 0,
        vocab: data.vocabLearned || 0,
        mastered: data.cardsMastered || 0,
      })
    } catch (e) {
      console.error('Error loading profile progress stats:', e)
    }
  }

  // Derive consolidated progress numbers from store + API
  const currentLevel  = profile?.current_level || progress.jlptLevel || 'N5'
  const xp            = profile?.xp_points || progress.totalXP || 0
  const streakDays    = profile?.streak_days || progress.streak || 0
  const hasStudiedToday = Boolean(progress.isActiveToday || (progress.dailyXP && progress.dailyXP > 0))
  const levelInfo     = LEVEL_DATA[currentLevel] || LEVEL_DATA.N5
  const xpInLevel     = Math.max(xp - levelInfo.min, 0)
  const xpNeeded      = Math.max(levelInfo.max - levelInfo.min, 1)

  // Rank derivation
  const rank = useMemo(() => {
    return RANKS.reduce((acc, r) => (xp >= r.xp ? r : acc), RANKS[0])
  }, [xp])
  const RankIcon = RANK_ICONS[rank.icon] || Shield

  // Skill calculations
  const statsForSkills = useMemo(() => ({
    lessons: stats?.lessons ?? progress.lessonsCompleted ?? 0,
    kanji:   stats?.kanji ?? progress.kanjiLearned ?? 0,
    vocab:   stats?.vocab ?? progress.vocabLearned ?? 0,
  }), [stats, progress.lessonsCompleted, progress.kanjiLearned, progress.vocabLearned])

  const skillData = useMemo(() => computeSkillData(statsForSkills), [statsForSkills])

  // Real achievements calculation from achievementsData
  const statsForAchievements = useMemo(() => ({
    lessonsCompleted: stats?.lessons ?? progress.lessonsCompleted ?? 0,
    kanjiLearned:     stats?.kanji ?? progress.kanjiLearned ?? 0,
    vocabLearned:     stats?.vocab ?? progress.vocabLearned ?? 0,
    cardsMastered:    stats?.mastered ?? progress.cardsMastered ?? 0,
    streak:           streakDays,
    totalXP:          xp,
    grammarLearned:   progress.grammarLearned ?? 0,
  }), [stats, progress.lessonsCompleted, progress.kanjiLearned, progress.vocabLearned, progress.cardsMastered, progress.grammarLearned, streakDays, xp])

  const realAchievements = useMemo(() => {
    return ACHIEVEMENTS.map((a) => {
      const isUnlocked = a.condition ? Boolean(a.condition(statsForAchievements)) : false
      return {
        id: a.id,
        icon: a.emoji,
        title: a.title,
        desc: a.desc,
        unlocked: isUnlocked,
      }
    }).sort((a, b) => (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0))
  }, [statsForAchievements])

  const unlockedCount = realAchievements.filter((a) => a.unlocked).length
  const lockedCount = realAchievements.length - unlockedCount

  const getDisplayAvatar = () => {
    if (previewUrl)     return { type: 'image', src: previewUrl }
    if (avatarUrl)      return { type: 'image', src: avatarUrl }
    if (selectedAvatar) {
      const av = AVATARS.find(a => a.id === selectedAvatar)
      if (av) return { type: 'emoji', ...av }
    }
    return { type: 'default' }
  }
  const displayAvatar = getDisplayAvatar()

  // ── File upload ────────────────────────────────────────
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error(t('toast.select_image_error', 'Please select an image file'))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('toast.image_too_large', 'Image must be under 5MB'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result)
    reader.readAsDataURL(file)
    setUploadLoading(true)
    try {
      const res = await uploadAvatar(file)
      const newUrl = res.url || res.avatar_url
      setAvatarUrl(newUrl)
      setSelectedAvatar(null)
      await updateProfile({ avatarUrl: newUrl, avatarId: null })
      if (refreshProfile) refreshProfile()
      toast.success(t('toast.avatar_updated', 'Avatar updated!'))
      setShowAvatarPicker(false)
    } catch {
      toast.error(t('toast.avatar_upload_failed', 'Failed to upload avatar'))
      setPreviewUrl(null)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleAvatarSelect = async (av) => {
    setSelectedAvatar(av.id)
    setAvatarUrl(null)
    setPreviewUrl(null)
    setUploadLoading(true)
    try {
      await updateProfile({ avatarId: av.id, avatarUrl: null })
      if (refreshProfile) refreshProfile()
      toast.success(t('toast.avatar_updated', 'Avatar updated!'))
      setShowAvatarPicker(false)
    } catch {
      toast.error(t('toast.avatar_update_failed', 'Failed to update avatar'))
    } finally {
      setUploadLoading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setUploadLoading(true)
    try {
      await updateProfile({ avatarId: null, avatarUrl: null })
      setSelectedAvatar(null)
      setAvatarUrl(null)
      setPreviewUrl(null)
      setShowAvatarPicker(false)
      if (refreshProfile) refreshProfile()
      toast.success(t('toast.avatar_removed', 'Avatar removed'))
    } catch {
      toast.error(t('toast.avatar_remove_failed', 'Failed to remove avatar'))
    } finally {
      setUploadLoading(false)
    }
  }

  const handleToggleFollow = (id) => setFollowingIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const handleViewProfile  = (id) => { setShowFollowersModal(false); navigate(`/profile/${id}`) }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(displayLanguage, { year: 'numeric', month: 'long' })
    : null

  const statCards = [
    { label: t('profile.total_xp', 'Total XP'),           value: xp,                                Icon: Star,     color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
    { label: t('profile.day_streak', 'Day Streak'),       value: streakDays,                        Icon: Flame,    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: t('profile.lessons_done', 'Stories Read'),   value: stats?.lessons ?? progress.lessonsCompleted ?? 0, Icon: BookOpen, color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/10'   },
    { label: t('profile.kanji_learned', 'Kanji Learned'), value: stats?.kanji ?? progress.kanjiLearned ?? 0,     Icon: Brain,    color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ]

  const levelReq = LEVEL_DETAILS[currentLevel] || LEVEL_DETAILS.N5

  // ── Reusable Card ──────────────────────────────────────
  const Card = ({ children, className = '', delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className={`rounded-2xl border shadow-sm bg-surface border-border ${className}`}
    >{children}</motion.div>
  )

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">

        {/* Back Button */}
        <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} whileHover={{ x: -3 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" /> {t('profile.back', 'Back')}
        </motion.button>

        {/* ── HERO BANNER ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl">
          <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-6 pb-28 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl" />
              <motion.div animate={{ y: [0,-10,0], rotate: [0,5,0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-4 right-8 text-4xl opacity-20">🌸</motion.div>
              <motion.div animate={{ y: [0,10,0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute top-8 right-32 text-2xl opacity-15">⛩️</motion.div>
              <motion.div animate={{ y: [0,-8,0], x: [0,5,0] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-20 right-16 text-3xl opacity-10">🎌</motion.div>
            </div>
            <div className="relative z-10 flex justify-end">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/settings')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors backdrop-blur-sm"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Profile content overlapping banner */}
          <div className="relative px-6 -mt-20 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative group">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAvatarPicker(true)}
                  className={`w-28 h-28 rounded-2xl border-4 shadow-xl overflow-hidden cursor-pointer border-surface ${
                    displayAvatar.type === 'emoji' ? `bg-gradient-to-br ${displayAvatar.bg}` : displayAvatar.type === 'image' ? '' : 'bg-muted'
                  }`}
                >
                  {displayAvatar.type === 'image' ? (
                    <img src={displayAvatar.src} alt="Avatar" className="w-full h-full object-cover" />
                  ) : displayAvatar.type === 'emoji' ? (
                    <div className="w-full h-full flex items-center justify-center text-4xl">{displayAvatar.emoji}</div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-2xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                {uploadLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h1 className="text-2xl font-bold truncate text-foreground">
                  {profile?.username || user?.username || user?.email?.split('@')[0] || t('profile.default_learner', 'Learner')}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                    <GraduationCap className="w-3 h-3" />{currentLevel} · {levelInfo.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300">
                    <RankIcon className="w-3 h-3" />{rank.title}
                  </span>
                </div>
                {memberSince && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    {t('profile.member_since', { date: memberSince }, `Member since ${memberSince}`)}
                  </p>
                )}
              </div>

              {/* Social counts */}
              <div className="flex gap-4 text-center">
                {[
                  { label: t('profile.following', 'Following'), count: MOCK_FOLLOWING.length, tab: 'following' },
                  { label: t('profile.followers', 'Followers'), count: MOCK_FOLLOWERS.length, tab: 'followers' },
                ].map(({ label, count, tab }) => (
                  <button key={tab} onClick={() => { setFollowersTab(tab); setShowFollowersModal(true) }}
                    className="flex flex-col items-center hover:opacity-80 transition-opacity"
                  >
                    <span className="text-lg font-bold text-foreground">{count}</span>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-5 p-4 rounded-2xl border bg-surface border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t('profile.progress_title', { level: currentLevel }, `${currentLevel} Progress`)}
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                  <AnimatedCounter value={xp} /> / {formatNumber(levelInfo.max)} XP
                </span>
              </div>
              <ProgressBar value={xpInLevel} max={xpNeeded} color="purple" height="h-3" />
              {levelInfo.next && (
                <p className="text-xs mt-1.5 text-muted-foreground">
                  {t('profile.xp_until_next', { xp: formatNumber(levelInfo.max - xp), next: levelInfo.next }, `${formatNumber(levelInfo.max - xp)} XP until ${levelInfo.next}`)}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ───────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCards.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-2xl border p-4 shadow-sm bg-surface border-border"
            >
              <div className="flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-[11px] font-medium mt-0.5 text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TABS ─────────────────────────────────────── */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview',      label: `📊 ${t('profile.tab_overview', 'Overview')}` },
            { id: 'achievements',  label: `🏆 ${t('profile.tab_achievements', 'Achievements')}` },
            { id: 'activity',      label: `📅 ${t('profile.tab_activity', 'Activity')}` },
            { id: 'social',        label: `👥 ${t('profile.tab_social', 'Social')}` },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === id
                  ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/25'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 dark:bg-gray-900 dark:border-gray-700/60 dark:text-gray-400 dark:hover:text-white'
              }`}
            >{label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── OVERVIEW TAB ─────────────────────────── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Skill Matrix */}
              <Card delay={0.1}>
                <div className="p-5">
                  <h3 className="font-bold text-base mb-5 flex items-center gap-2 text-foreground">
                    <BarChart3 className="w-5 h-5 text-purple-500" /> {t('profile.skill_overview', 'Skill Overview')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {SKILL_ITEMS.map(({ key, labelKey, fallback, Icon, color }) => {
                      const val = skillData[key] || 0
                      return (
                        <div key={key} className="p-3.5 rounded-xl border transition-colors bg-muted/40 border-border">
                          <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface border border-border">
                              <Icon className="w-4 h-4 text-purple-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate text-foreground">{t(labelKey, fallback)}</p>
                              <p className="text-[10px] text-muted-foreground">{val.toFixed(0)}%</p>
                            </div>
                          </div>
                          <ProgressBar value={val} max={100} color={color} height="h-1.5" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>

              {/* XP Milestones */}
              <Card delay={0.2}>
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                    <h3 className="font-bold text-lg text-foreground">{t('profile.xp_milestones', 'XP Milestones')}</h3>
                  </div>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />
                    <div className="space-y-4">
                      {MILESTONES_CONFIG.map(({ reqXp, labelKey, fallback, Icon }, i) => {
                        const isReached = xp >= reqXp
                        return (
                          <motion.div key={labelKey} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 relative"
                          >
                            <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                              isReached ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                              : 'bg-white border-gray-200 text-gray-400 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-600'
                            }`}>
                              {isReached ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className={`font-bold text-sm ${isReached ? 'text-foreground' : 'text-muted-foreground'}`}>{t(labelKey, fallback)}</p>
                                <span className={`text-xs font-mono ${isReached ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground/80'}`}>{formatNumber(reqXp)} XP</span>
                              </div>
                              {isReached && <p className="text-[11px] text-green-600 dark:text-green-400">{t('profile.achieved', '✓ Achieved')}</p>}
                              {!isReached && (
                                <div className="mt-1">
                                  <ProgressBar value={Math.min(xp, reqXp)} max={reqXp} color="yellow" height="h-1" />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Level Requirements */}
              <Card delay={0.3}>
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Target className="w-5 h-5 text-red-500 dark:text-red-400" />
                    <h3 className="font-bold text-lg text-foreground">
                      {t('profile.level_requirements', { level: currentLevel }, `${currentLevel} Requirements`)}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: `Kanji ${statsForSkills.kanji}/${levelReq.kanji}`, value: statsForSkills.kanji, max: levelReq.kanji, color: 'red', icon: '漢' },
                      { label: `Vocabulary ${statsForSkills.vocab}/${levelReq.vocab}`, value: statsForSkills.vocab, max: levelReq.vocab, color: 'blue', icon: '📝' },
                      { label: `Grammar ${statsForSkills.lessons}/${levelReq.grammar}`, value: statsForSkills.lessons, max: levelReq.grammar, color: 'green', icon: '📖' },
                    ].map(({ label, value, max, color, icon }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{icon}</span>
                            <span className="text-sm font-medium text-foreground/80">{label}</span>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">
                            {max > 0 ? ((value / max) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                        <ProgressBar value={value} max={max} color={color} height="h-2.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── ACHIEVEMENTS TAB ─────────────────────── */}
          {activeTab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: t('profile.unlocked', 'Unlocked'), value: unlockedCount, Icon: CheckCircle2, color: 'green' },
                  { label: t('profile.locked', 'Locked'),     value: lockedCount,   Icon: Lock,          color: 'gray' },
                  { label: t('profile.total', 'Total'),       value: realAchievements.length, Icon: Trophy, color: 'yellow' },
                ].map(({ label, value, Icon, color }) => (
                  <Card key={label} className="p-4 text-center">
                    <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color === 'green' ? 'text-green-500 dark:text-green-400' : color === 'yellow' ? 'text-yellow-500 dark:text-yellow-400' : 'text-muted-foreground'}`} />
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </Card>
                ))}
              </div>

              <Card>
                <div className="p-5 md:p-6">
                  <h3 className="font-bold text-lg mb-5 text-foreground">{t('profile.all_achievements', 'All Achievements')}</h3>
                  <div className="space-y-3">
                    {(showAllAchievements ? realAchievements : realAchievements.slice(0, 6)).map((a, i) => (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                          a.unlocked ? 'bg-yellow-50/50 border-yellow-100 dark:bg-yellow-500/5 dark:border-yellow-500/20'
                          : 'bg-gray-50 border-gray-100 opacity-60 dark:bg-gray-800/30 dark:border-gray-700/40 dark:opacity-60'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${a.unlocked ? 'bg-yellow-100 dark:bg-yellow-500/10' : 'bg-muted'}`}>
                          {a.unlocked ? a.icon : '🔒'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.desc}</p>
                        </div>
                        {a.unlocked ? (
                          <div className="flex flex-col items-end flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mb-0.5" />
                          </div>
                        ) : <Lock className="w-5 h-5 flex-shrink-0 text-foreground/80" />}
                      </motion.div>
                    ))}
                  </div>
                  {realAchievements.length > 6 && (
                    <button onClick={() => setShowAllAchievements(!showAllAchievements)}
                      className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      {showAllAchievements
                        ? <><ChevronUp className="w-4 h-4" /> {t('profile.show_less', 'Show Less')}</>
                        : <><ChevronDown className="w-4 h-4" /> {t('profile.show_all', { count: realAchievements.length }, `Show All ${realAchievements.length}`)}</>}
                    </button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── ACTIVITY TAB ─────────────────────────── */}
          {activeTab === 'activity' && (
            <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <Card delay={0.1}>
                <div className="p-5">
                  <h3 className="font-bold text-base mb-5 flex items-center gap-2 text-foreground">
                    <TrendingUp className="w-5 h-5 text-purple-500" /> {t('profile.weekly_xp_activity', 'Weekly XP Activity')}
                  </h3>
                  <WeeklyActivityChart locale={displayLanguage} />
                </div>
              </Card>
              <Card delay={0.2}>
                <div className="p-5">
                  <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-foreground">
                    <Flame className="w-5 h-5 text-orange-500" /> {t('profile.streak_calendar', { days: streakDays }, `${streakDays}-Day Streak Calendar`)}
                  </h3>
                  <StreakCalendar streakDays={streakDays} hasStudiedToday={hasStudiedToday} />
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── SOCIAL TAB ───────────────────────────── */}
          {activeTab === 'social' && (
            <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card>
                <div className="flex border-b border-inherit">
                  {['followers', 'following'].map(tab => (
                    <button key={tab} onClick={() => setFollowersTab(tab)}
                      className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                        followersTab === tab ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                      }`}
                    >
                      {tab === 'followers'
                        ? `${t('profile.followers', 'Followers')} (${MOCK_FOLLOWERS.length})`
                        : `${t('profile.following', 'Following')} (${MOCK_FOLLOWING.length})`}
                    </button>
                  ))}
                </div>
                <div className="p-3">
                  {(followersTab === 'followers' ? MOCK_FOLLOWERS : MOCK_FOLLOWING).map(u => (
                    <UserListItem key={u.id} u={u}
                      isFollowing={followingIds.includes(u.id)}
                      onToggleFollow={handleToggleFollow}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── AVATAR PICKER MODAL ───────────────────────── */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-6 border shadow-2xl bg-surface border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">{t('profile.choose_avatar', 'Choose Avatar')}</h3>
                <button onClick={() => setShowAvatarPicker(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border mb-4 transition-colors bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Upload className="w-4 h-4 text-indigo-400" /> {t('profile.upload_photo', 'Upload a Photo')}
              </button>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
                {t('profile.or_pick_emoji', 'Or pick an emoji')}
              </p>
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                {AVATARS.map(av => (
                  <motion.button key={av.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleAvatarSelect(av)} title={av.label}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${av.bg} flex items-center justify-center text-xl border-2 transition-all ${selectedAvatar === av.id ? 'border-purple-500 shadow-lg shadow-purple-500/30' : 'border-transparent hover:border-white/20'}`}
                  >{av.emoji}</motion.button>
                ))}
              </div>
              {(selectedAvatar || avatarUrl) && (
                <button onClick={handleRemoveAvatar} disabled={uploadLoading}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-colors text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-50"
                >
                  <X className="w-3 h-3" /> {t('profile.remove_avatar', 'Remove Current Avatar')}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOLLOWERS MODAL ──────────────────────────── */}
      <AnimatePresence>
        {showFollowersModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFollowersModal(false)}
          >
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden bg-surface border-border"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-inherit">
                <h3 className="text-lg font-bold text-foreground">
                  {followersTab === 'followers' ? t('profile.followers', 'Followers') : t('profile.following', 'Following')}
                </h3>
                <button onClick={() => setShowFollowersModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex border-b border-inherit">
                {['followers', 'following'].map(tab => (
                  <button key={tab} onClick={() => setFollowersTab(tab)}
                    className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors ${followersTab === tab ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
                  >
                    {tab === 'followers' ? t('profile.followers', 'Followers') : t('profile.following', 'Following')}
                  </button>
                ))}
              </div>
              <div className="p-3 max-h-80 overflow-y-auto">
                {(followersTab === 'followers' ? MOCK_FOLLOWERS : MOCK_FOLLOWING).map(u => (
                  <UserListItem key={u.id} u={u}
                    isFollowing={followingIds.includes(u.id)}
                    onToggleFollow={handleToggleFollow}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
