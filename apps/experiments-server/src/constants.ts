export const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
export const experimentsPath = '../../packages/experiments'
export const vercelStaticPath = '.vercel/output/static'
// Standardized screenshot filename produced by the per-experiment capture
// script (packages/experiment-screenshot) and detected/copied by the scanner.
export const screenshotFileName = 'screenshot.png'