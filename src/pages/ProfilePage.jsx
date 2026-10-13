// src/pages/ProfilePage.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Upload, X, Check, User, Pencil, Mail, Trophy,
  Flame, Star, Calendar, ChevronRight, ImagePlus, Sparkles,
  Award, Target, BookOpen, TrendingUp, Heart, ExternalLink,
  BarChart3, GraduationCap, Users, UserPlus, UserCheck,
  MessageCircle, Settings, Zap, Eye, Pen, Volume2, Languages,
  BookMarked, Brain, ArrowUpRight, Shield, Medal, Crown,
  Clock, Lock, ChevronDown, ChevronUp, CheckCircle2, ArrowLeft,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useNavigate } from 'react-router-dom'
import { getProgress } from '../api/progress'
import { updateProfile } from '../api/users'
import { uploadAvatar } from '../api/upload'
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
  { reqXp: 100,   label: 'First Steps',    icon: Star,         unlocked: true  },
  { reqXp: 500,   label: 'XP Hunter',      icon: Zap,          unlocked: true  },
  { reqXp: 1000,  label: 'Scholar',        icon: BookOpen,     unlocked: false },
  { reqXp: 2500,  label: 'N5 Graduate',    icon: GraduationCap,unlocked: false },
  { reqXp: 5000,  label: 'N4 Challenger',  icon: Trophy,       unlocked: false },
  { reqXp: 10000, label: 'N3 Warrior',     icon: Crown,        unlocked: false },
]

const SKILL_OVERVIEW = [
  { key: 'reading',   label: 'Reading',    Icon: Eye,            color: 'blue'   },
  { key: 'writing',   label: 'Writing',    Icon: Pen,            color: 'purple' },
  { key: 'listening', label: 'Listening',  Icon: Volume2,        color: 'green'  },
  { key: 'speaking',  label: 'Speaking',   Icon: MessageCircle,  color: 'orange' },
  { key: 'grammar',   label: 'Grammar',    Icon: Languages,      color: 'red'    },
  { key: 'vocab',     label: 'Vocabulary', Icon: BookMarked,     color: 'cyan'   },
]

const RECENT_ACHIEVEMENTS = [
  { id: 1, icon: '📖', title: 'First Step',    desc: 'Complete your first lesson',       date: 'Today',      unlocked: true },
  { id: 2, icon: '🔥', title: 'Week Warrior',  desc: 'Maintain a 7-day streak',          date: 'Yesterday',  unlocked: true },
  { id: 3, icon: '⭐', title: 'XP Hunter',     desc: 'Earn 100 XP',                      date: '2 days ago', unlocked: true },
  { id: 4, icon: '🏆', title: 'Perfectionist', desc: 'Unlock 50 other achievements',     date: null,         unlocked: false },
  { id: 5, icon: '🦉', title: 'Night Owl',     desc: 'Study after midnight',             date: null,         unlocked: false },
  { id: 6, icon: '🗓️', title: 'Monthly Master',desc: 'Maintain a 30-day streak',         date: null,         unlocked: false },
]

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

