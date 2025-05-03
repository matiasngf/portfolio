import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PeerjsReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['react', 'peerjs'],
      output: {
        globals: {
          react: 'React',
          peerjs: 'Peer'
        }
      }
    },
    sourcemap: true,
    minify: true
  },
  plugins: [
    dts()
  ]
}); 