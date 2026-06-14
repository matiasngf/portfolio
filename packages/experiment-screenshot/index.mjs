import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import sirv from "sirv";
import { chromium } from "playwright";

/**
 * macOS GPU flags that make WebGL/WebGPU render real frames in (new) headless
 * Chromium instead of a black canvas. See the package README for sources.
 */
const MACOS_GPU_ARGS = [
  "--use-gl=angle",
  "--use-angle=metal",
  "--enable-unsafe-webgpu",
  "--ignore-gpu-blocklist",
  "--enable-gpu",
];

const DEFAULTS = {
  dist: "dist",
  output: "screenshot.png",
  width: 1280,
  height: 800,
  deviceScaleFactor: 2,
  delayMs: 2000,
  waitSelector: null,
  route: "/",
  webgpu: false,
  headed: false,
  // Debug control panels common in these experiments — hidden so they don't
  // pollute the thumbnail. Override per-experiment via screenshot.config.
  hideSelectors: ["#leva__root", ".lil-gui", ".dg.main", ".dg.ac", ".tp-dfwv"],
};

/**
 * Experiments are built with vite `base: /<name>` so their assets resolve under
 * that subpath on the deployment. Read the name so we can serve the dist under
 * the same prefix locally. Returns "" when there's no config.
 */
function readBasePath(dir) {
  const cfgPath = path.join(dir, "experiment-config.json");
  if (!fs.existsSync(cfgPath)) return "";
  try {
    const { name } = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    return name ? `/${name}` : "";
  } catch {
    return "";
  }
}

/** Load an optional per-experiment `screenshot.config.{mjs,js,json}` from `dir`. */
async function loadConfig(dir) {
  for (const file of ["screenshot.config.mjs", "screenshot.config.js"]) {
    const p = path.join(dir, file);
    if (fs.existsSync(p)) {
      const mod = await import(pathToFileURL(p).href);
      return mod.default ?? mod;
    }
  }
  const jsonPath = path.join(dir, "screenshot.config.json");
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  }
  return {};
}

/**
 * Serve `root` statically on an ephemeral localhost port, mounted under `base`
 * (e.g. "/simple-scene") so absolute asset paths from the build resolve.
 * Resolves to { url, close }.
 */
function serveStatic(root, base) {
  const handler = sirv(root, { dev: true, single: true });
  const server = http.createServer((req, res) => {
    if (base && (req.url === base || req.url.startsWith(base + "/"))) {
      req.url = req.url.slice(base.length) || "/";
    }
    handler(req, res);
  });
  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}

/**
 * Capture a screenshot of a built experiment.
 *
 * @param {object} options
 * @param {string} options.dir   Experiment root (where screenshot.png is written).
 * @param {string} [options.dist] Built output folder to serve (relative to dir).
 * @param {string} [options.output] Output file (relative to dir).
 * @param {number} [options.width] / [options.height] / [options.deviceScaleFactor]
 * @param {number} [options.delayMs] Settle time before capture.
 * @param {string|null} [options.waitSelector] Optional selector to await.
 * @param {string} [options.route] Path to open under the served root.
 * @param {boolean} [options.webgpu] Hint (flags are always passed; kept for config clarity).
 * @param {boolean} [options.headed] Run headed (reliable GPU fallback on macOS).
 */
export async function capture(options) {
  const fileConfig = await loadConfig(options.dir);
  const opts = { ...DEFAULTS, ...fileConfig, ...options };

  const distPath = path.resolve(opts.dir, opts.dist);
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Build output not found at ${distPath}. Run the experiment build first (e.g. "pnpm experiment-build").`
    );
  }

  const outputPath = path.resolve(opts.dir, opts.output);
  const base = readBasePath(opts.dir);

  const { url, close: closeServer } = await serveStatic(distPath, base);
  const browser = await chromium.launch({
    headless: !opts.headed,
    args: MACOS_GPU_ARGS,
  });

  try {
    const page = await browser.newPage({
      viewport: { width: opts.width, height: opts.height },
      deviceScaleFactor: opts.deviceScaleFactor,
    });

    // base has no trailing slash; route starts with "/".
    const target = `${url}${base}${opts.route}`;
    await page.goto(target, { waitUntil: "networkidle" });

    if (opts.waitSelector) {
      await page.waitForSelector(opts.waitSelector, { timeout: 30000 });
    }

    // Hide debug control panels so they don't appear in the thumbnail.
    if (opts.hideSelectors?.length) {
      await page.addStyleTag({
        content: opts.hideSelectors
          .map((sel) => `${sel}{display:none !important;}`)
          .join("\n"),
      });
    }

    // Let the scene paint a few frames, then settle.
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        )
    );
    if (opts.delayMs > 0) await page.waitForTimeout(opts.delayMs);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    await page.screenshot({ path: outputPath, type: "png" });
    return outputPath;
  } finally {
    await browser.close();
    await closeServer();
  }
}
