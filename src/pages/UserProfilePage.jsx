import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Flame, Trophy, Calendar, Loader2 } from 'lucide-react'
import { getUserProfile } from '../api/users'
import { useI18n } from '../i18n'

// Fallback mock directory for legacy demo links
const ALL_USERS = {
  'user-1': { id: 'user-1', name: 'Sakura_Chan', emoji: '🌸', bg: 'from-pink-400 to-pink-600', level: 'N4', xp: 2400, streak: 12, joined: 'March 2025', lessons: 24, kanji: 45, vocab: 90 },
  'user-2': { id: 'user-2', name: 'KanjiMaster', emoji: '🐉', bg: 'from-green-500 to-emerald-700', level: 'N3', xp: 5200, streak: 30, joined: 'January 2025', lessons: 52, kanji: 120, vocab: 250 },
  'user-3': { id: 'user-3', name: 'TokyoDrifter', emoji: '⛩️', bg: 'from-orange-400 to-red-500', level: 'N5', xp: 800, streak: 5, joined: 'May 2025', lessons: 8, kanji: 15, vocab: 40 },
  'user-4': { id: 'user-4', name: 'NihonGoGo', emoji: '🗻', bg: 'from-blue-400 to-indigo-600', level: 'N4', xp: 1900, streak: 8, joined: 'April 2025', lessons: 18, kanji: 35, vocab: 75 },
  'user-5': { id: 'user-5', name: 'SenseiMode', emoji: '🥷', bg: 'from-gray-700 to-gray-900', level: 'N2', xp: 8100, streak: 45, joined: 'December 2024', lessons: 78, kanji: 210, vocab: 450 },
  'user-6': { id: 'user-6', name: 'SushiLover', emoji: '🍣', bg: 'from-amber-400 to-orange-500', level: 'N5', xp: 450, streak: 3, joined: 'June 2025', lessons: 5, kanji: 8, vocab: 25 },
}

export default function UserProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    if (!userId) {
      setError(t('user_profile.no_user', 'No user specified'))
      setLoading(false)
      return
    }

    getUserProfile(userId)
      .then((data) => {
        if (!isMounted) return
        setProfile({
          id: data.id,
          name: data.username,
          emoji: data.avatarId || (data.avatarUrl ? null : '🌸'),
          avatarUrl: data.avatarUrl,
          bg: 'from-purple-500 to-indigo-600',
          level: data.currentLevel || 'N5',
          xp: data.xpPoints || 0,
          streak: data.streakDays || 0,
          joined: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
          lessons: data.lessonsCount || 0,
          kanji: data.kanjiCount || 0,
          vocab: data.vocabCount || 0,
        })
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        if (ALL_USERS[userId]) {
          setProfile(ALL_USERS[userId])
          setLoading(false)
        } else {
          setError(err?.message || t('user_profile.not_found', 'User not found'))
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [userId, t])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-sm font-medium text-muted-foreground">{t('user_profile.loading', 'Loading learner profile...')}</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-12 rounded-2xl border bg-surface border-border"
        >
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-xl font-bold mb-2 text-foreground">
            {t('user_profile.not_found_title', 'User Not Found')}
          </h2>
          <p className="text-sm mb-6 text-muted-foreground">
            {error || t('user_profile.not_found_desc', "This user profile doesn't exist or has been removed.")}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-semibold hover:bg-purple-600 transition-colors"
          >
            {t('common.go_back', 'Go Back')}
          </button>
        </motion.div>
      </div>
    )
  }

  const stats = [
    { label: t('common.level', 'Level'), value: profile.level, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
    { label: t('profile.total_xp', 'XP'), value: profile.xp.toLocaleString(), icon: Star, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: t('profile.day_streak', 'Streak'), value: `${profile.streak} days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: t('profile.lessons_done', 'Stories'), value: profile.lessons, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 px-4 sm:px-0">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('profile.back', 'Back')}
      </motion.button>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-6 pb-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl" />
          </div>
        </div>

        <div className="relative px-6 -mt-14 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar */}
            <div className={`w-28 h-28 rounded-2xl border-4 shadow-xl overflow-hidden flex items-center justify-center text-5xl bg-gradient-to-br ${profile.bg} border-surface bg-surface`}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{profile.emoji || '🌸'}</span>
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1 sm:pb-2">
              <h1 className="text-2xl font-bold text-foreground">
                {profile.name}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-sm">{t('profile.member_since', { date: profile.joined }, `Joined ${profile.joined}`)}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 dark:border dark:border-purple-500/20">
                  🎓 {profile.level}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 dark:border dark:border-orange-500/20">
                  🔥 {profile.streak} {t('profile.day_streak', 'Day Streak')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/20">
                  ⭐ {profile.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 top-20 -z-10 bg-surface rounded-b-2xl" />
        <div className="absolute inset-0 rounded-2xl border border-border pointer-events-none" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-2xl border p-4 shadow-sm bg-surface border-border"
          >
            <div className="flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-[11px] font-medium mt-0.5 text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Learning Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border p-5 shadow-sm bg-surface border-border"
      >
        <h3 className="text-sm font-bold mb-3 text-foreground">
          📊 {t('profile.skill_overview', 'Learning Progress')}
        </h3>
        <div className="space-y-3">
          {[
            { label: t('profile.kanji_learned', 'Kanji Learned'), value: profile.kanji, max: 200, color: 'bg-amber-500' },
            { label: t('skill.vocab', 'Vocabulary Learned'), value: profile.vocab || 0, max: 500, color: 'bg-emerald-500' },
            { label: t('profile.lessons_done', 'Stories Read'), value: profile.lessons, max: 120, color: 'bg-purple-500' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-xs font-bold text-foreground/80">
                  {item.value}/{item.max}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.2, ease: 'easeOut' }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
