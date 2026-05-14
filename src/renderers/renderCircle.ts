import * as PIXI from 'pixi.js';
import type { CircleElement } from '@/types';
import { hexColor } from '@/utils';

export function renderCircle(
  container: PIXI.Container,
  el: CircleElement,
  width: number,
  height: number,
  addTicker: (cb: (delta: number) => void) => void,
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
      g.beginFill(color, alpha * el.alpha);
      g.drawCircle(x, y, radius * mult);
      g.endFill();
      container.addChild(g);
    }
  }

  const gfx = new PIXI.Graphics();
  gfx.beginFill(color, el.alpha);
  gfx.drawCircle(x, y, radius);
  gfx.endFill();
  container.addChild(gfx);

  if (el.glow) {
    let phase = 0;
    addTicker((delta) => {
      phase += 0.018 * delta;
      gfx.alpha = el.alpha * (0.82 + 0.18 * Math.sin(phase));
    });
  }
}
