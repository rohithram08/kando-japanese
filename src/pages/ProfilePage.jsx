// src/pages/ProfilePage.jsx
import React, { useState, useRef, useEffect, useMemo, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Upload, X, User, Trophy, Flame,
  Star, Calendar, Award, Target, BookOpen, TrendingUp,
  BarChart3, GraduationCap, UserPlus, UserCheck, Settings, Zap,
  Eye, Pen, BookMarked, Brain, Shield, Medal,
  Crown, Lock, ChevronDown, ChevronUp, CheckCircle2, ArrowLeft, Smile,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useNavigate } from 'react-router-dom'
import { getProgress } from '../api/progress'
import { updateProfile } from '../api/users'
import { uploadAvatar } from '../api/upload'
import { APP_CONFIG } from '../config/appConfig'
import { useI18n } from '../i18n'
import { getStreakHistory } from '../api/progress'
import { AVATARS } from '../data/avatarData'
import UserAvatar from '../components/common/UserAvatar'
// Lazy: pulls in DiceBear only when someone opens the creator.
const AvatarCreator = lazy(() => import('../components/avatar/AvatarCreator'))
import ProfileBannerScene from '../components/profile/ProfileBannerScene'
import { normalizeProfile } from '../utils/userIdentity'
import { buildWeeklyActivity, buildSkillProgress } from '../utils/profileStats'
import { summarizeReadingProgress } from '../utils/storyProgress'
import { allStories } from '../data/reading/n5_stories'
import { useProgressStore } from '../store/progressStore'
import { useReadingStore } from '../store/readingStore'
import { useSettingsStore } from '../store/settingsStore'
import { ACHIEVEMENTS, computeUnlockedIds } from './AchievementsPage'
import toast from 'react-hot-toast'


// ── Level Data ─────────────────────────────────────────────
const LEVEL_DATA = {
  N5: { min: 0,     max: 2500,  color: 'from-green-400 to-emerald-500',   label: 'Beginner',     next: 'N4' },
  N4: { min: 2500,  max: 8000,  color: 'from-blue-400 to-blue-600',       label: 'Elementary',   next: 'N3' },
  N3: { min: 8000,  max: 20000, color: 'from-purple-400 to-purple-600',   label: 'Intermediate', next: 'N2' },
  N2: { min: 20000, max: 45000, color: 'from-orange-400 to-red-500',      label: 'Advanced',     next: 'N1' },
  N1: { min: 45000, max: 80000, color: 'from-yellow-400 to-amber-500',    label: 'Expert',       next: null },
}

const RANKS = [
  { xp: 0,     title: 'Novice',   Icon: Shield, color: 'text-gray-400' },
  { xp: 500,   title: 'Learner',  Icon: Star,   color: 'text-blue-400' },
  { xp: 1000,  title: 'Student',  Icon: Award,  color: 'text-green-400' },
  { xp: 2500,  title: 'Scholar',  Icon: Medal,  color: 'text-purple-400' },
  { xp: 5000,  title: 'Expert',   Icon: Trophy, color: 'text-orange-400' },
  { xp: 10000, title: 'Master',   Icon: Crown,  color: 'text-yellow-400' },
]

const MILESTONES = [
  { reqXp: 100,   label: 'First Steps',    icon: Star,         },
  { reqXp: 500,   label: 'Wave XP Hunter',      icon: Zap,          },
  { reqXp: 1000,  label: 'Scholar',        icon: BookOpen,     },
  { reqXp: 2500,  label: 'N5 Graduate',    icon: GraduationCap,},
  { reqXp: 5000,  label: 'N4 Challenger',  icon: Trophy,       },
  { reqXp: 10000, label: 'N3 Warrior',     icon: Crown,        },
]

// Only skills we genuinely track (reading from stories, kanji and vocabulary from SRS).
const SKILL_OVERVIEW = [
  { key: 'reading', label: 'Reading',    labelKey: 'profile.skill_reading', Icon: Eye,        color: 'blue'   },
  { key: 'kanji',   label: 'Kanji',      labelKey: 'profile.skill_kanji',   Icon: Pen,        color: 'purple' },
  { key: 'vocab',   label: 'Vocabulary', labelKey: 'profile.skill_vocab',   Icon: BookMarked, color: 'cyan'   },
]

const RARITY_WEIGHT = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 }


