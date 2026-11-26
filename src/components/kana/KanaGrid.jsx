import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Volume2, BookmarkPlus, Check, Star } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useSRSStore } from '../../store/srsStore';

const GROUP_META = {
  gojuon: { title: 'Gojūon · 五十音', subtitle: 'Basic Kana Syllabary' },
  dakuon: { title: 'Dakuon · 濁音', subtitle: 'Voiced Consonants (゛)' },
  handakuon: { title: 'Handakuon · 半濁音', subtitle: 'Semi-Voiced Consonants (゜)' },
  yoon: { title: 'Yōon · 拗音', subtitle: 'Contracted Sounds (Horizontal Triplets)' },
};

const ROW_LABELS = {
  a: 'a-row (あ行)',
  ka: 'ka-row (か行)',
  sa: 'sa-row (さ行)',
  ta: 'ta-row (た行)',
  na: 'na-row (な行)',
  ha: 'ha-row (は行)',
  ma: 'ma-row (ま行)',
  ya: 'ya-row (や行)',
  ra: 'ra-row (ら行)',
  wa: 'wa-row (わ行)',
  ga: 'ga-row (が行)',
  za: 'za-row (ざ行)',
  da: 'da-row (だ行)',
  ba: 'ba-row (ば行)',
  pa: 'pa-row (ぱ行)',
  kya: 'KYA · きゃ行',
  gya: 'GYA · ぎゃ行',
  sha: 'SHA · しゃ行',
  ja: 'JA · じゃ行',
  cha: 'CHA · ちゃ行',
  dya: 'DYA · ぢゃ行',
  nya: 'NYA · にゃ行',
  hya: 'HYA · ひゃ行',
  bya: 'BYA · びゃ行',
  pya: 'PYA · ぴゃ行',
  mya: 'MYA · みゃ行',
  rya: 'RYA · りゃ行',
};

export default function KanaGrid({
  kanaList = [],
  selectedKana = null,
  onSelectKana,
  masteryMap = {},
  isDark: _isDark = false,
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

  // Group items cleanly by kana group -> horizontal consonant row
  const groupedSections = useMemo(() => {
    if (!kanaList || kanaList.length === 0) return [];

    const groupOrder = ['gojuon', 'dakuon', 'handakuon', 'yoon'];
    const sections = [];

    for (const grp of groupOrder) {
      const grpItems = kanaList.filter((k) => k.group === grp);
      if (grpItems.length === 0) continue;

      const rowsMap = new Map();
      for (const item of grpItems) {
        const rowKey = item.row || 'other';
        if (!rowsMap.has(rowKey)) rowsMap.set(rowKey, []);
        rowsMap.get(rowKey).push(item);
      }

      sections.push({
        group: grp,
        meta: GROUP_META[grp] || { title: grp, subtitle: '' },
        rows: Array.from(rowsMap.entries()).map(([rowKey, items]) => ({
          rowKey,
          label: ROW_LABELS[rowKey] || rowKey.toUpperCase(),
          items,
        })),
      });
    }

    // Fallback for any ungrouped items
    const knownGroups = new Set(groupOrder);
    const otherItems = kanaList.filter((k) => !knownGroups.has(k.group));
    if (otherItems.length > 0) {
      sections.push({
        group: 'other',
        meta: { title: 'Kana Characters', subtitle: '' },
        rows: [{ rowKey: 'other', label: '', items: otherItems }],
      });
    }

    return sections;
  }, [kanaList]);

  if (!kanaList || kanaList.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No kana found matching current filter.</p>
      </div>
    );
  }

  const renderKanaCard = (item) => {
    const isSelected = selectedKana?.id === item.id;
    const inSRS = isCardInSRS(item.id) || isCardInSRS(item.kana);
    const stats = masteryMap[item.id] || { correct: 0, mastered: false };
    const isMastered = stats.mastered;

    return (
      <motion.div
        key={item.id}
        layout
        whileHover={{ y: -2, scale: 1.02 }}
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
        className={`relative group rounded-xl border transition-all cursor-pointer p-2.5 flex flex-col items-center justify-between min-h-[98px] select-none outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isSelected
            ? 'bg-primary text-primary-foreground border-primary shadow-md'
            : isMastered
            ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-sm'
            : 'bg-surface border-border hover:border-primary/40 hover:shadow-sm'
        }`}
      >
        {/* Top badges: SRS indicator & Mastered star */}
        <div className="w-full flex items-center justify-between text-xs min-h-[14px]">
          {inSRS ? (
            <span
              title="In SRS Review Deck"
              className={`w-2 h-2 rounded-full ${
                isSelected ? 'bg-amber-300' : 'bg-amber-500'
              } shadow-2xs`}
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
              item.group === 'yoon' ? 'text-2xl sm:text-[26px]' : 'text-3xl sm:text-[32px]'
            } ${isSelected ? 'text-white' : 'text-foreground'}`}
          >
            {item.kana}
          </span>
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider block mt-1.5 ${
              isSelected ? 'text-white/90' : 'text-muted-foreground'
            }`}
          >
            {item.romaji}
          </span>
        </div>

        {/* Bottom quick actions */}
        <div className={`w-full flex items-center justify-between pt-1 border-t ${isSelected ? 'border-white/20' : 'border-border/50'}`}>
          <button
            type="button"
            onClick={(e) => handleSpeak(e, item.kana)}
            title={`Listen to ${item.romaji}`}
            aria-label={`Listen to ${item.romaji}`}
            className={`p-1 rounded-md transition-colors ${
              isSelected
                ? 'text-white/85 hover:text-white hover:bg-white/20'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => handleToggleSRS(e, item)}
            title={inSRS ? 'In SRS deck' : 'Add to SRS'}
            aria-label={inSRS ? 'In SRS deck' : 'Add to SRS'}
            className={`p-1 rounded-md transition-colors ${
              isSelected
                ? 'text-white/85 hover:text-white hover:bg-white/20'
                : inSRS
                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10'
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
  };

  return (
    <div className="space-y-8">
      {groupedSections.map(({ group, meta, rows }) => {
        const isYoon = group === 'yoon';
        return (
          <section key={group} className="space-y-3.5">
            {/* Section Title Header */}
            <div className="flex items-baseline justify-between gap-2 pb-1.5 border-b border-border/60">
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-sm font-bold text-foreground font-japanese">{meta.title}</h2>
                {meta.subtitle && (
                  <span className="text-xs text-muted-foreground">{meta.subtitle}</span>
                )}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground font-mono tabular-nums">
                {rows.reduce((acc, r) => acc + r.items.length, 0)} chars
              </span>
            </div>

            {isYoon ? (
              /* Yōon (Contracted Sounds): Strict horizontal 3-card triplet rows (→) side-by-side */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {rows.map((row) => (
                  <div
                    key={row.rowKey}
                    className="p-3 rounded-2xl border border-border/80 bg-surface-muted/35 space-y-2"
                  >
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {row.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70 font-mono">→</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {row.items.map((item) => renderKanaCard(item))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Standard 5-vowel Gojūon / Dakuon / Handakuon: Clean horizontal rows (→) */
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
                {rows.map((row) => (
                  <div
                    key={row.rowKey}
                    className="p-2.5 sm:p-3 rounded-2xl border border-border/70 bg-surface-muted/30 space-y-2"
                  >
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-japanese">
                        {row.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {row.items.map((item) => renderKanaCard(item))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
