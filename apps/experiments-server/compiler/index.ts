import webpack from "webpack"
import { baseConfig } from "./webpack-config"
import { getExperiments } from "./get-experiments"
import { cloneExperiments } from "./clone-experiments"
import { mode, outputFolder } from "./constants"
import { spawn } from 'child_process'
import path from 'path'

async function compile() {
  const experiments = await getExperiments()
  let isFirstCompile = true
  let scriptProcess: any
  // Run webpack for both configurations
  const compiler = webpack(baseConfig, (err, stats) => {
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