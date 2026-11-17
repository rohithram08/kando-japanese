// src/hooks/useStudyTracker.ts
// ─────────────────────────────────────────────────────────────────────────────
// Anti-Idle Verified Study Hours Tracker Hook
// Guards against fake idle farming: pauses on tab-blur or >45s inactivity.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';
import { logStudySession } from '../api/listening';

interface StudyTrackerOptions {
  activityType: 'listening' | 'reading' | 'grammar' | 'kanji' | 'conversation';
  level?: string;
  itemId: string;
  idleTimeoutSeconds?: number; // default: 45s
  flushIntervalSeconds?: number; // default: 30s
  enabled?: boolean;
}

export function useStudyTracker({
  activityType,
  level = 'N5',
  itemId,
  idleTimeoutSeconds = 45,
  flushIntervalSeconds = 30,
  enabled = true,
}: StudyTrackerOptions) {
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  // Unsynced seconds buffer waiting to be flushed to backend
  const pendingBufferSecRef = useRef(0);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const isDocumentVisibleRef = useRef<boolean>(
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
  );

  // Flush buffer to backend
  const flush = useCallback(
    async (isCompleted = false, finalScore?: number | null) => {
      const secondsToLog = pendingBufferSecRef.current;
      if (secondsToLog <= 0 && !isCompleted) return;

      // Reset buffer before async call to avoid race conditions
      pendingBufferSecRef.current = 0;

      try {
        await logStudySession({
          activityType,
          level,
          itemId,
          durationSeconds: Math.max(1, secondsToLog),
          completed: isCompleted,
          score: finalScore ?? null,
        });
      } catch (err) {
        // If network error, return back to buffer for next flush attempt
        pendingBufferSecRef.current += secondsToLog;
        console.warn('[useStudyTracker] Failed to flush study heartbeat:', err);
      }
    },
    [activityType, level, itemId]
  );

  // User activity listeners (mouse, key, touch, scroll)
  useEffect(() => {
    if (!enabled) return;

    const resetIdleTimer = () => {
      lastActiveTimestampRef.current = Date.now();
      setIsIdle(false);
    };

    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = document.visibilityState === 'visible';
      if (!isDocumentVisibleRef.current) {
        setIsIdle(true);
      } else {
        lastActiveTimestampRef.current = Date.now();
        setIsIdle(false);
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((ev) => window.addEventListener(ev, resetIdleTimer, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetIdleTimer));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  // 1-second interval ticker for active study calculation
  useEffect(() => {
    if (!enabled || !itemId) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSinceActivity = (now - lastActiveTimestampRef.current) / 1000;

      // If document is visible and user acted within idle timeout
      if (isDocumentVisibleRef.current && elapsedSinceActivity <= idleTimeoutSeconds) {
        setIsIdle(false);
        setActiveSeconds((prev) => prev + 1);
        pendingBufferSecRef.current += 1;

        // Periodic flush to backend
        if (pendingBufferSecRef.current >= flushIntervalSeconds) {
          flush(false);
        }
      } else {
        setIsIdle(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, itemId, idleTimeoutSeconds, flushIntervalSeconds, flush]);

  // Flush on unmount or page close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingBufferSecRef.current > 0) {
        flush(false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (pendingBufferSecRef.current > 0) {
        flush(false);
      }
    };
  }, [flush]);

  // Formatted display: e.g. "04:25" or "1h 12m"
  const minutes = Math.floor(activeSeconds / 60);
  const seconds = activeSeconds % 60;
  const formattedTime =
    minutes >= 60
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    activeSeconds,
    formattedTime,
    isIdle,
    flush,
  };
}
