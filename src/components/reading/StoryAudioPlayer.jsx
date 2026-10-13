// src/components/reading/StoryAudioPlayer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Audio Control Bar for Graded Japanese Reading Experience (Phase 4.3A)
// Includes Play/Pause, Replay, Speed Selector (0.8x, 1.0x, 1.2x), Autoplay Toggle,
// and Audio Strategy & Voice Status indicators.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  AlertCircle,
  Radio,
} from 'lucide-react';

const SPEED_OPTIONS = [0.8, 1.0, 1.2];

export default function StoryAudioPlayer({
  isPlaying = false,
  playbackSpeed = 1.0,
  autoPlayNext = false,
  isSupported = true,
  hasJapaneseVoice = true,
  activeAudioStrategy = 'synthesis',
  onPlay,
  onPause,
  onReplay,
  onSpeedChange,
  onToggleAutoPlayNext,
  className = '',
  compact = false,
}) {
  if (!isSupported) {
    return (
      <div
        className={`flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl px-3 py-2 ${className}`}
        role="alert"
      >
        <VolumeX className="w-4 h-4 shrink-0 text-amber-500" />
        <span>Audio synthesis is not supported in this browser.</span>
      </div>
    );
  }

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  const handleReplayClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onReplay?.();
  };

  const handleSpeedSelect = (e, speed) => {
    e.stopPropagation();
    e.preventDefault();
    onSpeedChange?.(speed);
  };

  const handleAutoplayToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleAutoPlayNext?.();
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-gray-50/90 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 backdrop-blur-xs transition-colors ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Left Controls: Play/Pause & Replay ── */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
          title={isPlaying ? (activeAudioStrategy === 'recorded' ? 'Pause narration' : 'Stop sentence playback') : 'Play sentence audio'}
          aria-label={isPlaying ? 'Pause sentence audio' : 'Play sentence audio'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
              <span>Listen</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReplayClick}
          className="inline-flex items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          title="Repeat current sentence"
          aria-label="Repeat current sentence"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Playback Speed Segmented Buttons */}
        <div
          className="inline-flex items-center rounded-xl p-0.5 bg-gray-200/70 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700"
          role="group"
          aria-label="Playback speed"
        >
          {SPEED_OPTIONS.map((speed) => {
            const isActive = playbackSpeed === speed;
            return (
              <button
                key={speed}
                type="button"
                onClick={(e) => handleSpeedSelect(e, speed)}
                aria-pressed={isActive}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all focus:outline-none ${
                  isActive
                    ? 'bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                title={`Set speed to ${speed}x`}
              >
                {speed}×
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Controls: Autoplay Toggle & Engine Badge ── */}
      <div className="flex items-center space-x-2.5">
        {/* Autoplay Next Toggle */}
        <button
          type="button"
          onClick={handleAutoplayToggle}
          aria-pressed={autoPlayNext}
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            autoPlayNext
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          title={autoPlayNext ? 'Autoplay next sentence enabled' : 'Autoplay next sentence disabled'}
        >
          <FastForward className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Autoplay Next</span>
          <span className="sm:hidden">Auto</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              autoPlayNext ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        </button>

        {/* Audio Engine Strategy Badge */}
        {!compact && (
          <div className="flex items-center space-x-1 text-[11px] text-gray-500 dark:text-gray-400">
            {activeAudioStrategy === 'recorded' ? (
              <span className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>Recorded Audio</span>
              </span>
            ) : (
              <span
                className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/60 font-medium"
                title="Browser Speech Synthesis (ja-JP)"
              >
                <Volume2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>ja-JP TTS</span>
              </span>
            )}

            {!hasJapaneseVoice && activeAudioStrategy === 'synthesis' && (
              <span
                role="status"
                className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 font-medium ml-1"
                title="Japanese speech synthesis voice not installed in OS/browser; using default synthesizer"
                aria-label="Japanese speech synthesis voice not installed in OS/browser; using default synthesizer"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span className="hidden sm:inline text-[10px]">No ja-JP voice</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
