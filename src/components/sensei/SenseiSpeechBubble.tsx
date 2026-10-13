import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useSenseiStore } from '../../store/senseiStore';

export function SenseiSpeechBubble() {
  const { targetId, targetMessage, isOpen, clearTarget } = useSenseiStore();

  return (
    <AnimatePresence>
      {targetId && targetMessage && !isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="mb-3 max-w-[280px] p-4 rounded-3xl bg-background/90 backdrop-blur-md border border-primary/20 shadow-xl text-sm flex flex-col gap-2 relative z-50 pointer-events-auto"
          role="alert"
        >
          {/* A small tail pointing down to the character */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-background/90 border-b border-r border-primary/20 transform rotate-45 backdrop-blur-md" />
          
          <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-1">
            <span className="font-bold text-primary flex items-center gap-1.5 font-japanese tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              先生のアドバイス
            </span>
            <button
              onClick={clearTarget}
              className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
              aria-label="Dismiss recommendation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-foreground leading-relaxed font-medium">{targetMessage}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
