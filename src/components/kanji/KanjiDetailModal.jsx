// src/components/kanji/KanjiDetailModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Interactive Pop-Up Learning Modal for Kanji
// Features:
// - Comprehensive layout matching student workflow:
//   * Left Pane: Prominent Kanji, On'yomi, Kun'yomi, Romaji, and 5-6 authentic vocabulary examples
//   * Right Pane: Animated interactive Stroke Order viewer & practice tracing canvas
// - Sequential navigation: Previous / Next kanji controls with keyboard arrow support
// - SRS deck integration (Add / Remove)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  BookmarkPlus,
  Check,
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  PenTool,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettingsStore } from '../../store/settingsStore';
import { useThemeStore } from '../../store/themeStore';
import { useSRSStore } from '../../store/srsStore';
import { useI18n, normalizeLocale, getCurriculumMeaning } from '../../i18n';
import { toRomaji, parseKanjiExample } from '../../utils/romaji';
import { audioService } from '../../services/audioService';
import { KANJI_EXAMPLE_MEANINGS } from '../../data/kanjiExampleMeanings';
import StrokeOrder from './StrokeOrder';

const LEVEL_GRADIENTS = {
  N5: 'from-emerald-500 to-teal-600',
  N4: 'from-blue-500 to-indigo-600',
  N3: 'from-purple-500 to-purple-700',
  N2: 'from-orange-500 to-red-600',
  N1: 'from-amber-500 to-yellow-600',
};

