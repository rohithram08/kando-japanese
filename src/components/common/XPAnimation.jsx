import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Star, TrendingUp, Trophy, Flame } from 'lucide-react'

// ── Constants ─────────────────────────────────────────────
const XP_MILESTONES = [50, 100, 200, 500, 1000]

const BURST_COLORS = [
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f97316', // orange
  '#06b6d4', // cyan
]

const LEVEL_TITLES = {
  1:  'Beginner',    5:  'Student',     10: 'Learner',
  15: 'Scholar',     20: 'Practitioner',25: 'Adept',
  30: 'Expert',      40: 'Master',      50: 'Sensei',
  75: 'Grand Master',100:'Legend',
}

function getLevelTitle(level) {
  const keys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a)
  for (const k of keys) {
    if (level >= k) return LEVEL_TITLES[k]
  }
  return 'Beginner'
}

// ── Single Particle ───────────────────────────────────────
const Particle = ({ color, angle, distance, delay, size = 6 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width:           size,
      height:          size,
      backgroundColor: color,
      left:            0,
      top:             0,
      zIndex:          9999,
    }}
    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
    animate={{
      scale:   [0, 1.2, 0.8, 0],
      x:       Math.cos(angle) * distance,
      y:       Math.sin(angle) * distance,
      opacity: [0, 1, 1, 0],
    }}
    transition={{ duration: 0.8, delay, ease: 'easeOut' }}
  />
)

// ── Star Particle (for milestones) ────────────────────────
const StarParticle = ({ angle, distance, delay }) => (
  <motion.div
    className="absolute pointer-events-none text-yellow-400"
    style={{ left: 0, top: 0, zIndex: 9999, fontSize: 12 }}
    initial={{ scale: 0, x: 0, y: 0, opacity: 1, rotate: 0 }}
    animate={{
      scale:   [0, 1, 0],
      x:       Math.cos(angle) * distance,
      y:       Math.sin(angle) * distance,
      opacity: [0, 1, 0],
      rotate:  360,
    }}
    transition={{ duration: 1, delay, ease: 'easeOut' }}
  >
    ⭐
  </motion.div>
)

// ── Ripple Ring ───────────────────────────────────────────
const RippleRing = ({ delay = 0, color = 'rgba(251,191,36,0.5)' }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      border:    `2px solid ${color}`,
      width:     20,
      height:    20,
      left:      -10,
      top:       -10,
      zIndex:    9998,
    }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 5, opacity: 0 }}
    transition={{ duration: 0.9, delay, ease: 'easeOut' }}
  />
)

// ─────────────────────────────────────────────────────────
// MAIN XP ANIMATION COMPONENT
// ─────────────────────────────────────────────────────────
const XPAnimation = ({
  xp        = 10,
  x         = '50%', y         = '50%',
  onComplete,
  variant   = 'default', // 'default' | 'large' | 'milestone' | 'inline'
}) => {
  const [particles, setParticles] = useState([])

  const isMilestone = XP_MILESTONES.some((m) => Math.abs(xp) >= m)
  const isGain      = xp > 0

  // Particle count scales with XP value
  const particleCount =
    isMilestone ? 24 :
    xp >= 50    ? 16 :
    xp >= 20    ? 10 :
                  6

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id:       i,
      angle:    (i / particleCount) * Math.PI * 2 + Math.random() * 0.3,
      distance: 25 + Math.random() * (isMilestone ? 60 : 40),
      color:    BURST_COLORS[i % BURST_COLORS.length],
      delay:    Math.random() * 0.2,
      size:     isMilestone ? 4 + Math.random() * 4 : 3 + Math.random() * 3,
      isStar:   isMilestone && i % 4 === 0,
    }))
    setParticles(newParticles)
  }, [particleCount, isMilestone])

  const xpLabel   = isGain ? `+${xp} Wave XP` : `${xp} Wave XP`
  const isLarge   = variant === 'large' || isMilestone
  const sizeClass = isLarge ? 'text-xl px-5 py-2.5' : 'text-sm px-3.5 py-1.5'

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left:      x,
        top:       y,
        zIndex:    9999,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Ripple rings */}
      {isMilestone && (
        <>
          <RippleRing delay={0}    color="rgba(251,191,36,0.6)" />
          <RippleRing delay={0.15} color="rgba(251,191,36,0.4)" />
          <RippleRing delay={0.3}  color="rgba(251,191,36,0.2)" />
        </>
      )}
      {!isMilestone && isGain && (
        <RippleRing delay={0} color="rgba(251,191,36,0.3)" />
      )}

      {/* Particles */}
      {particles.map((p) =>
        p.isStar ? (
          <StarParticle
            key={p.id}
            angle={p.angle}
            distance={p.distance}
            delay={p.delay}
          />
        ) : (
          <Particle
            key={p.id}
            color={p.color}
            angle={p.angle}
            distance={p.distance}
            delay={p.delay}
            size={p.size}
          />
        )
      )}

      {/* Wave XP Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 0 }}
        animate={{
          scale:   [0, 1.4, 1.1, 1, 0.95, 0],
          opacity: [0, 1,   1,   1, 1,    0],
          y:       [0, -8, -18, -28, -42, -60],
        }}
        transition={{
          duration: 1.6,
          times:    [0, 0.12, 0.28, 0.55, 0.75, 1],
          ease:     'easeOut',
        }}
        onAnimationComplete={onComplete}
        className={`
          flex items-center gap-1.5 rounded-full font-bold
          shadow-2xl whitespace-nowrap select-none
          ${sizeClass}
          ${isGain
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900'
            : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }
        `}
        style={{
          boxShadow: isGain
            ? '0 0 24px rgba(251,191,36,0.7), 0 4px 12px rgba(0,0,0,0.2)'
            : '0 0 24px rgba(239,68,68,0.7), 0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <Zap className={isLarge ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
        {xpLabel}

        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* Milestone label */}
      {isMilestone && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10], scale: 1 }}
          transition={{ duration: 2, times: [0, 0.2, 0.7, 1], delay: 0.3 }}
          className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                     text-[10px] font-bold text-yellow-300 tracking-widest uppercase"
        >
          🏆 Milestone!
        </motion.div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// XP BADGE — inline, non-positioned
