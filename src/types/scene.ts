export type ElementType = 'particles' | 'circle' | 'orbits' | 'lines' | 'text';

export interface ParticlesElement {
  type: 'particles';
  count: number;
  colors: string[];
  size: { min: number; max: number };
  speed: number;
  direction: 'random' | 'up';
  twinkle: boolean;
}

export interface CircleElement {
  type: 'circle';
  color: string;
  x_pct: number;
  y_pct: number;
  radius_pct: number;
  glow: boolean;
  alpha: number;
}

export interface OrbitsBody {
  color: string;
  radius: number;
  orbit_radius_pct: number;
  speed: number;
  glow: boolean;
}

export interface OrbitsElement {
  type: 'orbits';
  star: { color: string; radius: number };
  center_x_pct: number;
  center_y_pct: number;
  bodies: OrbitsBody[];
}

export interface LinesElement {
  type: 'lines';
  count: number;
  colors: string[];
  length: { min: number; max: number };
}

export interface TextElement {
  type: 'text';
  content: string;
  color: string;
  size: number;
  x_pct: number;
  y_pct: number;
}

export type SceneElement =
  | ParticlesElement
  | CircleElement
  | OrbitsElement
  | LinesElement
  | TextElement;

export interface SceneDefinition {
  background: { color: string };
  elements: SceneElement[];
}
