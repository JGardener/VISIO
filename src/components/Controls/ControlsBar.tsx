import { useRef } from 'react';
import type { Palette, ControlsState } from '@/types';
import { PALETTES } from '@/constants';
import PaletteSwatch from './PaletteSwatch';
import styles from './ControlsBar.module.scss';

interface ControlsBarProps {
  visible: boolean;
  speedMult: ControlsState['speedMult'];
  palette: ControlsState['palette'];
  onSpeedMult: (v: number) => void;
  onPalette: (v: Palette | null) => void;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="currentColor">
      <path d="M4.5 2.8a.6.6 0 0 1 .9-.52l8 5.2a.6.6 0 0 1 0 1.04l-8 5.2a.6.6 0 0 1-.9-.52V2.8z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="currentColor">
      <rect x="3.5" y="2.5" width="3.2" height="11" rx="1" />
      <rect x="9.3" y="2.5" width="3.2" height="11" rx="1" />
    </svg>
  );
}

export default function ControlsBar({
  visible,
  speedMult,
  palette,
  onSpeedMult,
  onPalette,
}: ControlsBarProps) {
  const lastSpeedRef = useRef(1);

  if (!visible) return null;

  const paused = speedMult === 0;

  function togglePause() {
    if (paused) {
      onSpeedMult(lastSpeedRef.current || 1);
    } else {
      lastSpeedRef.current = speedMult;
      onSpeedMult(0);
    }
  }

  return (
    <div className={styles.bar}>
      <div className={styles.control}>
        <button
          type="button"
          className={styles.pauseBtn}
          onClick={togglePause}
          aria-label={paused ? 'Play animation' : 'Pause animation'}
          aria-pressed={paused}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <label className={styles.sliderLabel}>
          <span className={styles.labelText}>Speed</span>
          <input
            type="range"
            className={styles.slider}
            min={0}
            max={3}
            step={0.25}
            value={speedMult}
            onChange={(e) => onSpeedMult(parseFloat(e.target.value))}
            aria-label="Animation speed"
            aria-valuetext={paused ? 'Paused' : `${speedMult} times`}
          />
        </label>
        <output className={styles.value}>{paused ? 'Paused' : `${speedMult.toFixed(2)}×`}</output>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.swatches} role="radiogroup" aria-label="Colour palette">
        <span className={styles.labelText}>Palette</span>
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
