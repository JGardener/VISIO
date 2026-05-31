import { describe, it, expect, vi, afterEach } from 'vitest';
import { extractAndParseScene, generateScene, VisioError } from './claude';

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

const SCENE_JSON = JSON.stringify(MINIMAL_SCENE);

function makeStreamFetch(text: string) {
  return vi.fn(() => {
    const encoder = new TextEncoder();
    const body = new ReadableStream({
      start(c) {
        c.enqueue(encoder.encode(text));
        c.close();
      },
    });
    return Promise.resolve(new Response(body, { status: 200 }));
  });
}

describe('generateScene', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends currentScene in the request body when provided', async () => {
    vi.stubGlobal('fetch', makeStreamFetch(SCENE_JSON));

    await generateScene('add a comet', MINIMAL_SCENE);

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);

    expect(body.currentScene).toEqual(MINIMAL_SCENE);
    expect(body.prompt).toBe('add a comet');
  });

  it('does not include currentScene in the request body when absent', async () => {
    vi.stubGlobal('fetch', makeStreamFetch(SCENE_JSON));

    await generateScene('a nebula');

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);

    expect(body).not.toHaveProperty('currentScene');
  });
});
