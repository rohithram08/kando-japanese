// src/components/curriculum/GrammarDetailModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Interactive Pop-Up Learning Modal for Grammar
// Replaces clumsy inline accordion cards with a rich, focused learning card
// featuring audio, formation formulas, Hepburn Romaji, and localized examples.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  Code2,
  GraduationCap,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useI18n, normalizeLocale, getCurriculumMeaning, getCurriculumExplanation } from '../../i18n';
import { toRomaji, toSentenceRomaji } from '../../utils/romaji';
import { audioService } from '../../services/audioService';

const LEVEL_GRADIENTS = {
  N5: 'from-emerald-500 to-teal-600',
  N4: 'from-blue-500 to-indigo-600',
  N3: 'from-purple-500 to-purple-700',
  N2: 'from-orange-500 to-red-600',
  N1: 'from-amber-500 to-yellow-600',
};

export default function GrammarDetailModal({
  grammar,
  isOpen,
  onClose,
  isStudied = false,
  onToggleStudied,
}) {
  const { t } = useI18n();
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage);
  const activeLang = normalizeLocale(displayLanguage);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !grammar) return null;

  const localizedMeaning = getCurriculumMeaning(grammar, activeLang);
  const localizedExplanation = getCurriculumExplanation(grammar, activeLang);
  const romaji = grammar.romaji || toRomaji(grammar.pattern);
  const gradient = LEVEL_GRADIENTS[grammar.level] || LEVEL_GRADIENTS.N5;

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
              {grammar.level || 'N5'} Grammar
            </span>

            {/* Prominent Pattern */}
            <div className="flex items-center justify-center gap-3 my-2 max-w-full px-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md select-none text-white text-center">
                {grammar.pattern}
              </h1>
              <button
                onClick={() => speak(grammar.pattern.replace(/[〜～]/g, ''))}
                title={t('audio.listen', 'Listen Pronunciation')}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Romaji */}
            {romaji && (
              <p className="text-sm font-mono text-white/90 mt-1">
                {romaji}
              </p>
            )}

            {/* Meaning */}
            <p className="text-base font-semibold mt-2 text-white">
              {localizedMeaning}
            </p>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Formation Formula Box */}
            {grammar.formation && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{t('grammar.formation', 'Formation Rule')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-indigo-500/20 text-xs font-mono font-semibold text-foreground">
                  {grammar.formation}
                </div>
              </div>
            )}

            {/* In-depth Localized Explanation */}
            {localizedExplanation && (
              <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t('grammar.explanation', 'Grammar Explanation')}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {localizedExplanation}
                </p>
              </div>
            )}

            {/* Example Sentences */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t('grammar.examples', 'Example Sentences')}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {grammar.examples?.length || 0} {t('grammar.sentences', 'sentences')}
                </span>
              </div>

              {grammar.examples && grammar.examples.length > 0 ? (
                <div className="space-y-3">
                  {grammar.examples.map((ex, i) => {
                    const jpText = typeof ex === 'string' ? ex : (ex.jp || ex.japanese || '');
                    const meaningText = typeof ex === 'string' ? '' : (ex.en || ex.english || ex.meaning || '');
                    const exReading = typeof ex === 'object' ? ex.reading : '';
                    const exRomaji = toSentenceRomaji(jpText, exReading);

                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-start justify-between gap-3 hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-bold text-foreground">
                            {jpText}
                          </p>
                          {exRomaji && (
                            <p className="text-xs font-mono text-muted-foreground">
                              {exRomaji}
                            </p>
                          )}
                          {meaningText && (
                            <p className="text-xs text-muted-foreground pt-0.5">
                              {meaningText}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => speak(jpText)}
                          title={t('audio.listen', 'Pronounce Sentence')}
                          className="p-2 rounded-xl bg-surface hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-950 dark:hover:text-purple-300 text-muted-foreground transition-colors shrink-0 shadow-xs border border-border mt-0.5"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-3">
                  {t('grammar.no_examples', 'No example sentences registered for this grammar rule.')}
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between gap-3">
            {onToggleStudied && (
              <button
                onClick={onToggleStudied}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isStudied
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/20'
                    : 'bg-primary text-white hover:opacity-90 shadow-sm'
                }`}
              >
                {isStudied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('grammar.studied', 'Marked as Studied')}</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>{t('grammar.mark_studied', 'Mark as Studied')}</span>
                  </>
                )}
              </button>
            )}

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
