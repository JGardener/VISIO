import type { SceneDefinition } from '@/types';

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
  let response: Response;
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
  } catch {
    throw new VisioError('api', 'Network error — check your connection');
  }

  if (!response.ok) {
    let code: ClaudeErrorCode = 'api';
    let message = `API error ${response.status}`;
    try {
      const err = (await response.json()) as { error?: string; code?: ClaudeErrorCode };
      if (err.code) code = err.code;
      if (err.error) message = err.error;
    } catch {
      // ignore — use defaults above
    }
    throw new VisioError(code, message);
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
