// src/components/reading/VocabLookupModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Interactive Learning Element & Vocabulary Lookup Modal for Graded Readers
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useRef } from 'react';
import { X, BookmarkPlus, Check, AlertCircle, RefreshCw, BookOpen, Sparkles } from 'lucide-react';
import { useSRSStore } from '../../store/srsStore';
import FuriganaText from '../common/FuriganaText';
import AudioButton from '../common/AudioButton';
import PitchContourVisualizer from '../pitch/PitchContourVisualizer';
import { getPitchAccent } from '../../data/pitch/pitchData';
import { useI18n, getCurriculumMeaning } from '../../i18n';

const TYPE_BADGES = {
  vocabulary: { label: '🟢 Vocabulary', bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  grammar: { label: '🟣 Grammar Pattern', bg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' },
  particle: { label: '🔵 Particle Function', bg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30' },
  kanji: { label: '🔴 Kanji Character', bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
};

export default function VocabLookupModal({ vocab, onClose, furiganaMode = null }) {
  const { isCardInSRS, addCardToSRS } = useSRSStore();
  const { t, locale } = useI18n();
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // Autofocus modal and restore focus to trigger element on dismiss
  useEffect(() => {
    if (!vocab) return;
    previouslyFocusedElementRef.current = document.activeElement;
    modalRef.current?.focus();

    return () => {
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [vocab]);

  // Handle Escape key and Tab focus trap
  useEffect(() => {
    if (!vocab) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), [tabindex]:not([tabindex="-1"]), a[href], input:not([disabled])'
          )
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vocab, onClose]);

  if (!vocab) return null;

  const cardRefId = vocab.vocabRefId || vocab.surface || vocab.text;
  const inDeck = isCardInSRS(cardRefId);
  const surfaceText = vocab.surface || vocab.text || '';
  const readingText = vocab.reading || '';

  // Check verified pitch accent
  const verifiedPitch = getPitchAccent(surfaceText, readingText);
  const isPitchVerified = vocab.pitchVerified === false ? false : (Boolean(vocab.pitchVerified) || !!verifiedPitch);
  const elementType = vocab.type || (vocab.partOfSpeech === 'particle' ? 'particle' : 'vocabulary');
  const typeBadge = TYPE_BADGES[elementType] || TYPE_BADGES.vocabulary;

  const handleAddSRS = async (e) => {
    e.stopPropagation();
    if (inDeck || isAdding) return;

    setIsAdding(true);
    setAddError(null);

    try {
      const success = await addCardToSRS('vocabulary', cardRefId, surfaceText);
      if (!success) {
        setAddError('Failed to add card. Please try again.');
      }
    } catch (err) {
      setAddError(err?.message || 'Error adding card to SRS');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vocab-lookup-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg p-6 bg-surface rounded-3xl border border-border shadow-2xl relative outline-none animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${typeBadge.bg}`}>
              {typeBadge.label}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              {vocab.jlptLevel || 'N5'}
            </span>
            {vocab.partOfSpeech && (
              <span className="text-[11px] font-medium text-muted-foreground capitalize">
                {vocab.partOfSpeech}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close vocabulary details"
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="vocab-lookup-title" className="text-3xl font-extrabold text-foreground mb-1 font-jp">
              {readingText ? (
                <FuriganaText
                  word={surfaceText}
                  reading={readingText}
                  forceMode={furiganaMode || 'always'}
                />
              ) : (
                surfaceText
              )}
            </h2>
            {readingText && (
              <p className="text-sm font-medium text-primary">
                {readingText}
              </p>
            )}
          </div>

          <AudioButton text={surfaceText} size="md" />
        </div>

        {/* Meaning */}
        <div className="p-3.5 rounded-2xl bg-muted/60 border border-border mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            {t('common.meaning', 'Meaning')}
          </span>
          <p className="text-sm font-semibold text-foreground">
            {getCurriculumMeaning(vocab, locale) || vocab.meaning}
          </p>
        </div>

        {/* Role in This Story Sentence (Requirement 3) */}
        {vocab.roleInStory && (
          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-1">
              Role in This Story (文脈解説)
            </span>
            <p className="text-xs text-foreground leading-relaxed">
              {vocab.roleInStory}
            </p>
          </div>
        )}

        {/* Grammar & Structural Mechanics (Requirement 3) */}
        {vocab.mechanicsExplanation && (
          <div className="p-3.5 rounded-2xl bg-muted/60 border border-border mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Structure & Mechanics (文法・規則)
            </span>
            <p className="text-xs text-foreground leading-relaxed">
              {vocab.mechanicsExplanation}
            </p>
          </div>
        )}

        {/* Alternative Real-World Example Sentence (Requirement 3) */}
        {vocab.exampleSentence && (
          <div className="p-3.5 rounded-2xl bg-muted/60 border border-border mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Alternative Context Example (例文)
              </span>
              <AudioButton text={vocab.exampleSentence.japanese} size="sm" />
            </div>
            <div className="text-sm font-bold font-jp text-foreground mb-1">
              {vocab.exampleSentence.furigana ? (
                <FuriganaText text={vocab.exampleSentence.furigana} />
              ) : (
                vocab.exampleSentence.japanese
              )}
            </div>
            <p className="text-xs text-muted-foreground italic">
              "{vocab.exampleSentence.english}"
            </p>
          </div>
        )}

        {/* Pitch Accent Section (if applicable) */}
        {surfaceText && readingText && (
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Pitch Accent ($F_0$ Contour)
            </span>
            {isPitchVerified ? (
              <div className="p-3 rounded-2xl bg-muted/40 border border-border">
                <PitchContourVisualizer
                  word={surfaceText}
                  reading={readingText}
                  particle="が"
                  showDetails={true}
                />
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center space-x-2 text-xs text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Pitch accent data awaiting verified dictionary entry</span>
              </div>
            )}
          </div>
        )}

        {/* SRS Intake Button */}
        <div className="pt-4 border-t border-border flex flex-col gap-2">
          {addError && (
            <div className="text-xs text-rose-600 dark:text-rose-400 mb-1">
              {addError}
            </div>
          )}

          <button
            type="button"
            disabled={inDeck || isAdding}
            onClick={handleAddSRS}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              inDeck
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 cursor-default'
                : 'bg-primary hover:bg-primary/90 text-white shadow-xs hover:shadow disabled:opacity-50'
            }`}
          >
            {inDeck ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('common.in_srs_deck', 'In SRS Review Deck (追加済み)')}</span>
              </>
            ) : isAdding ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('common.loading', 'Adding to SRS Deck...')}</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>{t('common.add_to_srs_deck', 'Add to SRS Deck (+ 復習に追加)')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
