// src/components/listening/ListeningDownContainer.tsx
import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import type { ListeningWord } from '../../api/listening';
import { speakJapaneseLine } from '../../utils/jlptAudio';

interface ListeningDownContainerProps {
  vocabulary: ListeningWord[];
  onWordVerified?: (wordId: string) => void;
}

export const ListeningDownContainer: React.FC<ListeningDownContainerProps> = ({
  vocabulary,
  onWordVerified,
}) => {
  const [activeTab, setActiveTab] = useState<'ear_test' | 'bank'>('ear_test');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [showFurigana, setShowFurigana] = useState(true);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleChecked = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (onWordVerified) onWordVerified(id);
      }
      return next;
    });
  };

  const handlePronounce = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakJapaneseLine({ text: word, rate: 0.85 });
  };

  const revealAll = () => {
    setRevealedIds(new Set(vocabulary.map((v) => v.id)));
  };

  const hideAll = () => {
    setRevealedIds(new Set());
  };

  return (
    <section className="mt-8 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-lg overflow-hidden">
      {/* Down Container Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-primary/10 via-background to-primary/5 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary grid place-items-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              Listening Words & Hearing Check
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                {checkedIds.size} / {vocabulary.length} Heard
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Verify what you heard in the conversation and check pitch accents and definitions.
            </p>
          </div>
        </div>

        {/* Tab & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-muted/60 p-1 rounded-xl border border-border/50 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('ear_test')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'ear_test'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              👂 Ear Test Mode
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'bank'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📖 Vocab Bank
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowFurigana((v) => !v)}
            className="px-2.5 py-1.5 rounded-lg border border-border/70 text-xs font-semibold text-muted-foreground hover:text-foreground bg-background/60"
            title="Toggle furigana reading"
          >
            {showFurigana ? 'ふりがな: ON' : 'ふりがな: OFF'}
          </button>
        </div>
      </div>

      {/* Mode Sub-banner */}
      {activeTab === 'ear_test' && (
        <div className="px-5 py-2.5 bg-muted/30 border-b border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            Listen to the audio, guess the word, then tap to reveal and verify your hearing!
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={revealAll}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              Reveal All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={hideAll}
              className="text-[11px] font-bold text-muted-foreground hover:underline"
            >
              Hide All
            </button>
          </div>
        </div>
      )}

      {/* Vocabulary Cards Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {vocabulary.map((item) => {
          const isRevealed = activeTab === 'bank' || revealedIds.has(item.id);
          const isChecked = checkedIds.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => activeTab === 'ear_test' && toggleReveal(item.id)}
              className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isChecked
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-card hover:bg-muted/40 border-border/70'
              } shadow-xs`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {/* Word and Reading */}
                  <div className="flex items-baseline gap-2">
                    {isRevealed ? (
                      <>
                        <h4 className="font-extrabold text-lg text-foreground tracking-wide">
                          {item.word}
                        </h4>
                        {showFurigana && (
                          <span className="text-xs font-semibold text-primary/90">
                            【{item.reading}】
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 py-0.5">
                        <span className="font-mono text-base font-bold text-muted-foreground/60 tracking-widest">
                          •••••••
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                          Tap to check
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Romaji */}
                  {isRevealed && (
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {item.romaji}
                    </p>
                  )}
                </div>

                {/* Pronounce & Check action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handlePronounce(item.word, e)}
                    className="p-1.5 rounded-lg bg-muted hover:bg-primary/20 text-foreground hover:text-primary transition-all"
                    title="Listen to native pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => toggleChecked(item.id, e)}
                    className={`p-1.5 rounded-lg transition-all ${
                      isChecked
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-muted/60 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10'
                    }`}
                    title={isChecked ? 'Marked as heard' : 'Mark as heard in audio'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pitch accent & part of speech pills */}
              {isRevealed && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/20">
                    {item.pitchAccent}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {item.partOfSpeech}
                  </span>
                </div>
              )}

              {/* English Meaning & Sample */}
              {isRevealed ? (
                <div className="mt-2 pt-2 border-t border-border/40">
                  <p className="text-xs font-semibold text-foreground/90">{item.meaning}</p>
                  {item.exampleSentenceJa && (
                    <div className="mt-1.5 text-[11px] text-muted-foreground">
                      <p className="font-medium text-foreground/80">{item.exampleSentenceJa}</p>
                      <p className="text-muted-foreground/75 mt-0.5">{item.exampleSentenceEn}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="italic">Definition hidden</span>
                  <Eye className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
