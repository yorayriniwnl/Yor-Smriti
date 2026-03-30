'use client';

import { useAppStore } from '@/hooks/useStageController';
import { getStageProgress } from '@/lib/stages';

// ─── StageProgressBar ───────────────────────────────────────────────────────

export function StageProgressBar() {
  const currentStage = useAppStore((s) => s.currentStage);
  const progress = getStageProgress(currentStage) * 100;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[220] h-[3px] w-full"
      aria-hidden="true"
    >
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background:
            'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
          boxShadow: '0 0 20px rgba(247, 85, 144, 0.35)',
          transition: 'width 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
    </div>
  );
}
