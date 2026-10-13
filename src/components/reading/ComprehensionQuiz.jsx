// src/components/reading/ComprehensionQuiz.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reading Comprehension Assessment for Graded Readers
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import FuriganaText from '../common/FuriganaText';
import HanaSenseiCharacter2D from '../sensei/HanaSenseiCharacter2D';

export default function ComprehensionQuiz({ questions, onComplete, onBackToStory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (optionIdx) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // Prevent changing answer after selection
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  const handleFinish = () => {
    const score = calculateScore();
    onComplete(score);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  // ── Final Result Screen ──
  if (isSubmitted) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 text-center shadow-lg animate-in fade-in">
        <div className="flex justify-center mb-4">
          <HanaSenseiCharacter2D
            state={passed ? 'celebrating' : 'encouraging'}
            size="md"
            speech={{
              japanese: passed ? 'よくできました！読解マスターです！' : '次はきっと大丈夫！復習してみましょう。',
              romaji: passed ? 'Yoku dekimashita! Dokkai masutaa desu!' : 'Tsugi wa kitto daijoubu! Fukushuu shitemimashou.',
              english: passed ? 'Well done! Reading comprehension mastered!' : 'You got this! Review and try once more.',
            }}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Comprehension Complete!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          You scored <span className="font-bold text-teal-600 dark:text-teal-400">{score}%</span> on this reading check.
        </p>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Result</span>
            <span className={`text-base font-bold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {passed ? 'Passed (合格)' : 'Needs Review'}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">XP Reward</span>
            <span className="text-base font-bold text-teal-600 dark:text-teal-400">
              +{50 + Math.round(score * 0.25)} XP
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>
          <button
            onClick={handleFinish}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            <span>Save & Complete Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Active Question Screen ──
  const selectedOption = selectedAnswers[currentIndex];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <HanaSenseiCharacter2D
            size="xs"
            state={!isAnswered ? 'listening' : (isCorrect ? 'happy' : 'encouraging')}
            showStatusPill={false}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Comprehension Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <button
          onClick={onBackToStory}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Review Story
        </button>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          {currentQ.questionFurigana ? (
            <FuriganaText text={currentQ.questionFurigana} />
          ) : (
            currentQ.question
          )}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((option, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isTheCorrectOne = optIdx === currentQ.correctAnswer;

          let btnStyle = 'border-gray-200 dark:border-gray-700 hover:border-teal-500/50 bg-white dark:bg-gray-800/40 text-gray-800 dark:text-gray-200';

          if (isAnswered) {
            if (isTheCorrectOne) {
              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
            } else if (isSelected) {
              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
            } else {
              btnStyle = 'border-gray-200 dark:border-gray-800 opacity-50 bg-white dark:bg-gray-900 text-gray-500';
            }
          }

          return (
            <button
              key={`opt-${optIdx}`}
              disabled={isAnswered}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{option}</span>
              {isAnswered && isTheCorrectOne && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
              )}
              {isAnswered && isSelected && !isTheCorrectOne && (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner (when answered) */}
      {isAnswered && (
        <div className={`p-4 rounded-2xl mb-6 text-xs leading-relaxed ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800'}`}>
          <div className="font-semibold mb-1">
            {isCorrect ? 'Correct! 正解です。' : 'Explanation (解説):'}
          </div>
          <p>{currentQ.explanation}</p>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex justify-end">
        <button
          disabled={!isAnswered}
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 text-white text-xs font-semibold transition-all flex items-center space-x-1.5"
        >
          <span>{isLastQuestion ? 'See Results' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
