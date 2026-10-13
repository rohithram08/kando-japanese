// src/hooks/useStoryAudio.ts
// ─────────────────────────────────────────────────────────────────────────────
// Audio Synchronization Hook for Graded Japanese Reading Experience (Phase 4.3B)
// Supports sentence-level narration, playback speed, autoplay, preference persistence,
// and hardened lifecycle cancellation guards.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import { audioService } from '../services/audioService';
import { useSettingsStore, sanitizeReaderSpeed } from '../store/settingsStore';
import type { StorySentence } from '../types/reading';

export type PlaybackSpeed = 0.8 | 1.0 | 1.2;

export interface UseStoryAudioProps {
  sentences: StorySentence[];
  activeSentenceIndex: number;
  onSentenceChange: (index: number) => void;
  onStoryComplete?: () => void;
}

export interface UseStoryAudioReturn {
  isPlaying: boolean;
  playbackSpeed: PlaybackSpeed;
  autoPlayNext: boolean;
  isSupported: boolean;
  hasJapaneseVoice: boolean;
  activeAudioStrategy: 'recorded' | 'synthesis' | 'none';
  play: (index?: number) => void;
  pause: () => void;
  replay: () => void;
  stop: () => void;
  nextSentence: () => void;
  prevSentence: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  toggleAutoPlayNext: () => void;
}

