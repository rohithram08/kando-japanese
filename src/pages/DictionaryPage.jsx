// src/pages/DictionaryPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Clean Bidirectional Dictionary
// Calm, user-friendly lookup supporting Kanji, Kana, Romaji, and meaning searches
// in the learner's preferred language, with Furigana, audio playback, and 1-click SRS.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Volume2,
  BookmarkPlus,
  Check,
  X,
  ArrowRightLeft,
  History,
  Copy,
  RotateCw,
  BookOpen,
} from 'lucide-react';
import { useI18n, SUPPORTED_LOCALES } from '../i18n';
import { useSRSStore } from '../store/srsStore';
import { audioService } from '../services/audioService';
import { searchDictionary } from '../api/dictionary';
import { detectSearchQuery } from '../utils/japaneseDetector';
import FuriganaText from '../components/common/FuriganaText';
import JellyStreakSlime from '../components/mascot/JellyStreakSlime';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';

const POPULAR_SEARCHES = [
  { term: '食べる', translation: 'Eat' },
  { term: '飲む', translation: 'Drink' },
  { term: '水', translation: 'Water' },
  { term: '猫', translation: 'Cat' },
  { term: 'ともだち', translation: 'Friend' },
  { term: 'ありがとう', translation: 'Thank you' },
  { term: '美しい', translation: 'Beautiful' },
  { term: '学校', translation: 'School' },
];

const SOURCE_FILTERS = [
  { id: 'all', label: 'All Results' },
  { id: 'curriculum', label: 'Kando Words' },
  { id: 'jisho', label: 'Online Lexicon' },
];

const JLPT_FILTERS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

const POS_FILTERS = [
  { id: 'all', label: 'All Types' },
  { id: 'noun', label: 'Nouns' },
  { id: 'verb', label: 'Verbs' },
  { id: 'adjective', label: 'Adjectives' },
];

const LOCAL_STORAGE_HISTORY_KEY = 'kando_dictionary_recent_v2';

