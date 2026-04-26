/**
 * Deterministic pseudo-random unit generator used across visual components.
 *
 * Bug 62 fix: the previous Math.sin(seed × 12.9898) × 43758.5453 approach
 * produces visible periodic banding for sequential integer seeds at ≥28 items
 * (RainLayer, FloatingParticles). The sine function's wave structure leaks into
 * the fractional part, making positions repeat noticeably at count > 50.
 *
 * Fix: splitmix32 — a well-studied integer hash with strong avalanche properties.
 * Sequential seeds produce statistically uniform outputs with no visible pattern.
 * All call sites are unchanged: seededUnit(n) still returns a float in [0, 1).
 */
function splitmix32(seed: number): number {
  let s = seed >>> 0; // coerce to uint32
  s = Math.imul(s ^ (s >>> 16), 0x45d9f3b) >>> 0;
  s = Math.imul(s ^ (s >>> 16), 0x45d9f3b) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0;
  return s / 0x100000000; // [0, 1)
}

export function seededUnit(seed: number): number {
  return splitmix32(seed);
}

/**
 * Returns a seeded float in [min, max).
 * Convenience wrapper for ranged values.
 */
export function seededRange(seed: number, min: number, max: number): number {
  return min + seededUnit(seed) * (max - min);
}
