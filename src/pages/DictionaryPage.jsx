// src/pages/DictionaryPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Bidirectional Multilingual Dictionary
// Complete, responsive, smart dictionary supporting Japanese (Kanji/Kana/Romaji)
// and meaning searches localized into the user's preferred platform language.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Volume2,
  BookmarkPlus,
  Check,
  X,
  ArrowRightLeft,
  BookOpen,
  Sparkles,
  Layers,
  Filter,
  History,
  Copy,
  RotateCw,
} from 'lucide-react';
import { useI18n, SUPPORTED_LOCALES } from '../i18n';
import { useSRSStore } from '../store/srsStore';
import { audioService } from '../services/audioService';
import { searchDictionary } from '../api/dictionary';
import { detectSearchQuery } from '../utils/japaneseDetector';
import FuriganaText from '../components/common/FuriganaText';
import JellyStreakSlime from '../components/mascot/JellyStreakSlime';
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

const JLPT_FILTERS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];
const POS_FILTERS = [
  { id: 'all', label: 'All Types' },
  { id: 'noun', label: 'Nouns (名詞)' },
  { id: 'verb', label: 'Verbs (動詞)' },
  { id: 'adjective', label: 'Adjectives (形容詞)' },
];

const LOCAL_STORAGE_HISTORY_KEY = 'kando_dictionary_recent_v2';

