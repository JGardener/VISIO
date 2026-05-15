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
  addTicker: (cb: (delta: number) => void) => void,
): void {
  const cx = el.center_x_pct * width;
  const cy = el.center_y_pct * height;
  const starColor = hexColor(el.star.color);

  // Star glow halo
  const starGlow = new PIXI.Graphics();
  starGlow.beginFill(starColor, 0.12);
  starGlow.drawCircle(cx, cy, el.star.radius * 3.5);
  starGlow.endFill();
  container.addChild(starGlow);

  // Star body
  const starGfx = new PIXI.Graphics();
  starGfx.beginFill(starColor);
  starGfx.drawCircle(cx, cy, el.star.radius);
  starGfx.endFill();
  container.addChild(starGfx);

  // Subtle star pulse
  let starPhase = 0;
  addTicker((delta) => {
    starPhase += 0.02 * delta;
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
      glow.beginFill(bodyColor, 0.15);
      glow.drawCircle(0, 0, body.radius * 2.8);
      glow.endFill();
      bodyContainer.addChild(glow);
    }

    const bodyGfx = new PIXI.Graphics();
    bodyGfx.beginFill(bodyColor);
    bodyGfx.drawCircle(0, 0, body.radius);
    bodyGfx.endFill();
    bodyContainer.addChild(bodyGfx);

    container.addChild(bodyContainer);
    animatedBodies.push({ bodyContainer, orbitRadius, speed: body.speed, angle: initialAngle });
  }

  addTicker((delta) => {
    for (const b of animatedBodies) {
      b.angle += b.speed * 0.01 * delta;
      b.bodyContainer.x = cx + Math.cos(b.angle) * b.orbitRadius;
      b.bodyContainer.y = cy + Math.sin(b.angle) * b.orbitRadius;
    }
  });
}
