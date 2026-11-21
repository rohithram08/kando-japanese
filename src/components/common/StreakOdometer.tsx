// src/components/common/StreakOdometer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Duolingo-Style Rolling Odometer Component
// Digit-by-digit vertical slide animation with spring physics.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';

interface StreakOdometerProps {
  value: number;
  className?: string;
  digitClassName?: string;
}

function SingleOdometerDigit({ digit }: { digit: string }) {
  const num = parseInt(digit, 10);
  if (isNaN(num)) {
    return <span className="inline-block select-none">{digit}</span>;
  }

  return (
    <div className="relative inline-block overflow-hidden h-[1.15em] leading-[1.15em] align-top select-none font-mono">
      <motion.div
        initial={false}
        animate={{ y: `-${num * 10}%` }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 24,
          mass: 0.8,
        }}
        className="flex flex-col"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1.15em] flex items-center justify-center">
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function StreakOdometer({
  value,
  className = 'text-3xl font-black font-mono tracking-tight text-cyan-600 dark:text-cyan-400',
  digitClassName,
}: StreakOdometerProps) {
  const digits = String(Math.max(0, value)).split('');

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {digits.map((digit, index) => (
        <span key={index} className={digitClassName}>
          <SingleOdometerDigit digit={digit} />
        </span>
      ))}
    </div>
  );
}
