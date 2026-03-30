'use client';

import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { OpeningStage } from '@/components/stages/OpeningStage';
import { ChatStage } from '@/components/stages/ChatStage';
import { TransitionStage } from '@/components/stages/TransitionStage';
import { MemoryStage } from '@/components/stages/MemoryStage';
import { AccountabilityStage } from '@/components/stages/AccountabilityStage';
import { ApologyStage } from '@/components/stages/ApologyStage';
import { HoldStage } from '@/components/stages/HoldStage';
import { EndingStage } from '@/components/stages/EndingStage';
import type { StageId } from '@/types';

// ─── Stage Map ────────────────────────────────────────────────────────────────

const STAGE_COMPONENTS: Record<StageId, React.ComponentType> = {
  opening: OpeningStage,
  chat: ChatStage,
  transition: TransitionStage,
  memory: MemoryStage,
  accountability: AccountabilityStage,
  apology: ApologyStage,
  hold: HoldStage,
  ending: EndingStage,
};

// ─── StageRenderer ────────────────────────────────────────────────────────────

export function StageRenderer() {
  const currentStage = useAppStore((s) => s.currentStage);
  const StageComponent = STAGE_COMPONENTS[currentStage];

  return (
    <AnimatePresence mode="wait">
      <StageComponent key={currentStage} />
    </AnimatePresence>
  );
}
