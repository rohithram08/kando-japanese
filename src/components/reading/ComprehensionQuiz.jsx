// src/components/reading/ComprehensionQuiz.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Story-Grounded Comprehension Quiz with Contextual Error Explanations
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import FuriganaText from '../common/FuriganaText';
import HanaSenseiCharacter2D from '../sensei/HanaSenseiCharacter2D';
import AudioButton from '../common/AudioButton';
import { useI18n } from '../../i18n';
import JellyStreakSlime from '../mascot/JellyStreakSlime';
import WaveXPBadge from '../common/WaveXPBadge';

const TYPE_CONFIG = {
  vocabulary: { label: '🟢 Vocabulary', bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  kanji: { label: '🔴 Kanji', bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  grammar: { label: '🟣 Grammar', bg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' },
  particle: { label: '🔵 Particle', bg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' },
  comprehension: { label: '📖 Reading Context', bg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30' },
};

export default function ComprehensionQuiz({ questions = [], onComplete, onBackToStory }) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-surface rounded-3xl border border-border text-center">
        <p className="text-muted-foreground text-sm">No quiz questions available for this story.</p>
        <button
          onClick={onBackToStory}
          className="mt-4 px-6 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
        >
          Return to Story
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const isLastQuestion = currentIndex === questions.length - 1;
  const qType = currentQ.type || 'comprehension';
  const typeMeta = TYPE_CONFIG[qType] || TYPE_CONFIG.comprehension;

  const handleSelectOption = (optionIdx) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // Prevent changing answer
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
    const waveXPEarned = 40 + 30 + Math.round(score * 0.3);

    return (
      <div className="max-w-2xl mx-auto p-8 bg-surface rounded-3xl border border-border text-center shadow-lg animate-in fade-in">
        <div className="flex justify-center mb-4">
          <HanaSenseiCharacter2D
            state={passed ? 'celebrating' : 'encouraging'}
            size="md"
            speech={{
              japanese: passed ? 'よくできました！読解マスターです！' : '次はきっと大丈夫！復習してみましょう。',
              romaji: passed ? 'Yoku dekimashita! Dokkai masutaa desu!' : 'Tsugi wa kitto daijoubu! Fukushuu shitemimashou.',
              english: passed ? 'Well done! Story and quiz completed!' : 'You completed the quiz! Review explanations and try once more.',
            }}
          />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Story Lesson Complete!
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          You scored <span className="font-bold text-primary">{score}%</span> on the story comprehension quiz.
        </p>

        {/* Jelly Streak Notification Pill */}
        <div className="p-3 mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center gap-2.5 text-xs font-bold text-cyan-700 dark:text-cyan-300">
          <JellyStreakSlime size="xs" mood="celebrating" animated />
          <span>Daily Jelly Streak Recorded! Keep learning every day!</span>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border">
            <span className="text-xs text-muted-foreground block mb-1">Result</span>
            <span className={`text-base font-bold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {passed ? 'Passed (合格)' : 'Needs Review'}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/50 border border-border flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground block mb-1">Wave XP Reward</span>
            <WaveXPBadge xp={waveXPEarned} size="md" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>
          <button
            onClick={handleFinish}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            <span>Save & Complete Story Lesson</span>
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
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-surface rounded-3xl border border-border shadow-sm">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5 flex-wrap">
          <HanaSenseiCharacter2D
            size="xs"
            state={!isAnswered ? 'listening' : (isCorrect ? 'happy' : 'encouraging')}
            showStatusPill={false}
          />
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${typeMeta.bg}`}>
            {typeMeta.label}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            Comprehension Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <button
          onClick={onBackToStory}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Review Story
        </button>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-2 flex items-start justify-between gap-3">
          <span>
            {currentQ.questionFurigana ? (
              <FuriganaText text={currentQ.questionFurigana} />
            ) : (
              currentQ.question
            )}
          </span>
          {currentQ.question && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(currentQ.question) && (
            <AudioButton text={currentQ.question} size="sm" />
          )}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((option, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isTheCorrectOne = optIdx === currentQ.correctAnswer;

          let btnStyle = 'border-border hover:border-primary/50 bg-surface text-foreground';

          if (isAnswered) {
            if (isTheCorrectOne) {
              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
            } else if (isSelected) {
              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
            } else {
              btnStyle = 'border-border/60 opacity-50 bg-muted/40 text-muted-foreground';
            }
          }

          return (
            <button
              key={`opt-${optIdx}`}
              disabled={isAnswered}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span className="leading-snug">{option}</span>
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

      {/* Contextual Feedback & Explanation Banner */}
      {isAnswered && (
        <div className={`p-4 rounded-2xl mb-6 text-xs leading-relaxed border ${
          isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-800'
        }`}>
          <div className="font-bold text-sm mb-1.5 flex items-center gap-1.5">
            {isCorrect ? (
              <span className="text-emerald-700 dark:text-emerald-400">✅ Correct! 正解です。</span>
            ) : (
              <span className="text-rose-700 dark:text-rose-400">❌ Incorrect (不正解)</span>
            )}
          </div>

          {/* Detailed Incorrect Answer Explanation */}
          {!isCorrect && currentQ.wrongExplanations?.[selectedOption] && (
            <div className="mb-2.5 p-3 rounded-xl bg-white/80 dark:bg-black/40 border border-rose-200 dark:border-rose-900">
              <span className="font-bold block text-rose-700 dark:text-rose-300 mb-0.5">
                Why this option is incorrect:
              </span>
              <p className="text-foreground">{currentQ.wrongExplanations[selectedOption]}</p>
            </div>
          )}

          {/* Grammar & Story Context Explanation */}
          <div className="p-3 rounded-xl bg-white/60 dark:bg-black/30 border border-border/40">
            <span className="font-bold block text-foreground mb-0.5">
              {isCorrect ? 'Story Context & Linguistic Breakdown:' : 'Correct Answer & Explanation:'}
            </span>
            <p className="text-muted-foreground">{currentQ.explanation}</p>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex justify-end">
        <button
          disabled={!isAnswered}
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <span>{isLastQuestion ? 'See Results' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