// ─────────────────────────────────────────────────────────
export const XPBadge = ({ xp, show = true }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 4 }}
        animate={{ opacity: 1, scale: 1,   y: 0 }}
        exit={{    opacity: 0, scale: 0.5, y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="inline-flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full"
      >
        <Zap className="w-3 h-3" />
        +{xp} Wave XP
      </motion.div>
    )}
  </AnimatePresence>
)

// ─────────────────────────────────────────────────────────
// STREAK BONUS BANNER
// ─────────────────────────────────────────────────────────
export const StreakBonus = ({ streak, show = true }) => (
  <AnimatePresence>
    {show && streak >= 3 && (
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.9 }}
        animate={{ opacity: 1,  x: 0,  scale: 1   }}
        exit={{    opacity: 0,  x:  30, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        className="flex items-center gap-2.5 bg-orange-500/20 border border-orange-500/30 rounded-2xl px-4 py-2.5"
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.4, repeat: 3 }}
          className="text-2xl"
        >
          🔥
        </motion.span>
        <div>
          <p className="text-orange-400 font-bold text-sm leading-tight">
            {streak}× Streak Bonus!
          </p>
          <p className="text-orange-300/60 text-xs">
            Wave XP multiplier active
          </p>
        </div>
        <div className="ml-auto text-orange-400 font-black text-lg">
          ×{streak}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

// ─────────────────────────────────────────────────────────
// LEVEL UP FULL-SCREEN OVERLAY
// ─────────────────────────────────────────────────────────
export const LevelUpAnimation = ({
  newLevel,
  show     = true,
  onComplete,
}) => {
  const title = getLevelTitle(newLevel)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* Background flash */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at center, rgba(251,191,36,0.15) 0%, transparent 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, times: [0, 0.3, 1] }}
          />

          {/* Floating particles around the card */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg pointer-events-none"
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos((i / 12) * Math.PI * 2) * (120 + Math.random() * 60),
                y: Math.sin((i / 12) * Math.PI * 2) * (120 + Math.random() * 60),
                scale: [0, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 1.5,
                delay:    0.2 + i * 0.05,
                ease:     'easeOut',
              }}
            >
              {['⭐', '✨', '🌟', '💫'][i % 4]}
            </motion.div>
          ))}

          {/* Main card */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0, y: 60, rotate: -5 }}
            animate={{ scale: 1,   opacity: 1, y: 0,  rotate: 0  }}
            exit={{    scale: 0.8, opacity: 0, y: -40, rotate: 5  }}
            transition={{
              type:      'spring',
              stiffness: 180,
              damping:   14,
              delay:     0.1,
            }}
            onAnimationComplete={onComplete}
            className="relative rounded-3xl px-12 py-9 text-center overflow-hidden"
            style={{
              background:  'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #d97706 100%)',
              boxShadow:   '0 0 80px rgba(251,191,36,0.6), 0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Animated glow ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-4 border-yellow-300/60"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.2, repeat: 3 }}
            />

            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: '-100%' }}
              animate={{ x: '200%'  }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                background:
                  'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
              }}
            />

            {/* Content */}
            <motion.div
              animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl mb-3 relative z-10"
            >
              ⭐
            </motion.div>

            <p className="text-gray-900 font-black text-lg uppercase tracking-[0.2em] mb-1 relative z-10">
              Level Up!
            </p>

            <motion.p
              className="text-gray-900 font-black relative z-10"
              style={{ fontSize: '5rem', lineHeight: 1 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {newLevel}
            </motion.p>

            <p className="text-gray-800 font-bold text-base mt-1 relative z-10">
              {title}
            </p>

            <div className="flex items-center justify-center gap-2 mt-3 relative z-10">
              <Star className="w-4 h-4 text-gray-800 fill-current" />
              <p className="text-gray-800 text-sm font-semibold">
                New content unlocked!
              </p>
              <Star className="w-4 h-4 text-gray-800 fill-current" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-1.5 mt-2 relative z-10"
            >
              <TrendingUp className="w-3.5 h-3.5 text-gray-700" />
              <p className="text-gray-700 text-xs font-medium">
                Keep going — you're on fire!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────
// ACHIEVEMENT UNLOCKED TOAST
// ─────────────────────────────────────────────────────────
export const AchievementToast = ({
  title,
  description,
  icon   = '🏆',
  show   = true,
  onComplete,
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.9  }}
        animate={{ opacity: 1, x: 0,  scale: 1    }}
        exit={{    opacity: 0, x: 80, scale: 0.9,
                   transition: { duration: 0.2 }   }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onAnimationComplete={onComplete}
        className="flex items-center gap-3 bg-gray-900 border border-yellow-500/30
                   rounded-2xl px-4 py-3 shadow-2xl min-w-[260px] max-w-xs"
        style={{ boxShadow: '0 0 30px rgba(251,191,36,0.2)' }}
      >
        {/* Icon with pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.4, delay: 0.2, repeat: 2 }}
          className="text-3xl flex-shrink-0"
        >
          {icon}
        </motion.div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Trophy className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
              Achievement Unlocked!
            </p>
          </div>
          <p className="text-white font-bold text-sm truncate">{title}</p>
          {description && (
            <p className="text-gray-400 text-xs mt-0.5 truncate">{description}</p>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

// ─────────────────────────────────────────────────────────
// COMBO MULTIPLIER
// ─────────────────────────────────────────────────────────
export const ComboAnimation = ({ combo, show = true }) => (
  <AnimatePresence>
    {show && combo >= 2 && (
      <motion.div
        key={combo}
        initial={{ scale: 0.5, opacity: 0, y: 10  }}
        animate={{ scale: 1,   opacity: 1, y: 0   }}
        exit={{    scale: 0.5, opacity: 0, y: -10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-black text-sm select-none"
        style={{
          background:  'linear-gradient(135deg, #f59e0b, #ef4444)',
          boxShadow:   '0 0 20px rgba(239,68,68,0.5)',
          color:       'white',
        }}
      >
        <Flame className="w-4 h-4" />
        {combo}× COMBO!
      </motion.div>
    )}
  </AnimatePresence>
)

// ─────────────────────────────────────────────────────────
// HOOK — trigger XP animations at DOM elements
// ─────────────────────────────────────────────────────────
export const useXPAnimation = () => {
  const [animations, setAnimations] = useState([])

  const triggerXP = useCallback((xp, elementOrPosition) => {
    const id = Date.now() + Math.random()
    let x = '50%'
    let y = '50%'

    if (elementOrPosition instanceof Element) {
      const rect = elementOrPosition.getBoundingClientRect()
      x = rect.left + rect.width  / 2
      y = rect.top  + rect.height / 2
    } else if (elementOrPosition && typeof elementOrPosition === 'object') {
      x = elementOrPosition.x ?? '50%'
      y = elementOrPosition.y ?? '50%'
    }

    setAnimations((prev) => [...prev, { id, xp, x, y }])

    setTimeout(() => {
      setAnimations((prev) => prev.filter((a) => a.id !== id))
    }, 2500)
  }, [])

  const AnimationRenderer = useCallback(() => (
    <>
      {animations.map((anim) => (
        <XPAnimation
          key={anim.id}
          xp={anim.xp}
          x={anim.x}
          y={anim.y}
        />
      ))}
    </>
  ), [animations])

  return { triggerXP, AnimationRenderer }
}

// ─────────────────────────────────────────────────────────
// DAILY GOAL COMPLETE BANNER
// ─────────────────────────────────────────────────────────
export const DailyGoalComplete = ({ xpEarned, show = true, onComplete }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.9  }}
        animate={{ opacity: 1, y: 0,   scale: 1    }}
        exit={{    opacity: 0, y: -20, scale: 0.95,
                   transition: { duration: 0.25 }   }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        onAnimationComplete={onComplete}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998]
                   pointer-events-none"
      >
        <div
          className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl"
          style={{
            background:  'linear-gradient(135deg, #10b981, #059669)',
            boxShadow:   '0 0 40px rgba(16,185,129,0.4)',
          }}
        >
          <motion.span
            animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl"
          >
            🎯
          </motion.span>
          <div>
            <p className="text-white font-black text-base">Daily Goal Complete!</p>
            <p className="text-emerald-200 text-sm">
              You earned <span className="font-bold text-white">{xpEarned} Wave XP</span> today
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            <Star className="w-6 h-6 text-yellow-300 fill-current" />
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default XPAnimation