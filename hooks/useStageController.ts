'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { AppStore, StageId } from '@/types';
import { getNextStage } from '@/lib/stages';

// Shared timer used to debounce/clear overlapping transition timers
let transitionTimer: ReturnType<typeof setTimeout> | null = null;

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // ─── State ───────────────────────────────────────────────────────────────
    currentStage: 'opening',
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
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
      transitionTimer = setTimeout(() => {
        set((state) => ({
          currentStage: nextStage,
          isTransitioning: false,
          stageHistory: [...state.stageHistory, nextStage],
        }));
        transitionTimer = null;
      }, 100);
    },

    goToStage: (stage: StageId) => {
      const { isTransitioning } = get();
      if (isTransitioning) return;

      set((state) => ({
        isTransitioning: true,
        previousStage: state.currentStage,
      }));

      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
      transitionTimer = setTimeout(() => {
        set((state) => ({
          currentStage: stage,
          isTransitioning: false,
          stageHistory: [...state.stageHistory, stage],
        }));
        transitionTimer = null;
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
