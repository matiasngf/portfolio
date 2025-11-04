import webpack from "webpack"
import { getWebpackConfig } from "./webpack-config"
import { getExperiments } from "./get-experiments"
import { cloneExperiments } from "./clone-experiments"
import { mode, vercelStaticPath } from "./constants"
import { spawn } from 'child_process'
import path from 'path'
import { createVercelConfig, createVercelFolder, generateExperimentsManifest } from "./vercel-utils"
import { createIndex } from "./create-index"

// import fs from 'fs'

async function compile() {
  console.log('Current working directory:', process.cwd());

  const experiments = await getExperiments()

  console.log(experiments);



  // console.log('\nExperiment includePath contents:')
  // for (const experiment of experiments) {
  //   const dirPath = experiment.includePath
  //   try {
  //     const files = fs.readdirSync(dirPath)
  //     console.log(`- ${experiment.name} (${dirPath}):`)
  //     files.forEach(file => {
  //       console.log(`    ${file}`)
  //     })
  //   } catch (err) {
  //     console.error(`Failed to read dir for ${experiment.name}: ${err}`)
  //   }
  // }

  createVercelFolder()
  cloneExperiments(experiments);
  createVercelConfig()
  generateExperimentsManifest(experiments);
  createIndex(experiments);


  return;
  let isFirstCompile = true
  let scriptProcess: any
  // Run webpack for both configurations
  const webpackConfig = getWebpackConfig()
  const compiler = webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err)
      return
    }

    if (stats?.hasErrors()) {
      console.error(stats.toString({
        colors: true,
        chunks: false
      }))
      return
    }

    if (stats?.endTime && stats?.startTime) {
      console.log(`Compiled in ${stats.endTime - stats.startTime}ms`);
    }

    if (isFirstCompile) {
      cloneExperiments(experiments)
      isFirstCompile = false
    }

    if (mode === 'production') {
      // Close the compiler when done
      compiler.close((closeErr) => {
        if (closeErr) {
          console.error(closeErr)
        }
      })
    } else {
      // In development mode, run the compiled script directly
      const rootDir = path.resolve(process.cwd())
      const scriptPath = path.join(rootDir, vercelStaticPath, 'index.js')

      // Kill previous process if it exists
      if (scriptProcess) {
        scriptProcess.kill()
      }

      // Start new process
      scriptProcess = spawn('node', [scriptPath], { stdio: 'inherit' })
    }
  })
}

compile()