# experiment-screenshot

Playwright-based screenshot capture for experiments. Serves an experiment's
**locally built** output on localhost, renders it in GPU-accelerated Chromium
(WebGL/WebGPU), and writes a standardized `screenshot.png` next to the
experiment config. The experiments scanner (`apps/experiments-server`) then
copies that file into the static deploy and exposes it in
`experiments-manifest.json` as a `preview` URL.

This command is **expensive and run manually** (not part of CI/build) — run it
when an experiment's thumbnail needs refreshing.

## One-time setup

Install the Chromium browser Playwright drives:

```bash
pnpm --filter experiment-screenshot install-browser
# or: npx playwright install chromium
```

## Usage

From an experiment folder (after building it, e.g. `pnpm experiment-build`):

```bash
pnpm screenshot
```

which runs `capture-screenshot`. Flags:

| Flag | Default | Meaning |
| --- | --- | --- |
| `--dist <dir>` | `dist` | Built output folder to serve |
| `--output <file>` | `screenshot.png` | Output file (relative to experiment root) |
| `--route <path>` | `/` | Path to open under the served root |
| `--width` / `--height` | `1280` / `800` | Viewport size |
| `--scale <n>` | `2` | deviceScaleFactor |
| `--delay <ms>` | `2000` | Settle time before capture |
| `--wait-selector <sel>` | — | Await a selector before capturing |
| `--headed` | off | Run headed (most reliable GPU on macOS) |

### Per-experiment overrides

Drop a `screenshot.config.mjs` (or `.js` / `.json`) next to the experiment
config to customize capture. CLI flags win over the file.

```js
// screenshot.config.mjs
export default {
  delayMs: 4000,        // slow scene — give it more time
  waitSelector: "canvas",
};
```

## macOS GPU notes

Headless Chromium renders WebGL/WebGPU to a black frame unless GPU acceleration
is forced. We launch with `--use-gl=angle --use-angle=metal
--enable-unsafe-webgpu --ignore-gpu-blocklist --enable-gpu`. If a scene still
captures black, use `--headed` (a real GPU context, reliable on a local Mac).

Sources:
- https://blog.promaton.com/testing-3d-applications-with-playwright-on-gpu-1e9cfc8b54a9
- https://michelkraemer.com/enable-gpu-for-slow-playwright-tests-in-headless-mode/
- https://www.createit.com/blog/headless-chrome-testing-webgl-using-playwright/
