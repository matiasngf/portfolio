import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['@mapbox/rehype-prism'],
    providerImportSource: "@mdx-js/react",
  } as any,
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