export default function DictionaryPage() {
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

  // Speaking state tracking
  const [speakingWord, setSpeakingWord] = useState(null);

  // Recent Searches
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

  // Current language display name
  const currentLangName = useMemo(() => {
    const found = SUPPORTED_LOCALES.find((l) => l.code === effectiveLocale);
    return found ? found.nativeLabel || found.label : 'English';
  }, [effectiveLocale]);

  // Real-time Query Detection
  const queryDetection = useMemo(() => {
    return detectSearchQuery(query, currentLangName);
  }, [query, currentLangName]);

  // Debounce search input (400ms) with stopword guard
  useEffect(() => {
    const trimmed = query.trim();
    const handler = setTimeout(() => {
      // Don't auto-search on bare English particles like "to" alone
      if (!trimmed || (trimmed.length >= 2 && !/^(to|a|an|the|in|on|at|by|of|or|is)$/i.test(trimmed))) {
        setDebouncedQuery(trimmed);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute Search
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

      // Abort any prior in-flight search request to prevent race conditions
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

        // Drop stale response if a newer search was initiated
        if (currentSeq !== searchSeqRef.current) return;

        setResults(res.results || []);

        // Save to recent searches
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

  // Trigger search on debounced query change
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch]);

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

  // Audio Pronunciation
  const handleSpeak = (text) => {
    if (!text) return;
    setSpeakingWord(text);
    audioService.speak(text);
    setTimeout(() => setSpeakingWord(null), 1400);
  };

  // SRS Deck Intake
  const handleAddToSRS = async (entry) => {
    const cardId = entry.id || entry.word;
    const added = await addCardToSRS('vocabulary', cardId, entry.word);
    if (added) {
      toast.success(`${entry.word} added to your review deck! 🗂️`, {
        icon: '✨',
      });
    }
  };

  // Copy word
  const handleCopyWord = (text) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Copied "${text}" to clipboard!`, { duration: 1500 });
  };

  // Filtered Results
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
    <div className="min-h-screen bg-background pb-16">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent border-b border-border/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                {t('dictionary.eyebrow', 'Smart Multilingual Lexicon')}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                {t('dictionary.title', 'Japanese Dictionary')}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                {t(
                  'dictionary.subtitle',
                  'Search bidirectionally using Japanese (Kanji, Kana, Romaji) or meanings in your language.'
                )}
              </p>
            </div>

            {/* Mascot Visual */}
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl" />
              <div className="relative p-3 rounded-3xl bg-surface/80 border border-border backdrop-blur-sm shadow-sm flex items-center gap-3">
                <JellyStreakSlime size="md" mood={loading ? 'celebrating' : 'active'} animated />
                <div className="text-left pr-2">
                  <span className="text-xs font-bold text-foreground block">
                    {currentLangName} ⇄ 日本語
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Curated + Jisho + AI
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── SEARCH BAR ────────────────────────────────────────── */}
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center shadow-lg rounded-2xl bg-surface border-2 border-border focus-within:border-emerald-500/70 dark:focus-within:border-emerald-400/70 transition-all">
                <Search className="w-5 h-5 ml-4 text-muted-foreground flex-shrink-0" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    queryDetection.placeholderText ||
                    t('dictionary.placeholder', 'Try 食べる, taberu, water, தண்ணீர், खाना…')
                  }
                  className="w-full py-4 pl-3 pr-28 text-base bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 border-0 outline-none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />

                <div className="absolute right-3 flex items-center gap-1.5">
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      aria-label="Clear search"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!query.trim() || loading}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xs"
                  >
                    {loading ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      t('dictionary.search_btn', 'Search')
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Auto-Detection Badge */}
              <div className="flex items-center justify-between mt-2.5 px-2 text-xs">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-colors ${queryDetection.badgeColor}`}
                >
                  <span>{queryDetection.icon}</span>
                  <span>{queryDetection.label}</span>
                </div>

                <div className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1">
                  <ArrowRightLeft className="w-3 h-3 text-emerald-500" />
                  <span>
                    Auto-translates between <strong>Japanese</strong> and <strong>{currentLangName}</strong>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── FILTER CHIPS & CONTROLS ───────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
          {/* Source filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Source:
            </span>
            {[
              { id: 'all', label: 'All Results' },
              { id: 'curriculum', label: '⭐ Kando Words' },
              { id: 'jisho', label: '🌐 Online Lexicon' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSourceFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  sourceFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* JLPT filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-muted-foreground mr-1">JLPT:</span>
            {JLPT_FILTERS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedJlpt(lvl)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  selectedJlpt === lvl
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Part of Speech filters */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> POS:
          </span>
          {POS_FILTERS.map((pos) => (
            <button
              key={pos.id}
              onClick={() => setSelectedPos(pos.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedPos === pos.id
                  ? 'bg-surface border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'bg-surface/50 border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT BODY ───────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* State: Idle / Welcome with Suggestions & Recents */}
        {!submittedQuery && !loading && (
          <div className="space-y-8 py-6">
            {/* Quick Suggestion Chips */}
            <div className="p-6 rounded-3xl bg-surface/60 border border-border space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {t('dictionary.popular_suggestions', 'Popular Words to Explore')}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item.term}
                    onClick={() => handleQuickSearch(item.term)}
                    className="px-3.5 py-1.5 rounded-xl bg-surface hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-border hover:border-emerald-500/50 text-foreground text-xs font-medium transition-all active:scale-95 shadow-2xs flex items-center gap-1.5"
                  >
                    <span className="font-bold">{item.term}</span>
                    <span className="text-muted-foreground text-[11px]">{item.translation}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-6 rounded-3xl bg-surface/60 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-cyan-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      {t('dictionary.recent_searches', 'Recent Searches')}
                    </h3>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('common.clear', 'Clear')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-3 py-1 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-medium transition-all flex items-center gap-1.5"
                    >
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-surface border border-border/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  あ
                </div>
                <h4 className="text-sm font-bold text-foreground">Kanji, Kana & Romaji</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Search any Japanese form with automatic script detection and Hepburn pronunciation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  🌐
                </div>
                <h4 className="text-sm font-bold text-foreground">Multi-Language Meanings</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Search in English, Tamil, Hindi, or your active language to find matching Japanese terms.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  🗂️
                </div>
                <h4 className="text-sm font-bold text-foreground">1-Click SRS Flashcards</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Found a new word? Save it instantly to your Spaced Repetition deck for daily mastery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* State: Loading Skeletons */}
        {loading && (
          <div className="space-y-4 py-4" data-testid="loading-skeletons">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-5 rounded-3xl bg-surface border border-border animate-pulse space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-6 w-36 bg-muted rounded-lg" />
                  <div className="h-6 w-20 bg-muted rounded-lg" />
                </div>
                <div className="h-4 w-48 bg-muted rounded-md" />
                <div className="h-10 w-full bg-muted/60 rounded-xl" />
                <div className="h-12 w-full bg-muted/40 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* State: Error */}
        {error && !loading && (
          <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3 my-6">
            <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
            <button
              onClick={() => performSearch(submittedQuery)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* State: Results */}
        {!loading && submittedQuery && (
          <div className="space-y-4 py-4">
            {/* Header with count */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
              <span>
                Showing <strong>{filteredResults.length}</strong> {filteredResults.length === 1 ? 'word' : 'words'} for "<strong>{submittedQuery}</strong>"
              </span>
              <span className="hidden sm:inline">
                Localized in <strong>{currentLangName}</strong>
              </span>
            </div>

            {filteredResults.length === 0 ? (
              <div className="p-10 rounded-3xl bg-surface/60 border border-border text-center space-y-3">
                <p className="text-2xl">🔍</p>
                <h3 className="text-base font-bold text-foreground">
                  {t('dictionary.no_results_title', 'No words found')}
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {t(
                    'dictionary.no_results_desc',
                    'We couldn\'t find any matching entries. Try searching using Romaji, English meaning, or check spelling.'
                  )}
                </p>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((entry, index) => {
                  const inSRS = isCardInSRS('vocabulary', entry.id || entry.word);
                  const isSpeaking = speakingWord === entry.word;

                  return (
                    <motion.article
                      key={entry.id || `${entry.word}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
                      className="p-5 sm:p-6 rounded-3xl bg-surface border border-border hover:border-emerald-500/40 transition-all shadow-xs space-y-4 group"
                    >
                      {/* Top Row: Word + Pronunciation + Actions */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                              <FuriganaText
                                word={entry.word}
                                reading={entry.reading}
                                forceMode="always"
                                size="lg"
                                className="font-bold text-foreground font-sans tracking-wide"
                              />
                            </h2>

                            {entry.romaji && (
                              <span className="text-sm font-semibold font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md">
                                {entry.romaji}
                              </span>
                            )}
                          </div>

                          {entry.reading && entry.reading !== entry.word && (
                            <p className="text-xs font-medium text-muted-foreground font-sans">
                              Kana: {entry.reading}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Speak */}
                          <button
                            onClick={() => handleSpeak(entry.word)}
                            title="Listen pronunciation"
                            aria-label={`Pronounce ${entry.word}`}
                            className={`p-2 rounded-xl border transition-all ${
                              isSpeaking
                                ? 'bg-cyan-500 text-white border-cyan-500 scale-105'
                                : 'bg-surface hover:bg-muted text-muted-foreground hover:text-foreground border-border'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {/* Copy */}
                          <button
                            onClick={() => handleCopyWord(entry.word)}
                            title="Copy word"
                            aria-label={`Copy ${entry.word}`}
                            className="p-2 rounded-xl border border-border bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* SRS Intake Button */}
                          <button
                            onClick={() => handleAddToSRS(entry)}
                            disabled={inSRS}
                            title={inSRS ? 'Already in your SRS Review' : 'Add to SRS Review deck'}
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                              inSRS
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 cursor-default'
                                : 'bg-surface hover:bg-emerald-600 hover:text-white border-border hover:border-emerald-600 active:scale-95 text-foreground'
                            }`}
                          >
                            {inSRS ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>In Review</span>
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>+ SRS Review</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Badges: JLPT + Part of Speech + Source */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                        {entry.level && (
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold font-mono ${
                              entry.level === 'N5'
                                ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800'
                                : entry.level === 'N4'
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                                : entry.level === 'N3'
                                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                                : entry.level === 'N2'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            }`}
                          >
                            JLPT {entry.level}
                          </span>
                        )}

                        {entry.partOfSpeech && (
                          <span className="px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/80">
                            {entry.partOfSpeech}
                          </span>
                        )}

                        {entry.isCommon && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40">
                            Common
                          </span>
                        )}

                        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                          {entry.source === 'curriculum' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              ⭐ Kando Curriculum
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              🌐 Jisho Lexicon
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Meanings */}
                      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {currentLangName} Meaning
                          </span>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
                          {entry.meaning}
                        </p>
                        {effectiveLocale !== 'en' && entry.meaningEn && entry.meaningEn !== entry.meaning && (
                          <p className="text-xs text-muted-foreground pt-0.5">
                            <span className="font-semibold text-foreground/70">English:</span> {entry.meaningEn}
                          </p>
                        )}
                      </div>

                      {/* Example Sentences */}
                      {entry.examples && entry.examples.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Example Sentence</span>
                          </div>
                          <div className="space-y-2">
                            {entry.examples.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="p-3 rounded-2xl bg-surface border border-border/80 flex items-start justify-between gap-3 text-xs"
                              >
                                <div className="space-y-1">
                                  <p className="text-sm font-semibold text-foreground font-sans">{ex.jp}</p>
                                  {ex.reading && ex.reading !== ex.jp && (
                                    <p className="text-xs text-muted-foreground font-sans">{ex.reading}</p>
                                  )}
                                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 pt-0.5">
                                    {ex.translation}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleSpeak(ex.jp)}
                                  title="Listen to example sentence"
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0 mt-0.5"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* Bottom Credits */}
            <p className="text-center text-[11px] text-muted-foreground/70 pt-6">
              Online Japanese definitions and readings provided by Jisho.org & JMdict. Localized into {currentLangName} by Kando AI.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
