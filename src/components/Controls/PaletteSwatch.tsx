import type { Palette } from '@/types';
import styles from './PaletteSwatch.module.scss';

interface PaletteSwatchProps {
  palette: Palette;
  active: boolean;
  onClick: () => void;
}

export default function PaletteSwatch({ palette, active, onClick }: PaletteSwatchProps) {
  return (
    <button
      className={`${styles.swatch}${active ? ` ${styles.active}` : ''}`}
      style={{ backgroundColor: palette.dot }}
      onClick={onClick}
      title={palette.name}
    />
  );
}
