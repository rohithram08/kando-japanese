import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, BookmarkPlus, Check, Star } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useSRSStore } from '../../store/srsStore';

export default function KanaGrid({
  kanaList = [],
  selectedKana = null,
  onSelectKana,
  masteryMap = {},
  isDark = false,
}) {
  const { isCardInSRS, addCardToSRS } = useSRSStore();

  const handleSpeak = (e, text) => {
    e.stopPropagation();
    audioService.speak(text);
  };

  const handleToggleSRS = (e, item) => {
    e.stopPropagation();
    addCardToSRS('kana', item.id, item.kana);
  };

  if (!kanaList || kanaList.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No kana found matching current filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5 sm:gap-3">
      {kanaList.map((item) => {
        const isSelected = selectedKana?.id === item.id;
        const inSRS = isCardInSRS(item.id) || isCardInSRS(item.kana);
        const stats = masteryMap[item.id] || { correct: 0, mastered: false };
        const isMastered = stats.mastered;

        return (
          <motion.div
            key={item.id}
            layout
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectKana(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectKana(item);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`${item.kana}, pronounced ${item.romaji}`}
            className={`relative group rounded-2xl border transition-all cursor-pointer p-3 flex flex-col items-center justify-between min-h-[105px] select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
              isSelected
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20 scale-[1.03]'
                : isMastered
                ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-md'
                : 'bg-surface border-border hover:border-purple-300 dark:hover:border-purple-700/60 hover:shadow-md'
            }`}
          >
            {/* Top badges: SRS indicator & Mastered star */}
            <div className="w-full flex items-center justify-between text-xs">
              {inSRS ? (
                <span
                  title="In SRS Review Deck"
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-amber-300' : 'bg-amber-500'
                  } shadow-sm`}
                />
              ) : (
                <span className="w-2 h-2" />
              )}

              {isMastered && (
                <span title="Mastered Kana" className="flex items-center">
                  <Star
                    className={`w-3.5 h-3.5 fill-current ${
                      isSelected ? 'text-amber-300' : 'text-amber-500'
                    }`}
                  />
                </span>
              )}
            </div>

            {/* Main Kana character */}
            <div className="my-0.5 text-center">
              <span
                className={`font-japanese font-bold transition-transform group-hover:scale-105 block leading-none ${
                  item.group === 'yoon' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
                } ${isSelected ? 'text-white' : 'text-foreground'}`}
              >
                {item.kana}
              </span>
              <span
                className={`text-xs font-semibold uppercase tracking-wider block mt-1 ${
                  isSelected ? 'text-purple-100' : 'text-muted-foreground'
                }`}
              >
                {item.romaji}
              </span>
            </div>

            {/* Bottom quick actions */}
            <div className="w-full flex items-center justify-between pt-1 border-t border-border/50">
              <button
                type="button"
                onClick={(e) => handleSpeak(e, item.kana)}
                title={`Listen to ${item.romaji}`}
                aria-label={`Listen to ${item.romaji}`}
                className={`p-1 rounded-lg transition-colors ${
                  isSelected
                    ? 'text-white/80 hover:text-white hover:bg-white/20'
                    : 'text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => handleToggleSRS(e, item)}
                title={inSRS ? 'In SRS deck' : 'Add to SRS'}
                aria-label={inSRS ? 'In SRS deck' : 'Add to SRS'}
                className={`p-1 rounded-lg transition-colors ${
                  isSelected
                    ? 'text-white/80 hover:text-white hover:bg-white/20'
                    : inSRS
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                    : 'text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                {inSRS ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <BookmarkPlus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
