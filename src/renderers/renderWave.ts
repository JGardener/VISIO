import * as PIXI from 'pixi.js';
import type { WaveElement } from '@/types';
import { hexColor } from '@/utils';

export function renderWave(
  container: PIXI.Container,
  el: WaveElement,
  width: number,
  height: number,
  palette: string[] | null,
  addTicker: (cb: (ticker: PIXI.Ticker) => void) => void,
): void {
  const colors = palette ?? el.colors;
  const amplitude = el.amplitude_pct * height;
  const waves: { gfx: PIXI.Graphics; offset: number; color: number }[] = [];

  for (let i = 0; i < el.count; i++) {
    const color = hexColor(colors[i % colors.length]);
    const gfx = new PIXI.Graphics();
    container.addChild(gfx);
    waves.push({ gfx, offset: (i / el.count) * Math.PI * 2, color });
  }

  let time = 0;

  addTicker((ticker) => {
    time += el.speed * 0.01 * ticker.deltaTime;

    for (const w of waves) {
      w.gfx.clear();
      w.gfx.moveTo(0, height / 2);

      for (let x = 0; x <= width; x += 4) {
        const y = height / 2 + Math.sin(x * el.frequency * 0.01 + time + w.offset) * amplitude;
        w.gfx.lineTo(x, y);
      }

      w.gfx.stroke({ width: 1.5, color: w.color, alpha: el.alpha });
    }
  });
}
