// ─── Stage System ───────────────────────────────────────────────────────────

export type StageId =
  | 'opening'
  | 'chat'
  | 'transition'
  | 'memory'
  | 'accountability'
  | 'apology'
  | 'hold'
  | 'ending';

export interface StageConfig {
  id: StageId;
  next: StageId | null;
  label: string;
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface AppState {
  currentStage: StageId;
  previousStage: StageId | null;
  isTransitioning: boolean;
  soundEnabled: boolean;
  interactionStarted: boolean;
  stageHistory: StageId[];
}

export interface AppActions {
  advanceStage: () => void;
  goToStage: (stage: StageId) => void;
  toggleSound: () => void;
  markInteractionStarted: () => void;
  setTransitioning: (value: boolean) => void;
}

export type AppStore = AppState & AppActions;

// ─── Chat Messages ───────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  text: string;
  typingDuration: number;   // ms to show typing indicator
  revealDelay: number;      // ms after previous message revealed
  isLast?: boolean;
}

// ─── Memories ───────────────────────────────────────────────────────────────

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
  pauseBefore: number;  // ms before this card appears
  pauseAfter: number;   // ms before next card appears
}

// ─── Accountability Lines ────────────────────────────────────────────────────

export interface AccountabilityLine {
  id: string;
  text: string;
  pauseAfter: number;  // ms before next line appears
  emphasis?: boolean;  // slightly larger/brighter
}

// ─── Apology Lines ──────────────────────────────────────────────────────────

export interface ApologyLine {
  id: string;
  text: string;
  pauseAfter: number;
  isOptional?: boolean;
  italic?: boolean;
  emphasis?: boolean;
}

// ─── Animation Variants ─────────────────────────────────────────────────────

export interface MotionVariants {
  hidden: Record<string, unknown>;
  visible: Record<string, unknown>;
  exit: Record<string, unknown>;
}

// ─── Sound System ────────────────────────────────────────────────────────────

export interface AmbientSoundConfig {
  oscillatorType: OscillatorType;
  frequency: number;
  gain: number;
  attackTime: number;
  releaseTime: number;
}

// ─── Typewriter ──────────────────────────────────────────────────────────────

export interface TypewriterConfig {
  text: string;
  speed?: number;       // ms per character
  startDelay?: number;  // ms before starting
  onComplete?: () => void;
}

export interface TypewriterState {
  displayText: string;
  isComplete: boolean;
  isStarted: boolean;
}

// ─── Hold Button ─────────────────────────────────────────────────────────────

export interface HoldButtonConfig {
  label: string;
  holdDuration: number;  // ms to hold
  revealText: string;
  onComplete: () => void;
}

export type HoldButtonState = 'idle' | 'holding' | 'revealed' | 'complete';

// ─── Memory Gradients ────────────────────────────────────────────────────────

export interface GradientDefinition {
  id: MemoryGradient;
  colors: string[];
  direction?: string;
  overlayOpacity?: number;
}

// ─── Stage Transition ────────────────────────────────────────────────────────

export interface TransitionConfig {
  type: 'fade' | 'dissolve' | 'rise';
  duration: number;
  delay?: number;
}

// ─── Sound Waveform ──────────────────────────────────────────────────────────

export interface WaveformNode {
  frequency: number;
  gain: number;
  type: OscillatorType;
  detune?: number;
}
