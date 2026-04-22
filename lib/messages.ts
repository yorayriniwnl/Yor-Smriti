import type { GradientDefinition, MemoryGradient } from '@/types';

export const MEMORY_GRADIENTS: Record<MemoryGradient, GradientDefinition> = {
  'warm-dusk': {
    id: 'warm-dusk',
    colors: ['#2d1b0e', '#5c3317', '#8b4513', '#c4752d', '#e8a058'],
    direction: '135deg',
    overlayOpacity: 0.3,
  },
  'cool-morning': {
    id: 'cool-morning',
    colors: ['#0d1520', '#1a2a40', '#243450', '#2e4060', '#3a5070'],
    direction: '160deg',
    overlayOpacity: 0.25,
  },
  'golden-hour': {
    id: 'golden-hour',
    colors: ['#1a0d00', '#4a2800', '#8b5000', '#c8800a', '#e8a830'],
    direction: '120deg',
    overlayOpacity: 0.35,
  },
  'rainy-afternoon': {
    id: 'rainy-afternoon',
    colors: ['#12161a', '#1e2830', '#283845', '#324858', '#3c5868'],
    direction: '175deg',
    overlayOpacity: 0.20,
  },
  'late-night': {
    id: 'late-night',
    colors: ['#0a0a10', '#12121e', '#1a1a2e', '#22223e', '#2a2a50'],
    direction: '180deg',
    overlayOpacity: 0.15,
  },
};

export function buildGradientCSS(gradient: MemoryGradient): string {
  const def = MEMORY_GRADIENTS[gradient];
  const stops = def.colors
    .map((color, i) => {
      const pct = Math.round((i / (def.colors.length - 1)) * 100);
      return `${color} ${pct}%`;
    })
    .join(', ');
  return `linear-gradient(${def.direction ?? '135deg'}, ${stops})`;
}
