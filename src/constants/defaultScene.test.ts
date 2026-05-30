import { DEFAULT_SCENE } from './defaultScene';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

describe('DEFAULT_SCENE', () => {
  it('has a valid hex background color', () => {
    expect(DEFAULT_SCENE.background.color).toMatch(HEX_COLOR);
  });

  it('has at least one element', () => {
    expect(DEFAULT_SCENE.elements.length).toBeGreaterThan(0);
  });

  it('every element has a recognized type', () => {
    const VALID_TYPES = ['particles', 'circle', 'orbits', 'lines', 'text', 'wave', 'trail'];
    for (const el of DEFAULT_SCENE.elements) {
      expect(VALID_TYPES).toContain(el.type);
    }
  });
});