const LEVEL_REQUIREMENTS = {
  N5: { kanji: 100,  vocab: 800,   grammar: 15 },
  N4: { kanji: 300,  vocab: 1500,  grammar: 30 },
  N3: { kanji: 650,  vocab: 3750,  grammar: 50 },
  N2: { kanji: 1000, vocab: 6000,  grammar: 80 },
  N1: { kanji: 2000, vocab: 10000, grammar: 120 },
}

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

// ── Circular Progress Ring ────────────────────────────────
function CircularProgress({ percentage, size = 56, strokeWidth = 5, color = '#8B5CF6', children }) {
  const r = (size - strokeWidth) / 2
  const c = r * 2 * Math.PI
  const offset = c - (percentage / 100) * c
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-gray-200 dark:text-gray-700" />
        <motion.circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeDasharray={c}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

// ── Weekly Activity Chart (real Wave XP per day this week) ─
function WeeklyActivityChart({ data, locale }) {
  const { t } = useI18n()
  const fmt = new Intl.DateTimeFormat(locale || undefined, { weekday: 'short' })
  const maxVal = Math.max(1, ...data.map((d) => d.xp))
  const total = data.reduce((sum, d) => sum + d.xp, 0)
  return (
    <div>
      <div className="flex items-end justify-between gap-2 h-32 px-2" data-testid="weekly-chart">
        {data.map((d, i) => {
          const height = (d.xp / maxVal) * 100
          return (
            <div key={d.date} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
              <motion.div
                className="relative w-full flex justify-center"
                initial={{ height: 0 }} animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
              >
                <div className={`w-full max-w-[32px] rounded-t-lg relative group cursor-pointer transition-colors ${
                  d.isToday ? 'bg-gradient-to-t from-purple-600 to-purple-400'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`} style={{ minHeight: 4 }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 bg-gray-800 text-white dark:bg-gray-700 dark:text-white">
                    {d.xp} Wave XP
                  </div>
                </div>
              </motion.div>
              <span className={`text-[10px] font-medium ${d.isToday ? 'text-purple-500 font-bold' : 'text-muted-foreground'}`}>
                {fmt.format(new Date(`${d.date}T12:00:00`))}
              </span>
            </div>
          )
        })}
      </div>
      {total === 0 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          {t('profile.no_activity_week', 'No Wave XP earned yet this week — finish a story and its quiz to light this up.')}
        </p>
      )}
    </div>
  )
}

// ── Streak Calendar ───────────────────────────────────────
function StreakCalendar({ isDark, streakDays }) {
  const count = 28
  const days = useMemo(() => {
    const today = new Date()
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (count - 1 - i))
      return { date: d, active: i >= count - streakDays, today: i === count - 1 }
    })
  }, [streakDays])

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {['M','T','W','T','F','S','S'].map((d, i) => (
        <div key={i} className={`text-center text-[9px] font-bold pb-1 text-muted-foreground`}>{d}</div>
      ))}
      {days.map((day, i) => (
        <motion.div key={i}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: i * 0.012 }}
          className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-all ${
            day.today ? 'bg-purple-500 text-white ring-2 ring-purple-400 ring-offset-1'
            : day.active ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
            : 'bg-muted text-muted-foreground'
          }`}
        >
          {day.active || day.today ? day.date.getDate() : ''}
        </motion.div>
      ))}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────
function ProgressBar({ value, max, color = 'purple', height = 'h-2' }) {
  const pct = Math.min((value / max) * 100, 100)
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
function UserListItem({ u, isDark, isFollowing, onToggleFollow, onViewProfile }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => onViewProfile(u.id)}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${u.bg} flex-shrink-0`}>{u.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold truncate hover:underline text-foreground`}>{u.name}</div>
          <div className={`text-xs truncate text-muted-foreground`}>{u.level} · {u.xp.toLocaleString()} Wave XP</div>
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
const AVATAR_MAX_BYTES = APP_CONFIG.AVATAR_MAX_SIZE_BYTES

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const { t } = useI18n()
  const isDark = resolvedTheme === 'dark'
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const [uploadLoading, setUploadLoading]     = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const identity = normalizeProfile(profile, user)
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)
  const [selectedAvatar, setSelectedAvatar]   = useState(identity.avatarId)
  const [avatarUrl, setAvatarUrl]             = useState(identity.avatarUrl)
  const [avatarConfig, setAvatarConfig]     = useState(identity.avatarConfig)
  const [showAvatarCreator, setShowAvatarCreator] = useState(false)
  const [weeklyRows, setWeeklyRows]           = useState([])
  const [previewUrl, setPreviewUrl]           = useState(null)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [followersTab, setFollowersTab]       = useState('followers')
  const [stats, setStats]                     = useState(null)
  const [loadingStats, setLoadingStats]       = useState(true)
  const [activeTab, setActiveTab]             = useState('overview')
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [followingIds, setFollowingIds]       = useState(['user-2', 'user-3', 'user-5'])

  useEffect(() => {
    if (profile) {
      const next = normalizeProfile(profile)
      setSelectedAvatar(next.avatarId)
      setAvatarUrl(next.avatarUrl)
      setAvatarConfig(next.avatarConfig)
    }
  }, [profile])

  useEffect(() => {
    if (user?.id) loadStats()
  }, [user?.id])

  const loadStats = async () => {
    try {
      const [progressRes, historyRes] = await Promise.allSettled([getProgress(), getStreakHistory()])
      if (historyRes.status === 'fulfilled') {
        const h = historyRes.value
        setWeeklyRows(Array.isArray(h) ? h : (h?.streaks ?? []))
      }
      if (progressRes.status === 'rejected') throw progressRes.reason
      const data = progressRes.value
      setStats({
        lessons: data.lessonsCompleted || 0,
        kanji: data.kanjiLearned || 0,
        vocab: data.vocabLearned || 0,
        mastered: data.cardsMastered || 0,
      })
    } catch (e) {
      console.error('Error loading profile progress stats:', e)
    } finally {
      setLoadingStats(false)
    }
  }

  // The progress store is the live source (updated on every reward); the profile
  // record is only fetched at login, so it is just the fallback.
  const storeXP       = useProgressStore((s) => s.totalXP)
  const storeStreak   = useProgressStore((s) => s.streak)
  const storeJlpt     = useProgressStore((s) => s.jlptLevel)
  const progressState = useProgressStore()
  const currentLevel  = storeJlpt || identity.jlptLevel
  const xp            = storeXP > 0 ? storeXP : identity.xp
  const streakDays    = storeStreak > 0 ? storeStreak : identity.streak

  // Stories read: the same persisted reading progress the dashboard uses
  const readingProgress = useReadingStore((s) => s.progressMap)
  const loadReadingProgress = useReadingStore((s) => s.loadAllProgress)
  useEffect(() => { loadReadingProgress?.(!!user) }, [user, loadReadingProgress])
  const storySummary = useMemo(() => summarizeReadingProgress(readingProgress, allStories), [readingProgress])
  const storiesRead = storySummary.completedCount

  const weekly = useMemo(() => buildWeeklyActivity(weeklyRows), [weeklyRows])

  // Real achievements (same unlock rules as the Achievements page)
  const unlockedIds = useMemo(() => computeUnlockedIds(progressState), [progressState])
  const achievementList = useMemo(
    () => ACHIEVEMENTS
      .filter((a) => a.category !== 'secret' || unlockedIds.has(a.id))
      .map((a) => ({ id: a.id, icon: a.emoji, title: a.title, desc: a.desc, unlocked: unlockedIds.has(a.id), weight: RARITY_WEIGHT[a.rarity] || 0 }))
      .sort((x, y) => Number(y.unlocked) - Number(x.unlocked) || y.weight - x.weight),
    [unlockedIds]
  )
  const levelInfo     = LEVEL_DATA[currentLevel] || LEVEL_DATA.N5
  const xpInLevel     = xp - levelInfo.min
  const xpNeeded      = levelInfo.max - levelInfo.min
  const levelProgress = Math.min(Math.max((xpInLevel / xpNeeded) * 100, 0), 100)
  const rank          = RANKS.reduce((acc, r) => xp >= r.xp ? r : acc, RANKS[0])
  const nextRank      = RANKS.find(r => xp < r.xp)

  const skillData = useMemo(
    () => buildSkillProgress({ storiesCompleted: storiesRead, totalStories: storySummary.totalStories, kanji: stats?.kanji, vocab: stats?.vocab, jlpt: currentLevel }),
    [storiesRead, storySummary.totalStories, stats, currentLevel]
  )


  // ── File upload ────────────────────────────────────────
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error(t('toast.select_image_error', 'Please select an image file')); return }
    if (file.size > AVATAR_MAX_BYTES)    { toast.error(t('toast.image_size_error', 'Image must be less than 2MB')); return }
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target.result)
    reader.readAsDataURL(file)
    setUploadLoading(true)
    try {
      const response = await uploadAvatar(file)
      const publicUrl = response.url
      await updateProfile({ avatarUrl: publicUrl, avatarId: null })
      setAvatarUrl(publicUrl); setSelectedAvatar(null); setAvatarConfig(null); setPreviewUrl(null); setShowAvatarPicker(false)
      if (refreshProfile) refreshProfile()
      toast.success(t('toast.photo_updated', 'Profile photo updated! 📸'))
    } catch (err) {
      console.error(err); toast.error(t('toast.photo_upload_failed', 'Failed to upload photo')); setPreviewUrl(null)
    } finally { setUploadLoading(false) }
  }

  const handleAvatarSelect = async (avatar) => {
    setUploadLoading(true)
    try {
      await updateProfile({ avatarId: avatar.id, avatarUrl: null })
      setSelectedAvatar(avatar.id); setAvatarUrl(null); setAvatarConfig(null); setPreviewUrl(null); setShowAvatarPicker(false)
      if (refreshProfile) refreshProfile()
      toast.success(t('toast.avatar_updated', { name: avatar.label, emoji: avatar.emoji }, `Avatar set to ${avatar.label}! ${avatar.emoji}`))
    } catch (err) { console.error(err); toast.error(t('toast.avatar_update_failed', 'Failed to update avatar')) }
    finally { setUploadLoading(false) }
  }

  const handleAvatarCreate = async (config) => {
    setUploadLoading(true)
    try {
      await updateProfile({ avatarConfig: config, avatarUrl: null, avatarId: null })
      setAvatarConfig(config); setAvatarUrl(null); setSelectedAvatar(null); setPreviewUrl(null); setShowAvatarCreator(false)
      if (refreshProfile) refreshProfile()
      toast.success(t('avatar.saved', 'Avatar saved!'))
    } catch (err) { console.error(err); toast.error(t('toast.avatar_update_failed', 'Failed to update avatar')) }
    finally { setUploadLoading(false) }
  }

  const handleRemoveAvatar = async () => {
    setUploadLoading(true)
    try {
      await updateProfile({ avatarId: null, avatarUrl: null, avatarConfig: null })
      setSelectedAvatar(null); setAvatarUrl(null); setAvatarConfig(null); setPreviewUrl(null); setShowAvatarPicker(false)
      if (refreshProfile) refreshProfile()
      toast.success(t('toast.avatar_removed', 'Avatar removed'))
    } catch (err) { toast.error(t('toast.avatar_remove_failed', 'Failed to remove avatar')) }
    finally { setUploadLoading(false) }
  }

  const handleToggleFollow = (id) => setFollowingIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const handleViewProfile  = (id) => { setShowFollowersModal(false); navigate(`/profile/${id}`) }

  const memberSince = identity.createdAt
    ? new Date(identity.createdAt).toLocaleDateString(displayLanguage || undefined, { year: 'numeric', month: 'long' })
    : null

  const statCards = [
    { label: t('profile.total_wave_xp', 'Total Wave XP'), value: xp,                   Icon: Star,     color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
    { label: t('profile.day_streak', 'Day Streak'), value: streakDays,            Icon: Flame,    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: t('profile.stories_read', 'Stories Read'), value: storiesRead,  Icon: BookOpen, color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/10'   },
    { label: t('profile.kanji_learned', 'Kanji Learned'), value: stats?.kanji || 0,    Icon: Brain,    color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ]

  // ── Reusable Card ──────────────────────────────────────
  const Card = ({ children, className = '', delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className={`rounded-2xl border shadow-sm bg-surface border-border ${className}`}
    >{children}</motion.div>
  )

  return (
    <div className={`min-h-screen p-4 md:p-8 bg-background`}>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">

        {/* Back */}
        <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} whileHover={{ x: -3 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted`}
        >
          <ArrowLeft className="w-4 h-4" /> {t('profile.back', 'Back')}
        </motion.button>

        {/* ── HERO BANNER ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl">
          {/* Animated 2D banner */}
          <div className="relative h-44 sm:h-52 overflow-hidden bg-purple-700">
            <ProfileBannerScene />
            <div className="relative z-10 flex justify-end p-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/settings')}
                aria-label={t('nav.settings', 'Settings')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors backdrop-blur-sm"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Profile content overlapping banner */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar (shared renderer: photo → preset emoji → initial, never a broken image) */}
              <div className="relative group -mt-14 sm:-mt-16">
                <span className="pbs-avatar-ring absolute inset-0 rounded-2xl pointer-events-none" aria-hidden="true" />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAvatarPicker(true)}
                  className="pbs-avatar relative w-28 h-28 rounded-2xl border-4 shadow-xl overflow-hidden cursor-pointer border-surface bg-surface"
                >
                  <UserAvatar
                    avatarUrl={avatarUrl}
                    avatarId={selectedAvatar}
                    avatarConfig={avatarConfig}
                    username={identity.username}
                    previewSrc={previewUrl}
                    size="2xl"
                    rounded="rounded-none"
                    className="!w-full !h-full"
                    label={identity.username}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
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
              <div className="flex-1 min-w-0 text-center sm:text-left sm:pt-3">
                <h1 className={`text-2xl font-bold truncate text-foreground`}>
                  {identity.username}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300`}>
                    <GraduationCap className="w-3 h-3" />{currentLevel} · {levelInfo.label}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300`}>
                    <rank.Icon className="w-3 h-3" />{rank.title}
                  </span>
                </div>
                {memberSince && (
                  <p className={`text-xs mt-1 text-muted-foreground`}>
                    {t('profile.member_since', { date: memberSince }, `Member since ${memberSince}`)}
                  </p>
                )}
              </div>

              {/* Social counts */}
              <div className="flex gap-4 text-center">
                {[
                  { label: 'Following', count: MOCK_FOLLOWING.length, tab: 'following' },
                  { label: 'Followers', count: MOCK_FOLLOWERS.length, tab: 'followers' },
                ].map(({ label, count, tab }) => (
                  <button key={tab} onClick={() => { setFollowersTab(tab); setShowFollowersModal(true) }}
                    className={`hover:opacity-80 transition-opacity`}
                  >
                    <div className={`text-xl font-bold text-foreground`}>{count}</div>
                    <div className={`text-xs text-muted-foreground`}>{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wave XP Progress Bar */}
            <div className={`mt-5 p-4 rounded-2xl border bg-surface border-border`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold text-muted-foreground`}>{t('profile.level_progress', { level: currentLevel }, `${currentLevel} Progress`)}</span>
                <span className={`text-xs font-bold text-purple-600 dark:text-purple-300`}>
                  <AnimatedCounter value={xp} /> / {formatNumber(levelInfo.max)} Wave XP
                </span>
              </div>
              <ProgressBar value={xpInLevel} max={xpNeeded} color="purple" height="h-3" />
              {levelInfo.next && (
                <p className={`text-xs mt-1.5 text-muted-foreground`}>
                  {t('profile.wave_xp_until', { xp: formatNumber(Math.max(levelInfo.max - xp, 0)), level: levelInfo.next }, `${formatNumber(Math.max(levelInfo.max - xp, 0))} Wave XP until ${levelInfo.next}`)}
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
              className={`rounded-2xl border p-4 shadow-sm bg-surface border-border`}
            >
              <div className="flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold text-foreground`}>
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className={`text-[11px] font-medium mt-0.5 text-muted-foreground`}>{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TABS ─────────────────────────────────────── */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview',      label: '📊 Overview' },
            { id: 'achievements',  label: '🏆 Achievements' },
            { id: 'activity',      label: '📅 Activity' },
            { id: 'social',        label: '👥 Social' },
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
              {/* Skill Radar */}
              <Card delay={0.1}>
                <div className="p-5">
                  <h3 className={`font-bold text-base mb-5 flex items-center gap-2 text-foreground`}>
                    <BarChart3 className="w-5 h-5 text-purple-500" /> Skill Overview
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {SKILL_OVERVIEW.map(({ key, label, labelKey, Icon, color }) => {
                      const val = skillData[key] || 0
                      const colorMap = { blue: '#3B82F6', purple: '#8B5CF6', green: '#10B981', orange: '#F59E0B', red: '#EF4444', cyan: '#06B6D4' }
                      return (
                        <div key={key} className="flex flex-col items-center gap-2">
                          <CircularProgress percentage={val} color={colorMap[color]}>
                            <span className={`text-xs font-bold text-${color}-500`}>{Math.round(val)}%</span>
                          </CircularProgress>
                          <div className="flex items-center gap-1">
                            <Icon className={`w-3.5 h-3.5 text-${color}-500`} />
                            <span className={`text-xs font-medium text-muted-foreground`}>{t(labelKey, label)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>

              {/* Wave XP Milestones */}
              <Card delay={0.2}>
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className={`w-5 h-5 text-yellow-500 dark:text-yellow-400`} />
                    <h3 className={`font-bold text-lg text-foreground`}>Wave XP Milestones</h3>
                  </div>
                  <div className="relative">
                    <div className={`absolute left-6 top-0 bottom-0 w-0.5 bg-muted`} />
                    <div className="space-y-4">
                      {MILESTONES.map(({ reqXp, label, icon: Icon }, i) => {
                        const isReached = xp >= reqXp
                        return (
                          <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
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
                                <p className={`font-bold text-sm ${isReached ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
                                <span className={`text-xs font-mono ${isReached ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground/80'}`}>{formatNumber(reqXp)} Wave XP</span>
                              </div>
                              {isReached && <p className={`text-[11px] text-green-600 dark:text-green-400`}>✓ Achieved</p>}
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
                    <Target className={`w-5 h-5 text-red-500 dark:text-red-400`} />
                    <h3 className={`font-bold text-lg text-foreground`}>{currentLevel} Requirements</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: `Kanji ${stats?.kanji || 0}/${LEVEL_REQUIREMENTS[currentLevel]?.kanji}`, value: stats?.kanji || 0, max: LEVEL_REQUIREMENTS[currentLevel]?.kanji || 100, color: 'red', icon: '漢' },
                      { label: `Vocabulary ${stats?.vocab || 0}/${LEVEL_REQUIREMENTS[currentLevel]?.vocab}`, value: stats?.vocab || 0, max: LEVEL_REQUIREMENTS[currentLevel]?.vocab || 800, color: 'blue', icon: '📝' },
                      { label: `Grammar ${stats?.lessons || 0}/${LEVEL_REQUIREMENTS[currentLevel]?.grammar}`, value: stats?.lessons || 0, max: LEVEL_REQUIREMENTS[currentLevel]?.grammar || 15, color: 'green', icon: '📖' },
                    ].map(({ label, value, max, color, icon }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{icon}</span>
                            <span className={`text-sm font-medium text-foreground/80`}>{label}</span>
                          </div>
                          <span className={`text-xs font-bold text-muted-foreground`}>
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
                  { label: t('profile.unlocked', 'Unlocked'), value: achievementList.filter(a => a.unlocked).length, Icon: CheckCircle2, color: 'green' },
                  { label: t('profile.locked', 'Locked'), value: achievementList.filter(a => !a.unlocked).length, Icon: Lock,          color: 'gray' },
                  { label: t('profile.total', 'Total'), value: achievementList.length,                           Icon: Trophy,        color: 'yellow' },
                ].map(({ label, value, Icon, color }) => (
                  <Card key={label} className="p-4 text-center">
                    <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color === 'green' ? 'text-green-500 dark:text-green-400' : color === 'yellow' ? 'text-yellow-500 dark:text-yellow-400' : 'text-muted-foreground'}`} />
                    <p className={`text-2xl font-bold text-foreground`}>{value}</p>
                    <p className={`text-xs text-muted-foreground`}>{label}</p>
                  </Card>
                ))}
              </div>

              <Card>
                <div className="p-5 md:p-6">
                  <h3 className={`font-bold text-lg mb-5 text-foreground`}>{t('profile.all_achievements', 'All Achievements')}</h3>
                  <div className="space-y-3">
                    {(showAllAchievements ? achievementList : achievementList.slice(0, 5)).map((a, i) => (
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
                          <p className={`font-bold text-sm text-foreground`}>{a.title}</p>
                          <p className={`text-xs text-muted-foreground`}>{a.desc}</p>
                        </div>
                        {a.unlocked ? (
                          <div className="flex flex-col items-end flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mb-0.5" />
                          </div>
                        ) : <Lock className={`w-5 h-5 flex-shrink-0 text-foreground/80`} />}
                      </motion.div>
                    ))}
                  </div>
                  {achievementList.length > 5 && (
                    <button onClick={() => setShowAllAchievements(!showAllAchievements)}
                      className={`w-full mt-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700`}
                    >
                      {showAllAchievements ? <><ChevronUp className="w-4 h-4" /> {t('profile.show_less', 'Show Less')}</> : <><ChevronDown className="w-4 h-4" /> {t('profile.show_all', { count: achievementList.length }, `Show All ${achievementList.length}`)}</>}
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
                  <h3 className={`font-bold text-base mb-5 flex items-center gap-2 text-foreground`}>
                    <TrendingUp className="w-5 h-5 text-purple-500" /> Weekly Wave XP Activity
                  </h3>
                  <WeeklyActivityChart data={weekly} locale={displayLanguage} />
                </div>
              </Card>
              <Card delay={0.2}>
                <div className="p-5">
                  <h3 className={`font-bold text-base mb-4 flex items-center gap-2 text-foreground`}>
                    <Flame className="w-5 h-5 text-orange-500" /> {streakDays}-Day Streak Calendar
                  </h3>
                  <StreakCalendar isDark={isDark} streakDays={streakDays} />
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
                    >{tab} {tab === 'followers' ? `(${MOCK_FOLLOWERS.length})` : `(${MOCK_FOLLOWING.length})`}</button>
                  ))}
                </div>
                <div className="p-3">
                  {(followersTab === 'followers' ? MOCK_FOLLOWERS : MOCK_FOLLOWING).map(u => (
                    <UserListItem key={u.id} u={u} isDark={isDark}
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
              className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl bg-surface border-border`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold text-foreground`}>Choose Avatar</h3>
                <button onClick={() => setShowAvatarPicker(false)} className={`p-1.5 rounded-lg hover:bg-muted text-muted-foreground`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => { setShowAvatarPicker(false); setShowAvatarCreator(true) }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold mb-2 transition-colors bg-primary text-white hover:opacity-90"
              >
                <Smile className="w-4 h-4" aria-hidden /> {t('avatar.create_cta', 'Create your own avatar')}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border mb-4 transition-colors bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700`}
              >
                <Upload className="w-4 h-4 text-indigo-400" /> Upload a Photo
              </button>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground`}>Or pick an emoji</p>
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                {AVATARS.map(av => (
                  <motion.button key={av.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleAvatarSelect(av)} title={av.label}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${av.bg} flex items-center justify-center text-xl border-2 transition-all ${selectedAvatar === av.id ? 'border-purple-500 shadow-lg shadow-purple-500/30' : 'border-transparent hover:border-white/20'}`}
                  >{av.emoji}</motion.button>
                ))}
              </div>
              {(selectedAvatar || avatarUrl || avatarConfig) && (
                <button onClick={handleRemoveAvatar} disabled={uploadLoading}
                  className={`w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-colors text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-50`}
                >
                  <X className="w-3 h-3" /> Remove Current Avatar
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAvatarCreator && (
        <Suspense fallback={null}>
          <AvatarCreator
            initialConfig={avatarConfig}
            saving={uploadLoading}
            onSave={handleAvatarCreate}
            onClose={() => setShowAvatarCreator(false)}
          />
        </Suspense>
      )}

      {/* ── FOLLOWERS MODAL ──────────────────────────── */}
      <AnimatePresence>
        {showFollowersModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFollowersModal(false)}
          >
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden bg-surface border-border`}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-inherit">
                <h3 className={`text-lg font-bold text-foreground`}>
                  {followersTab === 'followers' ? 'Followers' : 'Following'}
                </h3>
                <button onClick={() => setShowFollowersModal(false)} className={`p-1.5 rounded-lg hover:bg-muted text-muted-foreground`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex border-b border-inherit">
                {['followers', 'following'].map(tab => (
                  <button key={tab} onClick={() => setFollowersTab(tab)}
                    className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors ${followersTab === tab ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
                  >{tab}</button>
                ))}
              </div>
              <div className="p-3 max-h-80 overflow-y-auto">
                {(followersTab === 'followers' ? MOCK_FOLLOWERS : MOCK_FOLLOWING).map(u => (
                  <UserListItem key={u.id} u={u} isDark={isDark}
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