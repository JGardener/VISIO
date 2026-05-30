import { SYSTEM_PROMPT } from './api';

describe('SYSTEM_PROMPT', () => {
  it('documents the wave element type', () => {
    expect(SYSTEM_PROMPT).toContain('wave');
  });

  it('wave schema includes amplitude_pct', () => {
    expect(SYSTEM_PROMPT).toContain('amplitude_pct');
  });

  it('documents the trail element type', () => {
    expect(SYSTEM_PROMPT).toContain('trail');
  });

  it('trail schema includes trail_length', () => {
    expect(SYSTEM_PROMPT).toContain('trail_length');
  });

  it('particles direction schema includes down, left, and right', () => {
    const particlesLine = SYSTEM_PROMPT.split('\n').find((l) => l.startsWith('- particles:'));
    expect(particlesLine).toContain('"down"');
    expect(particlesLine).toContain('"left"');
    expect(particlesLine).toContain('"right"');
  });
});
