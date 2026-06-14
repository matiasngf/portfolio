import * as fs from 'fs';
import * as path from 'path';
import { ExperimentConfigExtended } from './experiment-config-schema';
import { screenshotFileName } from './constants';

export function createVercelFolder() {

  const vercelOutputPath = path.resolve(process.cwd(), '.vercel', 'output', 'static');

  // Delete .vercel/output/static directory if it already exists
  if (fs.existsSync(vercelOutputPath)) {
    fs.rmSync(vercelOutputPath, { recursive: true, force: true });
  }

  // Create .vercel/output/static directory
  fs.mkdirSync(vercelOutputPath, { recursive: true });
}

export function createVercelConfig() {

  const vercelOutputPath = path.resolve(process.cwd(), '.vercel', 'output');
  const vercelConfigPath = path.join(vercelOutputPath, 'config.json');

  const vercelConfig = {
    version: 3,

    routes: [
      {
        "handle": "filesystem"
      },
    ]
  };

  // Write the Vercel config file
  fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
}

export function generateExperimentsManifest(experiments: ExperimentConfigExtended[]) {
  const date = new Date().toISOString();

  // Expose a `preview` URL (relative to the deployment root) for experiments
  // that ship a screenshot, so consumers can render a thumbnail.
  const manifestExperiments = experiments.map((experiment) =>
    experiment.hasScreenshot
      ? { ...experiment, preview: `/${experiment.name}/${screenshotFileName}` }
      : experiment
  )

  const manifest = {
    generatedAt: date,
    experiments: manifestExperiments
  }

  const vercelOutputPath = path.resolve(process.cwd(), '.vercel', 'output', 'static');

  const manifestPath = path.join(vercelOutputPath, 'experiments-manifest.json');

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}
