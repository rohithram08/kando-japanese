// src/components/common/FuriganaText.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Adaptive Furigana Text Component
// Renders Japanese text with 3-stage adaptive ruby annotations:
// - Always On (Beginner scaffolding)
// - Reveal on Demand (Hover/tap peek for familiar items)
// - Off by Default (Reading independence for mastered items)
// Prevents layout shift and decomposes okurigana accurately.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { parseFuriganaSegments, getAdaptiveFuriganaMode } from '../../utils/furiganaUtils';

const SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export default function FuriganaText({
  text,
  word,
  reading,
  repetitions = 0,
  isMastered = false,
  isTesting = false,
  forceMode = null, // optional override
  className = '',
  rubyClassName = '',
  size = 'md',
}) {
  const [manualRevealed, setManualRevealed] = useState(false);
  const targetText = text || word || '';
  const userMode = useSettingsStore((s) => s.furiganaMode || (s.furigana ? 'adaptive' : 'off'));
  const effectiveMode = forceMode || userMode;

  const adaptiveState = getAdaptiveFuriganaMode({
    mode: effectiveMode,
    repetitions,
    isMastered,
    isTesting,
  });

  const isVisible = manualRevealed || adaptiveState.visibility === 'visible';
  const segments = parseFuriganaSegments(targetText, reading);

  const handleToggle = (e) => {
    if (adaptiveState.canReveal) {
      e?.stopPropagation();
      setManualRevealed((prev) => !prev);
    }
  };

  const accessibleLabel = reading && reading !== targetText ? `${targetText} (read as ${reading})` : targetText;

  return (
    <span
      className={`inline-flex items-baseline flex-wrap select-text group/furi relative ${
        SIZE_CLASSES[size] || ''
      } ${
        adaptiveState.canReveal ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && adaptiveState.canReveal) {
          e.preventDefault();
          handleToggle(e);
        }
      }}
      tabIndex={adaptiveState.canReveal ? 0 : undefined}
      role={adaptiveState.canReveal ? 'button' : undefined}
      aria-label={accessibleLabel}
      title={adaptiveState.reason}
    >
      {segments.map((seg, idx) => {
        if (!seg.isKanji || !seg.reading) {
          return (
            <span key={`furi-seg-${idx}`} className="align-baseline">
              {seg.text}
            </span>
          );
        }

        return (
          <ruby key={`furi-seg-${idx}`} className="ruby leading-normal group/ruby">
            <span className="align-baseline font-inherit">{seg.text}</span>
            <rt
              className={`text-[0.55em] font-medium leading-none tracking-normal select-none transition-all duration-200 block text-center ${
                isVisible
                  ? 'opacity-100 text-red-500/90 dark:text-red-400/90'
                  : 'opacity-0 group-hover/furi:opacity-80 text-muted-foreground'
              } ${rubyClassName}`}
            >
              {seg.reading}
            </rt>
          </ruby>
        );
      })}
    </span>
  );
}
