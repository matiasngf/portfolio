import webpack from "webpack"
import { getWebpackConfig } from "./webpack-config"
import { getExperiments } from "./get-experiments"
import { cloneExperiments } from "./clone-experiments"
import { mode, outputFolder } from "./constants"
import { spawn } from 'child_process'
import path from 'path'

// Log the dir contents of each experiments.includePath folder
import fs from 'fs'

async function compile() {
  const experiments = await getExperiments()

  console.log(experiments);



  console.log('\nExperiment includePath contents:')
  for (const experiment of experiments) {
    const dirPath = experiment.includePath
    try {
      const files = fs.readdirSync(dirPath)
      console.log(`- ${experiment.name} (${dirPath}):`)
      files.forEach(file => {
        console.log(`    ${file}`)
      })
    } catch (err) {
      console.error(`Failed to read dir for ${experiment.name}: ${err}`)
    }
  }


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
      const scriptPath = path.join(rootDir, outputFolder, 'index.js')

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