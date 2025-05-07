import chokidar from 'chokidar'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { ExperimentConfigExtended, experimentConfigSchema } from './experiment-config-schema.js'

export async function getExperiments() {

  console.log(chalk.bgGreenBright.bold.black(' Searching experiments '))

  return new Promise<ExperimentConfigExtended[]>(resolve => {

    const experiments: ExperimentConfigExtended[] = []

    const watcher = chokidar.watch('../../packages/', {
      persistent: true,
      ignored: [/node_modules/, /dist/, /.next/, /public/, /build/, /\.git/],
    })

    watcher
      .on('add', (filePath, _stats) => {
        try {
          if (!filePath.endsWith('experiment-config.json')) return

          const experimentConfigRaw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
          const experimentConfigParsed = experimentConfigSchema.safeParse(experimentConfigRaw)

          if (!experimentConfigParsed.success) {
            // Failed schema
            console.error(chalk.redBright(`Error parsing ${filePath}:`))
            experimentConfigParsed.error.errors.forEach(error => {
              console.error(chalk.redBright(`  - ${error.path.join('.')} : ${error.message}`))
            })
            return
          }

          // Schema ok
          const experimentConfig = experimentConfigParsed.data


          // Check that experiment has contents folder
          const dirPath = path.dirname(filePath)
          const includePath = path.join(dirPath, experimentConfig.include)
          if (!fs.existsSync(includePath)) throw new Error(chalk.redBright(`${chalk.bold(experimentConfig.include)} folder does not exist on ${dirPath}`))

          console.log(`└─ ${chalk.bold(experimentConfig.name)}`)

          // Create extendend configuration
          const experimentConfigExtended: ExperimentConfigExtended = {
            ...experimentConfig,
            includePath: includePath,
          }

          experiments.push(experimentConfigExtended)

        } catch (error) {
          if (typeof error === 'object' && error !== null && 'message' in error) {
            console.error(chalk.redBright(error.message))
          } else {
            console.error(chalk.redBright(error))
          }
        }
      })
      .on('error', error => console.error(`Watcher error: ${error}`))
      .on('ready', () => {
        console.log(chalk.bold('Found ', experiments.length, ' experiment' + (experiments.length !== 1 ? 's' : '')))
        // Do not close the watcher here if you want it to keep running
        watcher.close();
        resolve(experiments)
      })
  })

}