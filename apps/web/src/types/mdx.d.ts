// Augments all `*.mdx` modules with the `tableOfContents` export injected by
// the `remarkToc` plugin (see src/lib/remark-toc.mjs).
declare module "*.mdx" {
  export const tableOfContents: { depth: number; value: string; id: string }[];
}
