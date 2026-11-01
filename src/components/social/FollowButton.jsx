// Follow / Unfollow toggle (optimistic, race-safe, accessible).
import React, { useEffect, useRef, useState } from 'react'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { followUser, unfollowUser } from '../../api/social'
import { useI18n } from '../../i18n'

export default function FollowButton({
  userId,
  username = '',
  initialFollowing = false,
  size = 'md',
  onChange,
  className = '',
}) {
  const { t } = useI18n()
  const [following, setFollowing] = useState(Boolean(initialFollowing))
  const [busy, setBusy] = useState(false)
  const mounted = useRef(true)

  useEffect(() => () => { mounted.current = false }, [])
  // Re-sync when the parent loads a different profile / refreshed list.
  useEffect(() => { setFollowing(Boolean(initialFollowing)) }, [initialFollowing, userId])

  const toggle = async (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (busy || !userId) return
    const next = !following
    setFollowing(next) // optimistic
    setBusy(true)
    try {
      const result = await (next ? followUser(userId) : unfollowUser(userId))
      if (mounted.current) setFollowing(Boolean(result.isFollowing))
      onChange?.(result)
    } catch (err) {
      if (mounted.current) setFollowing(!next) // roll back
      toast.error(err?.message || t('people.follow_failed', 'Could not update follow. Please try again.'))
    } finally {
      if (mounted.current) setBusy(false)
    }
  }

  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
  const label = following ? t('people.following', 'Following') : t('people.follow', 'Follow')
  const aria = following
    ? t('people.unfollow_aria', { name: username }, `Unfollow ${username}`)
    : t('people.follow_aria', { name: username }, `Follow ${username}`)

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={following}
      aria-label={aria}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-wait ${pad} ${
        following
          ? 'bg-muted text-foreground border border-border hover:border-red-300 hover:text-red-600'
          : 'bg-purple-500 text-white hover:bg-purple-600 shadow-sm'
      } ${className}`}
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : following ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  )
}
