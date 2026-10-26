import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LeaguePage from '../../../pages/LeaguePage'
import { useAuthStore } from '../../../store/authStore'
import * as api from '../../../api/league'
import me from './fixtures/league-me.json'
import globalFixture from './fixtures/league-global.json'

vi.mock('../../../api/league')

// Both fixtures are REAL responses captured from the running API (not hand-written),
// so these tests fail if the backend and frontend ever disagree about the shape.
describe('league API contract (real captured payloads)', () => {
  it('GET /league/me has exactly the fields the frontend types and components rely on', () => {
    expect(Object.keys(me).sort()).toEqual(['board', 'ladder', 'optedOut', 'rules', 'rung', 'week'])
    expect(Object.keys(me.week).sort()).toEqual(['endsAt', 'id', 'secondsLeft', 'startsAt'])
    expect(Object.keys(me.rung).sort()).toEqual(['index', 'league', 'leagueIndex', 'label', 'stage'].sort())
    expect(Object.keys(me.rules).sort()).toEqual(['cohortSize', 'dailyXpCap', 'demoteFraction', 'minBoard', 'minXpToPromote', 'promoteFraction'])
    const board = me.board!
    expect(Object.keys(board).sort()).toEqual(['cohortId', 'demoteCount', 'promoteCount', 'realCount', 'size', 'standings', 'you'])
    expect(Object.keys(board.you).sort()).toEqual(['meetsMinXp', 'rank', 'xp', 'xpToNextRank', 'xpToPromotion', 'zone'])
    for (const s of board.standings) {
      expect(Object.keys(s).sort()).toEqual(['avatar', 'isBot', 'isYou', 'name', 'rank', 'userId', 'xp', 'zone'])
      expect(Object.keys(s.avatar).sort()).toEqual(['avatarConfig', 'avatarId', 'avatarUrl'])
    }
  })

  it('the ladder is 5 leagues x 3 stages, entry stage III first', () => {
    expect(me.ladder.map((l) => l.name)).toEqual(['Wakaba', 'Take', 'Ume', 'Sakura', 'Fuji'])
    for (const l of me.ladder) expect(l.rungs.map((r) => r.stage)).toEqual([3, 2, 1])
  })

  it('GET /league/global shape', () => {
    expect(Object.keys(globalFixture).sort()).toEqual(['entries', 'you'])
    expect(Object.keys(globalFixture.entries[0]).sort()).toEqual(['avatar', 'isYou', 'name', 'rank', 'userId', 'xp'])
  })
})

describe('LeaguePage rendering the real payload', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useAuthStore.setState({ user: { id: 'me', email: 'a@b.c' } as never, profile: null })
    const live = { ...me, week: { ...me.week, endsAt: new Date(Date.now() + 2 * 86400000).toISOString(), secondsLeft: 2 * 86400 } }
    vi.mocked(api.getLeague).mockResolvedValue(live as never)
    vi.mocked(api.getLeagueHistory).mockResolvedValue({ weeks: [] })
    vi.mocked(api.getGlobalBoard).mockResolvedValue(globalFixture as never)
  })

  const renderPage = () =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <MemoryRouter><LeaguePage /></MemoryRouter>
      </QueryClientProvider>,
    )

  it('renders every row from the server, flags the bots and highlights you', async () => {
    renderPage()
    expect(await screen.findByRole('heading', { name: me.rung.label })).toBeDefined()
    const rows = screen.getAllByRole('listitem').filter((li) => li.getAttribute('data-zone'))
    expect(rows).toHaveLength(me.board!.standings.length)
    expect(screen.getAllByText('Dojo bot')).toHaveLength(me.board!.standings.filter((s) => s.isBot).length)
    expect(rows.filter((r) => r.getAttribute('aria-current') === 'true')).toHaveLength(1)
    expect(screen.getByText(`${me.board!.you.xp.toLocaleString()} XP`, { selector: 'span.rounded-full' })).toBeDefined()
  })

  it('renders the real all-time board', async () => {
    renderPage()
    fireEvent.click(await screen.findByRole('tab', { name: 'All-time' }))
    expect(await screen.findByText(globalFixture.entries[0].name)).toBeDefined()
  })
})
