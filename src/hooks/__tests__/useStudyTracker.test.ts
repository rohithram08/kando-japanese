import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStudyTracker } from '../useStudyTracker';
import * as listeningApi from '../../api/listening';

vi.mock('../../api/listening', () => ({
  logStudySession: vi.fn().mockResolvedValue({ success: true, sessionId: 's-1', awardedXp: 10 }),
}));

describe('useStudyTracker Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('tracks active study seconds and formats time MM:SS', () => {
    const { result } = renderHook(() =>
      useStudyTracker({
        activityType: 'listening',
        level: 'N5',
        itemId: 'scenario-1',
        idleTimeoutSeconds: 45,
        flushIntervalSeconds: 30,
      })
    );

    expect(result.current.activeSeconds).toBe(0);
    expect(result.current.formattedTime).toBe('00:00');
    expect(result.current.isIdle).toBe(false);

    // Advance 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.activeSeconds).toBe(5);
    expect(result.current.formattedTime).toBe('00:05');
  });

  it('pauses counting when user is idle beyond idle timeout', () => {
    const { result } = renderHook(() =>
      useStudyTracker({
        activityType: 'reading',
        level: 'N5',
        itemId: 'story-1',
        idleTimeoutSeconds: 10,
        flushIntervalSeconds: 30,
      })
    );

    // Run for 12 seconds with no user activity
    act(() => {
      vi.advanceTimersByTime(12000);
    });

    // Should detect idle
    expect(result.current.isIdle).toBe(true);
    const stoppedSeconds = result.current.activeSeconds;

    // Advance further while idle
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Active seconds should not increase while idle
    expect(result.current.activeSeconds).toBe(stoppedSeconds);
  });

  it('flushes accumulated study time on completion', async () => {
    const { result } = renderHook(() =>
      useStudyTracker({
        activityType: 'listening',
        level: 'N5',
        itemId: 'scenario-1',
      })
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    await act(async () => {
      await result.current.flush(true, 100);
    });

    expect(listeningApi.logStudySession).toHaveBeenCalledWith({
      activityType: 'listening',
      level: 'N5',
      itemId: 'scenario-1',
      durationSeconds: 10,
      completed: true,
      score: 100,
    });
  });
});