export default function KanjiDetailModal({
  kanji,
  isOpen,
  onClose,
  initialTab = 'overview',
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}) {
  const { t } = useI18n();
  const [mobileTab, setMobileTab] = useState(initialTab || 'overview');
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage);
  const activeLang = normalizeLocale(displayLanguage);
  const { isCardInSRS, addCardToSRS, removeCardFromSRS } = useSRSStore();

  useEffect(() => {
    if (isOpen) {
      setMobileTab(initialTab || 'overview');
    }
  }, [isOpen, initialTab, kanji?.kanji]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev && !e.target.matches('input, textarea')) {
        onPrev?.();
      }
      if (e.key === 'ArrowRight' && hasNext && !e.target.matches('input, textarea')) {
        onNext?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!isOpen || !kanji) return null;

  const inDeck = isCardInSRS(kanji.id || kanji.kanji);
  const localizedMeaning = getCurriculumMeaning(kanji, activeLang);
  const onReadings = kanji.readings?.on?.filter(Boolean) || [];
  const kunReadings = kanji.readings?.kun?.filter((r) => r && r !== '-') || [];
  const gradient = LEVEL_GRADIENTS[kanji.level] || LEVEL_GRADIENTS.N5;

  const handleToggleSRS = () => {
    if (inDeck) {
      if (removeCardFromSRS) removeCardFromSRS(kanji.id || kanji.kanji);
    } else {
      addCardToSRS('kanji', kanji.id || kanji.kanji, kanji.kanji);
    }
  };

  const speak = (text) => audioService.speak(text);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-4xl lg:max-w-5xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        >
          {/* ── Top Header Banner: "This The Kanji" ── */}
          <div className={`relative px-6 py-6 sm:py-7 bg-gradient-to-br ${gradient} text-white flex flex-col items-center justify-center text-center shadow-inner shrink-0`}>
            <button
              onClick={onClose}
              aria-label={t('common.close', 'Close')}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/35 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              {kanji.level || 'N5'} Kanji
            </span>

            {/* Kanji Character + Pronunciation Audio Button */}
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight drop-shadow-md select-none text-white">
                {kanji.kanji}
              </span>
              <button
                onClick={() => speak(kanji.kanji)}
                title={t('audio.listen', 'Listen Pronunciation')}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Meaning Title */}
            <h2 className="text-xl sm:text-2xl font-bold mt-1 capitalize text-white">
              {localizedMeaning}
            </h2>
            {activeLang !== 'en' && kanji.meaning && kanji.meaning !== localizedMeaning && (
              <p className="text-xs text-white/80 mt-0.5">({kanji.meaning})</p>
            )}

            {/* Stroke Count & Radical Meta Badges */}
            <div className="flex items-center gap-3 mt-2.5 text-xs text-white/90">
              {kanji.strokeCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-black/20 font-medium">
                  {kanji.strokeCount} {t('kanji.strokes', 'Strokes')}
                </span>
              )}
              {kanji.radical && (
                <span className="px-2.5 py-0.5 rounded-full bg-black/20 font-medium">
                  {t('kanji.radical', 'Radical')}: {kanji.radical}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Tab Switcher (< md screens) */}
          <div className="flex md:hidden border-b border-border bg-muted/40 p-1.5 gap-1.5 shrink-0">
            <button
              onClick={() => setMobileTab('overview')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                mobileTab === 'overview'
                  ? 'bg-surface text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('kanji.tab_overview', 'Readings & Examples')}</span>
            </button>
            <button
              onClick={() => setMobileTab('stroke')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                mobileTab === 'stroke'
                  ? 'bg-surface text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{t('kanji.tab_stroke', 'Stroke Order & Draw')}</span>
            </button>
          </div>

          {/* ── Main Content: Two Columns on Desktop (Side-by-Side), Tabs on Mobile ── */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            
            {/* ── Left Column: Readings & 5-6 Vocabulary Examples ── */}
            <div className={`p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[60vh] md:max-h-[65vh] ${mobileTab !== 'overview' ? 'hidden md:block' : ''}`}>
              {/* Readings Section (On'yomi & Kun'yomi) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* On'yomi */}
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1.5 uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('kanji.onyomi', "On'yomi (音読み)")}</span>
                  </div>
                  {onReadings.length > 0 ? (
                    <div className="space-y-1">
                      {onReadings.map((reading, i) => (
                        <div key={i} className="flex items-baseline gap-2">
                          <button
                            onClick={() => speak(reading)}
                            className="text-base font-bold text-foreground hover:text-blue-600 transition-colors"
                          >
                            {reading}
                          </button>
                          <span className="text-xs font-mono text-muted-foreground">
                            {toRomaji(reading)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">—</p>
                  )}
                </div>

                {/* Kun'yomi */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('kanji.kunyomi', "Kun'yomi (訓読み)")}</span>
                  </div>
                  {kunReadings.length > 0 ? (
                    <div className="space-y-1">
                      {kunReadings.map((reading, i) => (
                        <div key={i} className="flex items-baseline gap-2">
                          <button
                            onClick={() => speak(reading)}
                            className="text-base font-bold text-foreground hover:text-emerald-600 transition-colors"
                          >
                            {reading}
                          </button>
                          <span className="text-xs font-mono text-muted-foreground">
                            {toRomaji(reading)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">—</p>
                  )}
                </div>
              </div>

              {/* Vocabulary Examples List (5 to 6 words) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {t('kanji.examples', 'Vocabulary Examples')}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {kanji.examples?.length || 0} {t('kanji.words', 'words')}
                  </span>
                </div>

                {kanji.examples && kanji.examples.length > 0 ? (
                  <div className="space-y-2.5">
                    {kanji.examples.map((ex, i) => {
                      const parsed = parseKanjiExample(ex);
                      const dictEntry = KANJI_EXAMPLE_MEANINGS[parsed.word] || KANJI_EXAMPLE_MEANINGS[parsed.reading];
                      const activeMeaning =
                        (activeLang === 'ta' && dictEntry?.ta) ||
                        (activeLang === 'hi' && dictEntry?.hi) ||
                        dictEntry?.en ||
                        parsed.meaning ||
                        kanji.meaning ||
                        '';

                      const romaji = parsed.romaji || dictEntry?.romaji || toRomaji(parsed.reading || parsed.word);

                      return (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-muted/50 border border-border flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-base font-bold text-foreground">
                                {parsed.word}
                              </span>
                              {parsed.reading && parsed.reading !== parsed.word && (
                                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                  【{parsed.reading}】
                                </span>
                              )}
                              <span className="text-xs font-mono text-muted-foreground">
                                {romaji}
                              </span>
                            </div>
                            {activeMeaning && (
                              <p className="text-xs font-medium text-muted-foreground mt-0.5 truncate">
                                {activeMeaning}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => speak(parsed.word)}
                            title={t('audio.listen', 'Pronounce')}
                            className="p-2 rounded-xl bg-surface hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-950 dark:hover:text-purple-300 text-muted-foreground transition-colors shrink-0 shadow-xs border border-border"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    {t('kanji.no_examples', 'No example words available for this kanji.')}
                  </p>
                )}
              </div>
            </div>

            {/* ── Right Column: Interactive Stroke Order & Practice Drawing ── */}
            <div className={`p-4 sm:p-6 overflow-y-auto max-h-[60vh] md:max-h-[65vh] flex flex-col justify-start ${mobileTab !== 'stroke' ? 'hidden md:block' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <PenTool className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  {t('kanji.tab_stroke', 'Stroke Order & Practice')}
                </h3>
              </div>

              <StrokeOrder
                key={kanji.kanji}
                character={kanji.kanji}
                isDark={isDark}
                onComplete={() => toast.success(t('kanji.stroke_complete', 'Great job! Stroke order practiced!'))}
              />
            </div>

          </div>

          {/* ── Modal Footer: [add to SRS] [Previous] [Next] [Done] ── */}
          <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between gap-3 shrink-0 flex-wrap">
            {/* Left: Add to SRS */}
            <button
              onClick={handleToggleSRS}
              className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
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
                  <span>{t('srs.add_card', 'Add to SRS')}</span>
                </>
              )}
            </button>

            {/* Center: Previous & Next Kanji Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label={t('common.previous', 'Previous')}
                title={hasPrev ? 'Previous Kanji (←)' : ''}
                className="py-2 px-3.5 rounded-xl text-xs font-semibold border border-border bg-surface hover:bg-muted disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors text-foreground shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('common.previous', 'Previous')}</span>
              </button>

              <button
                onClick={onNext}
                disabled={!hasNext}
                aria-label={t('common.next', 'Next')}
                title={hasNext ? 'Next Kanji (→)' : ''}
                className="py-2 px-3.5 rounded-xl text-xs font-semibold border border-border bg-surface hover:bg-muted disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors text-foreground shadow-xs"
              >
                <span>{t('common.next', 'Next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Close / Done */}
            <button
              onClick={onClose}
              className="py-2 px-5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              {t('common.done', 'Done')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
