"use client";

import { forwardRef } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 h-px w-full bg-foreground/20",
        className
      )}
    />
  );
}

type ListRowProps = {
  title: string;
  role: string;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  href?: string;
  showDivider?: boolean;
};

export const ListRow = forwardRef<HTMLDivElement, ListRowProps>(
  function ListRow(
    {
      title,
      role,
      isHovered,
      anyHovered,
      onHover,
      onLeave,
      href,
      showDivider = true,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative cursor-pointer transition-opacity duration-300",
          anyHovered && !isHovered ? "opacity-30" : "opacity-100"
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {showDivider ? <Divider /> : null}
        {href && (
          <Link href={href} className="absolute inset-0 z-10" aria-label={title} />
        )}
        <div className="flex items-center gap-4 px-6 py-6">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h3 className="font-serif text-4xl leading-tight work-title xl:text-5xl">
              {title}
            </h3>
            <span className="font-sans text-sm tracking-widest uppercase work-role text-foreground/40">
              {role}
            </span>
          </div>
          <div
            className="flex-shrink-0 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <Image
              src="/hand-dec-2 1.png"
              alt=""
              width={29}
              height={57}
              style={{ transform: "rotate(-90deg)" }}
            />
          </div>
        </div>
      </div>
    );
  }
);

type PreviewItem = {
  imageSrc: string | StaticImageData;
  summary: string;
};

type PreviewColumnProps = {
  items: PreviewItem[];
  hoveredIndex: number | null;
  imageTop: number;
};

export function PreviewColumn({ items, hoveredIndex, imageTop }: PreviewColumnProps) {
  const isVisible = hoveredIndex !== null;
  return (
    <div
      className="absolute left-0 right-0 flex flex-col gap-4 transition-[top,opacity] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
      style={{
        top: imageTop,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "507 / 318" }}>
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-300",
              hoveredIndex === index ? "opacity-100" : "opacity-0"
            )}
          >
            {typeof item.imageSrc === "string" ? (
              <img
                src={item.imageSrc}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Image src={item.imageSrc} alt="" fill className="object-cover" />
            )}
          </div>
        ))}
      </div>
      <div className="relative min-h-[4em]">
        {items.map((item, index) => (
          <p
            key={index}
            className={cn(
              "absolute inset-0 font-serif italic text-sm text-foreground/70 leading-snug transition-opacity duration-300",
              hoveredIndex === index ? "opacity-100" : "opacity-0"
            )}
          >
            {item.summary}
          </p>
        ))}
      </div>
    </div>
  );
}
