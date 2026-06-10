import { useRef } from 'react';
import { useFocusTrap } from '@/hooks';
import styles from './Panel.module.scss';

interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Panel({ isOpen, onClose, title, children }: PanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(isOpen, panelRef, onClose);

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />}
      <aside
        ref={panelRef}
        className={`${styles.panel}${isOpen ? ` ${styles.open}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!isOpen}
        {...(!isOpen && { inert: true })}
      >
        <div className={styles.panelHeader}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close library">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
              <path
                d="M4 4l8 8m0-8l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </aside>
    </>
  );
}
