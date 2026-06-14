import type { ReactNode } from "react";

interface SourceProps {
  basePath?: string;
  path: string;
  children: ReactNode;
}

export function Source({ path, children }: SourceProps) {
  return (
    <div className="mb-4">
      <div className="font-mono text-xs text-foreground/40 mb-1 pl-1">{path}</div>
      {children}
    </div>
  );
}
