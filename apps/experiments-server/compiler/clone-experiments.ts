import fs from 'fs';
import path from 'path';

import { ExperimentConfigExtended } from "./experiment-config-schema";

export function cloneExperiments(experiments: ExperimentConfigExtended[]) {
  experiments.forEach((experimentConfig) => {
    const { name, includePath } = experimentConfig
    const distPath = path.resolve(process.cwd(), 'dist', name)
    const sourcePath = path.resolve(process.cwd(), includePath)

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true })
    }

    // Copy all files from source to destination
    copyRecursive(sourcePath, distPath)
  })
}

function copyRecursive(source: string, dest: string) {
  if (fs.statSync(source).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(source).forEach((child) => {
      copyRecursive(path.join(source, child), path.join(dest, child))
    })
  } else {
    fs.copyFileSync(source, dest)
  }
}