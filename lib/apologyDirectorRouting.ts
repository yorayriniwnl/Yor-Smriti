import type { EndingVariant } from '@/lib/experienceEndings';
import { PANDA_SCREEN_IDS } from '@/lib/pandaScreenRegistry';

export interface DirectorRouteConfig {
  start: number;
  ending?: EndingVariant;
}

const PUBLIC_START_SCREEN = 1;
const SCREEN_COUNT = PANDA_SCREEN_IDS.length;

const routeEntries: Array<[string, DirectorRouteConfig]> = [];

for (let index = 0; index < SCREEN_COUNT; index += 1) {
  routeEntries.push([String(PUBLIC_START_SCREEN + index), { start: index }]);
}

export const APOLOGY_DIRECTOR_ROUTE_MAP: Record<string, DirectorRouteConfig> =
  Object.fromEntries(routeEntries);

export function getDirectorRouteConfig(screen: string): DirectorRouteConfig | null {
  return APOLOGY_DIRECTOR_ROUTE_MAP[screen] ?? null;
}
