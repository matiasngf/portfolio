#!/usr/bin/env node
import path from "node:path";
import { capture } from "../index.mjs";

// Minimal flag parser: --key value, --key=value, and boolean --flag.
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const eq = arg.indexOf("=");
    if (eq !== -1) {
      out[arg.slice(2, eq)] = arg.slice(eq + 1);
    } else {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`capture-screenshot — capture a standardized screenshot.png for an experiment

Usage (run from an experiment folder):
  capture-screenshot [--dist dist] [--output screenshot.png] [--route /]
                     [--width 1280] [--height 800] [--scale 2]
                     [--delay 2000] [--wait-selector "canvas"]
                     [--headed]

Per-experiment overrides may also live in screenshot.config.{mjs,js,json}
next to the experiment config. CLI flags take precedence.`);
  process.exit(0);
}

const num = (v, d) => (v === undefined ? d : Number(v));

const options = {
  dir: args.dir ? path.resolve(String(args.dir)) : process.cwd(),
};
if (args.dist !== undefined) options.dist = String(args.dist);
if (args.output !== undefined) options.output = String(args.output);
if (args.route !== undefined) options.route = String(args.route);
if (args.width !== undefined) options.width = num(args.width);
if (args.height !== undefined) options.height = num(args.height);
if (args.scale !== undefined) options.deviceScaleFactor = num(args.scale);
if (args.delay !== undefined) options.delayMs = num(args.delay);
if (args["wait-selector"] !== undefined)
  options.waitSelector = String(args["wait-selector"]);
if (args.headed) options.headed = true;
if (args.webgpu) options.webgpu = true;
if (args.hide !== undefined)
  options.hideSelectors = String(args.hide)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

try {
  const out = await capture(options);
  console.log(`✓ screenshot saved to ${out}`);
} catch (err) {
  console.error(`✗ screenshot failed: ${err.message}`);
  process.exit(1);
}
