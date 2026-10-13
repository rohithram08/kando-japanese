import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  Tv,
  ExternalLink,
  Search,
  Sparkles,
  BookOpen,
  Filter,
  Radio,
  Layers,
  X,
  CheckCircle2,
} from 'lucide-react';
import { DRAMA_RESOURCES } from '../../data/dramaResources';
import { useThemeStore } from '../../store/themeStore';
import ListeningVideoModal from './ListeningVideoModal';

const LEVEL_TABS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

export default function DramaPlayer() {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return DRAMA_RESOURCES.filter((res) => {
      // Category filter
      if (activeCategory !== 'all' && res.category !== activeCategory) {
        return false;
      }
      // Level filter
      if (activeLevel !== 'All' && res.level !== activeLevel && res.level !== 'All Levels') {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = res.title.toLowerCase().includes(query);
        const matchesTitleJp = res.titleJp?.toLowerCase().includes(query);
        const matchesHost = res.hostOrChannel.toLowerCase().includes(query);
        const matchesDesc = res.description.toLowerCase().includes(query);
        const matchesPurpose = res.learningPurpose.toLowerCase().includes(query);
        const matchesTags = res.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesTitleJp || matchesHost || matchesDesc || matchesPurpose || matchesTags;
      }
      return true;
    });
  }, [activeCategory, activeLevel, searchQuery]);

  const podcastCount = useMemo(() => DRAMA_RESOURCES.filter((r) => r.category === 'podcast').length, []);
  const youtubeCount = useMemo(() => DRAMA_RESOURCES.filter((r) => r.category === 'youtube').length, []);

  const clearFilters = () => {
    setActiveCategory('all');
    setActiveLevel('All');
    setSearchQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 px-2 sm:px-4">
      {/* ── Header Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-500/10 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide">
            <Radio className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
            <span>Immersion & Listening Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            🎙️ Japanese Podcasts & Listening
          </h1>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed">
            Curated, high-yield Japanese audio immersion resources. From absolute beginner comprehensible input to advanced cultural podcasts and native conversational breakdowns.
          </p>
        </div>
      </motion.div>

      {/* ── Filter Bar & Search ── */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCategory === 'all'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-muted hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-4 h-4" />
              All Resources ({DRAMA_RESOURCES.length})
            </button>
            <button
              onClick={() => setActiveCategory('podcast')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCategory === 'podcast'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-muted hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Headphones className="w-4 h-4" />
              Podcasts ({podcastCount})
            </button>
            <button
              onClick={() => setActiveCategory('youtube')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCategory === 'youtube'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-muted hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Tv className="w-4 h-4" />
              YouTube Channels ({youtubeCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, host, or keyword..."
              className="w-full pl-9 pr-8 py-2 bg-muted/60 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/60 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Level:
          </span>
          {LEVEL_TABS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                activeLevel === lvl
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-bold border border-red-500/30'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* ── Resource Cards Grid ── */}
      {filteredResources.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-card border border-border rounded-3xl p-8 space-y-4 shadow-sm"
        >
          <div className="text-5xl">🔍</div>
          <h3 className="text-xl font-bold text-foreground">No resources found</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We couldn't find any listening resources matching your current filters. Try changing your search query or level selection.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((res, index) => {
              const isPodcast = res.category === 'podcast';
              return (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-red-500/30 transition-all group"
                >
                  <div className="space-y-3">
                    {/* Card Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isPodcast
                              ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20'
                              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20'
                          }`}
                        >
                          {isPodcast ? <Headphones className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                          {isPodcast ? 'Podcast' : 'YouTube'}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-muted text-muted-foreground border border-border">
                          {res.levelBadge}
                        </span>
                      </div>

                      {res.recommended && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/20">
                          <Sparkles className="w-3 h-3" />
                          Top Pick
                        </span>
                      )}
                    </div>

                    {/* Title & Host */}
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-red-500 transition-colors">
                        {res.title}
                      </h3>
                      {res.titleJp && (
                        <p className="text-xs text-muted-foreground font-medium">
                          {res.titleJp}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">
                        Host / Channel: {res.hostOrChannel}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {res.description}
                    </p>

                    {/* Learning Purpose */}
                    <div className="bg-muted/40 rounded-xl p-2.5 border border-border/50 text-xs space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
                        <BookOpen className="w-3 h-3 text-red-500" />
                        Learning Objective:
                      </span>
                      <p className="text-muted-foreground text-[11px] leading-normal">
                        {res.learningPurpose}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {res.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-muted/60 text-[10px] text-muted-foreground font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 mt-3 border-t border-border/60">
                    <button
                      onClick={() => setSelectedResource(res)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        isPodcast
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/10'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/10'
                      }`}
                    >
                      {isPodcast ? <Headphones className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
                      <span>Open {isPodcast ? 'Podcast' : 'Channel'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── Listening Video Modal ── */}
      <ListeningVideoModal
        isOpen={!!selectedResource}
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
}