// ── Weekly Activity Chart ─────────────────────────────────
function WeeklyActivityChart({ isDark }) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const data = [45, 80, 30, 90, 60, 100, 70]
  const maxVal = Math.max(...data)
  return (
    <div className="flex items-end justify-between gap-2 h-32 px-2">
      {days.map((day, i) => {
        const height = (data[i] / maxVal) * 100
        const isToday = i === (new Date().getDay() + 6) % 7
        return (
          <div key={day} className="flex flex-col items-center gap-2 flex-1">
            <motion.div
              className="relative w-full flex justify-center"
              initial={{ height: 0 }} animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
            >
              <div className={`w-full max-w-[32px] rounded-t-lg relative group cursor-pointer transition-colors ${
                isToday ? 'bg-gradient-to-t from-purple-600 to-purple-400'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`} style={{ minHeight: 4 }}>
                <div className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 bg-gray-800 text-white dark:bg-gray-700 dark:text-white`}>
                  {data[i]} XP
                </div>
              </div>
            </motion.div>
            <span className={`text-[10px] font-medium ${isToday ? 'text-purple-500 font-bold' : 'text-muted-foreground'}`}>{day}</span>
          </div>
        )
      })}
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
          <div className={`text-xs truncate text-muted-foreground`}>{u.level} · {u.xp.toLocaleString()} XP</div>
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
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const [uploadLoading, setUploadLoading]     = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [selectedAvatar, setSelectedAvatar]   = useState(profile?.avatar_id || null)
  const [avatarUrl, setAvatarUrl]             = useState(profile?.avatar_url || null)
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
    } finally {
      setLoadingStats(false)
    }
  }

  const currentLevel  = profile?.current_level || 'N5'
  const xp            = profile?.xp_points || 0
  const streakDays    = profile?.streak_days || 0
  const levelInfo     = LEVEL_DATA[currentLevel] || LEVEL_DATA.N5
  const xpInLevel     = xp - levelInfo.min
  const xpNeeded      = levelInfo.max - levelInfo.min
  const levelProgress = Math.min(Math.max((xpInLevel / xpNeeded) * 100, 0), 100)
  const rank          = RANKS.reduce((acc, r) => xp >= r.xp ? r : acc, RANKS[0])
  const nextRank      = RANKS.find(r => xp < r.xp)

  const skillData = useMemo(() => ({
    reading:   Math.min((stats?.lessons || 0) * 5, 100),
    writing:   Math.min((stats?.kanji   || 0) * 2, 100),
    listening: Math.min(35, 100),
    speaking:  Math.min(20, 100),
    grammar:   Math.min((stats?.lessons || 0) * 3, 100),
    vocab:     Math.min((stats?.vocab   || 0) * 8, 100),
  }), [stats])

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
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024)    { toast.error('Image must be less than 5MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target.result)
    reader.readAsDataURL(file)
    setUploadLoading(true)
    try {
      const response = await uploadAvatar(file)
      const publicUrl = response.url
      await updateProfile({ avatarUrl: publicUrl, avatarId: null })
      setAvatarUrl(publicUrl); setSelectedAvatar(null); setPreviewUrl(null); setShowAvatarPicker(false)
      if (refreshProfile) refreshProfile()
      toast.success('Profile photo updated! 📸')
    } catch (err) {
      console.error(err); toast.error('Failed to upload photo'); setPreviewUrl(null)
    } finally { setUploadLoading(false) }
  }

  const handleAvatarSelect = async (avatar) => {
    setUploadLoading(true)
    try {
      await updateProfile({ avatarId: avatar.id, avatarUrl: null })
      setSelectedAvatar(avatar.id); setAvatarUrl(null); setPreviewUrl(null); setShowAvatarPicker(false)
      if (refreshProfile) refreshProfile()
      toast.success(`Avatar set to ${avatar.label}! ${avatar.emoji}`)
    } catch (err) { console.error(err); toast.error('Failed to update avatar') }
    finally { setUploadLoading(false) }
  }

  const handleRemoveAvatar = async () => {
    setUploadLoading(true)
    try {
      await updateProfile({ avatarId: null, avatarUrl: null })
      setSelectedAvatar(null); setAvatarUrl(null); setPreviewUrl(null); setShowAvatarPicker(false)
      if (refreshProfile) refreshProfile()
      toast.success('Avatar removed')
    } catch (err) { toast.error('Failed to remove avatar') }
    finally { setUploadLoading(false) }
  }

  const handleToggleFollow = (id) => setFollowingIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const handleViewProfile  = (id) => { setShowFollowersModal(false); navigate(`/profile/${id}`) }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null

  const statCards = [
    { label: 'Total XP',       value: xp,                   Icon: Star,     color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
    { label: 'Day Streak',     value: streakDays,            Icon: Flame,    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: 'Lessons Done',   value: stats?.lessons || 0,  Icon: BookOpen, color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/10'   },
    { label: 'Kanji Learned',  value: stats?.kanji || 0,    Icon: Brain,    color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
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
          <ArrowLeft className="w-4 h-4" /> Back
        </motion.button>

        {/* ── HERO BANNER ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl">
          {/* Banner bg */}
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
                      <User className={`w-10 h-10 text-muted-foreground`} />
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
                <h1 className={`text-2xl font-bold truncate text-foreground`}>
                  {profile?.username || user?.email?.split('@')[0] || 'Learner'}
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
                    Member since {memberSince}
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

            {/* XP Progress Bar */}
            <div className={`mt-5 p-4 rounded-2xl border bg-surface border-border`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold text-muted-foreground`}>{currentLevel} Progress</span>
                <span className={`text-xs font-bold text-purple-600 dark:text-purple-300`}>
                  <AnimatedCounter value={xp} /> / {formatNumber(levelInfo.max)} XP
                </span>
              </div>
              <ProgressBar value={xpInLevel} max={xpNeeded} color="purple" height="h-3" />
              {levelInfo.next && (
                <p className={`text-xs mt-1.5 text-muted-foreground`}>
                  {formatNumber(levelInfo.max - xp)} XP until {levelInfo.next}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {SKILL_OVERVIEW.map(({ key, label, Icon, color }) => {
                      const val = skillData[key] || 0
                      const colorMap = { blue: '#3B82F6', purple: '#8B5CF6', green: '#10B981', orange: '#F59E0B', red: '#EF4444', cyan: '#06B6D4' }
                      return (
                        <div key={key} className="flex flex-col items-center gap-2">
                          <CircularProgress percentage={val} color={colorMap[color]}>
                            <span className={`text-xs font-bold text-${color}-500`}>{Math.round(val)}%</span>
                          </CircularProgress>
                          <div className="flex items-center gap-1">
                            <Icon className={`w-3.5 h-3.5 text-${color}-500`} />
                            <span className={`text-xs font-medium text-muted-foreground`}>{label}</span>
                          </div>
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
                    <Award className={`w-5 h-5 text-yellow-500 dark:text-yellow-400`} />
                    <h3 className={`font-bold text-lg text-foreground`}>XP Milestones</h3>
                  </div>
                  <div className="relative">
                    <div className={`absolute left-6 top-0 bottom-0 w-0.5 bg-muted`} />
                    <div className="space-y-4">
                      {MILESTONES.map(({ reqXp, label, icon: Icon, unlocked }, i) => {
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
                                <span className={`text-xs font-mono ${isReached ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground/80'}`}>{formatNumber(reqXp)} XP</span>
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
                  { label: 'Unlocked', value: RECENT_ACHIEVEMENTS.filter(a => a.unlocked).length, Icon: CheckCircle2, color: 'green' },
                  { label: 'Locked',   value: RECENT_ACHIEVEMENTS.filter(a => !a.unlocked).length, Icon: Lock,          color: 'gray' },
                  { label: 'Total',    value: RECENT_ACHIEVEMENTS.length,                           Icon: Trophy,        color: 'yellow' },
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
                  <h3 className={`font-bold text-lg mb-5 text-foreground`}>All Achievements</h3>
                  <div className="space-y-3">
                    {(showAllAchievements ? RECENT_ACHIEVEMENTS : RECENT_ACHIEVEMENTS.slice(0, 5)).map((a, i) => (
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
                            {a.date && <span className={`text-[10px] text-muted-foreground`}>{a.date}</span>}
                          </div>
                        ) : <Lock className={`w-5 h-5 flex-shrink-0 text-foreground/80`} />}
                      </motion.div>
                    ))}
                  </div>
                  {RECENT_ACHIEVEMENTS.length > 5 && (
                    <button onClick={() => setShowAllAchievements(!showAllAchievements)}
                      className={`w-full mt-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700`}
                    >
                      {showAllAchievements ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show All {RECENT_ACHIEVEMENTS.length}</>}
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
                    <TrendingUp className="w-5 h-5 text-purple-500" /> Weekly XP Activity
                  </h3>
                  <WeeklyActivityChart isDark={isDark} />
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
              {(selectedAvatar || avatarUrl) && (
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