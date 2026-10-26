import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LeagueBadge from '../LeagueBadge'
import StandingsList from '../StandingsList'
import LeaguePage from '../../../pages/LeaguePage'
import { useAuthStore } from '../../../store/authStore'
import * as api from '../../../api/league'

vi.mock('../../../api/league')

const wakaba = { id: 'wakaba', name: 'Wakaba', jp: '若葉', color: '#84cc16' }
const av = { avatarConfig: null, avatarId: null, avatarUrl: null }
const row = (rank: number, name: string, xp: number, extra: Record<string, unknown> = {}) => ({
  rank, userId: extra.isBot ? null : `u${rank}`, isBot: false, name, xp, isYou: false, zone: 'safe', avatar: av, ...extra,
})

function makeView(over: Record<string, unknown> = {}) {
  const standings = [
    row(1, 'Aki', 400, { zone: 'promotion' }), row(2, 'Bamboo Fox', 350, { zone: 'promotion', isBot: true }),
    row(3, 'Rohith', 120, { isYou: true }), row(4, 'Mei', 90), row(5, 'Dojo Sparrow', 10, { zone: 'demotion', isBot: true }),
  ]
  return {
    optedOut: false,
    week: { id: '2026-10-19', startsAt: '2026-10-18T18:30:00Z', endsAt: new Date(Date.now() + 3 * 86400000).toISOString(), secondsLeft: 3 * 86400 },
    rung: { index: 1, leagueIndex: 0, league: wakaba, stage: 2, label: 'Wakaba II' },
    board: { cohortId: 'c', size: 5, realCount: 3, promoteCount: 2, demoteCount: 1, standings, you: { rank: 3, xp: 120, zone: 'safe', xpToNextRank: 231, xpToPromotion: 231, meetsMinXp: true } },
    ladder: ['wakaba', 'take', 'ume', 'sakura', 'fuji'].map((id, i) => ({ id, name: id, jp: '木', color: '#999', order: i, rungs: [] })),
    rules: { cohortSize: 30, minBoard: 20, promoteFraction: 0.2, demoteFraction: 0.2, minXpToPromote: 50, dailyXpCap: 1000 },
    ...over,
  }
}

const renderPage = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><LeaguePage /></MemoryRouter></QueryClientProvider>)
}

describe('LeagueBadge', () => {
  it('is labelled with league and stage, and fills pips by stage', () => {
    const { container, rerender } = render(<LeagueBadge league={wakaba} stage={3} />)
    expect(screen.getByRole('img', { name: 'Wakaba III' })).toBeDefined()
    const filled = () => [...container.querySelectorAll('circle')].filter((c) => c.getAttribute('fill') === '#fff').length
    expect(filled()).toBe(1)
    rerender(<LeagueBadge league={wakaba} stage={1} />)
    expect(screen.getByRole('img', { name: 'Wakaba I' })).toBeDefined()
    expect(filled()).toBe(3)
  })
})

describe('StandingsList', () => {
  const standings = makeView().board.standings as any[]

  it('labels bots, marks you, and explains the zones with concrete numbers', () => {
    render(<StandingsList standings={standings} promoteCount={2} demoteCount={1} />)
    expect(screen.getAllByText('Dojo bot')).toHaveLength(2)
    const items = screen.getAllByRole('listitem').filter((li) => li.getAttribute('data-zone'))
    expect(items).toHaveLength(5)
    const you = items.find((li) => li.getAttribute('aria-current') === 'true')!
    expect(within(you).getByText(/Rohith/)).toBeDefined()
    expect(screen.getByText('Top 2 move up')).toBeDefined()
    expect(screen.getByText('Bottom 1 move down')).toBeDefined()
    expect(items.map((li) => li.getAttribute('data-zone'))).toEqual(['promotion', 'promotion', 'safe', 'safe', 'demotion'])
  })

  it('shows no zone dividers when nobody can move (top / bottom rung)', () => {
    render(<StandingsList standings={standings} promoteCount={0} demoteCount={0} />)
    expect(screen.queryByText(/move up/)).toBeNull()
    expect(screen.queryByText(/move down/)).toBeNull()
  })
})

