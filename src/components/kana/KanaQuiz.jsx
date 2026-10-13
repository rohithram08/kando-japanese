import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  BookmarkPlus,
  ArrowRight,
  Headphones,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useSRSStore } from '../../store/srsStore';
import toast from 'react-hot-toast';
import HanaSenseiCharacter2D from '../sensei/HanaSenseiCharacter2D';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function KanaQuiz({
  kanaList = [],
  script = 'hiragana',
  onCompleteQuiz,
}) {
  const { isCardInSRS, addCardToSRS } = useSRSStore();

  const [mode, setMode] = useState('char-to-romaji'); // 'char-to-romaji' | 'sound-to-char'
  const [questionCount, setQuestionCount] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  // Generate distinct non-ambiguous questions
  const buildQuestions = useCallback(
    (count, quizMode) => {
      const pool = shuffle(kanaList);
      const selectedPool = pool.slice(0, Math.min(count, pool.length));

      return selectedPool.map((correctItem) => {
        // Collect distractors with distinct answers
        const candidatePool = kanaList.filter(
          (k) =>
            k.id !== correctItem.id &&
            k.romaji !== correctItem.romaji &&
            k.kana !== correctItem.kana
        );
        const shuffledCandidates = shuffle(candidatePool).slice(0, 3);
        const allFour = shuffle([correctItem, ...shuffledCandidates]);

        return {
          item: correctItem,
          mode: quizMode,
          options: allFour.map((opt) => ({
            id: opt.id,
            label: quizMode === 'char-to-romaji' ? opt.romaji : opt.kana,
            sub: quizMode === 'char-to-romaji' ? '' : opt.romaji,
            isCorrect: opt.id === correctItem.id,
            raw: opt,
          })),
        };
      });
    },
    [kanaList]
  );

  const startQuiz = (selectedMode = mode, count = questionCount) => {
    const newQuestions = buildQuestions(count, selectedMode);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setAnswers([]);
    setQuizFinished(false);
    setQuizStarted(true);

    // If sound mode, play first audio automatically
    if (selectedMode === 'sound-to-char' && newQuestions[0]) {
      audioService.speak(newQuestions[0].item.kana);
    }
  };

  const handleSelectOption = (optionIndex) => {
    if (isAnswered) return;
    const currentQ = questions[currentIndex];
    const chosen = currentQ.options[optionIndex];

    setSelectedChoice(optionIndex);
    setIsAnswered(true);

    // Audio feedback
    audioService.speak(currentQ.item.kana);

    const isCorrect = chosen.isCorrect;
    const record = {
      question: currentQ,
      chosen,
      isCorrect,
    };

    setAnswers((prev) => [...prev, record]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setQuizFinished(true);
      const scoreCount = answers.filter((a) => a.isCorrect).length;
      onCompleteQuiz?.({
        score: scoreCount,
        total: questions.length,
        answers,
      });
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedChoice(null);
      setIsAnswered(false);

      if (mode === 'sound-to-char' && questions[nextIdx]) {
        audioService.speak(questions[nextIdx].item.kana);
      }
    }
  };

  // Add missed kana to SRS in bulk
  const handleAddMissedToSRS = () => {
    const missed = answers.filter((a) => !a.isCorrect);
    let addedCount = 0;
    missed.forEach((m) => {
      const item = m.question.item;
      if (!isCardInSRS(item.id)) {
        addCardToSRS('kana', item.id, item.kana);
        addedCount++;
      }
    });

    toast.success(
      addedCount > 0
        ? `Added ${addedCount} missed kana to SRS review deck!`
        : 'All missed kana are already in your SRS review deck.'
    );
  };

  // ─────────────────────────────────────────────────────────────
  // SETUP SCREEN
  // ─────────────────────────────────────────────────────────────
  if (!quizStarted) {
    return (
      <div className="max-w-xl mx-auto space-y-6 p-6 rounded-3xl border border-border bg-surface shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {script === 'hiragana' ? 'Hiragana' : 'Katakana'} Recognition Practice
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Strengthen your instant recall through active recognition drills.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Practice Direction
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('char-to-romaji')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                mode === 'char-to-romaji'
                  ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20'
                  : 'border-border bg-muted/30 hover:border-border/80'
              }`}
            >
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
              <div className="font-bold text-sm text-foreground">
                Character &rarr; Romaji
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                See Japanese kana &rarr; identify the reading
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('sound-to-char')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                mode === 'sound-to-char'
                  ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20'
                  : 'border-border bg-muted/30 hover:border-border/80'
              }`}
            >
              <Headphones className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
              <div className="font-bold text-sm text-foreground">
                Sound &rarr; Character
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hear pronunciation &rarr; identify the character
              </p>
            </button>
          </div>
        </div>

        {/* Question Count Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Question Count
          </label>
          <div className="flex gap-2">
            {[10, 20, Math.min(46, kanaList.length)].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
                  questionCount === num
                    ? 'bg-purple-600 text-white border-purple-600 shadow'
                    : 'border-border bg-muted/30 hover:bg-muted text-muted-foreground'
                }`}
              >
                {num === kanaList.length ? `All (${num})` : `${num} Questions`}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => startQuiz(mode, questionCount)}
          className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          Start Practice Session &rarr;
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RESULTS SCREEN
  // ─────────────────────────────────────────────────────────────
  if (quizFinished) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const scorePct = Math.round((correctCount / questions.length) * 100);
    const missedList = answers.filter((a) => !a.isCorrect);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto space-y-6 p-6 rounded-3xl border border-border bg-surface shadow-sm text-center"
      >
        <div className="flex justify-center pt-2">
          <HanaSenseiCharacter2D
            state={scorePct >= 70 ? 'celebrating' : 'encouraging'}
            size="md"
            speech={{
              japanese: scorePct >= 90 ? '素晴らしい！満点近いです！' : scorePct >= 70 ? 'よくできました！合格です！' : '諦めないで！復習すれば必ず覚えられます！',
              romaji: scorePct >= 70 ? 'Subarashii! Gokaku desu!' : 'Akiramenaide! Fukushuu sureba kanarazu oboeraremasu!',
              english: scorePct >= 70 ? 'Outstanding work! Kana recognition mastered!' : 'Keep going! Review makes permanent!',
            }}
          />
        </div>

        <div>
          <h3 className="text-2xl font-black text-foreground">
            {scorePct >= 90 ? 'Subarashii! 🌟' : scorePct >= 70 ? 'Good Job! ✨' : 'Keep Practicing! 💪'}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            You scored {correctCount} out of {questions.length} ({scorePct}%)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => startQuiz(mode, questionCount)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 shadow transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Practice Again
          </button>

          {missedList.length > 0 && (
            <button
              onClick={handleAddMissedToSRS}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <BookmarkPlus className="w-4 h-4" /> Add Missed to SRS ({missedList.length})
            </button>
          )}

          <button
            onClick={() => setQuizStarted(false)}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-border bg-muted/40 hover:bg-muted text-muted-foreground transition-colors"
          >
            Change Settings
          </button>
        </div>

        {/* Breakdown of missed */}
        {missedList.length > 0 && (
          <div className="pt-4 text-left border-t border-border space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Review Missed Items ({missedList.length})
            </h4>
            <div className="space-y-2">
              {missedList.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-japanese font-bold text-foreground">
                      {m.question.item.kana}
                    </span>
                    <div>
                      <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                        {m.question.item.romaji}
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Your answer: {m.chosen.label}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => audioService.speak(m.question.item.kana)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
                    title="Listen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACTIVE QUESTION SCREEN
  // ─────────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const currentItem = currentQuestion.item;
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Progress header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-2">
          <HanaSenseiCharacter2D
            size="xs"
            state={!isAnswered ? 'listening' : (currentQuestion.options[selectedChoice]?.isCorrect ? 'happy' : 'encouraging')}
            showStatusPill={false}
          />
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <button
          onClick={() => audioService.speak(currentItem.kana)}
          className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
        >
          <Volume2 className="w-3.5 h-3.5" /> Repeat Audio
        </button>
      </div>

      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Prompt Card */}
      <div className="p-8 rounded-3xl border border-border bg-surface text-center space-y-3 shadow-sm">
        {mode === 'char-to-romaji' ? (
          <>
            <span className="text-7xl font-japanese font-black text-foreground block select-none">
              {currentItem.kana}
            </span>
            <p className="text-xs text-muted-foreground">
              Select the correct romaji reading
            </p>
          </>
        ) : (
          <>
            <button
              onClick={() => audioService.speak(currentItem.kana)}
              className="w-20 h-20 mx-auto rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              title="Play pronunciation"
              aria-label="Play pronunciation"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <p className="text-xs text-muted-foreground">
              Listen and choose the matching kana ({currentItem.romaji})
            </p>
          </>
        )}
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((opt, idx) => {
          let btnStyle = 'border-border bg-surface hover:border-purple-300 dark:hover:border-purple-700';

          if (isAnswered) {
            if (opt.isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20';
            } else if (selectedChoice === idx) {
              btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400';
            } else {
              btnStyle = 'opacity-40 border-border bg-surface';
            }
          }

          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              className={`p-5 rounded-2xl border font-bold text-center transition-all flex flex-col items-center justify-center min-h-[85px] ${btnStyle}`}
            >
              <span
                className={`${
                  mode === 'sound-to-char' ? 'font-japanese text-3xl' : 'text-xl uppercase'
                }`}
              >
                {opt.label}
              </span>
              {opt.sub && (
                <span className="text-xs text-muted-foreground font-mono mt-0.5">
                  {opt.sub}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback Bar & Next Button */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              currentQuestion.options[selectedChoice]?.isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {currentQuestion.options[selectedChoice]?.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold">
                  {currentQuestion.options[selectedChoice]?.isCorrect
                    ? 'Correct! 正解!'
                    : `Incorrect. It's ${currentItem.kana} (${currentItem.romaji})`}
                </p>
                {currentItem.mnemonic && !currentQuestion.options[selectedChoice]?.isCorrect && (
                  <p className="text-xs opacity-80 mt-0.5">
                    Tip: {currentItem.mnemonic}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-foreground text-background hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
            >
              {currentIndex + 1 >= questions.length ? 'Results' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
