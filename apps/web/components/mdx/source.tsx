import Link from "next/link";
import { PropsWithChildren } from "react";

export interface SourceProps {
  basePath?: string;
  path: string;
}

export const Source = ({
  basePath,
  path,
  children,
}: PropsWithChildren<SourceProps>) => {
  return (
    <div className="bg-[#1e1e1e]">
      <div className="px-4 pt-4 italic">
        <Link
          href={`${basePath || ""}${path}`}
          className="text-link"
          target="_blank"
        >
          {path}
        </Link>
      </div>
      {children}
    </div>
  );
};
