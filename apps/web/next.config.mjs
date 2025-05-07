import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";
import rehypePrism from "@mapbox/rehype-prism";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [remarkGfm],
    // rehypePlugins: [rehypeHighlight({
    //   ignoreMissing: true,
    // })],
    rehypePlugins: [rehypePrism],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
})
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ["ui"],
  experimental: {
    esmExternals: 'loose'
  },
  async redirects() {
    return [
      {
        source: "/projects/:slug",
        destination: "/experiments/:slug",
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
