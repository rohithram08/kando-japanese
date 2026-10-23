// src/components/reading/ComprehensionQuiz.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Story-Grounded Quiz with contextual explanations for every answer.
//
// Rewards are NOT computed here. On submit the quiz hands its score to the
// parent (`onSubmit`), which saves it through the server-authoritative reading
// endpoint; this screen only displays what the server actually granted
// (Wave XP, level, Jelly Streak) — so what you see is what was recorded.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import FuriganaText from '../common/FuriganaText';
import HanaSenseiCharacter2D from '../sensei/HanaSenseiCharacter2D';
import AudioButton from '../common/AudioButton';
import { useI18n } from '../../i18n';
import JellyStreakSlime from '../mascot/JellyStreakSlime';
import WaveXPBadge from '../common/WaveXPBadge';
import { useProgressStore } from '../../store/progressStore';
import { getUserLevelProgress } from '../../utils/progressCalculator';

const TYPE_CONFIG = {
  vocabulary: { emoji: '🟢', key: 'type_vocabulary', fallback: 'Vocabulary', bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  kanji: { emoji: '🔴', key: 'type_kanji', fallback: 'Kanji', bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  grammar: { emoji: '🟣', key: 'type_grammar', fallback: 'Grammar', bg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' },
  particle: { emoji: '🔵', key: 'type_particle', fallback: 'Particle', bg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' },
  comprehension: { emoji: '📖', key: 'type_comprehension', fallback: 'Reading Context', bg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30' },
};

export default function ComprehensionQuiz({
  questions = [],
  isAuthenticated = false,
  alreadyCompleted = false,
  onSubmit,
  onFinish,
  onBackToStory,
}) {
  const { t } = useI18n();
  const totalXP = useProgressStore((s) => s.totalXP);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null); // server response from onSubmit

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-surface rounded-3xl border border-border text-center">
        <p className="text-muted-foreground text-sm">{t('quiz.no_questions', 'No quiz questions available for this story.')}</p>
        <button
          onClick={onBackToStory}
          className="mt-4 px-6 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
        >
          {t('quiz.return_to_story', 'Return to Story')}
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

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  // Finishing the last question IS completing the quiz: save immediately so the
  // streak/XP can't be lost by closing the tab on the results screen.
  const submitQuiz = async () => {
    const score = calculateScore();
    setIsSubmitted(true);
    setSaving(true);
    try {
      const res = await onSubmit?.(score);
      setResult(res || null);
    } catch {
      setResult({ synced: false });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      submitQuiz();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setResult(null);
  };

  // ── Final Result Screen ──
  if (isSubmitted) {
    const score = calculateScore();
    const passed = score >= 70;
    const rewards = result?.rewards;
    const earned = rewards?.totalXp || 0;
    const streak = result?.streak;
    const levelInfo = getUserLevelProgress(totalXP);

    let streakLine = null;
    if (!saving) {
      if (streak?.recorded) {
        streakLine = streak.firstActivityToday
          ? t('quiz.streak_extended', { days: streak.days }, `Jelly Streak: ${streak.days} days!`)
          : t('quiz.streak_today', { days: streak.days }, `Today's Jelly Streak is already counted (${streak.days} days).`);
      } else if (!isAuthenticated) {
        streakLine = t('quiz.guest_note', 'Sign in to save Wave XP and your Jelly Streak.');
      } else if (result && result.synced === false) {
        streakLine = t('quiz.sync_failed', 'Could not reach the server. Your answers are saved on this device, but Wave XP and Jelly Streak were not recorded.');
      }
    }

    return (
      <div className="max-w-2xl mx-auto p-8 bg-surface rounded-3xl border border-border text-center shadow-lg animate-in fade-in">
        <div className="flex justify-center mb-4">
          <HanaSenseiCharacter2D
            state={passed ? 'celebrating' : 'encouraging'}
            size="md"
            speech={{
              japanese: passed ? 'よくできました！読解マスターです！' : '次はきっと大丈夫！復習してみましょう。',
              romaji: passed ? 'Yoku dekimashita! Dokkai masutaa desu!' : 'Tsugi wa kitto daijoubu! Fukushuu shitemimashou.',
              english: passed
                ? t('quiz.sensei_pass', 'Well done! Story and quiz completed!')
                : t('quiz.sensei_fail', 'Quiz completed! Review the explanations and try once more.'),
            }}
          />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('quiz.result_title', 'Quiz Complete!')}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t('quiz.result_score', { score }, `You scored ${score}% on the story quiz.`)}
        </p>

        {/* Jelly Streak — shows what the server actually recorded */}
        {saving ? (
          <p className="text-xs text-muted-foreground mb-6" role="status">{t('quiz.saving', 'Saving your progress…')}</p>
        ) : (
          streakLine && (
            <div
              role="status"
              data-testid="streak-line"
              className="p-3 mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center gap-2.5 text-xs font-bold text-cyan-700 dark:text-cyan-300"
            >
              {streak?.recorded && <JellyStreakSlime size="xs" mood="celebrating" animated />}
              <span>{streakLine}</span>
            </div>
          )
        )}

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border">
            <span className="text-xs text-muted-foreground block mb-1">{t('quiz.result_label', 'Result')}</span>
            <span className={`text-base font-bold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {passed ? t('quiz.passed', 'Passed (合格)') : t('quiz.needs_review', 'Needs Review')}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/50 border border-border flex flex-col items-center justify-center" data-testid="wave-xp-result">
            <span className="text-xs text-muted-foreground block mb-1">{t('quiz.wave_xp_earned', 'Wave XP earned')}</span>
            {saving ? (
              <span className="text-xs text-muted-foreground">…</span>
            ) : earned > 0 ? (
              <>
                <WaveXPBadge xp={earned} size="md" />
                <span className="text-[11px] text-muted-foreground mt-1">
                  {t('quiz.xp_breakdown', { story: rewards.storyXp, quiz: rewards.quizXp }, `Story +${rewards.storyXp} · Quiz +${rewards.quizXp}`)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-muted-foreground">+0</span>
            )}
          </div>
        </div>

        {!saving && isAuthenticated && earned === 0 && (rewards?.alreadyCompleted || alreadyCompleted) && (
          <p className="text-[11px] text-muted-foreground mb-4">
            {t('quiz.xp_already', "Wave XP for this story was already earned. Retakes keep your best score but don't pay again.")}
          </p>
        )}

        {/* Level progress — same numbers as the sidebar and dashboard */}
        {isAuthenticated && !saving && (
          <div className="mb-6 text-left" data-testid="level-progress">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
              <span className="font-semibold">
                {t('dashboard.level_label', { level: levelInfo.level }, `Level ${levelInfo.level}`)}
              </span>
              <span>
                {t('quiz.level_progress', { level: levelInfo.level, into: levelInfo.xpIntoLevel, need: levelInfo.xpForNext, next: levelInfo.level + 1 },
                  `Level ${levelInfo.level} · ${levelInfo.xpIntoLevel}/${levelInfo.xpForNext} Wave XP to Lv.${levelInfo.level + 1}`)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-cyan-950/20 dark:bg-cyan-900/40 border border-cyan-500/20 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-500" style={{ width: `${levelInfo.percent}%` }} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('quiz.retake', 'Retake Quiz')}</span>
          </button>
          <button
            onClick={onFinish}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            <span>{t('quiz.back_to_stories', 'Back to Stories')}</span>
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
            {typeMeta.emoji} {t('quiz.' + typeMeta.key, typeMeta.fallback)}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            {t('quiz.question_progress', { current: currentIndex + 1, total: questions.length }, `Question ${currentIndex + 1} of ${questions.length}`)}
          </span>
        </div>
        <button
          onClick={onBackToStory}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('quiz.review_story', 'Review Story')}
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
              <span className="text-emerald-700 dark:text-emerald-400">{t('quiz.correct_banner', '✅ Correct! 正解です。')}</span>
            ) : (
              <span className="text-rose-700 dark:text-rose-400">{t('quiz.incorrect_banner', '❌ Incorrect (不正解)')}</span>
            )}
          </div>

          {/* Detailed Incorrect Answer Explanation */}
          {!isCorrect && currentQ.wrongExplanations?.[selectedOption] && (
            <div className="mb-2.5 p-3 rounded-xl bg-white/80 dark:bg-black/40 border border-rose-200 dark:border-rose-900">
              <span className="font-bold block text-rose-700 dark:text-rose-300 mb-0.5">
                {t('quiz.why_incorrect', 'Why this option is incorrect:')}
              </span>
              <p className="text-foreground">{currentQ.wrongExplanations[selectedOption]}</p>
            </div>
          )}

          {/* Grammar & Story Context Explanation */}
          <div className="p-3 rounded-xl bg-white/60 dark:bg-black/30 border border-border/40">
            <span className="font-bold block text-foreground mb-0.5">
              {isCorrect ? t('quiz.context_breakdown', 'Story Context & Linguistic Breakdown:') : t('quiz.correct_explanation', 'Correct Answer & Explanation:')}
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
          <span>{isLastQuestion ? t('quiz.see_results', 'See Results') : t('quiz.next_question', 'Next Question')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
