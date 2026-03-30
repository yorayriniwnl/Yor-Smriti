import type { EndingVariant } from '@/lib/experienceEndings';

export interface DirectorRouteConfig {
  start: number;
  ending?: EndingVariant;
}

export const APOLOGY_DIRECTOR_ROUTE_MAP: Record<string, DirectorRouteConfig> = {
  '80': { start: 0 },
  '81': { start: 1 },
  '82': { start: 2 },
  '83': { start: 3 },
  '84': { start: 4 },
  '85': { start: 5 },
  '86': { start: 6, ending: 'closure' },
  '87': { start: 6, ending: 'hopeful' },
};

export function getDirectorRouteConfig(screen: string): DirectorRouteConfig | null {
  return APOLOGY_DIRECTOR_ROUTE_MAP[screen] ?? null;
}
