import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Trophy,
  RotateCcw,
  Clock,
  Zap,
  ChevronRight,
  Star,
} from "lucide-react";
import { useProgressStore } from "../../store/progressStore";

// ─── All Level Data ───────────────────────────────────────────────
const LEVELS = [
  {
    level: 1,
    title: "Animals",
    emoji: "🐾",
    pairs: [
      { id: 1, japanese: "犬", english: "dog" },
      { id: 2, japanese: "猫", english: "cat" },
      { id: 3, japanese: "魚", english: "fish" },
      { id: 4, japanese: "鳥", english: "bird" },
      { id: 5, japanese: "山", english: "mountain" },
      { id: 6, japanese: "川", english: "river" },
    ],
  },
  {
    level: 2,
    title: "Family",
    emoji: "👨‍👩‍👧",
    pairs: [
      { id: 1, japanese: "母", english: "mother" },
      { id: 2, japanese: "父", english: "father" },
      { id: 3, japanese: "姉", english: "older sister" },
      { id: 4, japanese: "兄", english: "older brother" },
      { id: 5, japanese: "妹", english: "younger sister" },
      { id: 6, japanese: "弟", english: "younger brother" },
    ],
  },
  {
    level: 3,
    title: "Food & Drink",
    emoji: "🍜",
    pairs: [
      { id: 1, japanese: "水", english: "water" },
      { id: 2, japanese: "茶", english: "tea" },
      { id: 3, japanese: "肉", english: "meat" },
      { id: 4, japanese: "米", english: "rice" },
      { id: 5, japanese: "酒", english: "sake" },
      { id: 6, japanese: "卵", english: "egg" },
    ],
  },
  {
    level: 4,
    title: "Nature",
    emoji: "🌿",
    pairs: [
      { id: 1, japanese: "木", english: "tree" },
      { id: 2, japanese: "花", english: "flower" },
      { id: 3, japanese: "空", english: "sky" },
      { id: 4, japanese: "海", english: "sea" },
      { id: 5, japanese: "星", english: "star" },
      { id: 6, japanese: "雨", english: "rain" },
    ],
  },
  {
    level: 5,
    title: "Numbers",
    emoji: "🔢",
    pairs: [
      { id: 1, japanese: "一", english: "one" },
      { id: 2, japanese: "二", english: "two" },
      { id: 3, japanese: "三", english: "three" },
      { id: 4, japanese: "四", english: "four" },
      { id: 5, japanese: "五", english: "five" },
      { id: 6, japanese: "六", english: "six" },
    ],
  },
  {
    level: 6,
    title: "Body Parts",
    emoji: "🫀",
    pairs: [
      { id: 1, japanese: "目", english: "eye" },
      { id: 2, japanese: "耳", english: "ear" },
      { id: 3, japanese: "口", english: "mouth" },
      { id: 4, japanese: "手", english: "hand" },
      { id: 5, japanese: "足", english: "foot" },
      { id: 6, japanese: "頭", english: "head" },
    ],
  },
  {
    level: 7,
    title: "Time",
    emoji: "⏰",
    pairs: [
      { id: 1, japanese: "今", english: "now" },
      { id: 2, japanese: "日", english: "day" },
      { id: 3, japanese: "月", english: "month" },
      { id: 4, japanese: "年", english: "year" },
      { id: 5, japanese: "朝", english: "morning" },
      { id: 6, japanese: "夜", english: "night" },
    ],
  },
  {
    level: 8,
    title: "Places",
    emoji: "🏙️",
    pairs: [
      { id: 1, japanese: "家", english: "house" },
      { id: 2, japanese: "店", english: "shop" },
      { id: 3, japanese: "駅", english: "station" },
      { id: 4, japanese: "学校", english: "school" },
      { id: 5, japanese: "病院", english: "hospital" },
      { id: 6, japanese: "図書館", english: "library" },
    ],
  },
];

