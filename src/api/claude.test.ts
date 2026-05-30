import { describe, it, expect } from 'vitest';
import { extractAndParseScene, VisioError } from './claude';

const MINIMAL_SCENE = { background: { color: '#000000' }, elements: [] };
const MINIMAL_JSON = JSON.stringify(MINIMAL_SCENE);

describe('extractAndParseScene', () => {
  it('resolves bare JSON to a SceneDefinition', () => {
    expect(extractAndParseScene(MINIMAL_JSON)).toEqual(MINIMAL_SCENE);
  });

  it('resolves JSON wrapped in a code fence', () => {
    const fenced = `\`\`\`json\n${MINIMAL_JSON}\n\`\`\``;
    expect(extractAndParseScene(fenced)).toEqual(MINIMAL_SCENE);
  });

  it('resolves JSON preceded by preamble text', () => {
    const withPreamble = `Here is the scene you requested:\n${MINIMAL_JSON}`;
    expect(extractAndParseScene(withPreamble)).toEqual(MINIMAL_SCENE);
  });

  it('throws VisioError with code parse for invalid JSON', () => {
    expect(() => extractAndParseScene('not json at all')).toThrow(VisioError);
    try {
      extractAndParseScene('not json at all');
    } catch (e) {
      expect(e).toBeInstanceOf(VisioError);
      expect((e as VisioError).code).toBe('parse');
    }
  });

  it('throws VisioError with code parse for JSON missing required fields', () => {
    try {
      extractAndParseScene('{"foo":"bar"}');
    } catch (e) {
      expect(e).toBeInstanceOf(VisioError);
      expect((e as VisioError).code).toBe('parse');
    }
  });
});
