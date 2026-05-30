import * as PIXI from 'pixi.js';
import type { TrailElement } from '@/types';
import { hexColor } from '@/utils';

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: number;
  history: { x: number; y: number }[];
  gfx: PIXI.Graphics;
}

function velocityFor(
  direction: TrailElement['direction'],
  speed: number,
): { vx: number; vy: number } {
  switch (direction) {
    case 'up':
      return { vx: (Math.random() - 0.5) * speed * 0.3, vy: -(Math.random() * speed * 0.6 + speed * 0.4) };
    case 'down':
      return { vx: (Math.random() - 0.5) * speed * 0.3, vy: Math.random() * speed * 0.6 + speed * 0.4 };
    case 'left':
      return { vx: -(Math.random() * speed * 0.6 + speed * 0.4), vy: (Math.random() - 0.5) * speed * 0.3 };
    case 'right':
      return { vx: Math.random() * speed * 0.6 + speed * 0.4, vy: (Math.random() - 0.5) * speed * 0.3 };
    default: {
      const angle = Math.random() * Math.PI * 2;
      return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
    }
  }
}

export function renderTrail(
  container: PIXI.Container,
  el: TrailElement,
  width: number,
  height: number,
  palette: string[] | null,
  addTicker: (cb: (ticker: PIXI.Ticker) => void) => void,
): void {
  const colors = palette ?? el.colors;
  const particles: TrailParticle[] = [];

  for (let i = 0; i < el.count; i++) {
    const size = el.size.min + Math.random() * (el.size.max - el.size.min);
    const color = hexColor(colors[Math.floor(Math.random() * colors.length)]);
    const { vx, vy } = velocityFor(el.direction, el.speed);
    const x = Math.random() * width;
    const y = Math.random() * height;

    const gfx = new PIXI.Graphics();
    container.addChild(gfx);

    particles.push({ x, y, vx, vy, size, color, history: [], gfx });
  }

  addTicker((ticker) => {
    for (const p of particles) {
      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > el.trail_length) p.history.shift();

      p.x += p.vx * ticker.deltaTime;
      p.y += p.vy * ticker.deltaTime;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.gfx.clear();

      // Draw fading trail polyline
      if (p.history.length > 1) {
        for (let i = 1; i < p.history.length; i++) {
          const alpha = (i / p.history.length) * 0.8;
          p.gfx
            .moveTo(p.history[i - 1].x, p.history[i - 1].y)
            .lineTo(p.history[i].x, p.history[i].y)
            .stroke({ width: p.size * (i / p.history.length), color: p.color, alpha });
        }
      }

      // Draw head
      p.gfx.circle(p.x, p.y, p.size).fill({ color: p.color });
    }
  });
}
