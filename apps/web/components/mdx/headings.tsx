import { DetailedHTMLProps, HTMLAttributes } from "react";

type HeadProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export const Headings = {
  h1: (props: HeadProps) => <h1 className="text-4xl font-bold" {...props} />,
  h2: (props: HeadProps) => <h2 className="text-3xl font-bold" {...props} />,
  h3: (props: HeadProps) => <h3 className="text-2xl font-bold" {...props} />,
  h4: (props: HeadProps) => <h4 className="text-xl font-bold" {...props} />,
  h5: (props: HeadProps) => <h5 className="text-lg font-bold" {...props} />,
  h6: (props: HeadProps) => <h6 className="text-base font-bold" {...props} />,
} as const;
