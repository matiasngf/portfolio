import { MDXComponents } from "mdx/types";
import { Headings } from "./headings";
import { Code } from "./code";
import { MdxLink } from "./link";

export const mdxCustomComponents: MDXComponents = {
  ...Headings,
  code: Code,
  a: MdxLink,
  ul: (props) => <ul className="list-disc list-inside" {...props} />,
};
