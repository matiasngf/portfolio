import path from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..')
const srcDir = path.resolve(rootDir, 'src')

// Base configuration for both CJS and ESM
const baseConfig: webpack.Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: path.resolve(srcDir, 'index.ts'),
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: false,
                decorators: true
              },
              target: 'es2020'
            },
            module: {
              type: 'es6'
            }
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    minimize: false
  },
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'index.js',
  },
}

// Run webpack for both configurations
const compiler = webpack(baseConfig)
compiler.run((err, stats) => {
  if (err) {
    console.error(err)
    return
  }

  if (stats?.hasErrors()) {
    console.error(stats.toString({
      colors: true,
      chunks: false
    }))
    process.exit(1)
  }

  console.log(stats?.toString({
    colors: true,
    chunks: false
  }))

  // Close the compiler when done
  compiler.close((closeErr) => {
    if (closeErr) {
      console.error(closeErr)
    }
  })
}) 