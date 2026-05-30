# ADR 0001 — Stream Claude responses via ReadableStream

**Status**: Accepted

## Context

The Edge function at `api/generate.ts` previously buffered the full Claude response before returning it. The client-side `useSceneGenerator` hook simulated progress with a fake interval timer cycling through fabricated step labels every 900ms, completely disconnected from actual network activity.

Incremental rendering is not possible because the canvas renderer requires a complete, valid `SceneDefinition` JSON object. Streaming does not enable earlier rendering.

## Decision

The Edge function streams the raw Anthropic response body directly to the client as a `ReadableStream`. The client accumulates chunks, drives an honest progress indicator from real network events (first byte received, stream complete), and surfaces the accumulating JSON text in the SceneJSON panel as a live display.

## Consequences

- The fake progress timer (`setInterval` stepping through `STEPS[]`) is removed entirely.
- Progress states are: `idle → waiting → streaming → rendering → ready`.
- The SceneJSON panel (collapsed by default) becomes a live display of the JSON as it arrives — a visible signal of the streaming implementation for technical reviewers.
- Error handling must account for mid-stream failures: if the accumulated text is not valid JSON at stream end, the existing `parse` error code applies.
- The alternative (honest single-status without streaming) was rejected because the live JSON display is a meaningful portfolio signal that justifies the implementation cost.
