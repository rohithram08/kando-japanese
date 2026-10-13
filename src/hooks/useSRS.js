import { useState, useCallback, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import {
  getDueCards as apiGetDueCards,
  reviewCard as apiReviewCard,
} from '../api/srs'
import { useSRSStore } from '../store/srsStore'

export function useSRS() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const { isCardInSRS, addCardToSRS, initSRSDeck, initialized } = useSRSStore()

  useEffect(() => {
    if (user && !initialized) {
      initSRSDeck()
    }
  }, [user, initialized, initSRSDeck])

  const getDueCards = useCallback(async (_limit = 20) => {
    setLoading(true)
    try {
      const res = await apiGetDueCards()
      return res?.cards || []
    } finally {
      setLoading(false)
    }
  }, [user])

  const reviewCard = useCallback(async (card, quality, intervalMode = 'balanced') => {
    const cardId = typeof card === 'string' ? card : card?.id
    return await apiReviewCard(cardId, { quality, intervalMode })
  }, [])

  return { getDueCards, reviewCard, addCardToSRS, isCardInSRS, loading }
}