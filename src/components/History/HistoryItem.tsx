import type { HistoryEntry } from '@/types';
import styles from './HistoryItem.module.scss';

interface HistoryItemProps {
  entry: HistoryEntry;
  selectMode: boolean;
  selected: boolean;
  selectIndex: number; // 0 = not selected, 1 or 2 = position in selection
  onToggleSelect: (ts: number) => void;
  onLoad: (entry: HistoryEntry) => void;
}

export default function HistoryItem({
  entry,
  selectMode,
  selected,
  selectIndex,
  onToggleSelect,
  onLoad,
}: HistoryItemProps) {
  function getIndicator(): string {
    if (!selectMode) return '↩';
    if (!selected) return '[ ]';
    return `[${selectIndex}]`;
  }

  function handleClick() {
    if (selectMode) {
      onToggleSelect(entry.ts);
    } else {
      onLoad(entry);
    }
  }

  return (
    <div
      className={`${styles.item}${selected ? ` ${styles.selected}` : ''}`}
      onClick={handleClick}
    >
      <span className={styles.indicator}>{getIndicator()}</span>
      <span className={styles.promptText}>{entry.prompt}</span>
    </div>
  );
}
