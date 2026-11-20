// src/components/listening/ChoukaiExamModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Official JLPT Choukai Exam Simulator with Manten-Style Exam Countdown Timer
// Realistic question pacing, overtime indicator, jump navigation, and explanations
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle,
  XCircle,
  Award,
  Volume2,
  BellRing,
  RotateCcw,
  ArrowRight,
  Sparkles,
  X,
  Timer as TimerIcon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { ChoukaiQuestion } from '../../api/listening';
import { playJlptChime, speakJapaneseLine } from '../../utils/jlptAudio';
import { playSuccess, playError } from '../../utils/soundEffects';

interface ChoukaiExamModalProps {
  level: string;
  scenarioTitle: string;
  questions: ChoukaiQuestion[];
  isOpen: boolean;
  onClose: () => void;
  onCompleteExam: (score: number) => void;
}

// Recommended time per question type (based on real JLPT test guidelines)
const getExamSecondsForQuestion = (q: ChoukaiQuestion): number => {
  if (q.mondaiType === 4) return 15; // 即時応答 (Quick Response)
  if (q.mondaiType === 3) return 20; // 発話表現 (Verbal Expressions)
  return 40; // 課題理解 (Task-Based) & ポイント理解 (Key Points)
};

export const ChoukaiExamModal: React.FC<ChoukaiExamModalProps> = ({
  level,
  scenarioTitle,
  questions,
  isOpen,
  onClose,
  onCompleteExam,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, { spent: number; overtime: boolean }>>({});
  const [showResults, setShowResults] = useState(false);
  const [isPlayingChime, setIsPlayingChime] = useState(false);

  // Per-Question Realistic Exam Timer (Manten-Style Countdown + Overtime)
  const currentQ = questions[currentIdx] || questions[0];
  const allocatedSeconds = getExamSecondsForQuestion(currentQ);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(allocatedSeconds);
  const [overtimeSeconds, setOvertimeSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer on question change
  useEffect(() => {
    if (!isOpen || showResults || isAnswerSubmitted) return;

    const baseSec = getExamSecondsForQuestion(currentQ);
    setSecondsRemaining(baseSec);
    setOvertimeSeconds(0);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Time expired — clock counts up overtime!
          setOvertimeSeconds((ot) => ot + 1);
          return 0;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isOpen, showResults, isAnswerSubmitted, currentQ]);

  // Clean up timer on close
  useEffect(() => {
    if (!isOpen && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isOpen]);

  if (!isOpen || !questions || questions.length === 0) return null;

  const handlePlayChime = async () => {
    setIsPlayingChime(true);
    await playJlptChime();
    setIsPlayingChime(false);
  };

  const handlePronounceQuestion = () => {
    speakJapaneseLine({ text: currentQ.questionJa, rate: 0.85 });
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitCurrentAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Record timing analytics
    const timeSpent = allocatedSeconds - secondsRemaining + overtimeSeconds;
    const isOvertime = overtimeSeconds > 0;
    setQuestionTimes((prev) => ({
      ...prev,
      [currentIdx]: { spent: timeSpent, overtime: isOvertime },
    }));

    setAnswers((prev) => ({ ...prev, [currentIdx]: selectedOption }));

    // Sound effect feedback
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      try {
        playSuccess();
      } catch {
        // Audio unavailable
      }
    } else {
      try {
        playError();
      } catch {
        // Audio unavailable
      }
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      const finalAnswers = { ...answers, [currentIdx]: selectedOption ?? answers[currentIdx] };
      let correct = 0;
      questions.forEach((q, idx) => {
        if (finalAnswers[idx] === q.correctIndex) {
          correct += 1;
        }
      });
      const finalScore = Math.round((correct / questions.length) * 100);
      setShowResults(true);
      onCompleteExam(finalScore);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswers({});
    setQuestionTimes({});
    setShowResults(false);
  };

  const handleJumpToQuestion = (targetIdx: number) => {
    if (targetIdx === currentIdx || isAnswerSubmitted) return;
    setCurrentIdx(targetIdx);
    setSelectedOption(answers[targetIdx] ?? null);
    setIsAnswerSubmitted(false);
  };

  // Calculate results if finished
  let totalScore = 0;
  let inTimeCount = 0;
  if (showResults) {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct += 1;
      if (questionTimes[idx] && !questionTimes[idx].overtime) inTimeCount += 1;
    });
    totalScore = Math.round((correct / questions.length) * 100);
  }

  // Timer Progress Calculation
  const timerPct = Math.max(0, Math.min(100, (secondsRemaining / allocatedSeconds) * 100));
  const isTimeCritical = secondsRemaining <= 10 && secondsRemaining > 0;
  const isOvertime = overtimeSeconds > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-primary/15 via-background to-primary/10 border-b border-border/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-xl bg-primary text-primary-foreground font-black text-xs tracking-wider shrink-0">
              JLPT {level} 聴解
            </span>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-base text-foreground truncate">
                Official Choukai Exam Simulator
              </h3>
              <p className="text-xs text-muted-foreground truncate">{scenarioTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePlayChime}
              disabled={isPlayingChime}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-50"
              title="Play authentic JLPT section start chime"
            >
              <BellRing className={`w-3.5 h-3.5 ${isPlayingChime ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isPlayingChime ? 'Chiming...' : 'Exam Chime'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Manten-Style Exam Timer Bar */}
        {!showResults && (
          <div className="bg-muted/40 border-b border-border/60 px-4 py-2 select-none">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <div className="flex items-center gap-1.5 font-bold">
                <TimerIcon className={`w-3.5 h-3.5 ${isOvertime ? 'text-rose-500 animate-pulse' : isTimeCritical ? 'text-amber-500' : 'text-primary'}`} />
                <span className="text-[11px] font-sans font-semibold text-muted-foreground">Exam Timer:</span>
                {isOvertime ? (
                  <span className="text-rose-600 dark:text-rose-400 font-black animate-pulse">
                    +{overtimeSeconds}s OVERTIME
                  </span>
                ) : (
                  <span className={`font-black ${isTimeCritical ? 'text-amber-500' : 'text-foreground'}`}>
                    {secondsRemaining}s left
                  </span>
                )}
              </div>

              {/* Jump Navigation Question Dots */}
              <div className="flex items-center gap-1">
                {questions.map((_, qIdx) => {
                  const isCur = qIdx === currentIdx;
                  const isAnswered = answers[qIdx] !== undefined;
                  return (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => handleJumpToQuestion(qIdx)}
                      disabled={isAnswerSubmitted}
                      className={`w-6 h-6 rounded-lg text-[10px] font-black transition-all ${
                        isCur
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : isAnswered
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Countdown Progress Bar */}
            <div className="h-1.5 w-full bg-border/60 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isOvertime
                    ? 'bg-rose-500 w-full animate-pulse'
                    : isTimeCritical
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: isOvertime ? '100%' : `${timerPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {!showResults ? (
            <div>
              {/* Question metadata badge */}
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-3">
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-black">
                  {currentQ.mondaiLabel}
                </span>
                <span>
                  Question {currentIdx + 1} of {questions.length}
                </span>
              </div>

              {/* Instruction banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/40 border border-border/60 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      {currentQ.instructionJa}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                      {currentQ.instructionEn}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePronounceQuestion}
                    className="p-2 rounded-xl bg-background border border-border/60 hover:text-primary transition-all shrink-0"
                    title="Read question"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-border/40">
                  <p className="text-xs sm:text-sm font-extrabold text-primary">
                    Q: {currentQ.questionJa}
                  </p>
                </div>
              </div>

              {/* Multiple Choice Options (1-4) */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;

                  let borderClass = 'border-border/70 hover:border-primary/50';
                  let bgClass = 'bg-card hover:bg-muted/30';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500';
                    } else if (isSelected) {
                      borderClass = 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-100';
                    } else {
                      borderClass = 'border-border/40 opacity-50';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-primary bg-primary/10 ring-2 ring-primary';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${borderClass} ${bgClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl font-black text-xs grid place-items-center shrink-0 ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {optIdx + 1}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-foreground">{opt.textJa}</p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground">{opt.textEn}</p>
                        </div>
                      </div>

                      {isAnswerSubmitted && (
                        <div>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box after submission */}
              {isAnswerSubmitted && (
                <div className="mt-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-top-2">
                  <h5 className="font-extrabold text-xs text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Explanation & Script Review
                  </h5>
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-primary/15 text-primary mx-auto grid place-items-center shadow-lg">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-primary/20 text-primary uppercase tracking-wider">
                  Choukai Exam Completed
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                  {totalScore}% Correct
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  {totalScore >= 80
                    ? '🎉 Outstanding listening comprehension! Pacing and accuracy are ready for official JLPT Choukai.'
                    : totalScore >= 60
                    ? '👍 Passed! Good recognition of the main conversation points. Practice quick response speed.'
                    : '💪 Keep practicing! Listen again with the vocabulary hearing helper below.'}
                </p>
              </div>

              {/* Exam Analytics Grid */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 max-w-lg mx-auto grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Level</p>
                  <p className="text-sm sm:text-base font-black text-foreground">{level}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Status</p>
                  <p className="text-sm sm:text-base font-black text-emerald-500">
                    {totalScore >= 60 ? 'PASSED' : 'PRACTICE'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Exam Pacing</p>
                  <p className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                    {inTimeCount}/{questions.length} in time
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">XP Earned</p>
                  <p className="text-sm sm:text-base font-black text-primary">
                    +{totalScore >= 80 ? 30 : 15} XP
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-card border-t border-border flex items-center justify-between">
          {!showResults ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Exit Exam
              </button>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitCurrentAnswer}
                  disabled={selectedOption === null}
                  className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-md"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md"
                >
                  <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-foreground hover:bg-muted"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
