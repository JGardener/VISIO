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
  addTicker: (cb: (ticker: PIXI.Ticker) => void) => void,
): void {
  const colors = palette ?? el.colors;
  const lines: AnimatedLine[] = [];
  const driftSpeed = 0.6;

  for (let i = 0; i < el.count; i++) {
    const length = el.length.min + Math.random() * (el.length.max - el.length.min);
    const angle = Math.random() * Math.PI * 2;
    const color = hexColor(colors[Math.floor(Math.random() * colors.length)]);

    const gfx = new PIXI.Graphics();
    // Draw once in local space from origin; position/rotation handles placement
    gfx.moveTo(0, 0).lineTo(length, 0).stroke({ width: 1, color, alpha: 0.65 });
    gfx.x = Math.random() * width;
    gfx.y = Math.random() * height;
    gfx.rotation = angle;
    container.addChild(gfx);

    lines.push({
      gfx,
      x: gfx.x,
      y: gfx.y,
      angle,
      length,
      vx: Math.cos(angle) * driftSpeed,
      vy: Math.sin(angle) * driftSpeed,
      color,
    });
  }

  addTicker((ticker) => {
    for (const l of lines) {
      l.x += l.vx * ticker.deltaTime;
      l.y += l.vy * ticker.deltaTime;

      // Wrap around edges (use line length as margin so it vanishes cleanly)
      if (l.x < -l.length) l.x = width + l.length;
      if (l.x > width + l.length) l.x = -l.length;
      if (l.y < -l.length) l.y = height + l.length;
      if (l.y > height + l.length) l.y = -l.length;

      l.gfx.x = l.x;
      l.gfx.y = l.y;
    }
  });
}
