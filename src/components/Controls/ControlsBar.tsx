import type { Palette, ControlsState } from '@/types';
import { PALETTES } from '@/constants';
import PaletteSwatch from './PaletteSwatch';
import styles from './ControlsBar.module.scss';

interface ControlsBarProps {
  visible: boolean;
  speedMult: ControlsState['speedMult'];
  zoom: ControlsState['zoom'];
  palette: ControlsState['palette'];
  onSpeedMult: (v: number) => void;
  onZoom: (v: number) => void;
  onPalette: (v: Palette | null) => void;
}

export default function ControlsBar({
  visible,
  speedMult,
  zoom,
  palette,
  onSpeedMult,
  onZoom,
  onPalette,
}: ControlsBarProps) {
  if (!visible) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.control}>
        Speed
        <input
          type="range"
          className={styles.slider}
          min={0.25}
          max={3}
          step={0.25}
          value={speedMult}
          onChange={(e) => onSpeedMult(parseFloat(e.target.value))}
        />
        <span className={styles.value}>{speedMult.toFixed(2)}x</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.control}>
        Zoom
        <input
          type="range"
          className={styles.slider}
          min={0.5}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => onZoom(parseFloat(e.target.value))}
        />
        <span className={styles.value}>{zoom.toFixed(1)}x</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.swatches}>
        <span className={styles.paletteLabel}>Palette</span>
        {PALETTES.map((p) => (
          <PaletteSwatch
            key={p.name}
            palette={p}
            active={palette?.name === p.name}
            onClick={() => onPalette(p)}
          />
        ))}
      </div>
    </div>
  );
}
