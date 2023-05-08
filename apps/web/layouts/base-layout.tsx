import { RepoButton } from "@/components/repo-button";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="fixed z-50 py-5 w-full backdrop-blur-lg bg-background/30 border-b border-t-primary/10">
      <div className="flex justify-between items-center container">
        <div className="flex items-center space-x-7">
          <Link href="/">Home</Link>
        </div>
        <RepoButton />
      </div>
    </div>
  );
};

export const BaseLayout = ({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={clsx(
        "bg-background text-t-primary min-h-screen pb-20",
        className
      )}
    >
      <Header />
      {children}
    </div>
  );
};
