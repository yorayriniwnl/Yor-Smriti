export type CharacterVariant = 'keyrin' | 'ayrin';

export type CharacterAnchor = 'left' | 'right';

export interface CharacterSceneConfig {
  variant: CharacterVariant;
  url: string;
  anchor: CharacterAnchor;
  position: [number, number, number];
  scale: number;
  rotationY: number;
  bobAmplitude: number;
  bobSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
  glow: string;
  rim: string;
  shadow: string;
}

const CHARACTER_VARIANT_CONFIG: Record<CharacterVariant, CharacterSceneConfig> = {
  keyrin: {
    variant: 'keyrin',
    url: '/models/keyrin.glb',
    anchor: 'right',
    position: [0.58, -1.36, 0],
    scale: 1.08,
    rotationY: -0.12,
    bobAmplitude: 0.012,
    bobSpeed: 1.15,
    swayAmplitude: 0.035,
    swaySpeed: 0.24,
    glow: 'radial-gradient(circle, rgba(255, 141, 188, 0.34), rgba(255, 141, 188, 0) 72%)',
    rim: 'rgba(255, 208, 228, 0.2)',
    shadow: 'rgba(43, 10, 26, 0.26)',
  },
  ayrin: {
    variant: 'ayrin',
    url: '/models/ayrin.glb',
    anchor: 'left',
    position: [-0.6, -1.34, 0],
    scale: 1.06,
    rotationY: 0.12,
    bobAmplitude: 0.01,
    bobSpeed: 1.05,
    swayAmplitude: 0.03,
    swaySpeed: 0.22,
    glow: 'radial-gradient(circle, rgba(255, 196, 122, 0.28), rgba(255, 196, 122, 0) 72%)',
    rim: 'rgba(255, 228, 196, 0.18)',
    shadow: 'rgba(34, 18, 10, 0.24)',
  },
};

const DIRECTOR_SCREEN_VARIANTS: Partial<Record<number, CharacterVariant>> = {
  82: 'ayrin',
  83: 'keyrin',
  84: 'ayrin',
  85: 'ayrin',
  86: 'keyrin',
  87: 'keyrin',
};

export function resolveCharacterVariant(screenId: number): CharacterVariant | null {
  return DIRECTOR_SCREEN_VARIANTS[screenId] ?? null;
}

export function resolveCharacterConfig(screenId: number): CharacterSceneConfig | null {
  const variant = resolveCharacterVariant(screenId);
  if (!variant) {
    return null;
  }

  return CHARACTER_VARIANT_CONFIG[variant];
}

