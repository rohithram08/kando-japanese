// Global learner directory + the people you follow / who follow you.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users, Flame, Star, Loader2 } from 'lucide-react'
import { searchPeople, getFollowing, getFollowers, getFollowSummary } from '../api/social'
import UserAvatar from '../components/common/UserAvatar'
import FollowButton from '../components/social/FollowButton'
import { useI18n } from '../i18n'
import SEO from '../components/common/SEO'

const PAGE = 20
const TABS = ['discover', 'following', 'followers']

function PersonRow({ person, onFollowChange }) {
  const { t } = useI18n()
  return (
    <li className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl border border-border bg-surface">
      <Link to={`/profile/${person.id}`} className="flex items-center gap-3 min-w-0 flex-1">
        <UserAvatar avatarConfig={person.avatarConfig} avatarId={person.avatarId} avatarUrl={person.avatarUrl} username={person.username} size="lg" rounded="rounded-full" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate">{person.username}</span>
            {person.followsYou && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                {t('people.follows_you', 'Follows you')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span>🎓 {person.level}</span>
            <span className="inline-flex items-center gap-1"><Star className="w-3 h-3" />{person.xp.toLocaleString()}</span>
            <span className="inline-flex items-center gap-1"><Flame className="w-3 h-3" />{person.streakDays}</span>
          </div>
        </div>
      </Link>
      <FollowButton size="sm" userId={person.id} username={person.username} initialFollowing={person.isFollowing} onChange={(r) => onFollowChange(person.id, r)} />
    </li>
  )
}

export default function PeoplePage() {
  const { t } = useI18n()
  const [tab, setTab] = useState('discover')
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [people, setPeople] = useState([])
  const [nextOffset, setNextOffset] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const requestId = useRef(0)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(id)
  }, [query])

  const fetchPage = useCallback((offset) => {
    if (tab === 'following') return getFollowing({ limit: PAGE, offset })
    if (tab === 'followers') return getFollowers({ limit: PAGE, offset })
    return searchPeople({ q: debounced, limit: PAGE, offset })
  }, [tab, debounced])

  // First page whenever the tab or search term changes. Stale responses are discarded.
  useEffect(() => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    fetchPage(0)
      .then((page) => {
        if (id !== requestId.current) return
        setPeople(page.people)
        setNextOffset(page.nextOffset)
      })
      .catch((err) => { if (id === requestId.current) setError(err?.message || t('people.load_failed', 'Could not load learners.')) })
      .finally(() => { if (id === requestId.current) setLoading(false) })
  }, [fetchPage, t])

  const refreshSummary = useCallback(() => { getFollowSummary().then(setSummary).catch(() => {}) }, [])
  useEffect(() => { refreshSummary() }, [refreshSummary])

  const loadMore = async () => {
    if (nextOffset == null || loadingMore) return
    const id = requestId.current
    setLoadingMore(true)
    try {
      const page = await fetchPage(nextOffset)
      if (id !== requestId.current) return
      setPeople((prev) => [...prev, ...page.people.filter((p) => !prev.some((q) => q.id === p.id))])
      setNextOffset(page.nextOffset)
    } catch (err) {
      setError(err?.message || t('people.load_failed', 'Could not load learners.'))
    } finally {
      setLoadingMore(false)
    }
  }

  const handleFollowChange = (userId, result) => {
    refreshSummary()
    // On the "following" tab an unfollow removes the row; elsewhere just reflect the new state.
    setPeople((prev) => tab === 'following' && !result.isFollowing
      ? prev.filter((p) => p.id !== userId)
      : prev.map((p) => (p.id === userId ? { ...p, isFollowing: result.isFollowing } : p)))
  }

  const tabLabel = {
    discover: t('people.tab_discover', 'Discover'),
    following: `${t('people.tab_following', 'Following')}${summary ? ` · ${summary.following}` : ''}`,
    followers: `${t('people.tab_followers', 'Followers')}${summary ? ` · ${summary.followers}` : ''}`,
  }

  const emptyText = tab === 'following'
    ? t('people.empty_following', "You're not following anyone yet. Discover learners to follow!")
    : tab === 'followers'
      ? t('people.empty_followers', 'No followers yet. Keep studying - people will find you!')
      : debounced
        ? t('people.empty_search', 'No learners match that name.')
        : t('people.empty_discover', 'No other learners to show yet.')

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-12 px-4 sm:px-0">
      <SEO
        title="Community & Learners Directory"
        description="Connect with Japanese language learners worldwide. Follow fellow learners, view study streaks, and share motivation on Kando Japanese."
        path="/people"
      />
      <header className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t('people.title', 'Learners')}</h1>
          <p className="text-sm text-muted-foreground">{t('people.subtitle', 'Find people studying Japanese and follow their journey.')}</p>
        </div>
      </header>

      <div role="tablist" aria-label={t('people.title', 'Learners')} className="flex gap-1 p-1 rounded-xl bg-muted w-full sm:w-fit">
        {TABS.map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === id ? 'bg-surface text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tabLabel[id]}
          </button>
        ))}
      </div>

      {tab === 'discover' && (
        <label className="relative block">
          <span className="sr-only">{t('people.search_label', 'Search learners by name')}</span>
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={50}
            placeholder={t('people.search_placeholder', 'Search by name…')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </label>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-purple-500" aria-label={t('common.loading', 'Loading')} /></div>
      ) : error ? (
        <div role="alert" className="p-6 text-center rounded-2xl border border-border bg-surface text-sm text-muted-foreground">{error}</div>
      ) : people.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">{emptyText}</div>
      ) : (
        <>
          <ul className="space-y-2.5">
            {people.map((p) => <PersonRow key={p.id} person={p} onFollowChange={handleFollowChange} />)}
          </ul>
          {nextOffset != null && (
            <div className="flex justify-center">
              <button onClick={loadMore} disabled={loadingMore} className="px-5 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60">
                {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : t('people.load_more', 'Load more')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
