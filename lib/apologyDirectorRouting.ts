import type { EndingVariant } from '@/lib/experienceEndings';

export interface DirectorRouteConfig {
  start: number;
  ending?: EndingVariant;
}

const DIRECTOR_START_SCREEN = 80;
const DIRECTOR_END_SCREEN = 119;

export const APOLOGY_DIRECTOR_ROUTE_MAP: Record<string, DirectorRouteConfig> =
  Object.fromEntries(
    Array.from({ length: DIRECTOR_END_SCREEN - DIRECTOR_START_SCREEN + 1 }, (_, index) => {
      const screen = String(DIRECTOR_START_SCREEN + index);
      return [screen, { start: index }];
    }),
  );

export function getDirectorRouteConfig(screen: string): DirectorRouteConfig | null {
  return APOLOGY_DIRECTOR_ROUTE_MAP[screen] ?? null;
}
