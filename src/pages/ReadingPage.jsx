// src/pages/ReadingPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Graded Japanese Reading Page (Phase 4.1 Foundations)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useReadingStore } from '../store/readingStore';
import { allStories, n5Stories, n4Stories, getStoryById } from '../data/reading/n5_stories';
import StoryCard from '../components/reading/StoryCard';
import StoryReader from '../components/reading/StoryReader';

export default function ReadingPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  const { progressMap, loading, error, loadAllProgress } = useReadingStore();
  const [selectedLevel, setSelectedLevel] = useState('ALL');
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
            Story Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            The requested reading text could not be located in the catalog.
          </p>
          <button
            onClick={() => navigate('/reading')}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            Back to Library
          </button>
        </div>
      );
    }

    if (!progressLoaded && loading && !progressMap[story.id]) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading reading progress...</p>
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
        onBack={() => navigate('/reading')}
      />
    );
  }

  // ── Library Overview ──
  const filteredStories = allStories.filter(
    (s) => selectedLevel === 'ALL' || s.level === selectedLevel
  );

  const completedCount = Object.values(progressMap).filter(
    (p) => p.status === 'completed'
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Extensive Reading • 多読 (Tadoku)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Graded Readers
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed">
          Read level-appropriate Japanese stories with adaptive furigana assistance, verified pitch accent contours, and comprehension checks designed to build natural reading fluency.
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs">
            <span className="text-xs text-gray-500 dark:text-gray-400">Available Stories</span>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {allStories.length} (N5 & N4)
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs">
            <span className="text-xs text-gray-500 dark:text-gray-400">Mastered Stories</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {completedCount}
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Current Catalog</span>
            <div className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-1">
              JLPT N5 & N4
            </div>
          </div>
        </div>
      </div>

      {/* ── Level Filter Tabs ── */}
      <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">
        {['ALL', 'N5', 'N4', 'N3 (Soon)'].map((lvl) => {
          const isAvailable = lvl === 'ALL' || lvl === 'N5' || lvl === 'N4';
          const isSelected = selectedLevel === lvl;

          return (
            <button
              key={lvl}
              disabled={!isAvailable}
              onClick={() => isAvailable && setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-xs'
                  : isAvailable
                  ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60'
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>

      {/* ── Stories Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            progress={progressMap[story.id]}
            onSelect={(id) => navigate(`/reading/${id}`)}
          />
        ))}
      </div>

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
