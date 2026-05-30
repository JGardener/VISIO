import * as PIXI from 'pixi.js';
import type { ParticlesElement } from '@/types';
import { hexColor } from '@/utils';

interface Particle {
  gfx: PIXI.Graphics;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  age: number;
}

function velocityFor(
  direction: ParticlesElement['direction'],
  speed: number,
): { vx: number; vy: number } {
  const spread = (Math.random() - 0.5) * speed * 0.4;
  const main = Math.random() * speed * 0.6 + speed * 0.4;
  switch (direction) {
    case 'up':    return { vx: spread, vy: -main };
    case 'down':  return { vx: spread, vy: main };
    case 'left':  return { vx: -main, vy: spread };
    case 'right': return { vx: main,  vy: spread };
    default: {
      const angle = Math.random() * Math.PI * 2;
      return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
    }
  }
}

const FADE_IN_FRAMES = 30;

export function renderParticles(
  container: PIXI.Container,
  el: ParticlesElement,
  width: number,
  height: number,
  palette: string[] | null,
  addTicker: (cb: (ticker: PIXI.Ticker) => void) => void,
): void {
  const colors = palette ?? el.colors;
  const particles: Particle[] = [];

  for (let i = 0; i < el.count; i++) {
    const size = el.size.min + Math.random() * (el.size.max - el.size.min);
    const color = hexColor(colors[Math.floor(Math.random() * colors.length)]);
    const { vx, vy } = velocityFor(el.direction, el.speed);

    const gfx = new PIXI.Graphics();
    gfx.circle(0, 0, size).fill({ color });
    gfx.x = Math.random() * width;
    gfx.y = Math.random() * height;
    gfx.alpha = 0;
    container.addChild(gfx);

    particles.push({ gfx, vx, vy, size, phase: Math.random() * Math.PI * 2, age: 0 });
  }

  addTicker((ticker) => {
    for (const p of particles) {
      p.gfx.x += p.vx * ticker.deltaTime;
      p.gfx.y += p.vy * ticker.deltaTime;
      p.age += ticker.deltaTime;

      // Wrap around edges
      if (p.gfx.x < -p.size) p.gfx.x = width + p.size;
      if (p.gfx.x > width + p.size) p.gfx.x = -p.size;
      if (p.gfx.y < -p.size) p.gfx.y = height + p.size;
      if (p.gfx.y > height + p.size) p.gfx.y = -p.size;

      const fadeIn = Math.min(1, p.age / FADE_IN_FRAMES);
      if (el.twinkle) {
        p.phase += 0.05 * ticker.deltaTime;
        p.gfx.alpha = fadeIn * (0.4 + 0.6 * Math.abs(Math.sin(p.phase)));
      } else {
        p.gfx.alpha = fadeIn;
      }
    }
  });
}
