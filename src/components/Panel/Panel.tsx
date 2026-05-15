import styles from './Panel.module.scss';

interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Panel({ isOpen, onClose, children }: PanelProps) {
  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
      <aside className={`${styles.panel}${isOpen ? ` ${styles.open}` : ''}`}>
        {children}
      </aside>
    </>
  );
}
