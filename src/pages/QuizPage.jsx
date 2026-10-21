// src/pages/QuizPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Unified Quiz Center: Story Comprehension Quizzes & Matching Game
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Sparkles, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useI18n } from '../i18n';
import { useAuthStore } from '../store/authStore';
import { useReadingStore } from '../store/readingStore';
import { allStories } from '../data/reading/n5_stories';
import MatchingGame from '../components/quiz/MatchingGame';
import FuriganaText from '../components/common/FuriganaText';

export default function QuizPage() {
  const navigate = useNavigate();
  const { resolvedTheme } = useThemeStore();
  const { t } = useI18n();
  const isDark = resolvedTheme === 'dark';

  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  const { progressMap, loadAllProgress } = useReadingStore();
  const [activeMode, setActiveMode] = useState(null); // null | 'matching'
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  useEffect(() => {
    loadAllProgress(isAuthenticated);
  }, [isAuthenticated, loadAllProgress]);

  const filteredStories = allStories.filter(
    (story) => selectedLevel === 'ALL' || story.level === selectedLevel
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 p-6 sm:p-8 text-white shadow-lg"
      >
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Comprehension</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            🧠 {t('quiz.title', 'Quiz Center')}
          </h1>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed">
            {t('quiz.subtitle', 'Test your Japanese knowledge through real contextual story comprehension and reinforcement games.')}
          </p>
        </div>

        {/* Decorative wave circles */}
        <div className="absolute -right-8 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </motion.div>

      {/* ── Mode Selection Header ── */}
      {activeMode === null ? (
        <div className="space-y-6">
          {/* Practice Mode Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-left transition-all shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📖</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  +30~60 Wave XP + Streak
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {t('quiz.story_quizzes', 'Story Comprehension Quizzes')}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {t('quiz.story_quizzes_desc', 'Quizzes grounded in Graded Reader stories testing vocabulary, grammar, particles, and kanji with instant feedback.')}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMode('matching')}
              className="p-5 rounded-2xl border-2 border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10 hover:border-blue-400 dark:hover:border-blue-500/40 text-left transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🔗</span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  Play Game →
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {t('quiz.matching_game', 'Matching Game')}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {t('quiz.matching_desc', 'Match kanji with their meanings')}
              </p>
            </motion.button>
          </div>

          {/* ── Story Quizzes Catalog ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Available Story Quizzes</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select any story to test your reading comprehension, particles, vocabulary, and grammar.
                </p>
              </div>

              {/* Level Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl">
                {['ALL', 'N5', 'N4'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      selectedLevel === lvl
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStories.map((story) => {
                const progress = progressMap[story.id];
                const hasScore = typeof progress?.quizScore === 'number';
                const isPassed = hasScore && progress.quizScore >= 70;
                const questionCount = Array.isArray(story.questions) ? story.questions.length : 5;

                return (
                  <div
                    key={story.id}
                    className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-emerald-400 dark:hover:border-emerald-600/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            story.level === 'N5'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                          }`}
                        >
                          {story.level}
                        </span>

                        {hasScore ? (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              isPassed
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Score: {progress.quizScore}%
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                            Ready to take
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-0.5">
                        <FuriganaText text={story.titleFurigana || story.title} />
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">
                        {story.englishTitle}
                      </p>

                      {/* Element tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                          {questionCount} Questions
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium">
                          🟢 Vocab
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-medium">
                          🟣 Grammar
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 font-medium">
                          🔵 Particle
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium">
                          🔴 Kanji
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800/60">
                      <button
                        onClick={() => navigate(`/reading/${story.id}?quiz=true`)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{hasScore ? 'Retake Quiz' : 'Take Story Quiz'}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>

                      <button
                        onClick={() => navigate(`/reading/${story.id}`)}
                        className="py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
                        title="Read the full story before testing"
                      >
                        Read
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── Matching Game Subview ── */
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <button
            onClick={() => setActiveMode(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back', 'Back to Quiz Center')}</span>
          </button>
          <MatchingGame />
        </motion.div>
      )}
    </div>
  );
}
