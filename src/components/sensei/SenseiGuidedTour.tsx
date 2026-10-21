import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useSenseiStore } from '../../store/senseiStore';
import { useSenseiTarget } from './useSenseiTarget';

interface TourStep {
  id: string;
  targetId: string | null;
  title: string;
  message: string;
  animation?: SenseiAnimationState;
  emotion?: SenseiEmotion;
  path?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'greet',
    targetId: null,
    title: 'Konnichiwa! (こんにちは)',
    message: 'Konnichiwa! Welcome to Kando Japanese! I am so delighted to meet you! 🌸',
    animation: 'greeting',
    emotion: 'happy'
  },
  {
    id: 'intro',
    targetId: null,
    title: 'Meet Hana-sensei (花先生)',
    message: 'I am Hana-sensei, your personal Japanese teacher. I will be your companion and mentor every step of your language journey! ✨',
    animation: 'waving',
    emotion: 'encouraging'
  },
  {
    id: 'mission',
    targetId: null,
    title: 'Daily Japanese Learning',
    message: "I'll help you learn Japanese every day. Together we will master grammar, practice speech, memorize Kanji, and build fluency! 🎌",
    animation: 'teaching',
    emotion: 'encouraging'
  },
  {
    id: 'lessons',
    targetId: 'nav-lessons',
    title: 'Structured JLPT Lessons',
    message: 'Here are our structured JLPT lessons from N5 to N1. Each lesson breaks down essential grammar patterns with interactive dialogues! 📖',
    animation: 'pointing',
    emotion: 'happy',
    path: '/lessons'
  },
  {
    id: 'vocabulary',
    targetId: 'nav-vocabulary',
    title: 'Word Bank & Flashcards',
    message: 'Here is your Word Bank! Build an extensive Japanese vocabulary with native audio pronunciations and contextual examples! 🗂️',
    animation: 'pointing',
    emotion: 'happy',
    path: '/vocabulary'
  },
  {
    id: 'kanji',
    targetId: 'nav-kanji',
    title: 'Interactive Kanji Studio',
    message: 'Here is the Kanji Studio! Learn stroke orders, radicals, onyomi and kunyomi readings with animated writing guides! ㊗️',
    animation: 'pointing',
    emotion: 'encouraging',
    path: '/kanji'
  },
  {
    id: 'review',
    targetId: 'nav-review',
    title: 'Spaced Repetition (SRS)',
    message: 'Here is your SRS Review Queue! Reviewing flashcards right before you forget them locks them into your long-term memory! 🔁',
    animation: 'pointing',
    emotion: 'happy',
    path: '/review'
  },
  {
    id: 'progress',
    targetId: 'nav-dashboard',
    title: 'Your Level & Progress',
    message: "Let's check your current progress! You are currently on JLPT N5. Keep up your daily streak 🔥 and earn XP ⚡ on every study session!",
    animation: 'thinking',
    emotion: 'encouraging',
    path: '/dashboard'
  },
  {
    id: 'recommendation',
    targetId: 'nav-lessons',
    title: "Today's Recommendation",
    message: "Ready to begin? I recommend starting Lesson 1: Basic Greetings & Hiragana! Let us do our best! Ganbatte kudasai! 🌸✨",
    animation: 'celebrating',
    emotion: 'celebrating'
  }
];

export function SenseiGuidedTour() {
  const {
    isTouring,
    closeTour,
    completeTour,
    skipTour,
    targetId,
    guideTo,
    clearTarget,
    triggerCelebration,
    setAnimationState
  } = useSenseiStore();

  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  useSenseiTarget(targetId);

  useEffect(() => {
    if (!isTouring) {
      setCurrentStepIndex(0);
      clearTarget();
      return;
    }

    const step = TOUR_STEPS[currentStepIndex];
    if (step) {
      if (step.animation) setAnimationState(step.animation);
      useSenseiStore.setState({ emotion: step.emotion || 'neutral' });
      guideTo(step.targetId || '', step.message);
    } else {
      closeTour();
    }
  }, [isTouring, currentStepIndex, guideTo, clearTarget, closeTour, setAnimationState]);

  const handleNext = async () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      await completeTour();
      triggerCelebration("Tour completed! Welcome to Kando Japanese! 🌸");
    }
  };

  const handleSkip = async () => {
    await skipTour();
  };

  if (!isTouring) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-[120] w-[320px] max-w-[calc(100vw-32px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-card border-2 border-primary/60 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 backdrop-blur-md"
      >
        <div className="flex justify-between items-center border-b border-border/50 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-primary text-sm">{currentStep.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {currentStepIndex + 1} / {TOUR_STEPS.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
              title="Skip Tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground">{currentStep.message}</p>

        <div className="flex justify-between items-center pt-2 border-t border-border/40">
          <button
            onClick={handleSkip}
            className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            {currentStepIndex === TOUR_STEPS.length - 1 ? (
              <>Start Learning! 🌸</>
            ) : (
              <>Next <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

