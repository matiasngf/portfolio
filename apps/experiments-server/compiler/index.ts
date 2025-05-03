import webpack from "webpack"
import { baseConfig } from "./webpack-config"

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