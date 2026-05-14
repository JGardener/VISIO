import type { SceneDefinition } from './scene';

export interface HistoryEntry {
  prompt: string;
  scene: SceneDefinition;
  ts: number;
}
