import type { Variants } from 'framer-motion';

// ─── Easing Curves ───────────────────────────────────────────────────────────

export const EASE_SOFT = [0.16, 1, 0.3, 1] as const;
export const EASE_DRIFT = [0.45, 0.05, 0.55, 0.95] as const;
export const EASE_SETTLE = [0.25, 0.46, 0.45, 0.94] as const;
export const EASE_BREATHE = [0.4, 0, 0.2, 1] as const;

// ─── Stage Container ─────────────────────────────────────────────────────────

export const stageVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.6,
      ease: EASE_SETTLE,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1.2,
      ease: EASE_DRIFT,
    },
  },
};

// ─── Text Reveal ─────────────────────────────────────────────────────────────

export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: EASE_SOFT,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(2px)',
    transition: {
      duration: 0.8,
      ease: EASE_DRIFT,
    },
  },
};

// ─── Gentle Fade ─────────────────────────────────────────────────────────────

export const gentleFadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.8,
      ease: EASE_SETTLE,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1.4,
      ease: EASE_DRIFT,
    },
  },
};

// ─── Chat Message ─────────────────────────────────────────────────────────────

export const chatMessageVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -16,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASE_SOFT,
    },
  },
};

// ─── Typing Indicator ────────────────────────────────────────────────────────

export const typingVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    x: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: EASE_SOFT,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// ─── Memory Card ─────────────────────────────────────────────────────────────

export const memoryCardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 2.0,
      ease: EASE_SETTLE,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(6px)',
    transition: {
      duration: 1.4,
      ease: EASE_DRIFT,
    },
  },
};

// ─── Memory Caption ──────────────────────────────────────────────────────────

export const memoryCaptionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.4,
      delay: 0.8,
      ease: EASE_SOFT,
    },
  },
};

// ─── Accountability Line ─────────────────────────────────────────────────────

export const accountabilityLineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: 'blur(3px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.4,
      ease: EASE_SOFT,
    },
  },
};

// ─── Button ──────────────────────────────────────────────────────────────────

export const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
      ease: EASE_SOFT,
    },
  },
};

// ─── Ambient Orb ─────────────────────────────────────────────────────────────

export const orbVariants: Variants = {
  breathe: {
    scale: [1, 1.08, 1],
    opacity: [0.25, 0.55, 0.25],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ─── Hold Button Progress ────────────────────────────────────────────────────

export const holdProgressVariants: Variants = {
  idle: {
    scaleX: 0,
    opacity: 0,
  },
  holding: {
    scaleX: 1,
    opacity: 1,
  },
  complete: {
    scaleX: 1,
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

// ─── Hold Reveal Text ────────────────────────────────────────────────────────

export const holdRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 2.0,
      ease: EASE_SOFT,
    },
  },
};

// ─── Stagger Container ───────────────────────────────────────────────────────

export function staggerContainer(staggerChildren = 0.15, delayChildren = 0) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  } satisfies Variants;
}

// ─── Transition Bridge ───────────────────────────────────────────────────────

export const transitionBridgeVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 2.4,
      ease: EASE_SETTLE,
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(8px)',
    transition: {
      duration: 1.8,
      ease: EASE_DRIFT,
    },
  },
};

// ─── Scale Rise ──────────────────────────────────────────────────────────────

export const scaleRiseVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.6,
      ease: EASE_SOFT,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 1.0,
    },
  },
};
