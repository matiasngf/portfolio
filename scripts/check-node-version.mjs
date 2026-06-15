#!/usr/bin/env node
// Guards local development/builds against running on the wrong Node.js major.
// The required major is read from .nvmrc (the same file fnm/nvm use), so there
// is a single source of truth. Runs on `preinstall`; bypass with SKIP_NODE_CHECK=1.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

if (process.env.SKIP_NODE_CHECK === "1") process.exit(0);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function requiredMajor() {
  try {
    const m = readFileSync(join(root, ".nvmrc"), "utf8").match(/\d+/);
    if (m) return Number(m[0]);
  } catch {
    /* no .nvmrc — skip the check */
  }
  return null;
}

const required = requiredMajor();
const current = Number(process.versions.node.split(".")[0]);

if (required !== null && current !== required) {
  const c = (code) => `\x1b[${code}m`;
  const reset = c(0);
  console.error(
    [
      "",
      `${c(31)}✖ Wrong Node.js version${reset}`,
      `  This project needs Node ${c(1)}${required}.x${reset}, but you're on ${c(1)}v${process.versions.node}${reset}.`,
      "",
      `  Switch with fnm (reads .nvmrc):`,
      `    ${c(36)}fnm use${reset}              switch to the project's version`,
      `    ${c(36)}fnm install${reset}          if you don't have ${required}.x installed yet`,
      "",
      `  No fnm? Install it: https://github.com/Schniz/fnm   (or run \`nvm use\`)`,
      `  Need to bypass once? Prefix the command with ${c(36)}SKIP_NODE_CHECK=1${reset}`,
      "",
    ].join("\n")
  );
  process.exit(1);
}
