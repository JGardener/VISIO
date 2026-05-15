import { useRef, useCallback, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import type { SceneDefinition } from '@/types';
import { hexColor } from '@/utils';
import {
  renderParticles,
  renderCircle,
  renderOrbits,
  renderLines,
  renderText,
} from '@/renderers';

type TickerCb = (delta: number) => void;

export interface UsePixiReturn {
  appRef: React.MutableRefObject<PIXI.Application | null>;
  clearScene: () => void;
  renderScene: (scene: SceneDefinition, palette: string[] | null) => void;
  applyControls: (speedMult: number, zoom: number) => void;
}

export function usePixi(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
): UsePixiReturn {
  const appRef = useRef<PIXI.Application | null>(null);
  const tickerCbs = useRef<TickerCb[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let app: PIXI.Application | null = null;
    let rafId: number;

    // Defer until after browser layout so the flex container has real dimensions.
    // PIXI reads gl.MAX_FRAGMENT_UNIFORM_VECTORS at init time — returns 0 on a 0×0 canvas.
    rafId = requestAnimationFrame(() => {
      app = new PIXI.Application({
        view: canvas,
        resizeTo: canvas.parentElement ?? window,
        preserveDrawingBuffer: true,
        backgroundColor: 0x080a0e,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });
      appRef.current = app;
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (app) {
        tickerCbs.current.forEach((cb) => app!.ticker.remove(cb as PIXI.TickerCallback<unknown>));
        tickerCbs.current = [];
        app.destroy(false, { children: true, texture: true, baseTexture: true });
      }
      appRef.current = null;
    };
  }, [canvasRef]);

  const clearScene = useCallback(() => {
    const app = appRef.current;
    if (!app) return;

    tickerCbs.current.forEach((cb) => app.ticker.remove(cb as PIXI.TickerCallback<unknown>));
    tickerCbs.current = [];

    while (app.stage.children.length > 0) {
      const child = app.stage.removeChildAt(0);
      child.destroy({ children: true });
    }

    app.stage.scale.set(1);
    app.stage.pivot.set(0, 0);
    app.stage.position.set(0, 0);
    app.stage.alpha = 1;
  }, []);

  const applyControls = useCallback((speedMult: number, zoom: number) => {
    const app = appRef.current;
    if (!app) return;

    app.ticker.speed = speedMult;

    const { width, height } = app.renderer;
    app.stage.scale.set(zoom);
    app.stage.pivot.set(width / 2, height / 2);
    app.stage.position.set(width / 2, height / 2);
  }, []);

  const renderScene = useCallback(
    (scene: SceneDefinition, palette: string[] | null) => {
      const app = appRef.current;
      if (!app) return;

      clearScene();

      (app.renderer as PIXI.Renderer).background.color = hexColor(scene.background.color);

      const { width, height } = app.renderer;

      const addTicker = (cb: TickerCb) => {
        tickerCbs.current.push(cb);
        app.ticker.add(cb as PIXI.TickerCallback<unknown>);
      };

      for (const el of scene.elements) {
        switch (el.type) {
          case 'particles':
            renderParticles(app.stage, el, width, height, palette, addTicker);
            break;
          case 'circle':
            renderCircle(app.stage, el, width, height, addTicker);
            break;
          case 'orbits':
            renderOrbits(app.stage, el, width, height, addTicker);
            break;
          case 'lines':
            renderLines(app.stage, el, width, height, palette, addTicker);
            break;
          case 'text':
            renderText(app.stage, el, width, height);
            break;
        }
      }
    },
    [clearScene],
  );

  return { appRef, clearScene, renderScene, applyControls };
}
