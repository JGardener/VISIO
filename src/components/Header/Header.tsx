import { exportPNG } from '@/utils';
import styles from './Header.module.scss';

interface HeaderProps {
  hasScene: boolean;
  promptSlug: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onHowItWorks: () => void;
}

export default function Header({ hasScene, promptSlug, canvasRef, onHowItWorks }: HeaderProps) {
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
        <div className={styles.statusDot} />
      </div>
    </header>
  );
}
