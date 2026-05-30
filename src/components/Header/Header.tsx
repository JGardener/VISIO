import { exportPNG } from '@/utils';
import styles from './Header.module.scss';

export type AppStatus = 'idle' | 'streaming' | 'ready' | 'error';

interface HeaderProps {
  hasScene: boolean;
  promptSlug: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onHowItWorks: () => void;
  status: AppStatus;
}

const STATUS_CLASS: Record<AppStatus, string> = {
  idle: styles.statusDotIdle,
  streaming: styles.statusDotStreaming,
  ready: styles.statusDotReady,
  error: styles.statusDotError,
};

export default function Header({ hasScene, promptSlug, canvasRef, onHowItWorks, status }: HeaderProps) {
  function handleExport() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    exportPNG(canvas, `visio-${promptSlug}`);
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        VIS<span className={styles.accent}>IO</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={onHowItWorks}>
          ? How It Works
        </button>
        <button className={styles.btn} disabled={!hasScene} onClick={handleExport}>
          ⬇ Export PNG
        </button>
        <div className={STATUS_CLASS[status]} />
      </div>
    </header>
  );
}
