import * as PIXI from 'pixi.js';
import type { CircleElement } from '@/types';
import { hexColor } from '@/utils';

export function renderCircle(
  container: PIXI.Container,
  el: CircleElement,
  width: number,
  height: number,
  addTicker: (cb: (ticker: PIXI.Ticker) => void) => void,
): void {
  const x = el.x_pct * width;
  const y = el.y_pct * height;
  const radius = el.radius_pct * width;
  const color = hexColor(el.color);

  if (el.glow) {
    const glowLayers: Array<{ mult: number; alpha: number }> = [
      { mult: 2.8, alpha: 0.05 },
      { mult: 1.9, alpha: 0.10 },
      { mult: 1.4, alpha: 0.18 },
    ];
    for (const { mult, alpha } of glowLayers) {
      const g = new PIXI.Graphics();
      g.circle(x, y, radius * mult).fill({ color, alpha: alpha * el.alpha });
      container.addChild(g);
    }
  }

  const gfx = new PIXI.Graphics();
  gfx.circle(x, y, radius).fill({ color, alpha: el.alpha });
  container.addChild(gfx);

  if (el.glow) {
    let phase = 0;
    addTicker((ticker) => {
      phase += 0.018 * ticker.deltaTime;
      gfx.alpha = el.alpha * (0.82 + 0.18 * Math.sin(phase));
    });
  }
}
