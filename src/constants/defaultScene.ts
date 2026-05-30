import type { SceneDefinition } from '@/types';

export const DEFAULT_SCENE: SceneDefinition = {
  background: { color: '#080a0e' },
  elements: [
    {
      type: 'particles',
      count: 80,
      colors: ['#ffffff', '#a0b8d0', '#4a6fa5'],
      size: { min: 0.8, max: 2.2 },
      speed: 0.4,
      direction: 'up',
      twinkle: true,
    },
    {
      type: 'orbits',
      star: { color: '#ffe066', radius: 18 },
      center_x_pct: 0.5,
      center_y_pct: 0.48,
      bodies: [
        { color: '#4a9eff', radius: 5, orbit_radius_pct: 0.18, speed: 1.2, glow: false },
        { color: '#ff6b6b', radius: 4, orbit_radius_pct: 0.28, speed: 0.7, glow: false },
        { color: '#a0e0a0', radius: 3, orbit_radius_pct: 0.38, speed: 0.4, glow: true },
      ],
    },
  ],
};
