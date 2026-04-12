'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import LoadingFallback from '@/components/ui/LoadingFallback';
const OpeningStage = dynamic(
  () => import('@/components/stages/OpeningStage').then((m) => m.OpeningStage),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const ChatStage = dynamic(
  () => import('@/components/stages/ChatStage').then((m) => m.ChatStage),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const TransitionStage = dynamic(
  () => import('@/components/stages/TransitionStage').then((m) => m.TransitionStage),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const MemoryStage = dynamic(
  () => import('@/components/stages/MemoryStage').then((m) => m.MemoryStage),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const AccountabilityStage = dynamic(
  () => import('@/components/stages/AccountabilityStage').then((m) => m.AccountabilityStage),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const ApologyStage = dynamic(
  () => import('@/components/stages/ApologyStage').then((m) => m.ApologyStage),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const HoldStage = dynamic(
  () => import('@/components/stages/HoldStage').then((m) => m.HoldStage),
  { ssr: false, loading: () => <LoadingFallback compact /> },
);
const EndingStage = dynamic(
  () => import('@/components/stages/EndingStage').then((m) => m.EndingStage),
  { ssr: false, loading: () => <LoadingFallback /> },
);
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
