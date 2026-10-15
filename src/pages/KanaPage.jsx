import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Swords,
  PenTool,
  BookmarkCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  Star,
  ChevronRight,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { useSRSStore } from '../store/srsStore';
import {
  ALL_KANA,
  getKanaByScript,
  getKanaByGroup,
} from '../data/kana/kanaData';
import KanaGrid from '../components/kana/KanaGrid';
import KanaDetailModal from '../components/kana/KanaDetailModal';
import KanaQuiz from '../components/kana/KanaQuiz';
import KanaTracingCanvas from '../components/kana/KanaTracingCanvas';
import KanaSenseiGuide from '../components/kana/KanaSenseiGuide';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n';

const STORAGE_KEY_PREFIX = 'nihongo_kana_mastery_';

export default function KanaPage() {
  const { t } = useI18n();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const user = useAuthStore((s) => s.user);
  const awardKanaXP = useProgressStore((s) => s.awardKanaXP);
  const srsDueCount = useProgressStore((s) => s.srsReviewsDue);
  const { isCardInSRS, initSRSDeck } = useSRSStore();

  // Active Script & Sub-navigation
  const [script, setScript] = useState('hiragana'); // 'hiragana' | 'katakana'
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'quiz' | 'tracing' | 'guide'
  const [groupFilter, setGroupFilter] = useState('all'); // 'all' | 'gojuon' | 'dakuon' | 'handakuon' | 'yoon' | 'mastered' | 'srs'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Characters
  const [selectedKana, setSelectedKana] = useState(null);
  const [tracingKana, setTracingKana] = useState(null);

  // Mastery state map: { [id: string]: { correct: number, mastered: boolean, lastStudied: string } }
  const storageKey = `${STORAGE_KEY_PREFIX}${user?.id || 'guest'}`;
  const [masteryMap, setMasteryMap] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save mastery map to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(masteryMap));
    } catch (e) {
      console.warn('Could not save kana mastery state:', e);
    }
  }, [masteryMap, storageKey]);

  // Sync SRS deck on mount
  useEffect(() => {
    initSRSDeck();
  }, [initSRSDeck]);

  // Characters for active script
  const scriptKanaList = useMemo(() => {
    return getKanaByScript(script);
  }, [script]);

  // Filtered kana list for explorer
  const filteredKanaList = useMemo(() => {
    let list = scriptKanaList;

    if (groupFilter !== 'all') {
      if (groupFilter === 'mastered') {
        list = list.filter((k) => masteryMap[k.id]?.mastered);
      } else if (groupFilter === 'srs') {
        list = list.filter((k) => isCardInSRS(k.id) || isCardInSRS(k.kana));
      } else {
        list = list.filter((k) => k.group === groupFilter);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (k) =>
          k.kana.includes(q) ||
          k.romaji.toLowerCase().includes(q) ||
          k.examples?.some(
            (ex) =>
              ex.word.includes(q) ||
              ex.reading.toLowerCase().includes(q) ||
              ex.meaning.toLowerCase().includes(q)
          )
      );
    }

    return list;
  }, [scriptKanaList, groupFilter, searchQuery, masteryMap, isCardInSRS]);

  // Calculate script progress
  const scriptStats = useMemo(() => {
    const total = scriptKanaList.length;
    const mastered = scriptKanaList.filter((k) => masteryMap[k.id]?.mastered).length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, percent };
  }, [scriptKanaList, masteryMap]);

  // Toggle mastery for a character (idempotent XP)
  const handleToggleMastery = useCallback(
    (kanaId) => {
      setMasteryMap((prev) => {
        const current = prev[kanaId] || { correct: 0, mastered: false };
        const newMastered = !current.mastered;

        if (newMastered) {
          toast.success('Kana marked as Mastered! ⭐');
          if (user?.id) {
            awardKanaXP(user.id, kanaId, true);
          }
        }

        return {
          ...prev,
          [kanaId]: {
            ...current,
            mastered: newMastered,
            lastStudied: new Date().toISOString(),
          },
        };
      });
    },
    [user, awardKanaXP]
  );

  // Handle quiz session completion (increment correct encounters & apply mastery rule)
  const handleQuizCompletion = useCallback(
    ({ score, total, answers }) => {
      setMasteryMap((prev) => {
        const updated = { ...prev };
        let newMasteredCount = 0;

        answers.forEach((ans) => {
          const id = ans.question.item.id;
          const curr = updated[id] || { correct: 0, mastered: false };

          if (ans.isCorrect) {
            const nextCorrect = curr.correct + 1;
            // Pedagogical Mastery Rule: 3 correct encounters achieves mastery
            const becameMastered = !curr.mastered && nextCorrect >= 3;

            updated[id] = {
              correct: nextCorrect,
              mastered: curr.mastered || becameMastered,
              lastStudied: new Date().toISOString(),
            };

            if (becameMastered) {
              newMasteredCount++;
              if (user?.id) {
                awardKanaXP(user.id, id, true);
              }
            }
          }
        });

        if (newMasteredCount > 0) {
          toast.success(
            `Mastered ${newMasteredCount} new kana through quiz practice! 🎉`
          );
        }

        return updated;
      });
    },
    [user, awardKanaXP]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Top Header & Script Selector ──────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Beginner Japanese Foundations
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t('kana.title', 'Kana Foundations Studio')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {t('kana.subtitle', 'Master the core Japanese writing system. Learn Hiragana and Katakana through active recognition, pronunciation, stroke order, and spaced repetition.')}
          </p>
        </div>

        {/* Script Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-muted/60 border border-border shrink-0">
          <button
            onClick={() => setScript('hiragana')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              script === 'hiragana'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="font-japanese text-lg">あ</span>
            Hiragana ひらがな
          </button>

          <button
            onClick={() => setScript('katakana')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              script === 'katakana'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="font-japanese text-lg">ア</span>
            Katakana カタカナ
          </button>
        </div>
      </div>

      {/* ── Progress Bar & Quick Stats ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mastery Progress Card */}
        <div className="md:col-span-2 p-5 rounded-3xl border border-border bg-surface flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {script === 'hiragana' ? 'Hiragana' : 'Katakana'} Mastery
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-foreground">
                  {scriptStats.mastered} / {scriptStats.total}
                </span>
                <span className="text-xs text-muted-foreground">
                  characters mastered ({scriptStats.percent}%)
                </span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Star className="w-6 h-6 fill-current" />
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${scriptStats.percent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* SRS Integration Badge Card */}
        <div className="p-5 rounded-3xl border border-border bg-surface flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Spaced Repetition
            </span>
            <BookmarkCheck className="w-5 h-5 text-amber-500" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add difficult characters to your SRS deck to schedule automated retention reviews.
            </p>
          </div>

          <Link
            to="/review"
            className="inline-flex items-center justify-between w-full p-2.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition-colors"
          >
            <span>Review SRS Deck ({srsDueCount || 0} due)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Studio Navigation Tabs ───────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {[
          { id: 'explorer', label: t('kana.tab_explorer', 'Character Explorer'), icon: Layers },
          { id: 'quiz', label: t('kana.tab_quiz', 'Recognition Quiz'), icon: Swords },
          { id: 'tracing', label: t('kana.tab_tracing', 'Stroke Tracing'), icon: PenTool },
          { id: 'guide', label: t('kana.tab_guide', "Hana's Guide & Mnemonics"), icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* TAB 1: EXPLORER */}
        {activeTab === 'explorer' && (
          <motion.div
            key="explorer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Filter Pills & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: t('kana.filter_all', 'All') },
                  { id: 'gojuon', label: t('kana.filter_gojuon', 'Gojūon (46)') },
                  { id: 'dakuon', label: t('kana.filter_dakuten', 'Dakuon (20)') },
                  { id: 'handakuon', label: t('kana.filter_handakuten', 'Handakuon (5)') },
                  { id: 'yoon', label: t('kana.filter_combo', 'Yōon (36)') },
                  { id: 'mastered', label: `${t('common.mastered', 'Mastered')} ⭐` },
                  { id: 'srs', label: `${t('common.in_srs', 'In SRS')} 🗂️` },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setGroupFilter(pill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      groupFilter === pill.id
                        ? 'bg-foreground text-background'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('common.search', 'Search kana, romaji, word...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Kana Grid Component */}
            <KanaGrid
              kanaList={filteredKanaList}
              selectedKana={selectedKana}
              onSelectKana={(item) => setSelectedKana(item)}
              masteryMap={masteryMap}
              isDark={isDark}
            />
          </motion.div>
        )}

        {/* TAB 2: RECOGNITION QUIZ */}
        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <KanaQuiz
              kanaList={scriptKanaList}
              script={script}
              onCompleteQuiz={handleQuizCompletion}
            />
          </motion.div>
        )}

        {/* TAB 3: TRACING CANVAS */}
        {activeTab === 'tracing' && (
          <motion.div
            key="tracing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Quick character selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs font-bold uppercase text-muted-foreground shrink-0 pr-2">
                Select Character:
              </span>
              {scriptKanaList.slice(0, 46).map((k) => (
                <button
                  key={k.id}
                  onClick={() => setTracingKana(k)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-japanese font-bold transition-all shrink-0 ${
                    (tracingKana?.id || scriptKanaList[0]?.id) === k.id
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-muted/40 border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {k.kana}
                </button>
              ))}
            </div>

            <KanaTracingCanvas
              kana={tracingKana || scriptKanaList[0]}
              isDark={isDark}
              onCompletePractice={(k) => handleToggleMastery(k.id)}
            />
          </motion.div>
        )}

        {/* TAB 4: HANA-SENSEI GUIDE */}
        {activeTab === 'guide' && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <KanaSenseiGuide
              onStartQuiz={() => setActiveTab('quiz')}
              onSelectScript={(s) => setScript(s)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Character Deep Dive Modal ────────────────────────── */}
      {selectedKana && (
        <KanaDetailModal
          kana={selectedKana}
          onClose={() => setSelectedKana(null)}
          onOpenTracing={(k) => {
            setTracingKana(k);
            setActiveTab('tracing');
          }}
          masteryStats={masteryMap[selectedKana.id]}
          onToggleMastery={handleToggleMastery}
        />
      )}
    </div>
  );
}
