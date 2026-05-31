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

const ERROR_MESSAGES: Record<ClaudeErrorCode, string> = {
  auth: 'Invalid API key — check your environment config',
  rate: 'Rate limit hit — wait a moment and try again',
  server: 'Claude is unavailable — try again shortly',
  parse: "Couldn't read the scene — try rephrasing your prompt",
  api: 'Something went wrong — check your connection and try again',
  empty: 'Something went wrong — check your connection and try again',
};

export function getErrorMessage(code: ClaudeErrorCode): string {
  return ERROR_MESSAGES[code];
}

export function extractAndParseScene(rawText: string): SceneDefinition {
  let jsonText: string;
  const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    jsonText = fenceMatch[1].trim();
  } else {
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    jsonText = start !== -1 && end > start ? rawText.slice(start, end + 1) : rawText.trim();
  }

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

export async function generateScene(
  prompt: string,
  currentScene?: SceneDefinition,
  onChunk?: (chunk: string) => void,
  onStreamClose?: () => void,
): Promise<SceneDefinition> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35_000);

  const bodyPayload: { prompt: string; currentScene?: SceneDefinition } = { prompt };
  if (currentScene !== undefined) bodyPayload.currentScene = currentScene;

  let response: Response;
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(bodyPayload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new VisioError('server', 'Request timed out — try again');
    }
    throw new VisioError('api', 'Network error — check your connection');
  }

  if (!response.ok) {
    clearTimeout(timeoutId);
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

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      onChunk?.(chunk);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new VisioError('server', 'Request timed out — try again');
    }
    throw new VisioError('parse', 'Stream interrupted');
  }

  clearTimeout(timeoutId);
  onStreamClose?.();
  return extractAndParseScene(buffer);
}
