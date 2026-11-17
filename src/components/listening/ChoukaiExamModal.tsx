// src/components/listening/ChoukaiExamModal.tsx
import React, { useState } from 'react';
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
} from 'lucide-react';
import type { ChoukaiQuestion } from '../../api/listening';
import { playJlptChime, speakJapaneseLine } from '../../utils/jlptAudio';

interface ChoukaiExamModalProps {
  level: string;
  scenarioTitle: string;
  questions: ChoukaiQuestion[];
  isOpen: boolean;
  onClose: () => void;
  onCompleteExam: (score: number) => void;
}

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
  const [showResults, setShowResults] = useState(false);
  const [isPlayingChime, setIsPlayingChime] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];

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
    setAnswers((prev) => ({ ...prev, [currentIdx]: selectedOption }));
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
    setShowResults(false);
  };

  // Calculate results if finished
  let totalScore = 0;
  if (showResults) {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct += 1;
    });
    totalScore = Math.round((correct / questions.length) * 100);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-primary/15 via-background to-primary/10 border-b border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-primary text-primary-foreground font-black text-xs tracking-wider">
              JLPT {level} 聴解
            </span>
            <div>
              <h3 className="font-extrabold text-base text-foreground">
                Official Choukai Exam Simulator
              </h3>
              <p className="text-xs text-muted-foreground">{scenarioTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayChime}
              disabled={isPlayingChime}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-50"
              title="Play authentic JLPT section start chime"
            >
              <BellRing className={`w-3.5 h-3.5 ${isPlayingChime ? 'animate-bounce' : ''}`} />
              <span>{isPlayingChime ? 'Chiming...' : 'Exam Chime'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!showResults ? (
            <div>
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-4">
                <span className="text-primary font-black">
                  {currentQ.mondaiLabel}
                </span>
                <span>
                  Question {currentIdx + 1} of {questions.length}
                </span>
              </div>

              {/* Instruction banner */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 mb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {currentQ.instructionJa}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
                  <p className="text-sm font-extrabold text-primary">
                    Q: {currentQ.questionJa}
                  </p>
                </div>
              </div>

              {/* Multiple Choice Options (1-4) */}
              <div className="space-y-3">
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
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${borderClass} ${bgClass}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-7 h-7 rounded-xl font-black text-xs grid place-items-center ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {optIdx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-foreground">{opt.textJa}</p>
                          <p className="text-xs text-muted-foreground">{opt.textEn}</p>
                        </div>
                      </div>

                      {isAnswerSubmitted && (
                        <div>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box after submission */}
              {isAnswerSubmitted && (
                <div className="mt-5 p-4 rounded-2xl bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-top-2">
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
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-primary/15 text-primary mx-auto grid place-items-center shadow-lg">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-primary/20 text-primary uppercase tracking-wider">
                  Exam Completed
                </span>
                <h3 className="text-3xl font-black text-foreground mt-2">
                  {totalScore}% Correct
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalScore >= 80
                    ? '🎉 Outstanding listening comprehension! Ready for JLPT Choukai.'
                    : totalScore >= 60
                    ? '👍 Passed! Good recognition of the main conversation points.'
                    : '💪 Keep practicing! Listen again with the vocabulary helper below.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 max-w-sm mx-auto flex items-center justify-around text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-base font-black text-foreground">{level}</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">XP Earned</p>
                  <p className="text-base font-black text-primary">+{totalScore >= 80 ? 25 : 15} XP</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-base font-black text-emerald-500">
                    {totalScore >= 60 ? 'PASSED' : 'PRACTICE'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-card border-t border-border flex items-center justify-between">
          {!showResults ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Exit Exam
              </button>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitCurrentAnswer}
                  disabled={selectedOption === null}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-md"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md"
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
