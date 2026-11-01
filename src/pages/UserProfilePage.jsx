import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Flame, Trophy, Calendar, Loader2, Sparkles, Shield, Send, CheckCircle2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { getUserProfile, sendUserAlert } from '../api/users'
import { useAuthStore } from '../store/authStore'
import { useI18n } from '../i18n'
import UserAvatar from '../components/common/UserAvatar'
import FollowButton from '../components/social/FollowButton'

const ALERT_OPTIONS = [
  {
    type: 'study',
    icon: '📚',
    title: "Let's start studying!",
    desc: 'Invite them to jump in and practice Japanese',
    color: 'hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20',
  },
  {
    type: 'streak',
    icon: '🔥',
    title: 'Keep your streak alive!',
    desc: 'Remind them not to lose their study streak',
    color: 'hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20',
  },
  {
    type: 'cheer',
    icon: '🌸',
    title: 'Ganbatte! You can do it!',
    desc: 'Send cheerful Japanese encouragement',
    color: 'hover:border-pink-500/50 hover:bg-pink-50/50 dark:hover:bg-pink-950/20',
  },
  {
    type: 'league',
    icon: '🏆',
    title: 'Great job in the league!',
    desc: 'Cheer them on in their weekly ladder climbing',
    color: 'hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20',
  },
]

export default function UserProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sendingAlert, setSendingAlert] = useState(null)
  const [sentAlerts, setSentAlerts] = useState({})
  const [followerCount, setFollowerCount] = useState(0)

  const currentUser = useAuthStore((s) => s.user)
  const isSelf = Boolean(currentUser?.id && profile?.id && currentUser.id === profile.id)

  const handleSendAlert = async (alertType) => {
    if (!profile?.id || isSelf) return
    setSendingAlert(alertType)
    try {
      const res = await sendUserAlert(profile.id, alertType)
      toast.success(res.alert?.text ? `${t('user_profile.alert_sent', 'Alert sent')}: "${res.alert.text}"` : (res.message || t('user_profile.alert_sent', 'Alert sent')))
      setSentAlerts((prev) => ({ ...prev, [alertType]: Date.now() }))
    } catch (err) {
      toast.error(err?.message || t('user_profile.alert_failed', 'Could not send alert'))
    } finally {
      setSendingAlert(null)
    }
  }

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
          avatarId: data.avatarId,
          avatarUrl: data.avatarUrl,
          avatarConfig: data.avatarConfig,
          followers: data.followersCount ?? 0,
          following: data.followingCount ?? 0,
          isFollowing: Boolean(data.isFollowing),
          isSelfProfile: Boolean(data.isSelf),
          level: data.currentLevel || 'N5',
          xp: data.xpPoints || 0,
          streak: data.streakDays || 0,
          joined: data.createdAt ? new Date(data.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : t('user_profile.recently', 'Recently'),
          lessons: data.lessonsCount || 0,
          kanji: data.kanjiCount || 0,
          vocab: data.vocabCount || 0,
        })
        setFollowerCount(data.followersCount ?? 0)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err?.status === 404 ? t('user_profile.not_found', 'User not found') : (err?.message || t('user_profile.load_failed', 'Could not load this profile.')))
        setLoading(false)
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
            <div className="rounded-2xl border-4 border-surface shadow-xl overflow-hidden bg-surface">
              <UserAvatar avatarConfig={profile.avatarConfig} avatarId={profile.avatarId} avatarUrl={profile.avatarUrl} username={profile.name} size="2xl" rounded="rounded-xl" />
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

              {/* Social: counts + follow */}
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 flex-wrap">
                <Link to="/people" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <Users className="w-4 h-4" />
                  <span><strong className="text-foreground">{followerCount}</strong> {t('people.followers', 'followers')}</span>
                  <span aria-hidden>·</span>
                  <span><strong className="text-foreground">{profile.following}</strong> {t('people.following_count', 'following')}</span>
                </Link>
                {!isSelf && currentUser && (
                  <FollowButton
                    userId={profile.id}
                    username={profile.name}
                    initialFollowing={profile.isFollowing}
                    onChange={(r) => setFollowerCount(r.followers)}
                  />
                )}
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

      {/* ── Friendly Study Alert & Nudge System (Confidential & Harassment-Free) ── */}
      {!isSelf && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border p-5 shadow-sm bg-surface border-border space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t('user_profile.alert_title', 'Send a Study Motivation Alert')}</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('user_profile.alert_desc', { name: profile.name }, `Encourage ${profile.name} with a friendly Japanese study ping!`)}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium self-start sm:self-auto">
              <Shield className="w-3 h-3" />
              <span>{t('user_profile.safe', 'Safe & Confidential')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ALERT_OPTIONS.map((opt) => {
              const isRecent = Boolean(sentAlerts[opt.type] && Date.now() - sentAlerts[opt.type] < 60000)
              const isSending = sendingAlert === opt.type
              return (
                <button
                  key={opt.type}
                  type="button"
                  disabled={isSending || isRecent}
                  onClick={() => handleSendAlert(opt.type)}
                  className={`p-3 rounded-xl border border-border/80 bg-background/50 text-left transition-all flex items-start gap-3 group disabled:opacity-60 disabled:cursor-not-allowed ${opt.color}`}
                >
                  <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-foreground truncate">
                        {opt.title}
                      </span>
                      {isRecent ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-500 font-semibold shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> {t('user_profile.sent', 'Sent')}
                        </span>
                      ) : (
                        <Send className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground flex items-center gap-2">
            <span className="text-xs">🔒</span>
            <span>
              <strong>{t('user_profile.privacy_title', 'Privacy Protection:')}</strong> {t('user_profile.privacy_body', 'Direct free-text chat and personal contact information are kept strictly confidential to protect all learners.')}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
