import type { AnchorHTMLAttributes, ReactNode } from "react";

interface MdxLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function MdxLink({ children, ...props }: MdxLinkProps) {
  return (
    <a
      {...props}
      className="underline underline-offset-2 text-foreground/80 hover:text-foreground transition-colors"
    >
      {children}
    </a>
  );
}
