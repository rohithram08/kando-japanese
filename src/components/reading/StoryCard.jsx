// src/components/reading/StoryCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Story Card component for Graded Reading Library
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { BookOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import FuriganaText from '../common/FuriganaText';

export default function StoryCard({ story, progress, onSelect }) {
  const isCompleted = progress?.status === 'completed';
  const inProgress = progress?.status === 'in_progress';
  const currentSentence = progress?.lastSentenceIndex ? progress.lastSentenceIndex + 1 : 1;
  const totalSentences = story.sentences.length;

  return (
    <div
      onClick={() => onSelect(story.id)}
      className="group relative flex flex-col justify-between p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all cursor-pointer"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            {story.level}
          </span>
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{story.estimatedMinutes} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          <FuriganaText text={story.titleFurigana} />
        </h3>
        <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-3">
          {story.englishTitle}
        </p>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
          {story.description}
        </p>
      </div>

      {/* Footer & Progress State */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        {isCompleted ? (
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Completed ({progress.quizScore ?? 100}%)</span>
          </div>
        ) : inProgress ? (
          <div className="flex items-center space-x-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <BookOpen className="w-4 h-4" />
            <span>Sentence {currentSentence} of {totalSentences}</span>
          </div>
        ) : (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {totalSentences} sentences
          </span>
        )}

        <button
          className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{isCompleted ? 'Review' : inProgress ? 'Continue' : 'Start'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
