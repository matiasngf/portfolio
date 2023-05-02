import { MDXComponents } from "mdx/types";
import { Headings } from "./headings";
import { Code } from "./code";

export const mdxCustomComponents: MDXComponents = {
  ...Headings,
  code: Code
}