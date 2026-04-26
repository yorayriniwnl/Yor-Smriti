/**
 * Shared A-minor pad chord frequencies.
 *
 * Bug 49 fix: both AmbientSound.tsx and useAudioEngine.ts independently
 * defined the same oscillator frequencies, so any page that mounted both
 * components stacked two identical pads and doubled the volume unintentionally.
 *
 * Fix: the frequencies live here. Both consumers import from this file.
 * Adding, removing, or retuning a frequency now has one authoritative place.
 */

/** A-minor pad: A2 root, A3 octave, C4 third, E4 fifth */
export const AMBIENT_CHORD_FREQS = [
  110,       // A2
  146.83,    // D3 (gentle tension)
  220,       // A3
  261.63,    // C4
  329.63,    // E4
] as const;
