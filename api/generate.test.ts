import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from './generate';
import type { SceneDefinition } from '@/types';

const MINIMAL_SCENE: SceneDefinition = {
  background: { color: '#000000' },
  elements: [],
};

function makeRequest(body: Record<string, unknown>): Request {
  return new Request('http://localhost/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeStreamResponse(): Response {
  const body = new ReadableStream({ start(c) { c.close(); } });
  return new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

describe('generate Edge function', () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(makeStreamResponse())));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.ANTHROPIC_API_KEY;
  });

  it('sends a single-message conversation when no currentScene is provided', async () => {
    await handler(makeRequest({ prompt: 'a nebula' }));

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);

    expect(body.messages).toHaveLength(1);
    expect(body.messages[0]).toEqual({ role: 'user', content: 'a nebula' });
  });

  it('sends a three-message conversation when currentScene is provided', async () => {
    await handler(makeRequest({ prompt: 'add a comet', currentScene: MINIMAL_SCENE }));

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    const sceneJson = JSON.stringify(MINIMAL_SCENE);

    expect(body.messages).toHaveLength(3);
    expect(body.messages[0]).toEqual({ role: 'user', content: sceneJson });
    expect(body.messages[1]).toEqual({ role: 'assistant', content: sceneJson });
    expect(body.messages[2]).toEqual({ role: 'user', content: 'add a comet' });
  });
});
