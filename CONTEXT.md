# VISIO — Domain Glossary

## Scene
A visual composition defined as a JSON structure. Produced by Claude from a user prompt and rendered live on the WebGL canvas. A scene has a background colour and a list of elements.

## Element
A single visual primitive within a scene. The supported types are: `particles`, `circle`, `orbits`, `lines`, `text`, `wave`, `trail`. Each type has its own renderer and JSON schema.

## Generation
Creating a new scene from scratch by sending only the user's prompt to Claude. The current scene (if any) is ignored.

## Refinement
Modifying an existing scene by sending the current scene JSON alongside a new instruction to Claude. The result is a modified scene, not a replacement.

## Default Scene
A hardcoded ambient scene rendered on first load before any user-triggered generation or refinement. Requires no API call.

## History
The ordered list of previously generated or refined scenes, keyed by prompt. Persisted to localStorage. Maximum 8 entries, deduplicated by prompt text.

## Palette
A curated named set of hex colours that overrides element colours across the entire active scene without re-generating it.

## Streaming
The server sends the Claude response as a `ReadableStream`. The client accumulates chunks until the JSON is complete, then parses and renders. The stream is surfaced in the SceneJSON panel as live text output.

## Scene Iteration
The product-level flow of refining an existing scene through successive refinement instructions. Distinct from generation, which always starts from a blank slate.
