import { useState, useCallback } from 'react';
import type { ControlsState, Palette } from '@/types';
import { PALETTES } from '@/constants';

export interface UseControlsReturn {
  controls: ControlsState;
  setSpeedMult: (v: number) => void;
  setZoom: (v: number) => void;
  setPalette: (v: Palette | null) => void;
}

export function useControls(): UseControlsReturn {
  const [controls, setControls] = useState<ControlsState>({
    speedMult: 1,
    zoom: 1,
    palette: PALETTES[0],
  });

  const setSpeedMult = useCallback((speedMult: number) => {
    setControls((prev) => ({ ...prev, speedMult }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setControls((prev) => ({ ...prev, zoom }));
  }, []);

  const setPalette = useCallback((palette: Palette | null) => {
    setControls((prev) => ({ ...prev, palette }));
  }, []);

  return { controls, setSpeedMult, setZoom, setPalette };
}