export function useStoryAudio({
  sentences,
  activeSentenceIndex,
  onSentenceChange,
  onStoryComplete,
}: UseStoryAudioProps): UseStoryAudioReturn {
  const storeSpeed = useSettingsStore((s) => s.readerSpeed);
  const storeAutoPlay = useSettingsStore((s) => s.readerAutoPlayNext);

  const initialSpeed = (sanitizeReaderSpeed(storeSpeed) as PlaybackSpeed) || 1.0;
  const initialAutoPlay = Boolean(storeAutoPlay);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(initialSpeed);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(initialAutoPlay);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [hasJapaneseVoice, setHasJapaneseVoice] = useState<boolean>(true);

  // References to avoid stale closures in audio event handlers
  const sentencesRef = useRef(sentences);
  sentencesRef.current = sentences;

  const activeIndexRef = useRef(activeSentenceIndex);
  activeIndexRef.current = activeSentenceIndex;

  const speedRef = useRef(playbackSpeed);
  speedRef.current = playbackSpeed;

  const autoPlayNextRef = useRef(autoPlayNext);
  autoPlayNextRef.current = autoPlayNext;

  const onSentenceChangeRef = useRef(onSentenceChange);
  onSentenceChangeRef.current = onSentenceChange;

  const onStoryCompleteRef = useRef(onStoryComplete);
  onStoryCompleteRef.current = onStoryComplete;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Track request generation ID and component mount state to eliminate race conditions
  const requestIdRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // Sync with external settings changes (e.g. settings page / reset)
  useEffect(() => {
    const safeSpeed = sanitizeReaderSpeed(storeSpeed) as PlaybackSpeed;
    if (safeSpeed !== playbackSpeed) {
      setPlaybackSpeed(safeSpeed);
      speedRef.current = safeSpeed;
      if (audioElementRef.current) {
        audioElementRef.current.playbackRate = safeSpeed;
      }
    }
  }, [storeSpeed]);

  useEffect(() => {
    const safeAutoPlay = Boolean(storeAutoPlay);
    if (safeAutoPlay !== autoPlayNext) {
      setAutoPlayNext(safeAutoPlay);
      autoPlayNextRef.current = safeAutoPlay;
    }
  }, [storeAutoPlay]);

  // Detect capability on mount & subscribe to dynamic voice changes
  useEffect(() => {
    isMountedRef.current = true;
    setIsSupported(audioService.isSupported());
    setHasJapaneseVoice(audioService.hasJapaneseVoice());

    const unsubscribe = audioService.onVoicesChanged?.(() => {
      if (isMountedRef.current) {
        setHasJapaneseVoice(audioService.hasJapaneseVoice());
      }
    });

    return () => {
      isMountedRef.current = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Internal helper to stop any in-flight playback and detach element listeners
  const stopCurrentAudio = useCallback(() => {
    requestIdRef.current += 1;
    if (audioElementRef.current) {
      const el = audioElementRef.current;
      el.onended = null;
      el.onerror = null;
      el.pause();
      el.currentTime = 0;
      audioElementRef.current = null;
    }
    audioService.stop();
  }, []);

  // Core play sentence routine (defined before handleAudioEnd so it can be referenced safely)
  const playSentence = useCallback((index: number) => {
    stopCurrentAudio();
    const currentRequestId = ++requestIdRef.current;

    const targetSentence = sentencesRef.current[index];
    if (!targetSentence) {
      if (isMountedRef.current) setIsPlaying(false);
      return;
    }

    if (isMountedRef.current) setIsPlaying(true);

    // Option A: Recorded Audio file if available
    if (targetSentence.audioUrl) {
      try {
        const audio = new Audio(targetSentence.audioUrl);
        audioElementRef.current = audio;
        audio.playbackRate = speedRef.current;

        audio.onended = () => {
          if (currentRequestId !== requestIdRef.current || !isMountedRef.current) return;
          audioElementRef.current = null;
          handleAudioEnd(index);
        };

        audio.onerror = () => {
          if (currentRequestId !== requestIdRef.current || !isMountedRef.current) return;
          audioElementRef.current = null;
          setIsPlaying(false);
        };

        audio.play().catch(() => {
          if (currentRequestId !== requestIdRef.current || !isMountedRef.current) return;
          setIsPlaying(false);
        });
      } catch {
        if (currentRequestId === requestIdRef.current && isMountedRef.current) {
          setIsPlaying(false);
        }
      }
      return;
    }

    // Option B: Browser Japanese Speech Synthesis (ja-JP)
    if (!audioService.isSupported()) {
      if (isMountedRef.current) setIsPlaying(false);
      return;
    }

    audioService.speak(targetSentence.japanese, {
      lang: 'ja-JP',
      rate: speedRef.current,
      onStart: () => {
        if (currentRequestId !== requestIdRef.current || !isMountedRef.current) return;
        setIsPlaying(true);
      },
      onEnd: () => {
        if (currentRequestId !== requestIdRef.current || !isMountedRef.current) return;
        handleAudioEnd(index);
      },
      onError: () => {
        if (currentRequestId !== requestIdRef.current || !isMountedRef.current) return;
        setIsPlaying(false);
      },
    });
  }, [stopCurrentAudio]);

  // Playback completion handler
  const handleAudioEnd = useCallback((finishedIndex: number) => {
    if (autoPlayNextRef.current) {
      const nextIdx = finishedIndex + 1;
      if (nextIdx < sentencesRef.current.length) {
        onSentenceChangeRef.current(nextIdx);
        // Play next sentence automatically
        playSentence(nextIdx);
      } else {
        if (isMountedRef.current) setIsPlaying(false);
        onStoryCompleteRef.current?.();
      }
    } else {
      if (isMountedRef.current) setIsPlaying(false);
    }
  }, [playSentence]);

  // Public Play function
  const play = useCallback((index?: number) => {
    const targetIdx = typeof index === 'number' ? index : activeIndexRef.current;
    if (targetIdx !== activeIndexRef.current) {
      onSentenceChangeRef.current(targetIdx);
      playSentence(targetIdx);
      return;
    }

    // If recorded audio is currently paused on the current sentence, resume it in-place
    if (audioElementRef.current && !audioElementRef.current.ended) {
      audioElementRef.current.playbackRate = speedRef.current;
      audioElementRef.current.play().catch(() => {
        if (isMountedRef.current) setIsPlaying(false);
      });
      if (isMountedRef.current) setIsPlaying(true);
      return;
    }

    playSentence(targetIdx);
  }, [playSentence]);

  // Public Pause function (pauses recorded audio in-place, cancels synthesis safely)
  const pause = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    audioService.stop();
    if (isMountedRef.current) setIsPlaying(false);
  }, []);

  // Public Stop function (stops and resets all audio engines to start)
  const stop = useCallback(() => {
    stopCurrentAudio();
    if (isMountedRef.current) setIsPlaying(false);
  }, [stopCurrentAudio]);

  // Public Replay function (starts sentence cleanly from byte 0)
  const replay = useCallback(() => {
    stopCurrentAudio();
    playSentence(activeIndexRef.current);
  }, [stopCurrentAudio, playSentence]);

  // Advance to next sentence with audio cue
  const nextSentence = useCallback(() => {
    if (activeIndexRef.current < sentencesRef.current.length - 1) {
      const nextIdx = activeIndexRef.current + 1;
      onSentenceChangeRef.current(nextIdx);
      if (isPlayingRef.current) {
        playSentence(nextIdx);
      }
    }
  }, [playSentence]);

  // Move to previous sentence with audio cue
  const prevSentence = useCallback(() => {
    if (activeIndexRef.current > 0) {
      const prevIdx = activeIndexRef.current - 1;
      onSentenceChangeRef.current(prevIdx);
      if (isPlayingRef.current) {
        playSentence(prevIdx);
      }
    }
  }, [playSentence]);

  // Set playback speed and persist to store
  const setSpeed = useCallback((speed: PlaybackSpeed) => {
    const safeSpeed = sanitizeReaderSpeed(speed) as PlaybackSpeed;
    setPlaybackSpeed(safeSpeed);
    speedRef.current = safeSpeed;
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = safeSpeed;
    }
    useSettingsStore.getState().setReaderSpeed?.(safeSpeed);
  }, []);

  // Toggle autoplay next sentence and persist to store
  const toggleAutoPlayNext = useCallback(() => {
    const nextVal = !autoPlayNextRef.current;
    autoPlayNextRef.current = nextVal;
    setAutoPlayNext(nextVal);
    useSettingsStore.getState().setReaderAutoPlayNext?.(nextVal);
  }, []);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopCurrentAudio();
    };
  }, [stopCurrentAudio]);

  // Stop audio if story sentences change (story switch)
  const prevSentencesRef = useRef(sentences);
  useEffect(() => {
    if (prevSentencesRef.current !== sentences) {
      prevSentencesRef.current = sentences;
      stopCurrentAudio();
      if (isMountedRef.current) setIsPlaying(false);
    }
  }, [sentences, stopCurrentAudio]);

  const currentSentence = sentences[activeSentenceIndex];
  const activeAudioStrategy: 'recorded' | 'synthesis' | 'none' = currentSentence?.audioUrl
    ? 'recorded'
    : isSupported
    ? 'synthesis'
    : 'none';

  return {
    isPlaying,
    playbackSpeed,
    autoPlayNext,
    isSupported,
    hasJapaneseVoice,
    activeAudioStrategy,
    play,
    pause,
    replay,
    stop,
    nextSentence,
    prevSentence,
    setSpeed,
    toggleAutoPlayNext,
  };
}
