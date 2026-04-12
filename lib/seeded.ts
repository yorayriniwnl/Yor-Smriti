// Small deterministic pseudo-random unit generator used across visual components
export function seededUnit(seed: number): number {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}
