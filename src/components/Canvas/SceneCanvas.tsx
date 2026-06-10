import HowItWorksOverlay from '@/components/HowItWorks/HowItWorksOverlay';
import styles from './SceneCanvas.module.scss';

interface SceneCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasScene: boolean;
  sceneLabel: string;
}

export default function SceneCanvas({ canvasRef, hasScene, sceneLabel }: SceneCanvasProps) {
  return (
    <div className={styles.canvasWrap}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="img"
        aria-label={hasScene ? `Animated scene: ${sceneLabel}` : 'Ambient welcome scene'}
      />
      <HowItWorksOverlay visible={!hasScene} />
    </div>
  );
}
