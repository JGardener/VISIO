import * as PIXI from 'pixi.js';
import type { LinesElement } from '@/types';
import { hexColor } from '@/utils';

interface AnimatedLine {
  gfx: PIXI.Graphics;
  x: number;
  y: number;
  angle: number;
  length: number;
  vx: number;
  vy: number;
  color: number;
}

export function renderLines(
  container: PIXI.Container,
  el: LinesElement,
  width: number,
  height: number,
  palette: string[] | null,
  addTicker: (cb: (delta: number) => void) => void,
): void {
  const colors = palette ?? el.colors;
  const lines: AnimatedLine[] = [];
  const driftSpeed = 0.6;

  for (let i = 0; i < el.count; i++) {
    const length = el.length.min + Math.random() * (el.length.max - el.length.min);
    const angle = Math.random() * Math.PI * 2;
    const color = hexColor(colors[Math.floor(Math.random() * colors.length)]);

    const gfx = new PIXI.Graphics();
    container.addChild(gfx);

    lines.push({
      gfx,
      x: Math.random() * width,
      y: Math.random() * height,
      angle,
      length,
      vx: Math.cos(angle) * driftSpeed,
      vy: Math.sin(angle) * driftSpeed,
      color,
    });
  }

  addTicker((delta) => {
    for (const l of lines) {
      l.x += l.vx * delta;
      l.y += l.vy * delta;

      // Wrap around edges (use line length as margin so it vanishes cleanly)
      if (l.x < -l.length) l.x = width + l.length;
      if (l.x > width + l.length) l.x = -l.length;
      if (l.y < -l.length) l.y = height + l.length;
      if (l.y > height + l.length) l.y = -l.length;

      l.gfx.clear();
      l.gfx.lineStyle(1, l.color, 0.65);
      l.gfx.moveTo(l.x, l.y);
      l.gfx.lineTo(
        l.x + Math.cos(l.angle) * l.length,
        l.y + Math.sin(l.angle) * l.length,
      );
    }
  });
}
