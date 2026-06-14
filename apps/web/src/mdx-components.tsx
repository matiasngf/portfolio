import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { MdxLink } from "@/components/mdx/link";
import { MdxImage } from "@/components/mdx/image";
import { Source } from "@/components/mdx/source";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: MdxLink as MDXComponents["a"],
    Image: MdxImage as unknown as MDXComponents["img"],
    Link: Link as unknown as MDXComponents[string],
    MdxLink: MdxLink as unknown as MDXComponents[string],
    Source: Source as unknown as MDXComponents[string],
    ...components,
  };
}
