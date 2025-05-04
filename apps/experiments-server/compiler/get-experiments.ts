import chokidar from 'chokidar'
import chalk from 'chalk'
import fs from 'fs'

export async function getExperiments() {

  return new Promise<string[]>(resolve => {

    const paths: string[] = []

    const watcher = chokidar.watch('../../packages/', {
      persistent: true,
      ignored: [/node_modules/, /dist/, /.next/, /public/, /build/, /\.git/],
    })

    watcher
      .on('add', (filePath, stats) => {
        if (!filePath.endsWith('experiment-config.json')) return

        const experimentConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        console.log(`Found experiment: ${chalk.bold.green(experimentConfig.name)}`)
      })
      .on('error', error => console.error(`Watcher error: ${error}`))
      .on('ready', () => {
        // Do not close the watcher here if you want it to keep running
        watcher.close();
        resolve(paths)
      })
  })

}