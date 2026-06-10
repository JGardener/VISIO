import { useState } from 'react';
import type { HistoryEntry } from '@/types';
import HistoryItem from './HistoryItem';
import styles from './HistoryPanel.module.scss';

interface HistoryPanelProps {
  history: HistoryEntry[];
  selectedIds: number[];
  onToggleSelect: (ts: number) => void;
  onClearSelection: () => void;
  onClearHistory: () => void;
  onRemix: () => void;
  onLoad: (entry: HistoryEntry) => void;
}

export default function HistoryPanel({
  history,
  selectedIds,
  onToggleSelect,
  onClearSelection,
  onClearHistory,
  onRemix,
  onLoad,
}: HistoryPanelProps) {
  const [selectMode, setSelectMode] = useState(false);

  function handleCancelSelect() {
    onClearSelection();
    setSelectMode(false);
  }

  function handleRemix() {
    onRemix();
    setSelectMode(false);
  }

  function handleClearHistory() {
    setSelectMode(false);
    onClearHistory();
  }

  return (
    <section className={styles.historySection} aria-label="Scene history">
      <div className={styles.historyHeader}>
        <h3 className={styles.label}>
          History
          {history.length > 0 && <span className={styles.count}>{history.length}</span>}
        </h3>
        {history.length > 0 && (
          <div className={styles.headerActions}>
            {selectMode ? (
              <button className={styles.actionBtn} onClick={handleCancelSelect}>
                Cancel
              </button>
            ) : (
              history.length >= 2 && (
                <button className={styles.actionBtn} onClick={() => setSelectMode(true)}>
                  Remix two…
                </button>
              )
            )}
            <button className={styles.actionBtn} onClick={handleClearHistory}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <p className={styles.empty}>Scenes you generate will appear here — load any of them back
        onto the canvas with one tap.</p>
      ) : (
        <>
          {selectMode && (
            <p className={styles.selectHint} aria-live="polite">
              {selectedIds.length === 2
                ? 'Ready — blend these two into one scene.'
                : `Pick two scenes to blend (${selectedIds.length}/2 selected).`}
            </p>
          )}
          <ul className={styles.itemsList}>
            {history.map((entry) => {
              const selIdx = selectedIds.indexOf(entry.ts);
              return (
                <HistoryItem
                  key={entry.ts}
                  entry={entry}
                  selectMode={selectMode}
                  selected={selIdx !== -1}
                  selectIndex={selIdx + 1}
                  onToggleSelect={onToggleSelect}
                  onLoad={onLoad}
                />
              );
            })}
          </ul>
          {selectMode && (
            <button
              className={styles.remixBtn}
              onClick={handleRemix}
              disabled={selectedIds.length !== 2}
            >
              ✦ Blend selected scenes
            </button>
          )}
        </>
      )}
    </section>
  );
}
