import { DetailedHTMLProps, HTMLAttributes } from "react";

export type CodeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

export const Code = ({ children, className, ...props }: CodeProps) => {
  const codeStyles = !!className
    ? className
    : "p-1 bg-black/20 text-token font-mono rounded-md";

  return (
    <code className={codeStyles} {...props}>
      {children}
    </code>
  );
};
