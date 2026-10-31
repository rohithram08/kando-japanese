// src/components/curriculum/VocabularyDetailModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Interactive Pop-Up Learning Modal for Vocabulary
// Replaces clumsy inline accordion cards with a rich, focused learning card
// featuring audio, pitch accent, Hepburn Romaji, and localized example sentences.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  BookmarkPlus,
  Check,
  Sparkles,
  Quote,
  Activity,
  GraduationCap,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useSRSStore } from '../../store/srsStore';
import { useI18n, normalizeLocale, getCurriculumMeaning, getCurriculumTranslation } from '../../i18n';
import { toRomaji, toSentenceRomaji } from '../../utils/romaji';
import { getPitchAccent } from '../../data/pitch/pitchData';
import { audioService } from '../../services/audioService';
import FuriganaText from '../common/FuriganaText';

const LEVEL_GRADIENTS = {
  N5: 'from-emerald-500 to-teal-600',
  N4: 'from-blue-500 to-indigo-600',
  N3: 'from-purple-500 to-purple-700',
  N2: 'from-orange-500 to-red-600',
  N1: 'from-amber-500 to-yellow-600',
};

export default function VocabularyDetailModal({ vocab, isOpen, onClose }) {
  const { t } = useI18n();
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage);
  const activeLang = normalizeLocale(displayLanguage);
  const { isCardInSRS, addCardToSRS, removeCardFromSRS } = useSRSStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !vocab) return null;

  const inDeck = isCardInSRS(vocab.id || vocab.word);
  const localizedMeaning = getCurriculumMeaning(vocab, activeLang);
  const translationEntry = getCurriculumTranslation(vocab.id, activeLang);
  const pitchInfo = getPitchAccent(vocab.word, vocab.reading);
  const romaji = vocab.romaji || toRomaji(vocab.reading || vocab.word);
  const gradient = LEVEL_GRADIENTS[vocab.level] || LEVEL_GRADIENTS.N5;

  const handleToggleSRS = () => {
    if (inDeck) {
      if (removeCardFromSRS) removeCardFromSRS(vocab.id || vocab.word);
    } else {
      addCardToSRS('vocabulary', vocab.id || vocab.word, vocab.word);
    }
  };

  const speak = (text) => audioService.speak(text);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className={`relative px-6 py-8 bg-gradient-to-br ${gradient} text-white flex flex-col items-center justify-center text-center shadow-inner`}>
            <button
              onClick={onClose}
              aria-label={t('common.close', 'Close')}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/35 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              {vocab.level || 'N5'} Vocabulary
            </span>

            {/* Prominent Word */}
            <div className="flex items-center justify-center gap-3 my-2">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md select-none text-white">
                <FuriganaText word={vocab.word} reading={vocab.reading} size="xl" />
              </div>
              <button
                onClick={() => speak(vocab.word)}
                title={t('audio.listen', 'Listen Pronunciation')}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Romaji */}
            <p className="text-sm font-mono text-white/90 mt-1">
              {romaji}
            </p>

            {/* Localized Meaning */}
            <h2 className="text-xl font-bold mt-2 text-white">
              {localizedMeaning}
            </h2>
            {activeLang !== 'en' && vocab.meaning && vocab.meaning !== localizedMeaning && (
              <p className="text-xs text-white/80 mt-0.5">({vocab.meaning})</p>
            )}

            {/* Badges: Part of Speech & Pitch Accent */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
              {vocab.pos && (
                <span className="px-2.5 py-0.5 rounded-full bg-black/25 font-semibold capitalize">
                  {vocab.pos}
                </span>
              )}
              {pitchInfo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 font-semibold backdrop-blur-sm">
                  <Activity className="w-3 h-3" />
                  {pitchInfo.patternMeta?.label || pitchInfo.pattern} [{pitchInfo.dropPosition}]
                </span>
              )}
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Example Sentence Card */}
            {vocab.example?.jp ? (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    <Quote className="w-3.5 h-3.5" />
                    <span>{t('vocab.example_sentence', 'Example Sentence')}</span>
                  </div>
                  <button
                    onClick={() => speak(vocab.example.jp)}
                    title={t('audio.listen', 'Pronounce Sentence')}
                    className="p-1.5 rounded-lg bg-surface hover:bg-purple-200/50 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 transition-colors shadow-xs border border-purple-500/20"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Japanese Sentence */}
                <p className="text-base font-bold text-foreground">
                  {vocab.example.jp}
                </p>

                {/* Clean Hepburn Romaji Transliteration */}
                {toSentenceRomaji(vocab.example.jp, vocab.example.reading) && (
                  <p className="text-xs font-mono text-muted-foreground">
                    {toSentenceRomaji(vocab.example.jp, vocab.example.reading)}
                  </p>
                )}

                {/* Translated Sentence */}
                <p className="text-sm font-medium text-foreground/90 pt-1 border-t border-purple-500/20">
                  {translationEntry?.example_trans || vocab.example.en || ''}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                <p className="text-xs text-muted-foreground">
                  {t('vocab.no_example', 'No example sentence registered for this entry.')}
                </p>
              </div>
            )}

            {/* Study Tags */}
            {vocab.tags && vocab.tags.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>{t('vocab.tags', 'Curriculum Tags')}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {vocab.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-muted text-muted-foreground border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between gap-3">
            <button
              onClick={handleToggleSRS}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                inDeck
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/20'
                  : 'bg-primary text-white hover:opacity-90 shadow-sm'
              }`}
            >
              {inDeck ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('srs.in_deck', 'In SRS Deck')}</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{t('srs.add_card', 'Add to SRS Deck')}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              {t('common.done', 'Done')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
