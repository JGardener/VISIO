import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';
import type { SceneDefinition } from '@/types';

const SCENE: SceneDefinition = {
  background: { color: '#000000' },
  elements: [],
};

describe('useHistory', () => {
  it('starts empty when localStorage has no data', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual([]);
  });

  it('clearHistory removes entries from localStorage', () => {
    const { result, unmount } = renderHook(() => useHistory());

    act(() => {
      result.current.addEntry('a solar system', SCENE);
      result.current.clearHistory();
    });

    unmount();

    const { result: result2 } = renderHook(() => useHistory());
    expect(result2.current.history).toEqual([]);
  });

  it('deduplication is persisted — same prompt replaces old entry', () => {
    const { result, unmount } = renderHook(() => useHistory());

    act(() => {
      result.current.addEntry('a solar system', SCENE);
      result.current.addEntry('a neon city', SCENE);
      result.current.addEntry('a solar system', SCENE);
    });

    unmount();

    const { result: result2 } = renderHook(() => useHistory());
    expect(result2.current.history).toHaveLength(2);
    expect(result2.current.history[0].prompt).toBe('a solar system');
  });

  it('caps history at 8 entries after remount', () => {
    const { result, unmount } = renderHook(() => useHistory());

    act(() => {
      for (let i = 0; i < 9; i++) {
        result.current.addEntry(`scene ${i}`, SCENE);
      }
    });

    unmount();

    const { result: result2 } = renderHook(() => useHistory());
    expect(result2.current.history).toHaveLength(8);
    expect(result2.current.history[0].prompt).toBe('scene 8');
  });

  it('restores history after remount', () => {
    const { result, unmount } = renderHook(() => useHistory());

    act(() => {
      result.current.addEntry('a solar system', SCENE);
    });

    unmount();

    const { result: result2 } = renderHook(() => useHistory());
    expect(result2.current.history).toHaveLength(1);
    expect(result2.current.history[0].prompt).toBe('a solar system');
  });
});
