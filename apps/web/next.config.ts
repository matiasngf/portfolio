import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import remarkGfm from "remark-gfm";
import rehypePrism from "@mapbox/rehype-prism";


const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
    providerImportSource: "@mdx-js/react",
  }
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
