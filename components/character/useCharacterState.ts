'use client';

import { useMemo } from 'react';
import {
  resolveCharacterConfig,
  type CharacterSceneConfig,
} from '@/components/character/characterConfig';

export function useCharacterState(screenId?: number | null): CharacterSceneConfig | null {
  return useMemo(() => {
    if (typeof screenId !== 'number') {
      return null;
    }

    return resolveCharacterConfig(screenId);
  }, [screenId]);
}

