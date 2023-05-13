import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { HTMLAttributeAnchorTarget, useMemo } from "react";
import clsx from "clsx";

export interface IconButtonProps {
  target?: HTMLAttributeAnchorTarget;
  href?: string;
  icon: FontAwesomeIconProps["icon"];
  className?: string;
}

export const IconButton = ({
  target,
  href,
  icon,
  className,
}: IconButtonProps) => {
  const IconRender = useMemo(() => {
    const Comp = () => (
      <div
        className={clsx(
          "rounded-md bg-zinc-800 text-white flex items-center justify-center w-10 h-10",
          className
        )}
      >
        <FontAwesomeIcon className="w-6 h-6" icon={icon} />
      </div>
    );
    return Comp;
  }, [icon, className]);
  if (href) {
    return (
      <Link href={href} target={target}>
        <IconRender />
      </Link>
    );
  }
  return <IconRender />;
};
