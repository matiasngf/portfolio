import { MDXComponents } from "mdx/types";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

export const Code = ({children, className, ...props}: CodeProps) => {

  const codeStyles = !!className ? className : 'p-1 bg-black text-white font-mono';

  return <code className={codeStyles} {...props}>{children}</code>
}