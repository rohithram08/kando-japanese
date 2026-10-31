// src/pages/ReadingPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Graded Japanese Reading Page — Graded Reader (多読 Tadoku)
// 250 Curated Graded Stories across JLPT N5, N4, N3, N2, and N1
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Sparkles, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useReadingStore } from '../store/readingStore';
import { allStories, getStoryById } from '../data/reading/n5_stories';
import StoryCard from '../components/reading/StoryCard';
import StoryReader from '../components/reading/StoryReader';
import { useI18n } from '../i18n';
import { useStudyLevel } from '../hooks/useStudyLevel';
import { unlockedRangeLabel } from '../utils/levelAccess';

const STORIES_PER_PAGE = 12;

export default function ReadingPage() {
  const { t } = useI18n();
  const { storyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialShowQuiz = searchParams.get('quiz') === 'true';

  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const { studyLevel, unlocked, isUnlocked } = useStudyLevel();

  // Only stories the user has unlocked are ever listed or counted.
  const availableStories = useMemo(
    () => allStories.filter((s) => unlocked.includes(s.level)),
    [unlocked],
  );

  const { progressMap, loading, loadAllProgress } = useReadingStore();
  const [pickedLevel, setSelectedLevel] = useState('ALL');
  // 'ALL' means every unlocked level; a stale pick of a locked level falls back to it.
  const selectedLevel = pickedLevel === 'ALL' || unlocked.includes(pickedLevel) ? pickedLevel : 'ALL';
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadAllProgress(isAuthenticated).finally(() => {
      if (mounted) setProgressLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, loadAllProgress]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLevel, searchQuery]);

  // ── Library Overview Filtering & Pagination ──
  // (hooks must run on every render, so they live above the `storyId` early return)
  const filteredStories = useMemo(() => {
    return availableStories.filter((s) => {
      const matchLevel = selectedLevel === 'ALL' || s.level === selectedLevel;
      if (!matchLevel) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.englishTitle.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
      );
    });
  }, [availableStories, selectedLevel, searchQuery]);

  const totalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE) || 1;
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * STORIES_PER_PAGE;
    return filteredStories.slice(start, start + STORIES_PER_PAGE);
  }, [filteredStories, currentPage]);

  // If a specific story is requested via route or selection
  if (storyId) {
    const story = getStoryById(storyId);

    if (!story) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('reading.story_not_found', 'Story Not Found')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t('reading.story_not_found_desc', 'The requested reading text could not be located.')}
          </p>
          <button
            onClick={() => navigate('/reading')}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            {t('common.back', 'Back to Library')}
          </button>
        </div>
      );
    }

    if (!isUnlocked(story.level)) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('reading.story_locked', 'Not unlocked yet')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t('reading.story_locked_desc', 'This story is above your current level. Keep studying and it will open up.')}
          </p>
          <button
            onClick={() => navigate('/reading')}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            {t('common.back', 'Back to Library')}
          </button>
        </div>
      );
    }

    if (!progressLoaded && loading && !progressMap[story.id]) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('common.loading', 'Loading reading progress...')}</p>
        </div>
      );
    }

    const storyProgress = progressMap[story.id] || {
      storyId: story.id,
      status: 'not_started',
      lastSentenceIndex: 0,
      quizScore: null,
    };

    return (
      <StoryReader
        story={story}
        initialProgress={storyProgress}
        initialShowQuiz={initialShowQuiz}
        onBack={() => navigate('/reading')}
      />
    );
  }

  const completedCount = Object.values(progressMap).filter(
    (p) => p.status === 'completed'
  ).length;

  // One unlocked level => nothing to filter, so no tabs at all.
  const levelTabs = unlocked.length > 1 ? ['ALL', ...unlocked] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* ── Page Header ── */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Graded Reading • 多読 (Tadoku)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {t('reading.title', 'Graded Reader (多読)')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed">
          {t('reading.subtitle', 'Learn vocabulary, grammar, particles, and kanji naturally through context through short stories. Complete each story and test your knowledge to earn Wave XP and maintain your daily Jelly Streak!')}
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
          <div className="min-w-0 p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs">
            <span className="block truncate text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">{t('reading.all_stories', 'Available Stories')}</span>
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {availableStories.length}
            </div>
          </div>
          <div className="min-w-0 p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs">
            <span className="block truncate text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">{t('common.mastered', 'Mastered Stories')}</span>
            <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {completedCount}
            </div>
          </div>
          <div className="min-w-0 p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs">
            <span className="block truncate text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">{t('common.your_levels', 'Your levels')}</span>
            <div className="text-lg sm:text-xl font-bold text-teal-600 dark:text-teal-400 mt-1">
              {unlockedRangeLabel(studyLevel)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Search Bar & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        {/* Level Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {levelTabs.map((lvl) => {
            const isSelected = selectedLevel === lvl;
            const countForLevel = lvl === 'ALL' ? availableStories.length : availableStories.filter((s) => s.level === lvl).length;

            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{lvl === 'ALL' ? t('reading.all_unlocked', 'All') : lvl}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  {countForLevel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('reading.search_placeholder', 'Search stories, titles...')}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* ── Stories Grid ── */}
      {paginatedStories.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <BookOpen className="w-10 h-10 mx-auto text-gray-400 mb-2 opacity-50" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('reading.no_match_title', 'No stories match your filter')}</p>
          <p className="text-xs text-gray-500 mt-1">{t('reading.no_match_hint', 'Try choosing a different level or clearing the search query.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              progress={progressMap[story.id]}
              onSelect={(id) => navigate(`/reading/${id}`)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination Controls ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * STORIES_PER_PAGE + 1}–{Math.min(currentPage * STORIES_PER_PAGE, filteredStories.length)} of {filteredStories.length} stories
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center transition-colors ${
                currentPage === 1
                  ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center transition-colors ${
                currentPage === totalPages
                  ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Guest Notice */}
      {!isAuthenticated && (
        <div className="mt-8 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            You are reading as a guest. Your reading position and quiz completion will be saved in your browser, but sign in to earn XP and sync across devices.
          </span>
        </div>
      )}
    </div>
  );
}