describe('LeaguePage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useAuthStore.setState({ user: { id: 'me', email: 'a@b.c' } as never, profile: null })
    vi.mocked(api.getLeagueHistory).mockResolvedValue({ weeks: [] })
    vi.mocked(api.getGlobalBoard).mockResolvedValue({ entries: [], you: null })
  })

  it('asks signed-out visitors to sign up instead of calling the API', () => {
    useAuthStore.setState({ user: null, profile: null })
    renderPage()
    expect(screen.getByText('Compete with other learners')).toBeDefined()
    expect(api.getLeague).not.toHaveBeenCalled()
  })

  it('shows rung, rank, status message, standings and the ladder', async () => {
    vi.mocked(api.getLeague).mockResolvedValue(makeView() as never)
    renderPage()
    expect(await screen.findByRole('heading', { name: 'Wakaba II' })).toBeDefined()
    expect(screen.getByText('3rd of 5')).toBeDefined()
    expect(screen.getByText('120 XP')).toBeDefined()
    expect(screen.getByText('231 XP to reach the promotion zone.')).toBeDefined()
    expect(screen.getByRole('list', { name: 'League ladder' }).querySelectorAll('li')).toHaveLength(5)
    expect(screen.getAllByText('Dojo bot').length).toBeGreaterThan(0)
  })

  it('past weeks show the outcome', async () => {
    vi.mocked(api.getLeague).mockResolvedValue(makeView() as never)
    vi.mocked(api.getLeagueHistory).mockResolvedValue({ weeks: [{ weekId: '2026-10-12', rungStart: 0, rank: 2, xp: 410, outcome: 'promoted', rung: { index: 0, leagueIndex: 0, league: wakaba, stage: 3, label: 'Wakaba III' } }] })
    renderPage()
    expect(await screen.findByText('Promoted')).toBeDefined()
    expect(screen.getByText('2nd · 410 XP')).toBeDefined()
  })

  it('opting out calls the API and the opted-out state offers to rejoin', async () => {
    vi.mocked(api.getLeague).mockResolvedValueOnce(makeView() as never)
    vi.mocked(api.setLeagueOptOut).mockResolvedValue({ optOut: true })
    vi.mocked(api.getLeague).mockResolvedValue(makeView({ optedOut: true, board: null }) as never)
    renderPage()
    fireEvent.click(await screen.findByRole('switch'))
    await waitFor(() => expect(api.setLeagueOptOut).toHaveBeenCalledWith(true))
    expect(await screen.findByText("You're hidden from leagues")).toBeDefined()
    expect(screen.getByText('Rejoin leagues')).toBeDefined()
    expect(screen.queryByRole('switch')).toBeNull()
  })

  it('shows a retry button when loading fails', async () => {
    vi.mocked(api.getLeague).mockRejectedValue(new Error('boom'))
    renderPage()
    expect(await screen.findByText("We couldn't load your league right now.")).toBeDefined()
    expect(screen.getByRole('button', { name: /retry/i })).toBeDefined()
  })

  it('all-time tab lists learners and tells you your rank when you are outside the top', async () => {
    vi.mocked(api.getLeague).mockResolvedValue(makeView() as never)
    vi.mocked(api.getGlobalBoard).mockResolvedValue({ entries: [{ rank: 1, userId: 'x', name: 'Sensei Fan', xp: 9000, isYou: false, avatar: av }], you: { rank: 42, xp: 120 } })
    renderPage()
    fireEvent.click(await screen.findByRole('tab', { name: 'All-time' }))
    expect(await screen.findByText('Sensei Fan')).toBeDefined()
    expect(screen.getByText("You're ranked #42 all-time.")).toBeDefined()
  })
})
