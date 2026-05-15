export interface Palette {
  name: string;
  colors: string[] | null;
  dot: string;
}

export interface ControlsState {
  speedMult: number;
  palette: Palette | null;
}
