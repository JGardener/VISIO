import type { ControlsState, Palette } from '@/types';
import HowItWorksOverlay from '@/components/HowItWorks/HowItWorksOverlay';
import ControlsBar from '@/components/Controls/ControlsBar';
import styles from './SceneCanvas.module.scss';

interface SceneCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasScene: boolean;
  onOpenPanel: () => void;
  controls: ControlsState;
  onSpeedMult: (v: number) => void;
  onZoom: (v: number) => void;
  onPalette: (v: Palette | null) => void;
}

export default function SceneCanvas({
  canvasRef,
  hasScene,
  onOpenPanel,
  controls,
  onSpeedMult,
  onZoom,
  onPalette,
}: SceneCanvasProps) {
  return (
    <div className={styles.canvasWrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <HowItWorksOverlay visible={!hasScene} />
      <ControlsBar
        visible={hasScene}
        speedMult={controls.speedMult}
        zoom={controls.zoom}
        palette={controls.palette}
        onSpeedMult={onSpeedMult}
        onZoom={onZoom}
        onPalette={onPalette}
      />
      <button className={styles.mobileToggle} onClick={onOpenPanel}>
        ✦ Describe Scene
      </button>
    </div>
  );
}
