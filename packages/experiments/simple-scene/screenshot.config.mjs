// Per-experiment screenshot overrides for `pnpm screenshot`.
// CLI flags take precedence over values here. See
// packages/experiment-screenshot/README.md for all options.
export default {
  // Wait for the canvas to mount, then let a couple of frames render.
  waitSelector: "canvas",
  delayMs: 1500,
};
