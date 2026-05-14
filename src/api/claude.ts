import type { SceneDefinition } from '@/types';
import { CLAUDE_MODEL, MAX_TOKENS, SYSTEM_PROMPT } from '@/constants';

export type ClaudeErrorCode = 'auth' | 'rate' | 'server' | 'parse' | 'empty' | 'api';

export class VisioError extends Error {
  constructor(
    public readonly code: ClaudeErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'VisioError';
  }
}

export async function generateScene(prompt: string): Promise<SceneDefinition> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new VisioError('auth', 'VITE_ANTHROPIC_API_KEY is not set');

  let response: Response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch {
    throw new VisioError('api', 'Network error — check your connection');
  }

  if (!response.ok) {
    if (response.status === 401) throw new VisioError('auth', 'Invalid API key');
    if (response.status === 429) throw new VisioError('rate', 'Rate limit exceeded — try again shortly');
    if (response.status >= 500) throw new VisioError('server', 'Claude server error — try again');
    throw new VisioError('api', `API error ${response.status}`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new VisioError('parse', 'Failed to parse API response');
  }

  const text =
    data != null &&
    typeof data === 'object' &&
    'content' in data &&
    Array.isArray((data as { content: unknown[] }).content) &&
    (data as { content: { text?: string }[] }).content[0]?.text;

  if (!text || typeof text !== 'string') {
    throw new VisioError('empty', 'Empty response from Claude');
  }

  // Strip markdown code fences if Claude wraps the JSON
  const jsonText = text
    .replace(/^```(?:json)?\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  let scene: SceneDefinition;
  try {
    scene = JSON.parse(jsonText) as SceneDefinition;
  } catch {
    throw new VisioError('parse', 'Claude returned invalid JSON');
  }

  if (
    typeof scene !== 'object' ||
    scene === null ||
    !('background' in scene) ||
    !Array.isArray(scene.elements)
  ) {
    throw new VisioError('parse', 'Scene JSON missing required fields');
  }

  return scene;
}
