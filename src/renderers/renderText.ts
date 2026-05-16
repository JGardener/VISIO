import * as PIXI from 'pixi.js';
import type { TextElement } from '@/types';

export function renderText(
  container: PIXI.Container,
  el: TextElement,
  width: number,
  height: number,
): void {
  const text = new PIXI.Text({
    text: el.content,
    style: {
      fill: el.color,
      fontSize: el.size,
      fontFamily: 'Space Mono, monospace',
    },
  });
  text.anchor.set(0.5);
  text.x = el.x_pct * width;
  text.y = el.y_pct * height;
  container.addChild(text);
}
