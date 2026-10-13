import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, BookmarkPlus, BookmarkCheck, X, Zap, ExternalLink } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import { useProgressStore } from "../../store/progressStore";

// Vocab word data structure
// { word, reading, meaning, partOfSpeech, jlptLevel, saved }

const JLPT_COLORS = {
  N5: "bg-green-500/20 text-green-400 border-green-500/30",
  N4: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  N3: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  N2: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  N1: "bg-red-500/20 text-red-400 border-red-500/30",
};

const POS_LABELS = {
  noun: "名詞",
  verb: "動詞",
  adjective: "形容詞",
  adverb: "副詞",
  particle: "助詞",
  expression: "表現",
};

const VocabHighlight = ({
  subtitle = "",
  vocabList = [],
  onSaveWord,
  onStudyWord,
  highlightAll = false,
}) => {
  const { playAudio } = useAudio();
  const { addXP } = useProgressStore();

  const [activeWord, setActiveWord] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [savedWords, setSavedWords] = useState(new Set());
  const [recentlySaved, setRecentlySaved] = useState(null);
  const containerRef = useRef(null);
  const popupRef = useRef(null);

  // Build a map for quick word lookup
  const vocabMap = vocabList.reduce((acc, v) => {
    acc[v.word] = v;
    return acc;
  }, {});

  // Close popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !e.target.closest("[data-vocab-word]")
      ) {
        setActiveWord(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Tokenize subtitle into segments (highlighted vocab + plain text)
  const tokenizeSubtitle = (text) => {
    if (!text) return [];
    const segments = [];
    let remaining = text;
    let offset = 0;

    // Sort vocab by length (longest first) to avoid partial matches
    const sortedVocab = Object.keys(vocabMap).sort(
      (a, b) => b.length - a.length
    );

    while (remaining.length > 0) {
      let found = false;

      for (const word of sortedVocab) {
        if (remaining.startsWith(word)) {
          segments.push({
            type: "vocab",
            text: word,
            vocab: vocabMap[word],
            index: offset,
          });
          remaining = remaining.slice(word.length);
          offset += word.length;
          found = true;
          break;
        }
      }

      if (!found) {
        // Add plain character
        const lastSeg = segments[segments.length - 1];
        if (lastSeg?.type === "plain") {
          lastSeg.text += remaining[0];
        } else {
          segments.push({ type: "plain", text: remaining[0] });
        }
        remaining = remaining.slice(1);
        offset += 1;
      }
    }

    return segments;
  };

  const handleWordClick = (e, segment) => {
    e.stopPropagation();
    if (activeWord?.word === segment.text) {
      setActiveWord(null);
      return;
    }

    const rect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    let x = rect.left - (containerRect?.left || 0);
    let y = rect.top - (containerRect?.top || 0) - 10;

    // Prevent popup going off right edge
    const popupWidth = 280;
    const containerWidth = containerRect?.width || window.innerWidth;
    if (x + popupWidth > containerWidth) {
      x = containerWidth - popupWidth - 8;
    }

    setActiveWord({ ...segment.vocab, word: segment.text });
    setPopupPos({ x, y });
  };

  const handleSaveWord = (vocab) => {
    const newSaved = new Set(savedWords);
    if (savedWords.has(vocab.word)) {
      newSaved.delete(vocab.word);
    } else {
      newSaved.add(vocab.word);
      addXP(5);
      setRecentlySaved(vocab.word);
      setTimeout(() => setRecentlySaved(null), 2000);
    }
    setSavedWords(newSaved);
    onSaveWord?.(vocab, !savedWords.has(vocab.word));
  };

  const segments = tokenizeSubtitle(subtitle);

  return (
    <div ref={containerRef} className="relative">
      {/* Subtitle Text with Highlights */}
      <div className="text-center leading-relaxed">
        <p className="text-lg text-white font-medium inline">
          {segments.map((seg, i) => {
            if (seg.type === "plain") {
              return <span key={i}>{seg.text}</span>;
            }

            const isActive = activeWord?.word === seg.text;
            const isSaved = savedWords.has(seg.text);
            const jlptLevel = seg.vocab?.jlptLevel;

            return (
              <motion.span
                key={i}
                data-vocab-word
                whileHover={{ scale: 1.05 }}
                onClick={(e) => handleWordClick(e, seg)}
                className={`relative inline-block cursor-pointer rounded px-0.5 mx-0.5 transition-all ${
                  isActive
                    ? "bg-yellow-500/30 text-yellow-300 underline decoration-yellow-400 underline-offset-2"
                    : isSaved
                    ? "bg-green-500/20 text-green-300 underline decoration-green-400 underline-offset-2 decoration-dotted"
                    : highlightAll
                    ? "bg-blue-500/10 text-blue-200 underline decoration-blue-400/50 underline-offset-2 decoration-dotted"
                    : "text-yellow-300 underline decoration-yellow-400/60 underline-offset-2 decoration-dotted hover:bg-yellow-500/20"
                }`}
              >
                {seg.text}
                {isSaved && (
                  <span className="absolute -top-1.5 -right-1 text-[8px] text-green-400">
                    ✓
                  </span>
                )}
              </motion.span>
            );
          })}
        </p>
      </div>

      {/* Vocab Popup */}
      <AnimatePresence>
        {activeWord && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              left: popupPos.x,
              bottom: `calc(100% - ${popupPos.y}px + 8px)`,
              zIndex: 50,
              width: 280,
            }}
            className="bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-gray-750 to-gray-800 border-b border-gray-700 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xl font-bold text-white">
                      {activeWord.word}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {activeWord.reading}
                    </span>
                    {activeWord.jlptLevel && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                          JLPT_COLORS[activeWord.jlptLevel]
                        }`}
                      >
                        {activeWord.jlptLevel}
                      </span>
                    )}
                  </div>
                  {activeWord.partOfSpeech && (
                    <span className="text-xs text-gray-500 mt-0.5 block">
                      {POS_LABELS[activeWord.partOfSpeech] ||
                        activeWord.partOfSpeech}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveWord(null)}
                  className="text-gray-500 hover:text-gray-300 transition-colors mt-0.5 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meaning */}
            <div className="px-4 py-3">
              <p className="text-white font-semibold text-base leading-snug">
                {activeWord.meaning}
              </p>

              {activeWord.examples?.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Example
                  </p>
                  {activeWord.examples.slice(0, 1).map((ex, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-xl px-3 py-2">
                      <p className="text-sm text-white">{ex.japanese}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ex.english}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-gray-700 flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => playAudio(activeWord.word)}
                className="w-9 h-9 rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <Volume2 className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSaveWord(activeWord)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center ${
                  savedWords.has(activeWord.word)
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                }`}
              >
                {savedWords.has(activeWord.word) ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5" /> Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" /> Save (+5 XP)
                  </>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onStudyWord?.(activeWord);
                  setActiveWord(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 text-xs font-semibold transition-colors flex-1 justify-center"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Study
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently Saved Toast */}
      <AnimatePresence>
        {recentlySaved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex items-center gap-2 bg-green-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm whitespace-nowrap"
          >
            <Zap className="w-3 h-3" />
            Word saved! +5 XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Words Counter */}
      {savedWords.size > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500">
            {savedWords.size} word{savedWords.size !== 1 ? "s" : ""} saved
          </span>
          <span className="text-xs text-yellow-400 font-bold">
            +{savedWords.size * 5} XP
          </span>
        </div>
      )}
    </div>
  );
};

export default VocabHighlight;