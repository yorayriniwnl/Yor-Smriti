import type { StageConfig, StageId } from '@/types';

// ─── Stage Definitions ───────────────────────────────────────────────────────

export const STAGES: StageConfig[] = [
  {
    id: 'opening',
    next: 'chat',
    label: 'Opening',
  },
  {
    id: 'chat',
    next: 'transition',
    label: 'Conversation',
  },
  {
    id: 'transition',
    next: 'memory',
    label: 'Transition',
  },
  {
    id: 'memory',
    next: 'accountability',
    label: 'Memory',
  },
  {
    id: 'accountability',
    next: 'apology',
    label: 'Accountability',
  },
  {
    id: 'apology',
    next: 'hold',
    label: 'Apology',
  },
  {
    id: 'hold',
    next: 'ending',
    label: 'Hold',
  },
  {
    id: 'ending',
    next: null,
    label: 'Ending',
  },
];

// ─── Stage Map ───────────────────────────────────────────────────────────────

export const STAGE_MAP = new Map<StageId, StageConfig>(
  STAGES.map((stage) => [stage.id, stage])
);

// ─── Helper: Get Next Stage ───────────────────────────────────────────────────

export function getNextStage(currentId: StageId): StageId | null {
  return STAGE_MAP.get(currentId)?.next ?? null;
}

// ─── Helper: Get Stage Index ─────────────────────────────────────────────────

export function getStageIndex(id: StageId): number {
  return STAGES.findIndex((s) => s.id === id);
}

// ─── Helper: Is Last Stage ───────────────────────────────────────────────────

export function isLastStage(id: StageId): boolean {
  return STAGE_MAP.get(id)?.next === null;
}

// ─── Helper: Stage Progress ──────────────────────────────────────────────────

export function getStageProgress(id: StageId): number {
  const index = getStageIndex(id);
  return index / (STAGES.length - 1);
}

// ─── Stage Background Intensities ────────────────────────────────────────────
// Controls how much ambient glow is visible at each stage

export const STAGE_AMBIENT_CONFIG: Record<StageId, {
  orbOpacity: number;
  orbSize: number;
  grainOpacity: number;
}> = {
  opening: {
    orbOpacity: 0.12,
    orbSize: 400,
    grainOpacity: 0.35,
  },
  chat: {
    orbOpacity: 0.10,
    orbSize: 350,
    grainOpacity: 0.30,
  },
  transition: {
    orbOpacity: 0.18,
    orbSize: 500,
    grainOpacity: 0.28,
  },
  memory: {
    orbOpacity: 0.20,
    orbSize: 450,
    grainOpacity: 0.32,
  },
  accountability: {
    orbOpacity: 0.08,
    orbSize: 300,
    grainOpacity: 0.40,
  },
  apology: {
    orbOpacity: 0.15,
    orbSize: 380,
    grainOpacity: 0.35,
  },
  hold: {
    orbOpacity: 0.22,
    orbSize: 420,
    grainOpacity: 0.30,
  },
  ending: {
    orbOpacity: 0.10,
    orbSize: 350,
    grainOpacity: 0.25,
  },
};
