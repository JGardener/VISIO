import { exportPNG } from '@/utils';
import styles from './Header.module.scss';

export type AppStatus = 'idle' | 'streaming' | 'ready' | 'error';

interface HeaderProps {
  hasScene: boolean;
  promptSlug: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onHowItWorks: () => void;
  onOpenLibrary: () => void;
  libraryOpen: boolean;
  libraryCount: number;
  status: AppStatus;
}

const STATUS_CLASS: Record<AppStatus, string> = {
  idle: styles.dotIdle,
  streaming: styles.dotStreaming,
  ready: styles.dotReady,
  error: styles.dotError,
};

const STATUS_TITLE: Record<AppStatus, string> = {
  idle: 'Idle',
  streaming: 'Generating…',
  ready: 'Ready',
  error: 'Error',
};

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.25v3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M8 2.5v7m0 0L5.25 6.75M8 9.5l2.75-2.75M3 12.75h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({
  hasScene,
  promptSlug,
  canvasRef,
  onHowItWorks,
  onOpenLibrary,
  libraryOpen,
  libraryCount,
  status,
}: HeaderProps) {
  function handleExport() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    exportPNG(canvas, `visio-${promptSlug}`);
  }

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>
          VIS<span className={styles.accent}>IO</span>
        </span>
        <span
          className={styles.statusPill}
          role="status"
          aria-live="polite"
          title={STATUS_TITLE[status]}
        >
          <span className={`${styles.dot} ${STATUS_CLASS[status]}`} aria-hidden="true" />
          <span className={styles.statusLabel}>{STATUS_TITLE[status]}</span>
        </span>
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={onHowItWorks} aria-label="How it works">
          <InfoIcon />
          <span className={styles.btnText}>How it works</span>
        </button>
        <button
          className={styles.btn}
          disabled={!hasScene}
          onClick={handleExport}
          aria-label="Export PNG"
        >
          <DownloadIcon />
          <span className={styles.btnText}>Export PNG</span>
        </button>
        <button
          className={styles.btn}
          onClick={onOpenLibrary}
          aria-label="Library"
          aria-expanded={libraryOpen}
        >
          <LibraryIcon />
          <span className={styles.btnText}>Library</span>
          {libraryCount > 0 && <span className={styles.badge}>{libraryCount}</span>}
        </button>
      </div>
    </header>
  );
}
