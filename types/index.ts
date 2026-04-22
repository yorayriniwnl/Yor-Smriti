// ─── Chat Messages ────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  text: string;
  typingDuration: number;
  revealDelay: number;
  isLast?: boolean;
}

// ─── Memories ─────────────────────────────────────────────────────────────────

export type MemoryGradient =
  | 'warm-dusk'
  | 'cool-morning'
  | 'golden-hour'
  | 'rainy-afternoon'
  | 'late-night';

export interface Memory {
  id: string;
  gradient: MemoryGradient;
  caption: string;
  subCaption?: string;
  pauseBefore: number;
  pauseAfter: number;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

export interface TypewriterConfig {
  text: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
}

export interface TypewriterState {
  displayText: string;
  isComplete: boolean;
  isStarted: boolean;
}

// ─── Hold Button ──────────────────────────────────────────────────────────────

export type HoldButtonState = 'idle' | 'holding' | 'revealed' | 'complete';

// ─── Gradient Definitions ─────────────────────────────────────────────────────

export interface GradientDefinition {
  id: MemoryGradient;
  colors: string[];
  direction?: string;
  overlayOpacity?: number;
}

// ─── Animation ────────────────────────────────────────────────────────────────

export interface TransitionConfig {
  type: 'fade' | 'dissolve' | 'rise';
  duration: number;
  delay?: number;
}
