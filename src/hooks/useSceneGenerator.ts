import { useState, useCallback, useRef } from 'react';
import type { SceneDefinition } from '@/types';
import { generateScene, VisioError } from '@/api';

export interface SceneGeneratorState {
  scene: SceneDefinition | null;
  loading: boolean;
  error: string | null;
  stepLabel: string;
  progress: number;
  streamBuffer: string;
}

export type SceneMode = 'generate' | 'refine';

export interface UseSceneGeneratorReturn extends SceneGeneratorState {
  generate: (prompt: string, currentScene?: SceneDefinition) => Promise<void>;
  mode: SceneMode;
  setMode: (mode: SceneMode) => void;
}

export function useSceneGenerator(): UseSceneGeneratorReturn {
  const [state, setState] = useState<SceneGeneratorState>({
    scene: null,
    loading: false,
    error: null,
    stepLabel: '',
    progress: 0,
    streamBuffer: '',
  });
  const [mode, setMode] = useState<SceneMode>('generate');

  const firstChunkRef = useRef(true);

  const generate = useCallback(async (prompt: string, currentScene?: SceneDefinition) => {
    firstChunkRef.current = true;

    setState({
      scene: null,
      loading: true,
      error: null,
      stepLabel: 'Waiting for Claude…',
      progress: 0,
      streamBuffer: '',
    });

    const onChunk = (chunk: string) => {
      setState((prev) => {
        const newBuffer = prev.streamBuffer + chunk;
        if (firstChunkRef.current) {
          firstChunkRef.current = false;
          return { ...prev, stepLabel: 'Streaming…', progress: 40, streamBuffer: newBuffer };
        }
        return { ...prev, streamBuffer: newBuffer };
      });
    };

    const onStreamClose = () => {
      setState((prev) => ({ ...prev, stepLabel: 'Rendering…', progress: 85 }));
    };

    try {
      const scene = await generateScene(prompt, currentScene, onChunk, onStreamClose);
      setState({
        scene,
        loading: false,
        error: null,
        stepLabel: 'Scene ready',
        progress: 100,
        streamBuffer: '',
      });
    } catch (err) {
      const msg = err instanceof VisioError ? err.message : 'Something went wrong';
      setState((prev) => ({
        ...prev,
        scene: null,
        loading: false,
        error: msg,
        stepLabel: '',
        progress: 0,
        streamBuffer: '',
      }));
    }
  }, []);

  return { ...state, generate, mode, setMode };
}
