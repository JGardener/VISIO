# VISIO Phase 5 — Polish & Portfolio-Ready Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repo portfolio-ready: fix the one mobile UX gap (panel scroll), add the iOS Safari comment to exportPNG, create .env.example, and replace the Vite template README with a proper project README.

**Architecture:** Small targeted changes to three areas — a one-line SCSS fix for panel overflow, a file creation for .env.example, and a full README replacement. TypeScript is already fully strict (0 errors) and the build already passes; all tasks must preserve that.

**Tech Stack:** React 19 + TypeScript (strict) + SCSS Modules + Vite 8 + PIXI.js v7. Path alias `@/` maps to `src/`. SCSS variables/mixins auto-injected via Vite `additionalData` — never `@use` them manually. TypeScript check command: `npx tsc -p tsconfig.app.json --noEmit` (root tsconfig has `"files": []`; always use `-p tsconfig.app.json`).

---

## Current State

These items are already done — do NOT re-implement them:
- `src/utils/exportPNG.ts` — function exists and is wired to the Header button
- `src/components/Header/Header.tsx` — Export PNG button enabled via `hasScene` prop
- All mobile SCSS (Panel bottom sheet, ControlsBar `bottom: 80px` on mobile, mobileToggle button)
- TypeScript strict mode (`strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`)
- `npm run build` passes cleanly

---

## File Map

| File | Change |
|------|--------|
| `src/utils/exportPNG.ts` | Add iOS Safari limitation comment |
| `src/components/Panel/Panel.module.scss` | Add `overflow-y: auto` inside `@include mobile` block |
| `.env.example` | Create new file |
| `README.md` | Full replacement (currently has Vite template boilerplate) |

---

### Task 1: exportPNG iOS comment + Panel mobile scroll

**Files:**
- Modify: `src/utils/exportPNG.ts`
- Modify: `src/components/Panel/Panel.module.scss`

**Context:**
The `exportPNG` function uses `<a download>` which is blocked in iOS Safari when not served from a proper domain. The spec says to document this in a code comment — no code change needed, just the comment.

The Panel on mobile renders as a bottom sheet with `height: 80vh` but currently has `overflow: hidden`, which means users can't scroll through the history list, SceneJSON, etc. The fix is one line in the mobile block.

- [ ] **Step 1: Add iOS Safari comment to exportPNG**

Open `src/utils/exportPNG.ts`. Current content:

```typescript
export function exportPNG(canvas: HTMLCanvasElement, filename: string): void {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
```

Replace with:

```typescript
export function exportPNG(canvas: HTMLCanvasElement, filename: string): void {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  // <a download> is blocked in iOS Safari on file:// and non-HTTPS origins;
  // works correctly once deployed to any standard HTTPS host (e.g. Vercel).
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
```

- [ ] **Step 2: Fix Panel mobile scroll**

Open `src/components/Panel/Panel.module.scss`. Current content of the `.panel` rule:

```scss
.panel {
  width: $panel-width;
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  z-index: 10;

  @include mobile {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 80vh;
    border-radius: 16px 16px 0 0;
    border-left: none;
    border-top: 1px solid var(--border);
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 30;

    &.open {
      transform: translateY(0);
    }
  }
}
```

Add `overflow-y: auto;` inside the `@include mobile` block, right after `z-index: 30;`:

```scss
.panel {
  width: $panel-width;
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  z-index: 10;

  @include mobile {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 80vh;
    border-radius: 16px 16px 0 0;
    border-left: none;
    border-top: 1px solid var(--border);
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 30;
    overflow-y: auto;

    &.open {
      transform: translateY(0);
    }
  }
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc -p tsconfig.app.json --noEmit`

Expected: No output, exit code 0.

- [ ] **Step 4: Verify build**

Run: `npm run build`

Expected: `✓ built in ...ms` with no errors. The chunk size warning is acceptable (not an error).

- [ ] **Step 5: Commit**

```bash
git add src/utils/exportPNG.ts src/components/Panel/Panel.module.scss
git commit -m "fix: add iOS export comment, fix Panel mobile overflow scroll"
```

---

### Task 2: Create .env.example

**Files:**
- Create: `.env.example` (project root — `visio/.env.example`, NOT `C:/code/VISIO/.env.example`)

