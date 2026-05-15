import * as PIXI from 'pixi.js';
import type { ParticlesElement } from '@/types';
import { hexColor } from '@/utils';

interface Particle {
  gfx: PIXI.Graphics;
  vx: number;
  vy: number;
  size: number;
  phase: number;
}

export function renderParticles(
  container: PIXI.Container,
  el: ParticlesElement,
  width: number,
  height: number,
  palette: string[] | null,
  addTicker: (cb: (delta: number) => void) => void,
): void {
  const colors = palette ?? el.colors;
  const particles: Particle[] = [];

  for (let i = 0; i < el.count; i++) {
    const size = el.size.min + Math.random() * (el.size.max - el.size.min);
    const color = hexColor(colors[Math.floor(Math.random() * colors.length)]);
    const baseSpeed = el.speed;

    let vx: number;
    let vy: number;
    if (el.direction === 'up') {
      vx = (Math.random() - 0.5) * baseSpeed * 0.4;
      vy = -(Math.random() * baseSpeed * 0.6 + baseSpeed * 0.4);
    } else {
      const angle = Math.random() * Math.PI * 2;
      vx = Math.cos(angle) * baseSpeed;
      vy = Math.sin(angle) * baseSpeed;
    }

    const gfx = new PIXI.Graphics();
    gfx.beginFill(color);
    gfx.drawCircle(0, 0, size);
    gfx.endFill();
    gfx.x = Math.random() * width;
    gfx.y = Math.random() * height;
    container.addChild(gfx);

    particles.push({ gfx, vx, vy, size, phase: Math.random() * Math.PI * 2 });
  }

  addTicker((delta) => {
    for (const p of particles) {
      p.gfx.x += p.vx * delta;
      p.gfx.y += p.vy * delta;

      // Wrap around edges
      if (p.gfx.x < -p.size) p.gfx.x = width + p.size;
      if (p.gfx.x > width + p.size) p.gfx.x = -p.size;
      if (p.gfx.y < -p.size) p.gfx.y = height + p.size;
      if (p.gfx.y > height + p.size) p.gfx.y = -p.size;

      if (el.twinkle) {
        p.phase += 0.05 * delta;
        p.gfx.alpha = 0.4 + 0.6 * Math.abs(Math.sin(p.phase));
      }
    }
  });
}
