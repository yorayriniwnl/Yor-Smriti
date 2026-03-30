'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { AppStore, StageId } from '@/types';
import { getNextStage } from '@/lib/stages';

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // ─── State ───────────────────────────────────────────────────────────────
    currentStage: 'opening' as StageId,
    previousStage: null,
    isTransitioning: false,
    soundEnabled: false,
    interactionStarted: false,
    stageHistory: ['opening'],

    // ─── Actions ─────────────────────────────────────────────────────────────

    advanceStage: () => {
      const { currentStage, isTransitioning } = get();
      if (isTransitioning) return;

      const nextStage = getNextStage(currentStage);
      if (!nextStage) return;

      set((state) => ({
        isTransitioning: true,
        previousStage: state.currentStage,
      }));

      // Allow animation to complete before updating
      setTimeout(() => {
        set((state) => ({
          currentStage: nextStage,
          isTransitioning: false,
          stageHistory: [...state.stageHistory, nextStage],
        }));
      }, 100);
    },

    goToStage: (stage: StageId) => {
      const { isTransitioning } = get();
      if (isTransitioning) return;

      set((state) => ({
        isTransitioning: true,
        previousStage: state.currentStage,
      }));

      setTimeout(() => {
        set((state) => ({
          currentStage: stage,
          isTransitioning: false,
          stageHistory: [...state.stageHistory, stage],
        }));
      }, 100);
    },

    toggleSound: () => {
      set((state) => ({ soundEnabled: !state.soundEnabled }));
    },

    markInteractionStarted: () => {
      set({ interactionStarted: true });
    },

    setTransitioning: (value: boolean) => {
      set({ isTransitioning: value });
    },
  }))
);

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectCurrentStage = (state: AppStore) => state.currentStage;
export const selectSoundEnabled = (state: AppStore) => state.soundEnabled;
export const selectIsTransitioning = (state: AppStore) => state.isTransitioning;
export const selectInteractionStarted = (state: AppStore) => state.interactionStarted;
