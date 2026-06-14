import NextImage, { type ImageProps } from "next/image";

type MdxImageProps = Omit<ImageProps, "alt"> & { alt?: string };

/**
 * Image wrapper for MDX content. `alt` is optional here (defaults to an empty,
 * decorative string) so post images don't trip Next's required-alt warning.
 */
export function MdxImage({ alt = "", ...props }: MdxImageProps) {
  return <NextImage alt={alt} {...props} />;
}
