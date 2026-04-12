import type { EndingVariant } from '@/lib/experienceEndings';
import { PANDA_SCREEN_IDS } from '@/lib/pandaScreenRegistry';

export interface DirectorRouteConfig {
  start: number;
  ending?: EndingVariant;
}

const routeEntries: Array<[string, DirectorRouteConfig]> = PANDA_SCREEN_IDS.map(
  (screenId, index) => [screenId, { start: index }],
);

export const APOLOGY_DIRECTOR_ROUTE_MAP: Record<string, DirectorRouteConfig> =
  Object.fromEntries(routeEntries);

export function getDirectorRouteConfig(screen: string): DirectorRouteConfig | null {
  return APOLOGY_DIRECTOR_ROUTE_MAP[screen] ?? null;
}
