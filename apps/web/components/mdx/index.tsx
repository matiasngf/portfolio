import { MDXComponents } from "mdx/types";
import { Headings } from "./headings";
import { Code } from "./code";
import { MdxLink } from "./link";
import Image from "next/image";
import { Source } from "./source";

export const mdxCustomComponents: MDXComponents = {
  ...Headings,
  Link: MdxLink,
  Image,
  Source,
  code: Code,
  a: MdxLink,
  ul: (props) => <ul className="list-disc list-inside" {...props} />,
};
