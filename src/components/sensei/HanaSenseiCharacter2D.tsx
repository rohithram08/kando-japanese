// src/components/sensei/HanaSenseiCharacter2D.tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, Heart, Award, HelpCircle } from 'lucide-react';
import './hanaSensei2D.css';

export type HanaAnimationState =
  | 'idle'
  | 'greeting'
  | 'listening'
  | 'thinking'
  | 'happy'
  | 'encouraging'
  | 'celebrating';

export type HanaCharacterSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface HanaSpeechContent {
  japanese: string;
  romaji?: string;
  english?: string;
}

export interface HanaSenseiCharacter2DProps {
  state?: HanaAnimationState;
  size?: HanaCharacterSize;
  speech?: string | HanaSpeechContent;
  showStatusPill?: boolean;
  statusLabelOverride?: string;
  interactive?: boolean;
  onCharacterClick?: () => void;
  celebrationDuration?: number;
  className?: string;
  ariaLabel?: string;
  onStateChange?: (newState: HanaAnimationState) => void;
}

const STATE_METADATA: Record<
  HanaAnimationState,
  {
    label: string;
    labelJp: string;
    badgeClass: string;
    dotClass: string;
    auraClass: string;
  }
> = {
  idle: {
    label: 'Ready to assist',
    labelJp: '準備完了',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
    auraClass: 'hana-aura-idle',
  },
  greeting: {
    label: 'Welcoming you',
    labelJp: 'こんにちは！',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    dotClass: 'bg-rose-500',
    auraClass: 'hana-aura-greeting',
  },
  listening: {
    label: 'Listening carefully',
    labelJp: '聞いています',
    badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    dotClass: 'bg-cyan-500',
    auraClass: 'hana-aura-listening',
  },
  thinking: {
    label: 'Composing reply',
    labelJp: '考え中...',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    dotClass: 'bg-purple-500',
    auraClass: 'hana-aura-thinking',
  },
  happy: {
    label: 'Great job!',
    labelJp: 'よくできました！',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500',
    auraClass: 'hana-aura-happy',
  },
  encouraging: {
    label: 'Keep going!',
    labelJp: '頑張って！',
    badgeClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    dotClass: 'bg-pink-500',
    auraClass: 'hana-aura-encouraging',
  },
  celebrating: {
    label: 'Milestone Mastered!',
    labelJp: 'おめでとう！',
    badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    dotClass: 'bg-orange-500',
    auraClass: 'hana-aura-celebrating',
  },
};

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 48,
  sm: 76,
  md: 130,
  lg: 210,
  xl: 300,
};

