import { useState, useCallback } from 'react';
import type { HistoryEntry, SceneDefinition } from '@/types';

const MAX_ENTRIES = 8;
const STORAGE_KEY = 'visio:history';

function loadFromStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

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
  const [history, setHistory] = useState<HistoryEntry[]>(loadFromStorage);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const addEntry = useCallback((prompt: string, scene: SceneDefinition) => {
    const ts = Date.now();
    setHistory((prev) => {
      const deduped = prev.filter((e) => e.prompt !== prompt);
      const next = [{ prompt, scene, ts }, ...deduped].slice(0, MAX_ENTRIES);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveToStorage([]);
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
