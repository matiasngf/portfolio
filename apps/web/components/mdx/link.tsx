import clsx from "clsx";
import Link from "next/link";

// TODO: what?
export const MdxLink = ({ children, className, href, ...props }: any) => {
  return (
    <Link
      href={href as any}
      className={clsx(className, "text-link")}
      {...props}
    >
      {children}
    </Link>
  );
};
