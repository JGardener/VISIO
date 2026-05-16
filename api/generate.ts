export const maxDuration = 30;

const CLAUDE_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 2048;
const SYSTEM_PROMPT = `You are a visual scene generator for a canvas renderer. Respond with ONLY a valid JSON object — no markdown, no explanation.

STRICT RULES:
- All text content must use plain ASCII only. No emoji, no Unicode symbols.
- Use "text" elements sparingly — only for labels, titles, or short phrases that add narrative meaning. Never use text to represent a visual concept (e.g. no "🌊" or "☁" for water/clouds).
- Represent concepts visually using shapes, colors, particles, and composition.

{
  "background": { "color": "#hexcolor" },
  "elements": []
}

Element types:
- particles: { type: "particles", count: number, colors: string[], size: { min: number, max: number }, speed: number, direction: "random"|"up", twinkle: boolean }
- circle: { type: "circle", color: string, x_pct: number, y_pct: number, radius_pct: number, glow: boolean, alpha: number }
- orbits: { type: "orbits", star: { color: string, radius: number }, center_x_pct: number, center_y_pct: number, bodies: [{ color: string, radius: number, orbit_radius_pct: number, speed: number, glow: boolean }] }
- lines: { type: "lines", count: number, colors: string[], length: { min: number, max: number } }
- text: { type: "text", content: string (ASCII only), color: string, size: number, x_pct: number, y_pct: number }

Use x_pct/y_pct as 0–1 fractions of canvas dimensions. radius_pct is fraction of canvas width.

Example — "a calm ocean at night":
BAD: { type: "text", content: "🌊🌊🌊" }
GOOD: deep blue background + slow upward particles in blue/teal + large low-opacity circle for a moon`;

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed", code: "api" },
      { status: 405 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured", code: "auth" },
      { status: 500 },
    );
  }

  let prompt: string;
  try {
    const body = (await request.json()) as { prompt?: unknown };
    if (!body.prompt || typeof body.prompt !== "string") {
      return Response.json(
        { error: "prompt must be a non-empty string", code: "parse" },
        { status: 400 },
      );
    }
    prompt = body.prompt;
  } catch {
    return Response.json(
      { error: "Invalid JSON body", code: "parse" },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25_000);

  let upstream: Response;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return Response.json(
        { error: "Request timed out — try again", code: "server" },
        { status: 504 },
      );
    }
    return Response.json(
      { error: "Network error reaching Claude", code: "api" },
      { status: 502 },
    );
  }
  clearTimeout(timeoutId);

  if (!upstream.ok) {
    const status = upstream.status;
    if (status === 401)
      return Response.json(
        { error: "Invalid API key", code: "auth" },
        { status: 401 },
      );
    if (status === 429)
      return Response.json(
        { error: "Rate limit exceeded — try again shortly", code: "rate" },
        { status: 429 },
      );
    if (status >= 500)
      return Response.json(
        { error: "Claude server error — try again", code: "server" },
        { status: 502 },
      );
    return Response.json(
      { error: `Upstream API error ${status}`, code: "api" },
      { status },
    );
  }

  const data: unknown = await upstream.json();
  return Response.json(data);
}
