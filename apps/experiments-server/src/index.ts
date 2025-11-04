import { getExperiments } from "./get-experiments"
import { cloneExperiments } from "./clone-experiments"
import { createVercelConfig, createVercelFolder, generateExperimentsManifest } from "./vercel-utils"
import { createIndex } from "./create-index"

async function compile() {
  const experiments = await getExperiments()
  createVercelFolder()
  cloneExperiments(experiments);
  createVercelConfig()
  generateExperimentsManifest(experiments);
  createIndex(experiments);
}

compile()