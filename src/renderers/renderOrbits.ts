import * as PIXI from 'pixi.js';
import type { OrbitsElement } from '@/types';
import { hexColor } from '@/utils';

interface AnimatedBody {
  bodyContainer: PIXI.Container;
  orbitRadius: number;
  speed: number;
  angle: number;
}

export function renderOrbits(
  container: PIXI.Container,
  el: OrbitsElement,
  width: number,
  height: number,
  addTicker: (cb: (ticker: PIXI.Ticker) => void) => void,
): void {
  const cx = el.center_x_pct * width;
  const cy = el.center_y_pct * height;
  const starColor = hexColor(el.star.color);

  // Star glow halo
  const starGlow = new PIXI.Graphics();
  starGlow.circle(cx, cy, el.star.radius * 3.5).fill({ color: starColor, alpha: 0.12 });
  container.addChild(starGlow);

  // Star body
  const starGfx = new PIXI.Graphics();
  starGfx.circle(cx, cy, el.star.radius).fill({ color: starColor });
  container.addChild(starGfx);

  // Subtle star pulse
  let starPhase = 0;
  addTicker((ticker) => {
    starPhase += 0.02 * ticker.deltaTime;
    starGlow.alpha = 0.7 + 0.3 * Math.sin(starPhase);
  });

  // Orbiting bodies
  const animatedBodies: AnimatedBody[] = [];

  for (const body of el.bodies) {
    const orbitRadius = body.orbit_radius_pct * width;
    const initialAngle = Math.random() * Math.PI * 2;
    const bodyColor = hexColor(body.color);

    const bodyContainer = new PIXI.Container();

    if (body.glow) {
      const glow = new PIXI.Graphics();
      glow.circle(0, 0, body.radius * 2.8).fill({ color: bodyColor, alpha: 0.15 });
      bodyContainer.addChild(glow);
    }

    const bodyGfx = new PIXI.Graphics();
    bodyGfx.circle(0, 0, body.radius).fill({ color: bodyColor });
    bodyContainer.addChild(bodyGfx);

    container.addChild(bodyContainer);
    animatedBodies.push({ bodyContainer, orbitRadius, speed: body.speed, angle: initialAngle });
  }

  addTicker((ticker) => {
    for (const b of animatedBodies) {
      b.angle += b.speed * 0.01 * ticker.deltaTime;
      b.bodyContainer.x = cx + Math.cos(b.angle) * b.orbitRadius;
      b.bodyContainer.y = cy + Math.sin(b.angle) * b.orbitRadius;
    }
  });
}
