// src/components/placement/LevelPlacementModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// JLPT Level Qualification Placement Modal
// Strictly evaluates learners attempting to access levels higher than N5 (N4..N1).
// Learners must achieve >= 80% on genuine level questions to qualify; otherwise
// they begin at N5 to ensure solid educational foundations.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { PLACEMENT_TESTS } from '../../data/placementTests';
import { useProgressStore } from '../../store/progressStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { useI18n } from '../../i18n';
import { post } from '../../api/client';

export default function LevelPlacementModal({
  isOpen,
  targetLevel = 'N4',
  onClose,
  onQualified,
}) {
  const { t } = useI18n();
  const test = PLACEMENT_TESTS[targetLevel] || PLACEMENT_TESTS.N4;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const user = useAuthStore((s) => s.user);

  if (!isOpen) return null;

  const currentQ = test.questions[currentIdx];
  const isSelected = selectedAnswers[currentIdx] !== undefined;

  const handleSelectOption = (optIdx) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < test.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      finishTest();
    }
  };

  const calculateScore = () => {
    let score = 0;
    test.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  const finishTest = async () => {
    setShowResults(true);
    const score = calculateScore();
    const passed = score >= test.passingScore;

    if (passed) {
      setSubmitting(true);
      try {
        if (user) {
          await post('/users/qualify-placement', {
            targetLevel: test.level,
            score,
            totalQuestions: test.questions.length,
          });
        }
        useProgressStore.getState().setStudyLevel?.(test.level);
        useSettingsStore.getState().updateSettings({ jlptLevel: test.level });
        toast.success(`🎉 ${t('placement.qualified', `Qualified for JLPT ${test.level}!`)}`);
        onQualified?.(test.level);
      } catch (err) {
        console.warn('Placement qualification sync note:', err);
        useSettingsStore.getState().updateSettings({ jlptLevel: test.level });
        onQualified?.(test.level);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Begin at N5
      useSettingsStore.getState().updateSettings({ jlptLevel: 'N5' });
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = calculateScore();
  const passed = score >= test.passingScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {test.title}
              </h2>
              <p className="text-xs text-white/80">
                {t('placement.pass_requirement', `Answer 4 of 5 correctly to qualify for ${test.level}`)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/35 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!showResults ? (
            <>
              {/* Question Progress Indicator */}
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>
                  {t('placement.question_step', { current: currentIdx + 1, total: test.questions.length }, `Question ${currentIdx + 1} of ${test.questions.length}`)}
                </span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                  {currentQ.category}
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / test.questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-muted/40 border border-border">
                <p className="text-lg font-bold text-foreground">
                  {currentQ.question}
                </p>
                {currentQ.questionRomaji && (
                  <p className="text-xs font-mono text-muted-foreground">
                    {currentQ.questionRomaji}
                  </p>
                )}
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const active = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between ${
                        active
                          ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20 shadow-xs'
                          : 'bg-surface border-border text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <span>{option}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          active
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : 'border-muted-foreground/40'
                        }`}
                      >
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="text-center py-4 space-y-5">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  passed
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                }`}
              >
                {passed ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {passed
                    ? t('placement.congrats', `Congratulations! You Qualified for JLPT ${test.level}`)
                    : t('placement.start_n5_title', 'Beginning at JLPT N5')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  {passed
                    ? t(
                        'placement.congrats_desc',
                        `You answered ${score} out of ${test.questions.length} questions correctly. Your verified study level has been updated to ${test.level}!`
                      )
                    : t(
                        'placement.start_n5_desc',
                        `You scored ${score}/${test.questions.length}. Starting at N5 gives you a rock-solid foundation in kanji, vocabulary, and grammar. You can re-take this test anytime from your profile!`
                      )}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-left space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t('placement.summary_breakdown', 'Test Breakdown')}
                </h4>
                {test.questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                  return (
                    <div key={q.id} className="text-xs flex items-center justify-between py-1 border-b border-border/50 last:border-b-0">
                      <span className="font-medium text-foreground truncate max-w-[280px]">
                        {q.question}
                      </span>
                      <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between gap-3">
          {!showResults ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>

              <button
                type="button"
                disabled={!isSelected}
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>{currentIdx < test.questions.length - 1 ? t('common.next', 'Next Question') : t('placement.submit', 'Submit Answers')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              {!passed && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('placement.try_again', 'Try Again')}</span>
                </button>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
              >
                {t('common.continue_learning', 'Continue Learning')}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
