import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import { fileURLToPath } from 'node:url'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'experiments.matiasgf.dev' },
      { protocol: 'https', hostname: 'experiments-matias-gfs-projects.vercel.app' },
    ],
  },
}

// Turbopack requires MDX plugins to be passed as serializable module
// references (strings), not function instances — so we point at the plugin
// file by absolute path.
const remarkTocPath = fileURLToPath(
  new URL('./src/lib/remark-toc.mjs', import.meta.url)
)

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm', remarkTocPath],
    rehypePlugins: ['@mapbox/rehype-prism'],
  } as any,
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
