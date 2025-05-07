import express from 'express'
import path from 'path'

const app = express()
const experimentsPath = path.dirname(process.argv[1])

// Serve static files from the experiments directory
app.use('/:slug', (req, res, next) => {
  const slug = req.params.slug
  const experimentPath = path.join(experimentsPath, slug)

  // First try to serve index.html for the root path
  if (req.path === '/' || req.path === '') {
    express.static(experimentPath)(req, res, next)
  } else {
    // Then try to serve any file within the experiment directory
    express.static(experimentPath)(req, res, next)
  }
})

// Catch-all handler for root-level requests using referer
app.use((req, res, next) => {
  const referer = req.headers.referer

  if (referer) {
    // Extract experiment slug from referer URL
    const match = referer.match(/\/([^\/]+)/)

    if (match && match[1]) {
      const slug = match[1]
      const redirectPath = `/${slug}${req.path}`

      // Redirect to the experiment's path
      return res.redirect(redirectPath)
    }
  }

  // If no referer or invalid format, continue to 404 handler
  next()
})

// Default 404 handler
app.use((_req, res) => {
  res.status(404).send({ error: 'Not found' })
})

app.listen(3000, () => {
  console.log(`Server started at http://localhost:3000`)
})

module.exports = app