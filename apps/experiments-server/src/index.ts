import express from 'express'
import path from 'path'

const app = express()
const experimentsPath = path.dirname(process.argv[1])

// Serve static files from the experiments directory
app.use('/experiments/:slug', (req, res, next) => {
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

// Default 404 handler
app.use((req, res) => {
  res.status(404).send({ error: 'Not found' })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
