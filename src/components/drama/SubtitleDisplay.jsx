import { motion, AnimatePresence } from 'framer-motion';
import React from "react";

const SubtitleDisplay = ({ subtitle, mode = 'both', className = '' }) => {
  if (!subtitle) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={subtitle.jp}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`bg-black/80 backdrop-blur-sm rounded-xl px-6 py-3 text-center max-w-2xl ${className}`}
      >
        {(mode === 'jp' || mode === 'both') && (
          <div className="text-white text-xl font-bold leading-relaxed drop-shadow-lg">
            {subtitle.jp}
          </div>
        )}
        {(mode === 'romaji' || mode === 'both') && (
          <div className="text-blue-300 text-sm mt-1">
            {subtitle.romaji}
          </div>
        )}
        {(mode === 'en' || mode === 'both') && (
          <div className="text-yellow-200 text-sm mt-0.5">
            {subtitle.en}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SubtitleDisplay;