import Link from "next/link";
import { PropsWithChildren } from "react";

export interface SourceProps {
  basePath?: string;
  functionName?: string;
  path: string;
}

export const Source = ({
  basePath,
  path,
  functionName,
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
          {path} {functionName && `> ${functionName}`}
        </Link>
      </div>
      {children}
    </div>
  );
};
