import { useState, useCallback } from 'react';
import type { HistoryEntry, SceneDefinition } from '@/types';

const MAX_ENTRIES = 8;

export interface UseHistoryReturn {
  history: HistoryEntry[];
  addEntry: (prompt: string, scene: SceneDefinition) => void;
  clearHistory: () => void;
  selectedIds: number[];
  toggleSelect: (ts: number) => void;
  clearSelection: () => void;
  getRemixPrompt: () => string;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const addEntry = useCallback((prompt: string, scene: SceneDefinition) => {
    const ts = Date.now();
    setHistory((prev) => {
      const deduped = prev.filter((e) => e.prompt !== prompt);
      return [{ prompt, scene, ts }, ...deduped].slice(0, MAX_ENTRIES);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setSelectedIds([]);
  }, []);

  const toggleSelect = useCallback((ts: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(ts)) return prev.filter((id) => id !== ts);
      if (prev.length >= 2) return [prev[1], ts];
      return [...prev, ts];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const getRemixPrompt = useCallback((): string => {
    if (selectedIds.length !== 2) return '';
    const [id1, id2] = selectedIds;
    const e1 = history.find((e) => e.ts === id1);
    const e2 = history.find((e) => e.ts === id2);
    if (!e1 || !e2) return '';
    return `${e1.prompt} combined with ${e2.prompt}`;
  }, [history, selectedIds]);

  return { history, addEntry, clearHistory, selectedIds, toggleSelect, clearSelection, getRemixPrompt };
}
