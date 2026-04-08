'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/hooks/useStageController';
import type { StageId } from '@/types';

const OpeningStage = dynamic(() => import('@/components/stages/OpeningStage').then((m) => m.OpeningStage), {
  ssr: false,
  loading: () => null,
});
const ChatStage = dynamic(() => import('@/components/stages/ChatStage').then((m) => m.ChatStage), {
  ssr: false,
  loading: () => null,
});
const TransitionStage = dynamic(() => import('@/components/stages/TransitionStage').then((m) => m.TransitionStage), {
  ssr: false,
  loading: () => null,
});
const MemoryStage = dynamic(() => import('@/components/stages/MemoryStage').then((m) => m.MemoryStage), {
  ssr: false,
  loading: () => null,
});
const AccountabilityStage = dynamic(
  () => import('@/components/stages/AccountabilityStage').then((m) => m.AccountabilityStage),
  { ssr: false, loading: () => null }
);
const ApologyStage = dynamic(() => import('@/components/stages/ApologyStage').then((m) => m.ApologyStage), {
  ssr: false,
  loading: () => null,
});
const HoldStage = dynamic(() => import('@/components/stages/HoldStage').then((m) => m.HoldStage), {
  ssr: false,
  loading: () => null,
});
const EndingStage = dynamic(() => import('@/components/stages/EndingStage').then((m) => m.EndingStage), {
  ssr: false,
  loading: () => null,
});

// ─── Stage Map ────────────────────────────────────────────────────────────────

const STAGE_COMPONENTS: Record<StageId, React.ComponentType<any>> = {
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
  const regionRef = useRef<HTMLDivElement | null>(null);

  // Move focus to the stage region when the stage changes so screen readers announce it.
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    // Ensure element is focusable then focus
    const prevTab = el.getAttribute('tabindex');
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    if (prevTab === null) el.removeAttribute('tabindex');
  }, [currentStage]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, y: -6, transition: { duration: 0.4 } }}
        ref={regionRef}
        role="region"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Stage: ${currentStage}`}
        className="stage-region"
      >
        <StageComponent />
      </motion.div>
    </AnimatePresence>
  );
}
