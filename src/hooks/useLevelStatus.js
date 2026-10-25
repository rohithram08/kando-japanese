// src/hooks/useLevelStatus.js
// Server-computed coverage of the user's current study level (signed-in users only).
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { getLevelStatus } from '../api/users'

export function useLevelStatus() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: ['level-status', userId],
    queryFn: getLevelStatus,
    enabled: !!userId,
    staleTime: 60_000,
  })
}
