import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  BookmarkPlus,
  Check,
  Star,
  PenTool,
  Lightbulb,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useSRSStore } from '../../store/srsStore';
import { useI18n } from '../../i18n';
import { getKanaStrokeData } from '../../data/kana/kanaStrokes';
import { CONFUSABLE_PAIRS } from '../../data/kana/kanaData';

export default function KanaDetailModal({
  kana,
  onClose,
  onOpenTracing,
  masteryStats = { correct: 0, mastered: false },
  onToggleMastery,
}) {
  const { t } = useI18n();
  const { isCardInSRS, addCardToSRS } = useSRSStore();

  if (!kana) return null;

  const inSRS = isCardInSRS(kana.id) || isCardInSRS(kana.kana);
  const strokeData = getKanaStrokeData(kana.kana);
  const confusable = CONFUSABLE_PAIRS.find((p) => p.chars.includes(kana.kana));

  const handleSpeak = (text) => {
    audioService.speak(text);
  };

  const handleToggleSRS = () => {
    addCardToSRS('kana', kana.id, kana.kana);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden my-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Details for kana ${kana.kana}`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-muted/40">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {kana.script === 'hiragana' ? 'Hiragana ひらがな' : 'Katakana カタカナ'}
              </span>
              <span className="text-xs text-muted-foreground capitalize font-medium">
                {kana.group}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Hero Character Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-6xl font-japanese font-bold shadow-xl shadow-purple-500/20 select-none">
                {kana.kana}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
                  <h2 className="text-3xl font-black text-foreground uppercase tracking-wide">
                    {kana.romaji}
                  </h2>
                  <span className="text-sm text-muted-foreground font-mono">
                    /{kana.romaji}/
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                  <button
                    onClick={() => handleSpeak(kana.kana)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Pronounce
                  </button>

                  <button
                    onClick={handleToggleSRS}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      inSRS
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                        : 'bg-muted border-border hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600'
                    }`}
                  >
                    {inSRS ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    {inSRS ? t('common.in_srs', 'In SRS Deck') : `+ ${t('common.add_to_srs', 'Add to SRS')}`}
                  </button>

                  <button
                    onClick={() => onToggleMastery?.(kana.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      masteryStats.mastered
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted border-border hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600'
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        masteryStats.mastered ? 'fill-current' : ''
                      }`}
                    />
                    {masteryStats.mastered ? 'Mastered' : 'Mark Mastered'}
                  </button>
                </div>

                <p className="text-[11px] text-muted-foreground italic pt-1">
                  Audio source: Speech Synthesis (ja-JP)
                </p>
              </div>
            </div>

            {/* Visual Mnemonic */}
            {kana.mnemonic && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-foreground space-y-1.5">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  Visual Memory Mnemonic
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {kana.mnemonic}
                </p>
              </div>
            )}

            {/* Confusing Pair Alert */}
            {confusable && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  Look-Alike Alert: {confusable.title}
                </div>
                <p className="text-xs leading-relaxed text-foreground/80">
                  {confusable.explanation}
                </p>
                <div className="p-2 rounded-xl bg-surface/80 border border-border text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Tip: {confusable.rule}
                </div>
              </div>
            )}

            {/* Stroke Information */}
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <PenTool className="w-4 h-4 text-purple-500" />
                  Stroke Order ({kana.strokeCount || strokeData?.strokeCount || '—'} strokes)
                </div>
                {onOpenTracing && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTracing(kana);
                    }}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                  >
                    Open Canvas Tracing &rarr;
                  </button>
                )}
              </div>

              {strokeData?.tips ? (
                <div className="space-y-1.5">
                  {strokeData.tips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-foreground/80 leading-relaxed">
                      {tip}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Standard stroke count: {kana.strokeCount || 1} stroke(s). Use the Tracing Canvas to practice smooth execution.
                </p>
              )}
            </div>

            {/* Example Words */}
            {kana.examples && kana.examples.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Beginner Example Words
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {kana.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-border bg-muted/40 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-japanese font-bold text-foreground text-sm">
                            {ex.word}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {ex.reading}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {ex.meaning}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSpeak(ex.word)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        title={`Listen to ${ex.word}`}
                        aria-label={`Listen to ${ex.word}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              {t('lessons.done', 'Done')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
