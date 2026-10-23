// src/pages/DictionaryPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Bidirectional Multilingual Dictionary
// Complete, responsive, smart dictionary supporting Japanese (Kanji/Kana/Romaji)
// and meaning searches localized into the user's preferred platform language.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import { useI18n, SUPPORTED_LOCALES } from '../i18n';
import { useSRSStore } from '../store/srsStore';
import { audioService } from '../services/audioService';
import { searchDictionary, DictionaryEntry } from '../api/dictionary';
import { detectSearchQuery } from '../utils/japaneseDetector';
import FuriganaText from '../components/common/FuriganaText';
import JellyStreakSlime from '../components/mascot/JellyStreakSlime';
import toast from 'react-hot-toast';

const POPULAR_SEARCHES = [
  { term: '食べる', label: '食べる (Eat)', type: 'kanji' },
  { term: '飲む', label: '飲む (Drink)', type: 'kanji' },
  { term: '水', label: '水 (Water)', type: 'kanji' },
  { term: '猫', label: '猫 (Cat)', type: 'kanji' },
  { term: 'ともだち', label: 'ともだち (Friend)', type: 'kana' },
  { term: 'ありがとう', label: 'ありがとう (Thank you)', type: 'kana' },
  { term: '美しい', label: '美しい (Beautiful)', type: 'kanji' },
  { term: '学校', label: '学校 (School)', type: 'kanji' },
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
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [sourceFilter, setSourceFilter] = useState<'all' | 'curriculum' | 'jisho'>('all');
  const [selectedJlpt, setSelectedJlpt] = useState<string>('All');
  const [selectedPos, setSelectedPos] = useState<string>('all');

  // Speaking state tracking
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Current language display name
  const currentLangName = useMemo(() => {
    const found = SUPPORTED_LOCALES.find((l) => l.code === effectiveLocale);
    return found ? found.nativeLabel || found.label : 'English';
  }, [effectiveLocale]);

  // Real-time Query Detection
  const queryDetection = useMemo(() => {
    return detectSearchQuery(query, currentLangName);
  }, [query, currentLangName]);

  // Debounce search input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute Search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      const q = searchQuery.trim();
      if (!q) {
        setResults([]);
        setSubmittedQuery('');
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setSubmittedQuery(q);

      try {
        const res = await searchDictionary(q, effectiveLocale, {
          jlpt: selectedJlpt !== 'All' ? selectedJlpt : undefined,
          pos: selectedPos !== 'all' ? selectedPos : undefined,
        });

        setResults(res.results || []);

        // Save to recent searches
        setRecentSearches((prev) => {
          const updated = [q, ...prev.filter((item) => item.toLowerCase() !== q.toLowerCase())].slice(0, 8);
          try {
            localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } catch (err: any) {
        console.error('Dictionary search error:', err);
        setError(t('dictionary.error', 'Unable to fetch dictionary results. Please check your connection.'));
      } finally {
        setLoading(false);
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

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleQuickSearch = (term: string) => {
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
  const handleSpeak = (text: string) => {
    if (!text) return;
    setSpeakingWord(text);
    audioService.speak(text);
    setTimeout(() => setSpeakingWord(null), 1400);
  };

  // SRS Deck Intake
  const handleAddToSRS = async (entry: DictionaryEntry) => {
    const cardId = entry.id || entry.word;
    const added = await addCardToSRS('vocabulary', cardId, entry.word);
    if (added) {
      toast.success(`${entry.word} added to your review deck! 🗂️`, {
        icon: '✨',
      });
    }
  };

  // Copy word
  const handleCopyWord = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Copied "${text}" to clipboard!`, { duration: 1500 });
  };

  // Filtered Results
  const filteredResults = useMemo(() => {
    return results.filter((entry) => {
      if (sourceFilter === 'curriculum' && entry.source !== 'curriculum') return false;
      if (sourceFilter === 'jisho' && entry.source === 'curriculum') return false;
      if (selectedJlpt !== 'All' && entry.level?.toUpperCase() !== selectedJlpt.toUpperCase()) return false;
      if (selectedPos !== 'all' && !entry.partOfSpeech.toLowerCase().includes(selectedPos)) return false;
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
                  className="w-full py-4 pl-3 pr-28 text-base bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden"
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
                onClick={() => setSourceFilter(f.id as any)}
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
            <div className="p-6 rounded-3xl bg-surface border border-border/60 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t('dictionary.popular_suggestions', 'Popular Words to Explore')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item.term}
                    onClick={() => handleQuickSearch(item.term)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted/60 hover:bg-emerald-500/10 hover:border-emerald-500/40 border border-transparent text-sm font-medium transition-all group"
                  >
                    <span className="font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {item.term}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.label.split('(')[1]?.replace(')', '') || ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold px-1">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    {t('dictionary.recent_searches', 'Recent Searches')}
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="hover:text-foreground underline transition-colors"
                  >
                    Clear history
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-3 py-1.5 rounded-xl bg-surface border border-border/80 hover:border-emerald-500 text-xs font-medium text-foreground transition-all shadow-2xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Educational Info Box */}
            <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-muted-foreground space-y-2">
              <div className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>How the Kando Multilingual Dictionary Works</span>
              </div>
              <p>
                • <strong>Bidirectional:</strong> Type a Japanese word (e.g. 食べる) to get definitions in {currentLangName}, or type an everyday word in {currentLangName} (e.g. eat / தண்ணீர் / खाना) to discover Japanese translations.
              </p>
              <p>
                • <strong>Curated + Global:</strong> Prioritizes verified Kando curriculum lessons first, expanding into the entire Jisho.org Japanese lexicon with instant AI localization for words outside the core curriculum.
              </p>
            </div>
          </div>
        )}

        {/* State: Loading Skeletons */}
        {loading && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground animate-pulse">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span>Searching authoritative curriculum and online lexicons…</span>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-surface border border-border/60 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-8 w-32 bg-muted rounded-lg" />
                    <div className="h-4 w-24 bg-muted/60 rounded-md" />
                  </div>
                  <div className="h-9 w-28 bg-muted rounded-xl" />
                </div>
                <div className="h-5 w-3/4 bg-muted/70 rounded-md" />
                <div className="h-14 w-full bg-muted/40 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* State: Error */}
        {error && !loading && (
          <div className="py-12 text-center space-y-3">
            <div className="text-3xl">⚠️</div>
            <h3 className="font-bold text-foreground text-base">Search Encountered an Issue</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">{error}</p>
            <button
              onClick={() => performSearch(submittedQuery)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
            >
              Retry Search
            </button>
          </div>
        )}

        {/* State: Results */}
        {!loading && !error && submittedQuery && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <div>
                Showing <strong className="text-foreground">{filteredResults.length}</strong> words matching{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  “{submittedQuery}”
                </span>
              </div>
              <span className="text-[11px]">
                Language: <strong>{currentLangName}</strong>
              </span>
            </div>

            {/* Empty Results */}
            {filteredResults.length === 0 ? (
              <div className="py-16 text-center space-y-4 rounded-3xl bg-surface border border-border/60 p-8">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-muted/50 flex items-center justify-center">
                  <JellyStreakSlime size="sm" mood="sleepy" animated={false} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">
                    No Japanese words found for “{submittedQuery}”
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Try checking the spelling, searching by Hiragana reading, or searching in English / {currentLangName}.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            ) : (
              /* Word Cards List */
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredResults.map((entry, index) => {
                    const inDeck = isCardInSRS(entry.id || entry.word);
                    const isSpeaking = speakingWord === entry.word;

                    return (
                      <motion.article
                        key={`${entry.id}-${index}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
                        className="rounded-3xl bg-surface border border-border/70 hover:border-emerald-500/40 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                      >
                        {/* Word Top Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            {/* Furigana Display */}
                            <div className="flex items-baseline gap-3 flex-wrap">
                              <FuriganaText
                                word={entry.word}
                                reading={entry.reading}
                                size="xl"
                                className="font-black text-foreground tracking-tight"
                              />

                              {/* Reading Kana if word is Kanji */}
                              {entry.reading && entry.reading !== entry.word && (
                                <span className="text-base text-muted-foreground font-medium font-sans">
                                  ({entry.reading})
                                </span>
                              )}
                            </div>

                            {/* Romaji Pronunciation */}
                            {entry.romaji && (
                              <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                🔤 {entry.romaji}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Audio pronunciation */}
                            <button
                              onClick={() => handleSpeak(entry.word)}
                              title="Listen to Japanese pronunciation"
                              aria-label={`Listen to ${entry.word}`}
                              className={`p-2.5 rounded-2xl border transition-all ${
                                isSpeaking
                                  ? 'bg-emerald-500 text-white border-emerald-500 scale-105'
                                  : 'bg-muted/50 hover:bg-muted border-border text-foreground'
                              }`}
                            >
                              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                            </button>

                            {/* Copy Word */}
                            <button
                              onClick={() => handleCopyWord(entry.word)}
                              title="Copy Japanese word"
                              aria-label={`Copy ${entry.word}`}
                              className="p-2.5 rounded-2xl border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Add to SRS Review Deck */}
                            <button
                              onClick={() => handleAddToSRS(entry)}
                              title={inDeck ? 'In your review deck' : 'Add to SRS review deck'}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all ${
                                inDeck
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-surface border-border hover:border-emerald-500 text-foreground hover:bg-emerald-500/5'
                              }`}
                            >
                              {inDeck ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>In Deck</span>
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

                        {/* Badges Bar (JLPT, Part of Speech, Common, Source) */}
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

                        {/* Localized Definition in Preferred Platform Language */}
                        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {currentLangName} Meaning
                            </span>
                          </div>
                          <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
                            {entry.meaning}
                          </p>

                          {/* Secondary English definition if user's language is Tamil/Hindi */}
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
                                    <p className="text-sm font-semibold text-foreground font-sans">
                                      {ex.jp}
                                    </p>
                                    {ex.reading && ex.reading !== ex.jp && (
                                      <p className="text-xs text-muted-foreground font-sans">
                                        {ex.reading}
                                      </p>
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
                </AnimatePresence>

                {/* Attribution note */}
                <p className="text-center text-[11px] text-muted-foreground/70 pt-6">
                  Online Japanese definitions and readings provided by Jisho.org & JMdict. Localized into {currentLangName} by Kando AI.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
