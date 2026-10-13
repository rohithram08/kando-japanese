import { useEffect, useState, useCallback } from 'react';
import { useSenseiStore } from '../store/senseiStore';
import { SenseiDailyGuidance } from '../api/sensei';

export function useSenseiDailyGuidance() {
  const { dailyGuidance, fetchGuidance } = useSenseiStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchGuidance();
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch daily guidance');
    } finally {
      setLoading(false);
    }
  }, [fetchGuidance]);

  useEffect(() => {
    if (!dailyGuidance) {
      load();
    }
  }, [dailyGuidance, load]);

  return {
    guidance: dailyGuidance as SenseiDailyGuidance | null,
    loading,
    error,
    refresh: load,
  };
}
