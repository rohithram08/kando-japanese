// src/components/srs/SRSReviewCard.jsx
// Dedicated review card component for Spaced Repetition sessions.
// Displays resolved Kanji or Vocabulary with native audio, readings, and example sentences.

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useSettingsStore } from '../../store/settingsStore';
import FuriganaText from '../common/FuriganaText';
import PitchContourVisualizer from '../pitch/PitchContourVisualizer';

export default function SRSReviewCard({
  card,
  revealed,
  onReveal,
  getLangMeaning,
}) {
  const showRomaji = useSettingsStore((s) => s.romaji);

  if (!card) return null;

  const speak = (e) => {
    e?.stopPropagation();
    if (card.front) {
      audioService.speak(card.front);
    }
  };

  const localizedMeaning = getLangMeaning ? getLangMeaning(card) : card.meaning;
  const isKanji = card.cardType === 'kanji';

  return (
    <div
      onClick={!revealed ? onReveal : undefined}
      className={`w-full cursor-pointer transition-all duration-300 select-none ${
        !revealed ? 'hover:scale-[1.01]' : ''
      }`}
    >
      <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-xl overflow-hidden">
        {/* Card Header: Type Badge & Level */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isKanji
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
              }`}
            >
              {isKanji ? '漢字 Kanji' : '単語 Vocab'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {card.level || 'N5'}
            </span>
          </div>

          <button
            onClick={speak}
            title="Listen to pronunciation"
            className="p-2.5 rounded-full transition-transform active:scale-90 bg-muted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Card Front: Big Japanese Character / Word */}
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`font-bold tracking-tight text-foreground flex items-center justify-center ${
              isKanji ? 'text-6xl sm:text-7xl font-serif' : 'text-4xl sm:text-5xl'
            }`}
          >
            {isKanji ? (
              card.front
            ) : (
              <FuriganaText
                word={card.front}
                reading={card.reading}
                repetitions={card.repetitions || 0}
                isTesting={!revealed}
                size="xl"
              />
            )}
          </motion.div>

          {/* Reading (Kana) — revealed on card back */}
          {revealed && card.reading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-lg sm:text-xl font-medium text-red-500 dark:text-red-400"
            >
              {card.reading}
            </motion.p>
          )}

          {/* Romaji */}
          {showRomaji && card.romaji && revealed && (
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              {card.romaji}
            </p>
          )}
        </div>

        {/* Card Back / Revealed Details */}
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-6 border-t border-border space-y-4"
          >
            {/* Primary Meaning */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground">
                {localizedMeaning}
              </h3>
              {card.partOfSpeech && (
                <span className="text-xs italic text-muted-foreground">
                  ({card.partOfSpeech})
                </span>
              )}
            </div>

            {/* Tokyo Pitch Accent Visualizer (Vocab) */}
            {!isKanji && card.reading && (
              <div className="p-3.5 rounded-2xl bg-muted/60 text-left">
                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                  Tokyo Pitch Accent
                </p>
                <PitchContourVisualizer
                  word={card.front}
                  reading={card.reading}
                  showParticle={true}
                />
              </div>
            )}

            {/* Kanji-specific Readings */}
            {isKanji && (card.onReadings?.length > 0 || card.kunReadings?.length > 0) && (
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/50 text-xs">
                <div>
                  <span className="font-bold text-muted-foreground block mb-0.5">音読み (On):</span>
                  <span className="text-foreground font-medium">
                    {card.onReadings?.join('、 ') || '—'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-muted-foreground block mb-0.5">訓読み (Kun):</span>
                  <span className="text-foreground font-medium">
                    {card.kunReadings?.join('、 ') || '—'}
                  </span>
                </div>
              </div>
            )}

            {/* Example Sentence */}
            {card.exampleJp && (
              <div className="p-3.5 rounded-2xl bg-muted/60 text-left">
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-red-500 shrink-0" />
                  {card.exampleJp}
                </p>
                {card.exampleEn && (
                  <p className="text-xs text-muted-foreground mt-1 ml-5">
                    {card.exampleEn}
                  </p>
                )}
              </div>
            )}

            {/* Memory Mnemonic */}
            {card.mnemonic && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 text-left flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{card.mnemonic}</span>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center pt-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
              Click or tap anywhere to reveal answer ↵
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
