// src/components/reading/StoryReader.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable Graded Japanese Reader Component with Interactive Word Lookup
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  BookOpen,
  List,
  Layers,
  Sparkles,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Pause,
  Volume2,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { useReadingStore } from '../../store/readingStore';
import { useSRSStore } from '../../store/srsStore';
import { useI18n, getCurriculumMeaning } from '../../i18n';
import FuriganaText from '../common/FuriganaText';
import AudioButton from '../common/AudioButton';
import PitchContourVisualizer from '../pitch/PitchContourVisualizer';
import ComprehensionQuiz from './ComprehensionQuiz';
import VocabLookupModal from './VocabLookupModal';
import StoryAudioPlayer from './StoryAudioPlayer';
import { useStoryAudio } from '../../hooks/useStoryAudio';
import { getSentenceTokens } from '../../utils/readingTokenizer';

function InteractiveSentenceText({
  sentence,
  vocabularyList,
  learningElements = [],
  furiganaOverride,
  onSelectWord,
  activeFilter = 'all',
}) {
  const tokens = getSentenceTokens(sentence, vocabularyList);

  return (
    <span className="inline-flex items-baseline flex-wrap leading-relaxed select-text">
      {tokens.map((token, idx) => {
        const cleanSurface = token.surface ? token.surface.trim() : '';

        // Check if token matches a curated learning element
        const matchedElement = learningElements.find((el) => {
          if (!el) return false;
          if (activeFilter !== 'all' && el.type !== activeFilter) return false;
          return el.text === cleanSurface || el.surface === cleanSurface || el.id === token.vocabKey;
        });

        // Or fallback to standard vocab
        const vocab = token.isWord && token.vocabKey
          ? vocabularyList.find((v) => v.surface === token.vocabKey || v.vocabRefId === token.vocabKey)
          : null;

        const targetItem = matchedElement || vocab;

        if (targetItem) {
          const type = targetItem.type || 'vocabulary';
          let borderClass = 'border-b border-dashed border-teal-500/50 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-800 dark:text-teal-200';
          if (type === 'grammar') {
            borderClass = 'border-b-2 border-purple-500/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-medium';
          } else if (type === 'particle') {
            borderClass = 'border-b-2 border-sky-500/80 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-bold';
          } else if (type === 'kanji') {
            borderClass = 'border-b-2 border-amber-500/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold';
          }

          return (
            <button
              key={`tok-${idx}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onSelectWord(targetItem);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  e.preventDefault();
                  onSelectWord(targetItem);
                }
              }}
              className={`inline-flex items-baseline rounded px-1 py-0.5 mx-0.5 cursor-pointer text-inherit transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/60 select-text ${borderClass}`}
              aria-haspopup="dialog"
              aria-label={`Look up ${targetItem.surface || targetItem.text} (${targetItem.reading || ''}): ${targetItem.meaning}`}
              title={`Click to explore ${targetItem.surface || targetItem.text}`}
            >
              <FuriganaText text={token.text} forceMode={furiganaOverride} />
            </button>
          );
        }

        return (
          <FuriganaText
            key={`tok-${idx}`}
            text={token.text}
            forceMode={furiganaOverride}
          />
        );
      })}
    </span>
  );
}

export default function StoryReader({ story, initialProgress, onBack, initialShowQuiz = false }) {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const { saveProgress } = useReadingStore();
  const { initSRSDeck } = useSRSStore();
  const { t, locale } = useI18n();

  const sentences = Array.isArray(story?.sentences) ? story.sentences : [];
  const totalSentences = sentences.length;

  const initialIndex = (
    typeof initialProgress?.lastSentenceIndex === 'number' &&
    initialProgress.lastSentenceIndex >= 0 &&
    initialProgress.lastSentenceIndex < totalSentences
  ) ? initialProgress.lastSentenceIndex : 0;

  const [activeSentenceIndex, setActiveSentenceIndex] = useState(initialIndex);

  // View modes
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'passage'
  const [showTranslations, setShowTranslations] = useState(true);
  const [furiganaOverride, setFuriganaOverride] = useState(null); // null (use settings) | 'always' | 'adaptive' | 'off'
  const [showVocabDrawer, setShowVocabDrawer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(Boolean(initialShowQuiz));
  const [selectedLookupVocab, setSelectedLookupVocab] = useState(null);
  const [completed, setCompleted] = useState(initialProgress?.status === 'completed');
  const [quizScore, setQuizScore] = useState(initialProgress?.quizScore ?? null);
  const [elementFilter, setElementFilter] = useState('all');

  // Refs to guard against initial progress overwrite race condition
  const userHasNavigatedRef = useRef(false);
  const lastSavedIndexRef = useRef(initialIndex);

  // Synchronize state if initialProgress hydrates asynchronously before user interaction
  useEffect(() => {
    if (!userHasNavigatedRef.current && initialProgress) {
      if (
        typeof initialProgress.lastSentenceIndex === 'number' &&
        initialProgress.lastSentenceIndex >= 0 &&
        initialProgress.lastSentenceIndex < totalSentences
      ) {
        setActiveSentenceIndex(initialProgress.lastSentenceIndex);
        lastSavedIndexRef.current = initialProgress.lastSentenceIndex;
      }
      if (initialProgress.status === 'completed') {
        setCompleted(true);
      }
      if (initialProgress.quizScore !== undefined && initialProgress.quizScore !== null) {
        setQuizScore(initialProgress.quizScore);
      }
    }
  }, [initialProgress, totalSentences]);

  const navigateToSentence = (newIdx) => {
    userHasNavigatedRef.current = true;
    setActiveSentenceIndex(newIdx);
  };

  const currentSentence = sentences[activeSentenceIndex] || sentences[0] || null;

  // Initialize SRS deck membership on mount
  useEffect(() => {
    initSRSDeck();
  }, [initSRSDeck]);

  // Auto-save sentence position only when user navigates and position has changed
  useEffect(() => {
    if (userHasNavigatedRef.current && lastSavedIndexRef.current !== activeSentenceIndex && !completed && story?.id) {
      lastSavedIndexRef.current = activeSentenceIndex;
      saveProgress(
        {
          storyId: story.id,
          lastSentenceIndex: activeSentenceIndex,
          status: 'in_progress',
        },
        isAuthenticated
      );
    }
  }, [activeSentenceIndex, story?.id, completed, isAuthenticated, saveProgress]);

  const storyAudio = useStoryAudio({
    sentences,
    activeSentenceIndex,
    onSentenceChange: (newIndex) => {
      navigateToSentence(newIndex);
    },
    onStoryComplete: () => {
      // Completed full story audio
    },
  });

  const handleNextSentence = () => {
    if (activeSentenceIndex < totalSentences - 1) {
      const nextIdx = activeSentenceIndex + 1;
      navigateToSentence(nextIdx);
      if (storyAudio.isPlaying) {
        storyAudio.play(nextIdx);
      }
    } else {
      storyAudio.stop();
      setShowQuiz(true);
    }
  };

  const handlePrevSentence = () => {
    if (activeSentenceIndex > 0) {
      const prevIdx = activeSentenceIndex - 1;
      navigateToSentence(prevIdx);
      if (storyAudio.isPlaying) {
        storyAudio.play(prevIdx);
      }
    }
  };

  const handleBack = () => {
    storyAudio.stop();
    onBack?.();
  };

  const handleSelectWord = (vocab) => {
    storyAudio.pause();
    setSelectedLookupVocab(vocab);
  };

  const handleOpenQuiz = () => {
    storyAudio.stop();
    setShowQuiz(true);
  };

  // Called by the quiz as soon as the learner submits their answers. The server is
  // the single source of truth for Wave XP, level and Jelly Streak: it pays the
  // story + quiz reward once, credits today's streak (pass or fail) and returns the
  // numbers, which the quiz screen then displays.
  const handleQuizSubmit = async (score) => {
    storyAudio.stop();
    setQuizScore((prev) => Math.max(prev ?? 0, score));
    setCompleted(true);

    return saveProgress(
      {
        storyId: story.id,
        lastSentenceIndex: totalSentences - 1,
        status: 'completed',
        quizScore: score,
      },
      isAuthenticated
    );
  };

  const handleQuizFinish = () => {
    setShowQuiz(false);
    handleBack();
  };

  // If in quiz mode, show the quiz component
  if (showQuiz) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <button
            onClick={() => setShowQuiz(false)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('reading.return_to_reading', 'Return to Reading')}</span>
          </button>
        </div>
        <ComprehensionQuiz
          questions={story.questions}
          isAuthenticated={isAuthenticated}
          alreadyCompleted={initialProgress?.status === 'completed'}
          onSubmit={handleQuizSubmit}
          onFinish={handleQuizFinish}
          onBackToStory={() => setShowQuiz(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ── Top Navigation & Meta ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('reading.all_stories', 'All Stories')}</span>
        </button>

        {/* Story Title & Level */}
        <div className="text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {story.level}
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              <FuriganaText text={story.titleFurigana} forceMode={furiganaOverride} />
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {story.englishTitle} • {story.estimatedMinutes} min read
          </p>
        </div>

        {/* Reading Controls Toolbar */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 p-0.5 bg-gray-50 dark:bg-gray-800/40">
            <button
              onClick={() => setViewMode('card')}
              title={t('reading.mode_sentence', 'Sentence-by-sentence mode')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('passage')}
              title={t('reading.mode_passage', 'Continuous passage mode')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'passage'
                  ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Translation Toggle */}
          <button
            onClick={() => setShowTranslations((prev) => !prev)}
            title={showTranslations ? 'Hide translations' : 'Show translations'}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              showTranslations
                ? 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {showTranslations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Furigana Mode Selector */}
          <select
            value={furiganaOverride || 'default'}
            onChange={(e) => setFuriganaOverride(e.target.value === 'default' ? null : e.target.value)}
            className="text-xs py-1.5 px-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="default">Furigana: Auto</option>
            <option value="always">Furigana: Always On</option>
            <option value="adaptive">Furigana: Adaptive</option>
            <option value="off">Furigana: Off</option>
          </select>

          {/* Vocab Sheet Toggle */}
          <button
            onClick={() => {
              storyAudio.pause();
              setShowVocabDrawer((prev) => !prev);
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center space-x-1 ${
              showVocabDrawer
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('reading.vocab_notes', 'Vocabulary')} ({story.vocabulary.length})</span>
          </button>
        </div>
      </div>

      {/* ── Main Layout (Content + Vocabulary Sidebar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reader view */}
        <div className={showVocabDrawer ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {viewMode === 'card' ? (
            /* ── Card Mode: Focused Sentence Reader ── */
            <div
              className={`p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-3xl border transition-all duration-200 shadow-sm flex flex-col justify-between min-h-[380px] ${
                storyAudio.isPlaying
                  ? 'border-teal-500/80 ring-2 ring-teal-500/20'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div>
                {/* Sentence Progress & Active Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Sentence {activeSentenceIndex + 1} of {totalSentences}
                    </span>
                    {storyAudio.isPlaying && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 animate-pulse">
                        <Volume2 className="w-3 h-3" />
                        <span>{t('reading.speaking', 'Speaking')}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <AudioButton text={currentSentence.japanese} size="sm" />
                    {completed && (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('reading.completed', 'Completed')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Sentence Audio Controls Bar */}
                <div className="mb-6">
                  <StoryAudioPlayer
                    isPlaying={storyAudio.isPlaying}
                    playbackSpeed={storyAudio.playbackSpeed}
                    autoPlayNext={storyAudio.autoPlayNext}
                    isSupported={storyAudio.isSupported}
                    hasJapaneseVoice={storyAudio.hasJapaneseVoice}
                    activeAudioStrategy={storyAudio.activeAudioStrategy}
                    onPlay={() => storyAudio.play(activeSentenceIndex)}
                    onPause={() => storyAudio.pause()}
                    onReplay={() => storyAudio.replay()}
                    onSpeedChange={(speed) => storyAudio.setSpeed(speed)}
                    onToggleAutoPlayNext={() => storyAudio.toggleAutoPlayNext()}
                  />
                </div>

                {/* Large Japanese Sentence with Interactive Word Tokens */}
                <div className="text-2xl sm:text-3xl leading-relaxed sm:leading-loose font-medium text-foreground mb-6 py-4 font-jp">
                  <InteractiveSentenceText
                    sentence={currentSentence}
                    vocabularyList={story.vocabulary}
                    learningElements={story.learningElements || []}
                    furiganaOverride={furiganaOverride}
                    onSelectWord={handleSelectWord}
                    activeFilter={elementFilter}
                  />
                </div>

                {/* English Translation */}
                {showTranslations && (
                  <div className="p-4 rounded-2xl bg-muted/60 text-sm text-foreground leading-relaxed mb-4">
                    <p className="font-medium">{currentSentence.translation}</p>
                  </div>
                )}

                {/* Grammar Notes */}
                {currentSentence.grammarNotes && (
                  <div className="flex items-start space-x-2 text-xs text-muted-foreground mt-2 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{currentSentence.grammarNotes}</span>
                  </div>
                )}

                {/* ── In-Story Interactive Learning Elements Dock ── */}
                {story.learningElements && story.learningElements.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Learning Elements (単語・文法・助詞・漢字)</span>
                      </span>
                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'vocabulary', label: '🟢 Vocab' },
                          { id: 'grammar', label: '🟣 Grammar' },
                          { id: 'particle', label: '🔵 Particle' },
                          { id: 'kanji', label: '🔴 Kanji' },
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setElementFilter(f.id)}
                            className={`px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                              elementFilter === f.id
                                ? 'bg-primary text-white border-primary shadow-xs'
                                : 'bg-muted/60 text-muted-foreground border-border hover:text-foreground'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filtered Element Cards */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {story.learningElements
                        .filter((el) => elementFilter === 'all' || el.type === elementFilter)
                        .map((el) => {
                          const typeColors = {
                            vocabulary: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20',
                            grammar: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20',
                            particle: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 hover:bg-sky-500/20',
                            kanji: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20',
                          }[el.type] || 'bg-muted text-muted-foreground border-border';

                          return (
                            <button
                              key={el.id}
                              onClick={() => handleSelectWord(el)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${typeColors}`}
                              title={el.roleInStory || el.meaning}
                            >
                              <span className="font-bold font-jp">{el.text || el.surface}</span>
                              <span className="text-[10px] opacity-80 font-normal">
                                {el.reading || el.meaning}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="pt-8 mt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  disabled={activeSentenceIndex === 0}
                  onClick={handlePrevSentence}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-30 disabled:hover:bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('common.previous', 'Previous')}</span>
                </button>

                {/* Sentence progress dots */}
                <div className="hidden sm:flex items-center space-x-1.5">
                  {story.sentences.map((_, idx) => (
                    <button
                      key={`dot-${idx}`}
                      onClick={() => {
                        navigateToSentence(idx);
                        if (storyAudio.isPlaying) {
                          storyAudio.play(idx);
                        }
                      }}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeSentenceIndex
                          ? 'w-6 bg-teal-600 dark:bg-teal-400'
                          : 'w-2 bg-gray-200 dark:bg-gray-700'
                      }`}
                      title={`Jump to sentence ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextSentence}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center space-x-1"
                >
                  <span>{activeSentenceIndex === totalSentences - 1 ? t('reading.take_quiz', 'Take Quiz') : t('common.next', 'Next')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* ── Passage Mode: Continuous Reading ── */
            <div className="p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
              {/* Sticky Top Audio Player Bar in Passage Mode */}
              <div className="sticky top-2 z-10 shadow-xs">
                <StoryAudioPlayer
                  isPlaying={storyAudio.isPlaying}
                  playbackSpeed={storyAudio.playbackSpeed}
                  autoPlayNext={storyAudio.autoPlayNext}
                  isSupported={storyAudio.isSupported}
                  hasJapaneseVoice={storyAudio.hasJapaneseVoice}
                  activeAudioStrategy={storyAudio.activeAudioStrategy}
                  onPlay={() => storyAudio.play(activeSentenceIndex)}
                  onPause={() => storyAudio.pause()}
                  onReplay={() => storyAudio.replay()}
                  onSpeedChange={(speed) => storyAudio.setSpeed(speed)}
                  onToggleAutoPlayNext={() => storyAudio.toggleAutoPlayNext()}
                />
              </div>

              <div className="space-y-4">
                {story.sentences.map((sentence, sIdx) => {
                  const isCurrent = sIdx === activeSentenceIndex;
                  const isAudioActive = isCurrent && storyAudio.isPlaying;
                  return (
                    <div
                      key={sentence.id}
                      onClick={() => {
                        navigateToSentence(sIdx);
                        if (storyAudio.isPlaying) {
                          storyAudio.play(sIdx);
                        }
                      }}
                      className={`p-4 rounded-2xl transition-all cursor-pointer ${
                        isAudioActive
                          ? 'bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                          : isCurrent
                          ? 'bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/80 shadow-xs'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-[10px] font-bold text-gray-400">
                              #{sIdx + 1}
                            </span>
                            {isAudioActive && (
                              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white animate-pulse">
                                <Volume2 className="w-2.5 h-2.5" />
                                <span>{t('reading.speaking', 'Speaking')}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100 leading-loose">
                            <InteractiveSentenceText
                              sentence={sentence}
                              vocabularyList={story.vocabulary}
                              learningElements={story.learningElements || []}
                              furiganaOverride={furiganaOverride}
                              onSelectWord={handleSelectWord}
                              activeFilter={elementFilter}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (isAudioActive) {
                              storyAudio.pause();
                            } else {
                              navigateToSentence(sIdx);
                              storyAudio.play(sIdx);
                            }
                          }}
                          className={`p-2 rounded-xl border transition-colors shrink-0 ${
                            isAudioActive
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-teal-600 hover:border-teal-400'
                          }`}
                          title={isAudioActive ? 'Pause sentence audio' : 'Play this sentence'}
                          aria-label={isAudioActive ? `Pause sentence ${sIdx + 1}` : `Play sentence ${sIdx + 1}`}
                        >
                          {isAudioActive ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {showTranslations && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                          {sentence.translation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* End of Passage Action */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  onClick={handleOpenQuiz}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5"
                >
                  <span>{t('reading.take_quiz', 'Complete Reading & Take Quiz')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Completion Banner if finished */}
          {completed && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {t('reading.story_complete', 'Story Mastered!')}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    {quizScore !== null && quizScore !== undefined
                      ? t('quiz.score', { score: quizScore, total: 100, percent: quizScore }, `Comprehension Quiz Score: ${quizScore}%`)
                      : null}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                {t('quiz.retake', 'Retake Quiz')}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Vocabulary & Pitch Drawer */}
        {showVocabDrawer && (
          <div className="lg:col-span-1 p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm max-h-[700px] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{t('reading.vocab_notes', 'Vocabulary Notes')}</span>
              </h3>
              <button
                onClick={() => setShowVocabDrawer(false)}
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {t('common.close', 'Close')}
              </button>
            </div>

            <div className="space-y-4">
              {story.vocabulary.map((vocab, vIdx) => {
                return (
                  <div
                    key={`v-${vIdx}`}
                    onClick={() => handleSelectWord(vocab)}
                    className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-teal-500/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                          {vocab.surface}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {vocab.reading}
                        </span>
                      </div>
                      <AudioButton text={vocab.surface} size="sm" />
                    </div>

                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mb-2">
                      {getCurriculumMeaning(vocab, locale) || vocab.meaning}
                    </p>

                    {/* Pitch Accent Section */}
                    {vocab.pitchVerified ? (
                      <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                        <PitchContourVisualizer
                          word={vocab.surface}
                          reading={vocab.reading}
                          particle="が"
                          showDetails={false}
                        />
                      </div>
                    ) : (
                      <div className="mt-2 pt-1 border-t border-gray-200/30 dark:border-gray-700/30 flex items-center space-x-1 text-[10px] text-gray-400">
                        <AlertCircle className="w-3 h-3 text-amber-500/70" />
                        <span>{t('reading.pitch_pending', 'Pitch accent data awaiting verified dictionary entry')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Vocabulary Lookup Popover Modal ── */}
      {selectedLookupVocab && (
        <VocabLookupModal
          vocab={selectedLookupVocab}
          onClose={() => setSelectedLookupVocab(null)}
          furiganaMode={furiganaOverride}
        />
      )}
    </div>
  );
}