export default function DictionaryPage() {
  const [searchParams] = useSearchParams();
  const { locale, displayLanguage, t } = useI18n();
  const effectiveLocale = displayLanguage || locale || 'en';

  const { isCardInSRS, addCardToSRS } = useSRSStore();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedJlpt, setSelectedJlpt] = useState('All');
  const [selectedPos, setSelectedPos] = useState('all');

  // Audio feedback state
  const [speakingWord, setSpeakingWord] = useState(null);

  // Recent searches
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef(null);
  const searchAbortControllerRef = useRef(null);
  const searchSeqRef = useRef(0);

  const currentLangName = useMemo(() => {
    const found = SUPPORTED_LOCALES.find((l) => l.code === effectiveLocale);
    return found ? found.nativeLabel || found.label : 'English';
  }, [effectiveLocale]);

  const queryDetection = useMemo(() => {
    return detectSearchQuery(query, currentLangName);
  }, [query, currentLangName]);

  // Debounced auto-search (skip noisy 1-letter queries or bare English articles)
  useEffect(() => {
    const trimmed = query.trim();
    const handler = setTimeout(() => {
      if (!trimmed || (trimmed.length >= 2 && !/^(to|a|an|the|in|on|at|by|of|or|is)$/i.test(trimmed))) {
        setDebouncedQuery(trimmed);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

  const performSearch = useCallback(
    async (searchQuery) => {
      const q = String(searchQuery || '').trim();
      if (!q) {
        setResults([]);
        setSubmittedQuery('');
        setLoading(false);
        setError(null);
        return;
      }

      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      searchAbortControllerRef.current = abortController;
      const currentSeq = ++searchSeqRef.current;

      setLoading(true);
      setError(null);
      setSubmittedQuery(q);

      try {
        const res = await searchDictionary(q, effectiveLocale, {
          jlpt: selectedJlpt !== 'All' ? selectedJlpt : undefined,
          pos: selectedPos !== 'all' ? selectedPos : undefined,
          signal: abortController.signal,
        });

        if (currentSeq !== searchSeqRef.current) return;

        setResults(res.results || []);

        setRecentSearches((prev) => {
          const updated = [q, ...prev.filter((item) => item.toLowerCase() !== q.toLowerCase())].slice(0, 8);
          try {
            localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
          return;
        }
        if (currentSeq === searchSeqRef.current) {
          console.error('Dictionary search error:', err);
          setError(t('dictionary.error', 'Unable to fetch dictionary results. Please check your connection.'));
        }
      } finally {
        if (currentSeq === searchSeqRef.current) {
          setLoading(false);
        }
      }
    },
    [effectiveLocale, selectedJlpt, selectedPos, t]
  );

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    const initialQ = searchParams.get('q');
    if (initialQ && initialQ.trim()) {
      const trimmed = initialQ.trim();
      setQuery(trimmed);
      setDebouncedQuery(trimmed);
      performSearch(trimmed);
    }
  }, [searchParams, performSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setSubmittedQuery('');
    setResults([]);
    setError(null);
    searchInputRef.current?.focus();
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    performSearch(term);
    searchInputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    } catch {}
  };

  const handleSpeak = (text) => {
    if (!text) return;
    setSpeakingWord(text);
    audioService.speak(text);
    setTimeout(() => setSpeakingWord(null), 1300);
  };

  const handleAddToSRS = async (entry) => {
    const cardId = entry.id || entry.word;
    const added = await addCardToSRS('vocabulary', cardId, entry.word);
    if (added) {
      toast.success(`${entry.word} added to your review deck!`);
    }
  };

  const handleCopyWord = (text) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Copied "${text}"`, { duration: 1400 });
  };

  const filteredResults = useMemo(() => {
    return results.filter((entry) => {
      if (sourceFilter === 'curriculum' && entry.source !== 'curriculum') return false;
      if (sourceFilter === 'jisho' && entry.source === 'curriculum') return false;
      if (selectedJlpt !== 'All' && entry.level?.toUpperCase() !== selectedJlpt.toUpperCase()) return false;
      if (selectedPos !== 'all' && !entry.partOfSpeech?.toLowerCase().includes(selectedPos)) return false;
      return true;
    });
  }, [results, sourceFilter, selectedJlpt, selectedPos]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3 pb-20 space-y-6">
      <SEO
        title="Japanese Dictionary & Word Lookup"
        description="Search Japanese kanji, words, and phrases with furigana readings, localized meanings, example sentences, and audio pronunciation."
        path="/dictionary"
      />

      {/* Calm Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3.5">
          <div className="shrink-0">
            <JellyStreakSlime size="sm" mood={loading ? 'celebrating' : 'active'} animated />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('dictionary.title', 'Japanese Dictionary')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {t(
                'dictionary.subtitle',
                'Look up any Japanese kanji, kana, romaji, or meaning in one clean view.'
              )}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full bg-card border border-border text-xs font-semibold text-muted-foreground shadow-xs">
          <ArrowRightLeft className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span>{currentLangName} ⇄ 日本語</span>
        </div>
      </header>

      {/* Focused Search Bar + Single Filter Strip */}
      <section className="rounded-3xl border border-border bg-card p-3.5 sm:p-4 shadow-sm space-y-3">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 flex items-center">
            <Search
              className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                'dictionary.search_placeholder',
                'Search kanji (食べる), kana (たべる), romaji (taberu), or meaning...'
              )}
              aria-label="Search Japanese dictionary"
              className="w-full pl-10 pr-28 py-3 rounded-2xl bg-background border border-border text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />

            <div className="absolute right-2.5 flex items-center gap-1.5">
              {query.trim() && queryDetection?.label && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-primary/10 text-primary">
                  {queryDetection.label}
                </span>
              )}
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </form>

        {/* Compact Single-Row Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
          {/* Source Tabs */}
          <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="Dictionary source filter">
            {SOURCE_FILTERS.map((src) => {
              const active = sourceFilter === src.id;
              return (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => setSourceFilter(src.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {src.label}
                </button>
              );
            })}
          </div>

          {/* JLPT Level + Part of Speech */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1" role="group" aria-label="JLPT level filter">
              {JLPT_FILTERS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedJlpt(lvl)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    selectedJlpt === lvl
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <select
              value={selectedPos}
              onChange={(e) => setSelectedPos(e.target.value)}
              aria-label="Filter by part of speech"
              className="px-2.5 py-1 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              {POS_FILTERS.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Welcome / Empty Query View */}
      {!submittedQuery && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <History className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Recent Searches</span>
                </span>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickSearch(term)}
                    className="px-3 py-1 rounded-xl bg-muted/60 hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Words */}
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm font-bold text-foreground">Popular Words to Explore</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_SEARCHES.map((item) => (
                <motion.button
                  key={item.term}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickSearch(item.term)}
                  className="flex flex-col items-start p-3 rounded-2xl border border-border/80 bg-background hover:border-primary/40 hover:bg-primary/[0.03] text-left transition-all cursor-pointer"
                >
                  <span className="font-japanese text-base font-bold text-foreground">
                    {item.term}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">{item.translation}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 text-center space-y-3">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>
          <button
            type="button"
            onClick={() => performSearch(submittedQuery || query)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3" aria-label="Loading dictionary results">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-5 space-y-3 animate-pulse"
            >
              <div className="h-7 w-36 rounded-lg bg-muted" />
              <div className="h-4 w-56 rounded-lg bg-muted/70" />
              <div className="h-12 w-full rounded-xl bg-muted/50" />
            </div>
          ))}
        </div>
      )}

      {/* Empty Search Results */}
      {submittedQuery && !loading && !error && filteredResults.length === 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center space-y-2">
          <p className="text-base font-bold text-foreground">
            No matching entries for &ldquo;{submittedQuery}&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">
            Try switching filters back to All Results / All JLPT levels, or search by kana or English meaning.
          </p>
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && filteredResults.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              {filteredResults.length} {filteredResults.length === 1 ? 'entry' : 'entries'} for{' '}
              <strong className="text-foreground">&ldquo;{submittedQuery}&rdquo;</strong>
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredResults.map((entry, idx) => {
              const cardId = entry.id || entry.word;
              const inSRS = isCardInSRS('vocabulary', cardId);
              const isSpeaking = speakingWord === entry.word;
              const examples = Array.isArray(entry.examples) ? entry.examples.slice(0, 3) : [];

              return (
                <motion.article
                  key={`${cardId}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: Math.min(idx * 0.03, 0.18) }}
                  className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs hover:border-border/90 hover:shadow-sm transition-all space-y-4"
                >
                  {/* Word Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-baseline flex-wrap gap-2.5">
                        <div className="font-japanese text-2xl sm:text-3xl font-black text-foreground">
                          <FuriganaText
                            text={entry.word}
                            reading={entry.reading}
                            showFurigana={Boolean(entry.reading && entry.reading !== entry.word)}
                          />
                        </div>
                        {entry.reading && entry.reading !== entry.word && (
                          <span className="font-japanese text-sm font-semibold text-primary">
                            {entry.reading}
                          </span>
                        )}
                        {entry.romaji && (
                          <span className="text-sm font-mono text-muted-foreground">
                            /{entry.romaji}/
                          </span>
                        )}
                      </div>

                      {/* Clean Badges */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        {entry.level && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                            {`JLPT ${entry.level}`}
                          </span>
                        )}
                        {entry.isCommon && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            Common
                          </span>
                        )}
                        {entry.partOfSpeech && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground">
                            {entry.partOfSpeech}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSpeak(entry.word || entry.reading)}
                        title="Listen pronunciation"
                        aria-label={`Listen to ${entry.word}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isSpeaking
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted text-foreground border-border'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Listen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyWord(entry.word)}
                        title="Copy word"
                        aria-label={`Copy ${entry.word}`}
                        className="p-2 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToSRS(entry)}
                        disabled={inSRS}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          inSRS
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 cursor-default'
                            : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'
                        }`}
                      >
                        {inSRS ? (
                          <>
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>In SRS</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>+ SRS</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Primary Meaning */}
                  <div className="pt-1">
                    <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
                      {entry.meaning}
                    </p>
                    {entry.meaningEn && entry.meaningEn !== entry.meaning && (
                      <p className="text-xs text-muted-foreground mt-0.5">{entry.meaningEn}</p>
                    )}
                  </div>

                  {/* Example Sentences */}
                  {examples.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      {examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="flex items-start justify-between gap-3 rounded-2xl bg-muted/35 px-3.5 py-2.5"
                        >
                          <div className="space-y-0.5 text-sm">
                            <p className="font-japanese font-bold text-foreground">{ex.jp}</p>
                            {ex.reading && (
                              <p className="font-japanese text-xs text-muted-foreground">
                                {ex.reading}
                              </p>
                            )}
                            {ex.translation && (
                              <p className="text-xs text-foreground/80">{ex.translation}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(ex.jp)}
                            aria-label="Play example sentence"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-background transition-colors shrink-0 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}
