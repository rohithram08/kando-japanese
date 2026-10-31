// src/components/pitch/PitchContourVisualizer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Interactive Tokyo Pitch Accent ($F_0$) Visualizer
// Renders SVG pitch contour over mora sequence with drop indicator and particle preview.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Info, AlertCircle } from 'lucide-react';
import { getPitchAccent } from '../../data/pitch/pitchData';
import { audioService } from '../../services/audioService';

export default function PitchContourVisualizer({
  word,
  reading,
  showParticle = true,
  particleText = 'が',
  className = '',
  compact = false,
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const data = getPitchAccent(word, reading);

  const handleSpeak = (e) => {
    e?.stopPropagation();
    if (word) {
      audioService.speak(word);
    }
  };

  // Fallback state if pitch data is unverified or missing
  if (!data) {
    return (
      <div className={`rounded-xl p-3 border border-border/60 bg-muted/30 text-xs text-text-secondary ${className}`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500/80 flex-shrink-0" />
          <span>Pitch accent data not verified for this word yet.</span>
        </div>
      </div>
    );
  }

  const { morae, pitchHeights, particlePitch, pattern, dropPosition, patternMeta } = data;

  // SVG Geometry Settings
  const stepX = compact ? 36 : 48;
  const startX = 24;
  const highY = 22; // High pitch line
  const lowY = 56;  // Low pitch line
  const totalMorae = morae.length;
  const svgWidth = startX + totalMorae * stepX + (showParticle ? stepX + 16 : 16);
  const svgHeight = 90;

  // Compute node coordinates
  const points = morae.map((mora, i) => {
    const x = startX + i * stepX;
    const y = pitchHeights[i] === 'H' ? highY : lowY;
    return { mora, x, y, pitch: pitchHeights[i], index: i + 1 };
  });

  // Particle coordinate (e.g. + が)
  const particleX = startX + totalMorae * stepX;
  const particleY = particlePitch === 'H' ? highY : lowY;

  // Construct SVG polyline path string for word
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Badge color mapping
  const badgeColors = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  const badgeStyle = badgeColors[patternMeta?.badgeColor] || badgeColors.blue;

  // Accessible descriptive string
  const accessibleDescription = `Tokyo pitch accent for ${word} (${reading}): ${patternMeta?.romaji} pattern. ` +
    points.map((p) => `Mora ${p.index} (${p.mora}) is ${p.pitch === 'H' ? 'High' : 'Low'}`).join(', ') +
    (showParticle ? `, followed by particle ${particleText} which is ${particlePitch === 'H' ? 'High' : 'Low'}.` : '.');

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 shadow-sm transition-all ${className}`}
      role="region"
      aria-label={accessibleDescription}
    >
      {/* Header bar: Badge, Drop indicator & Audio */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeStyle}`}>
            <span>[{patternMeta?.code}]</span>
            <span>{patternMeta?.kanji}</span>
            <span className="font-medium text-[11px] opacity-80">({patternMeta?.romaji})</span>
          </span>

          <span className="text-xs text-text-secondary font-medium hidden sm:inline">
            {patternMeta?.english}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-foreground hover:bg-muted/60 transition-colors"
            title="Explain this pitch pattern"
            aria-expanded={showExplanation}
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Listen to word pronunciation"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Pitch Graph Canvas */}
      <div className="w-full overflow-x-auto py-1 scrollbar-none select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="mx-auto block"
          style={{ width: `${Math.min(svgWidth, 420)}px`, height: `${svgHeight}px` }}
          aria-hidden="true"
        >
          {/* Reference baseline guidelines */}
          <line
            x1="12"
            y1={highY}
            x2={svgWidth - 12}
            y2={highY}
            stroke="currentColor"
            strokeDasharray="3 3"
            strokeOpacity="0.15"
          />
          <line
            x1="12"
            y1={lowY}
            x2={svgWidth - 12}
            y2={lowY}
            stroke="currentColor"
            strokeDasharray="3 3"
            strokeOpacity="0.15"
          />

          {/* High / Low markers on left margin */}
          <text x="6" y={highY + 3} fontSize="8" fontWeight="bold" fill="currentColor" opacity="0.35">
            H
          </text>
          <text x="6" y={lowY + 3} fontSize="8" fontWeight="bold" fill="currentColor" opacity="0.35">
            L
          </text>

          {/* Main pitch contour connection line */}
          <path
            d={linePath}
            fill="none"
            stroke="rgb(239 68 68)" // red-500
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Connection to attached particle */}
          {showParticle && (
            <line
              x1={points[points.length - 1].x}
              y1={points[points.length - 1].y}
              x2={particleX}
              y2={particleY}
              stroke="rgb(239 68 68)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              strokeOpacity="0.7"
            />
          )}

          {/* Mora Nodes & Labels */}
          {points.map((p) => {
            const isDrop = p.index === dropPosition;
            return (
              <g key={`mora-${p.index}`}>
                {/* Node circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5.5"
                  fill="white"
                  stroke={isDrop ? 'rgb(220 38 38)' : 'rgb(239 68 68)'}
                  strokeWidth="3"
                />

                {/* Accent drop indicator pin (▼) */}
                {isDrop && (
                  <path
                    d={`M ${p.x - 4} ${p.y - 12} L ${p.x + 4} ${p.y - 12} L ${p.x} ${p.y - 7} Z`}
                    fill="rgb(220 38 38)"
                  />
                )}

                {/* Mora kana label */}
                <text
                  x={p.x}
                  y={lowY + 22}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill="currentColor"
                >
                  {p.mora}
                </text>
              </g>
            );
          })}

          {/* Attached particle node (+ が) */}
          {showParticle && (
            <g>
              <circle
                cx={particleX}
                cy={particleY}
                r="4.5"
                fill="currentColor"
                opacity="0.25"
                stroke="rgb(239 68 68)"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
              <text
                x={particleX}
                y={lowY + 22}
                textAnchor="middle"
                fontSize="11"
                fontWeight="normal"
                fill="currentColor"
                opacity="0.6"
              >
                +{particleText}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Expandable Pedagogical Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/70 pt-3 mt-2 text-xs text-text-secondary leading-relaxed space-y-1.5"
          >
            <p>
              <span className="font-semibold text-foreground">{patternMeta?.kanji} ({patternMeta?.romaji}): </span>
              {patternMeta?.description}
            </p>
            {data.notes && (
              <p className="text-muted-foreground italic">
                {data.notes}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground/70 pt-1">
              Source: {data.source}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