**Context:**
The app reads `import.meta.env.VITE_ANTHROPIC_API_KEY` in `src/api/claude.ts`. The `.env.local` file (which contains the real key) is gitignored. `.env.example` is the committed template that shows developers what to configure — it should NOT be gitignored.

- [ ] **Step 1: Check .gitignore does not exclude .env.example**

Run: `cat .gitignore | grep env`

Expected: You should see `.env.local` (or similar) gitignored, but NOT `.env.example`. If `.env.example` is listed in .gitignore, remove that line. (It's the template — it should be committed.)

- [ ] **Step 2: Create .env.example**

Create `visio/.env.example` with this exact content:

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

No trailing newline complexity — just that one line.

- [ ] **Step 3: Verify the file is tracked**

Run: `git status`

Expected: `.env.example` appears as an untracked file (not ignored). If it does NOT appear (meaning it is gitignored), open `.gitignore` and remove the line that's excluding it.

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "chore: add .env.example"
```

---

### Task 3: Replace README.md

**Files:**
- Modify: `README.md` (at `visio/README.md`)

**Context:**
The current README.md contains the default Vite template content ("React + TypeScript + Vite", "two official plugins are available", etc.). This needs to be replaced with a proper project README covering the 6 points from the spec's README Outline.

The spec's README Outline:
1. What VISIO is (one paragraph)
2. Tech stack badges
3. Screenshot / GIF of a generated scene ← no screenshot exists yet, use a placeholder note
4. Getting started (`npm install`, `.env.local` setup, `npm run dev`)
5. How it works (the 4-step pipeline)
6. Known limitations (iOS export, API key required)

- [ ] **Step 1: Replace README.md with the following content**

Write this exact content to `README.md`:

```markdown
# VISIO

> AI-powered interactive scene visualiser

VISIO takes a natural-language description, sends it to the Claude API, and renders a live WebGL animation in your browser. Type anything — *"a solar system with three moons"*, *"a digital rainstorm"*, *"a campfire on a dark night"* — and watch the scene appear in real time. Adjust speed, zoom, and colour palette on the fly, remix two scenes together, and export your creation as a PNG.

---

## Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![PIXI.js](https://img.shields.io/badge/PIXI.js-v7-e91e8c)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude-API-cc785c)

---

## Getting Started

**1. Clone and install**

```bash
git clone https://github.com/JGardener/VISIO.git
cd VISIO/visio
npm install
```

**2. Add your API key**

Copy `.env.example` to `.env.local` and fill in your Anthropic API key:

```bash
cp .env.example .env.local
# then edit .env.local and set VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

**3. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## How It Works

| Step | What happens |
|------|-------------|
| **1. Describe a scene** | Type anything in plain English — no special syntax required |
| **2. Claude interprets it** | Your prompt is sent to Claude's API, which returns a structured JSON scene definition specifying elements, colours, sizes, speeds, and animation types |
| **3. PIXI.js renders it** | The JSON drives a WebGL canvas — animated in real time, entirely in your browser, no server required |
| **4. You take control** | Adjust speed, zoom, and colour palette. Remix two scenes together. Export as PNG. Every scene is saved to history |

---

## Known Limitations

- **API key required** — VISIO calls the Anthropic Claude API directly from the browser. You need a valid `VITE_ANTHROPIC_API_KEY` in `.env.local`.
- **PNG export on iOS Safari** — The `<a download>` trigger is blocked in iOS Safari when not on HTTPS. Works correctly once deployed to any standard HTTPS host (e.g. Vercel).
- **Client-side API key** — The API key is exposed in the browser bundle. This is intentional for a portfolio/demo project. Do not use a production key with billing limits.
```

- [ ] **Step 2: Verify TypeScript still passes**

Run: `npx tsc -p tsconfig.app.json --noEmit`

Expected: No output, exit code 0. (README changes cannot break TypeScript, but always verify.)

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: `✓ built in ...ms` — no errors.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: replace Vite template README with VISIO project README"
```

---

## Deliverable Verification

After all three tasks are committed, run these checks:

```bash
npx tsc -p tsconfig.app.json --noEmit   # Expected: 0 errors
npm run build                            # Expected: ✓ built, no errors
git log --oneline -5                     # Expected: 3 new commits visible
```

The repo is portfolio-ready when all three pass.
