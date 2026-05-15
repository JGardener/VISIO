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

  if (history.length === 0) return null;

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
    <div className={styles.historySection}>
      <div className={styles.historyHeader}>
        <span className={styles.label}>History</span>
        <div className={styles.headerActions}>
          {selectedIds.length === 2 && (
            <button className={`${styles.actionBtn} ${styles.remixBtn}`} onClick={handleRemix}>
              Remix
            </button>
          )}
          {selectMode ? (
            <button className={styles.actionBtn} onClick={handleCancelSelect}>
              Cancel
            </button>
          ) : (
            history.length >= 2 && (
              <button className={styles.actionBtn} onClick={() => setSelectMode(true)}>
                Select
              </button>
            )
          )}
          <button className={styles.actionBtn} onClick={handleClearHistory}>
            Clear
          </button>
        </div>
      </div>
      <div className={styles.itemsList}>
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
      </div>
    </div>
  );
}
