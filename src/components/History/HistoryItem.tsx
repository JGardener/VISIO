import type { HistoryEntry } from '@/types';
import { timeAgo } from '@/utils';
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
  function handleClick() {
    if (selectMode) {
      onToggleSelect(entry.ts);
    } else {
      onLoad(entry);
    }
  }

  return (
    <li className={styles.itemWrap}>
      <button
        type="button"
        className={`${styles.item}${selected ? ` ${styles.selected}` : ''}`}
        onClick={handleClick}
        aria-pressed={selectMode ? selected : undefined}
        aria-label={
          selectMode
            ? `Select for remix: ${entry.prompt}`
            : `Load scene: ${entry.prompt}`
        }
      >
        {selectMode && (
          <span className={`${styles.checkbox}${selected ? ` ${styles.checked}` : ''}`} aria-hidden="true">
            {selected ? selectIndex : ''}
          </span>
        )}
        <span className={styles.itemBody}>
          <span className={styles.promptText}>{entry.prompt}</span>
          <span className={styles.meta}>{timeAgo(entry.ts)}</span>
        </span>
        {!selectMode && (
          <svg
            className={styles.loadIcon}
            viewBox="0 0 16 16"
            width="14"
            height="14"
            aria-hidden="true"
            fill="none"
          >
            <path
              d="M6 3.5L10.5 8 6 12.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </li>
  );
}
