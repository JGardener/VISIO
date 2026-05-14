import { useState, useCallback } from 'react';
import type { SceneDefinition } from '@/types';
import { generateScene, VisioError } from '@/api';

const STEPS = [
  'Contacting Claude API…',
  'Parsing scene description…',
  'Generating visual elements…',
  'Finalising scene composition…',
  'Rendering…',
];

export interface SceneGeneratorState {
  scene: SceneDefinition | null;
  loading: boolean;
  error: string | null;
  stepLabel: string;
  progress: number;
}

export interface UseSceneGeneratorReturn extends SceneGeneratorState {
  generate: (prompt: string) => Promise<void>;
}

export function useSceneGenerator(): UseSceneGeneratorReturn {
  const [state, setState] = useState<SceneGeneratorState>({
    scene: null,
    loading: false,
    error: null,
    stepLabel: '',
    progress: 0,
  });

  const generate = useCallback(async (prompt: string) => {
    setState({
      scene: null,
      loading: true,
      error: null,
      stepLabel: STEPS[0],
      progress: 0,
    });

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, STEPS.length - 2);
      setState((prev) => ({
        ...prev,
        stepLabel: STEPS[stepIdx],
        progress: Math.round((stepIdx / (STEPS.length - 1)) * 85),
      }));
    }, 900);

    try {
      const scene = await generateScene(prompt);
      clearInterval(interval);
      setState({
        scene,
        loading: false,
        error: null,
        stepLabel: STEPS[STEPS.length - 1],
        progress: 100,
      });
    } catch (err) {
      clearInterval(interval);
      const msg = err instanceof VisioError ? err.message : 'Something went wrong';
      setState((prev) => ({
        ...prev,
        scene: null,
        loading: false,
        error: msg,
        progress: 0,
      }));
    }
  }, []);

  return { ...state, generate };
}