export default function HanaSenseiCharacter2D({
  state = 'idle',
  size = 'md',
  speech,
  showStatusPill,
  statusLabelOverride,
  interactive = true,
  onCharacterClick,
  celebrationDuration = 3200,
  className = '',
  ariaLabel,
  onStateChange,
}: HanaSenseiCharacter2DProps) {
  const [internalState, setInternalState] = useState<HanaAnimationState>(state);
  const [clickBounced, setClickBounced] = useState(false);

  // Sync state prop changes
  useEffect(() => {
    setInternalState(state);
    if (state === 'celebrating' && celebrationDuration > 0) {
      const timer = setTimeout(() => {
        setInternalState('happy');
        if (onStateChange) {
          onStateChange('happy');
        }
      }, celebrationDuration);
      return () => clearTimeout(timer);
    }
  }, [state, celebrationDuration, onStateChange]);

  // Compute pixel dimension
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 130;
  const isCompact = pixelSize < 100;
  const shouldShowPill = showStatusPill !== undefined ? showStatusPill : !isCompact;

  const meta = STATE_METADATA[internalState] || STATE_METADATA.idle;

  const handleClick = () => {
    setClickBounced(true);
    setTimeout(() => setClickBounced(false), 500);
    if (onStateChange) {
      onStateChange('happy');
    }
    if (onCharacterClick) {
      onCharacterClick();
    }
  };

  // Parse speech content
  const speechData: HanaSpeechContent | null = speech
    ? typeof speech === 'string'
      ? { japanese: speech }
      : speech
    : null;

  return (
    <div
      data-testid="hana-character-container"
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      role="region"
      aria-label={ariaLabel || `Hana-sensei companion in ${internalState} state`}
    >
      {/* ── Optional Attached Manga Speech Bubble ─────────────────── */}
      {speechData && (
        <div
          className="mb-3 max-w-xs sm:max-w-sm card p-3 sm:p-4 rounded-2xl border border-red-500/25 bg-surface/95 backdrop-blur-md shadow-md relative z-30 transition-all text-left"
          aria-live="polite"
        >
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-primary">
            <Sparkles className="w-3 h-3" />
            <span>Hana-sensei</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-foreground font-jp leading-snug">
            {speechData.japanese}
          </p>
          {speechData.romaji && (
            <p className="text-[10px] sm:text-[11px] text-primary font-medium mt-0.5">
              {speechData.romaji}
            </p>
          )}
          {speechData.english && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              "{speechData.english}"
            </p>
          )}
          {/* Bubble Pointer Tail */}
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-r border-b border-red-500/25 transform rotate-45 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}

      {/* ── Character Core Stage ───────────────────────────────────── */}
      <div
        className={`relative flex items-center justify-center hana-state-${internalState} ${
          interactive ? 'hana-interactive cursor-pointer' : ''
        } ${clickBounced ? 'scale-105 -translate-y-2' : ''}`}
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
        }}
        onClick={handleClick}
        title={interactive ? `Hana-sensei (${meta.label}) - Click to interact` : undefined}
      >
        {/* Soft state-driven aura backdrop glow */}
        <div
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-500 ${meta.auraClass}`}
          aria-hidden="true"
        />

        {/* State Visual Indicator: Thinking dots */}
        {internalState === 'thinking' && (
          <div
            className="absolute -top-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/90 border border-purple-500/30 shadow-md animate-pulse"
            aria-label="Thinking"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {/* State Visual Indicator: Listening sound waves */}
        {internalState === 'listening' && (
          <div
            className="absolute -inset-2 rounded-full border border-cyan-500/30 animate-ping pointer-events-none opacity-40"
            aria-hidden="true"
          />
        )}

        {/* State Visual Indicator: Celebrating sparkle burst */}
        {internalState === 'celebrating' && (
          <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
            <span className="hana-confetti-particle absolute top-1 left-3 text-amber-400 text-xs font-bold" style={{ '--tx': '-15px', '--ty': '-25px' } as any}>✨</span>
            <span className="hana-confetti-particle absolute top-2 right-4 text-rose-400 text-xs font-bold" style={{ '--tx': '20px', '--ty': '-20px' } as any}>🌸</span>
            <span className="hana-confetti-particle absolute bottom-4 left-2 text-yellow-400 text-xs font-bold" style={{ '--tx': '-20px', '--ty': '15px' } as any}>⭐</span>
            <span className="hana-confetti-particle absolute bottom-3 right-3 text-emerald-400 text-xs font-bold" style={{ '--tx': '18px', '--ty': '18px' } as any}>🎉</span>
          </div>
        )}

        {/* High-Resolution 2D Hana-sensei Illustration */}
        <img
          src="/images/hana-sensei-welcome.png"
          alt={ariaLabel || "Hana-sensei anime tutor character waving in traditional wave kimono"}
          className="w-full h-full object-contain hana-img transition-all duration-300 filter drop-shadow-md"
          loading="lazy"
        />

        {/* Status Pill Badge anchored to character footer */}
        {shouldShowPill && (
          <div
            className={`absolute -bottom-2 z-20 px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-semibold shadow-md backdrop-blur-md bg-surface/95 flex items-center gap-1.5 transition-all whitespace-nowrap ${meta.badgeClass}`}
            data-testid="hana-status-pill"
          >
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${meta.dotClass}`} aria-hidden="true" />
            <span>{statusLabelOverride || meta.label}</span>
            <span className="text-muted-foreground/50 hidden sm:inline" aria-hidden="true">•</span>
            <span className="font-jp hidden sm:inline">{meta.labelJp}</span>
          </div>
        )}
      </div>
    </div>
  );
}
