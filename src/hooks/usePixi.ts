import { useRef, useCallback, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import type { SceneDefinition, ControlsState } from '@/types';
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
  renderScene: (scene: SceneDefinition, controls: ControlsState) => void;
}

export function usePixi(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
): UsePixiReturn {
  const appRef = useRef<PIXI.Application | null>(null);
  const tickerCbs = useRef<TickerCb[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new PIXI.Application({
      view: canvas,
      resizeTo: canvas.parentElement ?? window,
      preserveDrawingBuffer: true,
      backgroundColor: 0x080a0e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    appRef.current = app;

    return () => {
      tickerCbs.current.forEach((cb) => app.ticker.remove(cb as PIXI.TickerCallback<unknown>));
      tickerCbs.current = [];
      app.destroy(false, { children: true, texture: true, baseTexture: true });
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

    // Reset stage transform and tint so remnant values don't bleed into next scene
    app.stage.scale.set(1);
    app.stage.pivot.set(0, 0);
    app.stage.position.set(0, 0);
    app.stage.alpha = 1;
  }, []);

  const renderScene = useCallback(
    (scene: SceneDefinition, controls: ControlsState) => {
      const app = appRef.current;
      if (!app) return;

      clearScene();

      (app.renderer as PIXI.Renderer).backgroundColor = hexColor(scene.background.color);

      const { width, height } = app.renderer;
      const { speedMult, zoom, palette } = controls;
      const paletteColors = palette?.colors ?? null;

      // Zoom to centre: pivot at stage centre, position to screen centre
      app.stage.scale.set(zoom);
      app.stage.pivot.set(width / 2, height / 2);
      app.stage.position.set(width / 2, height / 2);

      const addTicker = (cb: TickerCb) => {
        tickerCbs.current.push(cb);
        app.ticker.add(cb as PIXI.TickerCallback<unknown>);
      };

      for (const el of scene.elements) {
        switch (el.type) {
          case 'particles':
            renderParticles(app.stage, el, width, height, speedMult, paletteColors, addTicker);
            break;
          case 'circle':
            renderCircle(app.stage, el, width, height, addTicker);
            break;
          case 'orbits':
            renderOrbits(app.stage, el, width, height, speedMult, addTicker);
            break;
          case 'lines':
            renderLines(app.stage, el, width, height, speedMult, paletteColors, addTicker);
            break;
          case 'text':
            renderText(app.stage, el, width, height);
            break;
        }
      }
    },
    [clearScene],
  );

  return { appRef, clearScene, renderScene };
}
