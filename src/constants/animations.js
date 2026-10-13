// src/constants/animations.js
// Duolingo-inspired animation and spring physics constants for Nihongo Master

export const DUO_SPRINGS = {
  // Snappy, energetic button press and release
  button: {
    type: 'spring',
    stiffness: 450,
    damping: 18,
    mass: 0.8,
  },
  // Playful pop for character speech bubbles, badges, and XP chips
  pop: {
    type: 'spring',
    stiffness: 500,
    damping: 22,
    mass: 1,
  },
  // Bouncy entrance for interactive cards and modals
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
  },
  // Gentle natural sway for floating kana chips & clouds
  gentle: {
    type: 'spring',
    stiffness: 120,
    damping: 14,
  },
  // Card flip 3D spring
  cardFlip: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
}

// Framer motion variants for staggered headline animation
export const HEADLINE_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const HEADLINE_ITEM = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
}

// Subheadline fade-slide variant
export const FADE_UP_SPRING = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 22,
      delay: 0.25,
    },
  },
}

// Sticky header slide-in variant
export const HEADER_CTA_SLIDE = {
  hidden: {
    opacity: 0,
    y: -14,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 450,
      damping: 22,
    },
  },
}
