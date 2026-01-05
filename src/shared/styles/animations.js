/**
 * Centralized Animation System
 * Framer Motion variants and transitions
 */

// =============================================================================
// TRANSITION PRESETS
// =============================================================================

export const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
  mass: 0.5,
};

export const springBouncy = {
  type: 'spring',
  stiffness: 500,
  damping: 20,
  mass: 0.8,
};

export const springGentle = {
  type: 'spring',
  stiffness: 200,
  damping: 30,
  mass: 1,
};

export const springSnappy = {
  type: 'spring',
  stiffness: 600,
  damping: 35,
  mass: 0.3,
};

export const easeTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export const slowEase = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
};

// =============================================================================
// FADE VARIANTS
// =============================================================================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// =============================================================================
// SCALE VARIANTS
// =============================================================================

export const scaleIn = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scale: 0 },
};

export const scalePop = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 1.2, opacity: 0 },
};

export const scaleBounce = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: springBouncy,
  },
  exit: { scale: 0 },
};

// =============================================================================
// BUTTON VARIANTS
// =============================================================================

export const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const buttonGlow = {
  idle: {
    scale: 1,
    boxShadow: '0 0 0 rgba(255, 255, 255, 0)',
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
  },
  tap: { scale: 0.95 },
};

// =============================================================================
// PIXEL VARIANTS (for game grid)
// =============================================================================

export const pixelVariants = {
  default: {
    scale: 1,
    boxShadow: 'none',
  },
  fillable: {
    scale: 1,
    boxShadow: '0 0 8px #FFE066, 0 0 4px #FFE066',
  },
  playhead: {
    scale: 1.1,
  },
  playheadUnfilled: {
    scale: 1.05,
  },
  active: {
    scale: 1.3,
  },
  filled: {
    scale: [0.8, 1.2, 1],
    transition: {
      duration: 0.3,
      times: [0, 0.5, 1],
    },
  },
};

// =============================================================================
// PROJECTILE VARIANTS
// =============================================================================

export const projectileVariants = {
  initial: {
    scale: 1.8,
    opacity: 0.8,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 2,
    opacity: 0,
  },
};

export const projectileTransition = {
  type: 'spring',
  stiffness: 250,
  damping: 20,
  mass: 0.6,
};

// =============================================================================
// LAUNCHER VARIANTS
// =============================================================================

export const launcherVariants = {
  empty: {
    scale: 1,
    boxShadow: 'none',
  },
  filled: {
    scale: 1,
  },
  firing: {
    scale: [1, 0.9, 1],
    transition: { duration: 0.15 },
  },
};

export const launcherContentVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
};

// =============================================================================
// STACK VARIANTS (for queues)
// =============================================================================

export const stackVariants = {
  initial: { opacity: 0, y: -20, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, y: 20 },
  top: { opacity: 1 },
  queued: { opacity: 0.35 },
};

export const stackHover = {
  scale: 1.08,
  transition: springTransition,
};

export const stackTap = {
  scale: 0.95,
  transition: springSnappy,
};

// =============================================================================
// GLOW PULSE ANIMATION
// =============================================================================

export const glowPulse = (color) => ({
  animate: {
    boxShadow: [
      `0 0 10px ${color}60, 0 0 20px ${color}30`,
      `0 0 20px ${color}80, 0 0 40px ${color}50`,
      `0 0 10px ${color}60, 0 0 20px ${color}30`,
    ],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
});

// =============================================================================
// PARTICLE TRAIL ANIMATION
// =============================================================================

export const particleTrail = (index) => ({
  animate: {
    y: [0, 20 + index * 10],
    opacity: [1, 0],
    scale: [1, 0.2],
  },
  transition: {
    duration: 0.2,
    repeat: Infinity,
    delay: index * 0.03,
  },
});

// =============================================================================
// STAGGER CHILDREN
// =============================================================================

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// =============================================================================
// PAGE TRANSITIONS
// =============================================================================

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: slowEase,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: easeTransition,
  },
};

// =============================================================================
// MODAL VARIANTS
// =============================================================================

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: easeTransition,
  },
};

// =============================================================================
// PROGRESS BAR
// =============================================================================

export const progressBar = {
  initial: { width: 0 },
  animate: (progress) => ({
    width: `${progress}%`,
    transition: { duration: 0.1 },
  }),
};

// =============================================================================
// WIN/CELEBRATION ANIMATIONS
// =============================================================================

export const celebrationBurst = {
  initial: { scale: 0, rotate: 0 },
  animate: {
    scale: [0, 1.5, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 0.6,
      times: [0, 0.6, 1],
    },
  },
};

export const confettiParticle = (index) => ({
  initial: {
    y: 0,
    x: 0,
    opacity: 1,
    rotate: 0,
  },
  animate: {
    y: [0, -100, 200],
    x: (index % 2 === 0 ? 1 : -1) * (50 + Math.random() * 100),
    opacity: [1, 1, 0],
    rotate: [0, 360 * (index % 2 === 0 ? 1 : -1)],
    transition: {
      duration: 1.5,
      ease: 'easeOut',
    },
  },
});
