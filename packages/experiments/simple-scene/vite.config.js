import { defineConfig } from 'vite'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const experimentConfig = JSON.parse(
  readFileSync(resolve(process.cwd(), 'experiment-config.json'), 'utf-8')
)

const basePath = `/${experimentConfig.name}`

export default defineConfig(({ command }) => ({
  base: command === 'build' ? basePath : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext'
  },
  esbuild: {
    target: 'esnext'
  }
}))

