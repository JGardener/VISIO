# VISIO

> AI-powered interactive scene visualiser

VISIO takes a natural-language description, sends it to the Claude API, and renders a live WebGL animation in your browser. Type anything — _"a solar system with three moons"_, _"a digital rainstorm"_, _"a campfire on a dark night"_ — and watch the scene appear in real time. Adjust speed, zoom, and colour palette on the fly, remix two scenes together, and export your creation as a PNG.

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
cd VISIO
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

| Step                        | What happens                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Describe a scene**     | Type anything in plain English — no special syntax required                                                                                            |
| **2. Claude interprets it** | Your prompt is sent to Claude's API, which returns a structured JSON scene definition specifying elements, colours, sizes, speeds, and animation types |
| **3. PIXI.js renders it**   | The JSON drives a WebGL canvas — animated in real time, entirely in your browser, no server required                                                   |
| **4. You take control**     | Adjust speed, zoom, and colour palette. Remix two scenes together. Export as PNG. Every scene is saved to history                                      |

---

## Known Limitations

- **API key required** — VISIO calls the Anthropic Claude API directly from the browser. You need a valid `VITE_ANTHROPIC_API_KEY` in `.env.local`.
- **PNG export on iOS Safari** — The `<a download>` trigger is blocked in iOS Safari when not on HTTPS. Works correctly once deployed to any standard HTTPS host (e.g. Vercel).
