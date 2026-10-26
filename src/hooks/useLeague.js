// src/hooks/useLeague.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { getLeague, getLeagueHistory, getGlobalBoard, setLeagueOptOut } from '../api/league'

export const leagueKeys = {
  all: ['league'],
  me: (userId) => ['league', 'me', userId],
  history: (userId) => ['league', 'history', userId],
  global: (userId) => ['league', 'global', userId],
}

/** Current league + standings. Refreshes every minute and when the tab regains focus. */
export function useLeague({ enabled = true, poll = true } = {}) {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: leagueKeys.me(userId),
    queryFn: getLeague,
    enabled: !!userId && enabled,
    staleTime: 30_000,
    refetchInterval: poll ? 60_000 : false,
    refetchOnWindowFocus: true,
  })
}

export function useLeagueHistory({ enabled = true } = {}) {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({ queryKey: leagueKeys.history(userId), queryFn: getLeagueHistory, enabled: !!userId && enabled, staleTime: 5 * 60_000 })
}

export function useGlobalBoard({ enabled = true } = {}) {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({ queryKey: leagueKeys.global(userId), queryFn: getGlobalBoard, enabled: !!userId && enabled, staleTime: 60_000 })
}

export function useLeagueOptOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (optOut) => setLeagueOptOut(optOut),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leagueKeys.all }),
  })
}
