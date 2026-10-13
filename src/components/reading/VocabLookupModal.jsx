// src/components/reading/VocabLookupModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Interactive Vocabulary Lookup Popover / Modal for Graded Readers
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useRef } from 'react';
import { X, BookmarkPlus, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useSRSStore } from '../../store/srsStore';
import FuriganaText from '../common/FuriganaText';
import AudioButton from '../common/AudioButton';
import PitchContourVisualizer from '../pitch/PitchContourVisualizer';
import { getPitchAccent } from '../../data/pitch/pitchData';

export default function VocabLookupModal({ vocab, onClose, furiganaMode = null }) {
  const { isCardInSRS, addCardToSRS } = useSRSStore();
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

  const cardRefId = vocab.vocabRefId || vocab.surface;
  const inDeck = isCardInSRS(cardRefId);

  // Check verified pitch accent
  const verifiedPitch = getPitchAccent(vocab.surface, vocab.reading);
  const isPitchVerified = vocab.pitchVerified || !!verifiedPitch;

  const handleAddSRS = async (e) => {
    e.stopPropagation();
    if (inDeck || isAdding) return;

    setIsAdding(true);
    setAddError(null);

    try {
      const success = await addCardToSRS('vocabulary', cardRefId, vocab.surface);
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
        className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl relative outline-none animate-in zoom-in-95 duration-150"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {vocab.jlptLevel || 'N5'}
            </span>
            {vocab.partOfSpeech && (
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 capitalize">
                {vocab.partOfSpeech}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close vocabulary details"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="vocab-lookup-title" className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">
              <FuriganaText
                word={vocab.surface}
                reading={vocab.reading}
                forceMode={furiganaMode || 'always'}
              />
            </h2>
            <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
              {vocab.reading}
            </p>
          </div>

          <AudioButton text={vocab.surface} size="md" />
        </div>

        {/* English Meaning */}
        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
            English Meaning
          </span>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {vocab.meaning}
          </p>
        </div>

        {/* Pitch Accent Section */}
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-2">
            Pitch Accent ($F_0$ Contour)
          </span>
          {isPitchVerified ? (
            <div className="p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
              <PitchContourVisualizer
                word={vocab.surface}
                reading={vocab.reading}
                particle="が"
                showDetails={true}
              />
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Pitch accent data awaiting verified dictionary entry</span>
            </div>
          )}
        </div>

        {/* SRS Intake Button */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
          {addError && (
            <div className="text-xs text-rose-600 dark:text-rose-400 mb-1">
              {addError}
            </div>
          )}

          <button
            type="button"
            disabled={inDeck || isAdding}
            onClick={handleAddSRS}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              inDeck
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs hover:shadow disabled:opacity-50'
            }`}
          >
            {inDeck ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>In SRS Review Deck (追加済み)</span>
              </>
            ) : isAdding ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Adding to SRS Deck...</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Add to SRS Deck (+ 復習に追加)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