// ─── Target Icon ──────────────────────────────────────────────────
const Target = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// ─── Level Selector Component ─────────────────────────────────────
const LevelSelector = ({ completedLevels, currentLevel, onSelect }) => (
  <div className="w-full max-w-xl mx-auto space-y-4">
    <div className="text-center">
      <h3 className="text-white font-bold text-xl">Choose a Level</h3>
      <p className="text-gray-400 text-sm mt-1">
        Complete levels to unlock new word sets
      </p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {LEVELS.map((lvl) => {
        const isUnlocked = lvl.level <= currentLevel;
        const isDone = completedLevels.has(lvl.level);
        return (
          <motion.button
            key={lvl.level}
            whileTap={isUnlocked ? { scale: 0.97 } : {}}
            onClick={() => isUnlocked && onSelect(lvl.level)}
            className={`relative p-4 rounded-2xl border text-left transition-all duration-200
              ${
                isDone
                  ? "bg-green-500/10 border-green-500/40 cursor-pointer"
                  : isUnlocked
                  ? "bg-gray-800 border-gray-600 hover:border-blue-500/60 cursor-pointer"
                  : "bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed"
              }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-2xl">{lvl.emoji}</span>
                <p className="text-white font-semibold text-sm mt-1">
                  Level {lvl.level}
                </p>
                <p className="text-gray-400 text-xs">{lvl.title}</p>
              </div>
              <div className="mt-1">
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : isUnlocked ? (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                ) : (
                  <span className="text-gray-600 text-lg">🔒</span>
                )}
              </div>
            </div>
            {isDone && (
              <span className="absolute top-2 right-2 text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-medium">
                Done
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────
const MatchingGame = ({ onComplete }) => {
  const { incrementXP } = useProgressStore();

  // Level progression state
  const [view, setView] = useState("selector"); // "selector" | "game"
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1); // highest unlocked
  const [completedLevels, setCompletedLevels] = useState(new Set());

  // Game state
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);

  const activeLevel = LEVELS[activeLevelIndex];

  // ── Init game for selected level ──
  const initGame = useCallback((levelData) => {
    const shuffled = [...levelData.pairs].sort(() => Math.random() - 0.5);
    const right = [...levelData.pairs].sort(() => Math.random() - 0.5);
    setLeftItems(shuffled);
    setRightItems(right);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setWrongPair(null);
    setAttempts(0);
    setCompleted(false);
    setShowCompletionModal(false);
    setElapsedTime(0);
    setSessionXP(0);
    setStartTime(Date.now());
  }, []);

  const handleSelectLevel = (levelNum) => {
    const idx = LEVELS.findIndex((l) => l.level === levelNum);
    setActiveLevelIndex(idx);
    initGame(LEVELS[idx]);
    setView("game");
  };

  // ── Timer ──
  useEffect(() => {
    if (completed || view !== "game") return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [completed, startTime, view]);

  // ── Match checker ──
  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;

    setAttempts((prev) => prev + 1);

    if (selectedLeft.id === selectedRight.id) {
      const newMatched = new Set([...matched, selectedLeft.id]);
      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      const xpGain = 5;
      incrementXP(xpGain);
      setSessionXP((prev) => prev + xpGain);

      if (newMatched.size === activeLevel.pairs.length) {
        setTimeout(() => {
          setCompleted(true);
          setShowCompletionModal(true);
          const bonusXP = Math.max(
            50,
            100 - attempts * 2 - Math.floor(elapsedTime / 5)
          );
          incrementXP(bonusXP);
          setSessionXP((prev) => prev + bonusXP);

          // Unlock next level
          const nextLevel = activeLevel.level + 1;
          setCompletedLevels((prev) => new Set([...prev, activeLevel.level]));
          if (nextLevel <= LEVELS.length) {
            setCurrentLevel((prev) => Math.max(prev, nextLevel));
          }

          onComplete?.({
            level: activeLevel.level,
            attempts,
            time: elapsedTime,
            accuracy: Math.round((newMatched.size / (attempts + 1)) * 100),
          });
        }, 400);
      }
    } else {
      setWrongPair({ left: selectedLeft.id, right: selectedRight.id });
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongPair(null);
      }, 800);
    }
  }, [selectedLeft, selectedRight]);

  const handleLeftClick = (item) => {
    if (matched.has(item.id) || wrongPair) return;
    setSelectedLeft(selectedLeft?.id === item.id ? null : item);
  };

  const handleRightClick = (item) => {
    if (matched.has(item.id) || wrongPair) return;
    setSelectedRight(selectedRight?.id === item.id ? null : item);
  };

  const getLeftStyle = (item) => {
    if (matched.has(item.id))
      return "bg-green-500/20 border-green-500 text-green-300 cursor-default";
    if (wrongPair?.left === item.id)
      return "bg-red-500/20 border-red-500 text-red-300";
    if (selectedLeft?.id === item.id)
      return "bg-blue-500/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/20 scale-105";
    return "bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500 cursor-pointer";
  };

  const getRightStyle = (item) => {
    if (matched.has(item.id))
      return "bg-green-500/20 border-green-500 text-green-300 cursor-default";
    if (wrongPair?.right === item.id)
      return "bg-red-500/20 border-red-500 text-red-300";
    if (selectedRight?.id === item.id)
      return "bg-purple-500/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/20 scale-105";
    return "bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500 cursor-pointer";
  };

  const accuracy =
    attempts > 0 ? Math.round((matched.size / attempts) * 100) : 100;

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const hasNextLevel =
    activeLevel && activeLevel.level < LEVELS.length;

  // ── Level Selector View ──
  if (view === "selector") {
    return (
      <LevelSelector
        completedLevels={completedLevels}
        currentLevel={currentLevel}
        onSelect={handleSelectLevel}
      />
    );
  }

  // ── Game View ──
  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back to levels */}
          <button
            onClick={() => setView("selector")}
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm flex items-center gap-1"
          >
            ← Levels
          </button>
          <div>
            <h3 className="text-white font-bold text-lg">
              {activeLevel.emoji} {activeLevel.title}
            </h3>
            <p className="text-gray-400 text-xs">
              Level {activeLevel.level} · Match each kanji
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-yellow-400">
            <Zap className="w-4 h-4" />
            <span className="font-bold">+{sessionXP} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {matched.size} / {activeLevel.pairs.length} matched
          </span>
          <span>{attempts} attempts · {accuracy}% accuracy</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            animate={{
              width: `${(matched.size / activeLevel.pairs.length) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 120 }}
          />
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Japanese Column */}
        <div className="space-y-2">
          <p className="text-xs text-center text-gray-500 font-medium uppercase tracking-wider mb-3">
            Japanese
          </p>
          {leftItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={!matched.has(item.id) ? { scale: 0.97 } : {}}
              onClick={() => handleLeftClick(item)}
              className={`w-full py-3 px-4 rounded-xl border font-bold text-xl transition-all duration-200 ${getLeftStyle(item)}`}
            >
              <div className="flex items-center justify-between">
                <span>{item.japanese}</span>
                {matched.has(item.id) && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* English Column */}
        <div className="space-y-2">
          <p className="text-xs text-center text-gray-500 font-medium uppercase tracking-wider mb-3">
            English
          </p>
          {rightItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={!matched.has(item.id) ? { scale: 0.97 } : {}}
              onClick={() => handleRightClick(item)}
              className={`w-full py-3 px-4 rounded-xl border font-medium text-sm transition-all duration-200 ${getRightStyle(item)}`}
            >
              <div className="flex items-center justify-between">
                <span>{item.english}</span>
                {matched.has(item.id) && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {!completed && (
        <p className="text-center text-xs text-gray-600">
          Select one from each column to make a match
        </p>
      )}

      {/* Shuffle Button */}
      <div className="flex justify-center">
        <button
          onClick={() => initGame(activeLevel)}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Shuffle & Restart
        </button>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-gray-800 border border-gray-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-1">
                Level {activeLevel.level} Complete!
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                {activeLevel.emoji} {activeLevel.title} — Great work!
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + star * 0.1, type: "spring" }}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        accuracy >= star * 33
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {
                    icon: Clock,
                    value: formatTime(elapsedTime),
                    label: "Time",
                    color: "text-blue-400",
                    bg: "bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    icon: Target,
                    value: `${accuracy}%`,
                    label: "Accuracy",
                    color: "text-green-400",
                    bg: "bg-green-500/10 border-green-500/20",
                  },
                  {
                    icon: Zap,
                    value: `+${sessionXP}`,
                    label: "XP",
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/10 border-yellow-500/20",
                  },
                ].map(({ icon: Icon, value, label, color, bg }) => (
                  <div key={label} className={`border rounded-xl p-3 ${bg}`}>
                    <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-gray-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              {/* Next level unlock message */}
              {hasNextLevel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                >
                  <p className="text-blue-400 text-xs font-medium">
                    🔓 Level {activeLevel.level + 1} unlocked!
                  </p>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                {hasNextLevel && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setShowCompletionModal(false);
                      handleSelectLevel(activeLevel.level + 1);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity"
                  >
                    Next Level
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setShowCompletionModal(false);
                      initGame(activeLevel);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Replay
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setShowCompletionModal(false);
                      setView("selector");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity"
                  >
                    <Trophy className="w-4 h-4" />
                    All Levels
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchingGame;