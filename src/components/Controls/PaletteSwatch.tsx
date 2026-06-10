import type { Palette } from '@/types';
import styles from './PaletteSwatch.module.scss';

interface PaletteSwatchProps {
  palette: Palette;
  active: boolean;
  onClick: () => void;
}

export default function PaletteSwatch({ palette, active, onClick }: PaletteSwatchProps) {
  const background = palette.colors
    ? `conic-gradient(${palette.colors.join(', ')}, ${palette.colors[0]})`
    : 'transparent';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={palette.colors ? `${palette.name} palette` : 'Original colours'}
      title={palette.colors ? palette.name : 'Original colours'}
      className={`${styles.swatch}${active ? ` ${styles.active}` : ''}${palette.colors ? '' : ` ${styles.none}`}`}
      onClick={onClick}
    >
      <span className={styles.fill} style={{ background }} aria-hidden="true" />
    </button>
  );
}
