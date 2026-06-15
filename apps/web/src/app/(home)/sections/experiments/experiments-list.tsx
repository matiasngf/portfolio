"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Experiment } from "@/lib/experiments";

/** Neutral placeholder shown while an experiment has no screenshot yet. */
function PreviewFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-foreground/[0.06]">
      <span className="font-sans text-[0.625rem] tracking-widest uppercase text-foreground/30">
        {label}
      </span>
    </div>
  );
}

export function ExperimentsList({ items }: { items: Experiment[] }) {
  // hoveredIndex covers the experiment rows; -1 marks the "See more" row so it
  // dims the others too, keeping the interaction consistent across the list.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {items.map((experiment, index) => {
        const isHovered = hoveredIndex === index;
        const anyHovered = hoveredIndex !== null;
        return (
          <div
            key={experiment.name}
            className={cn(
              "relative flex overflow-hidden min-h-[150px] transition-opacity duration-300",
              anyHovered && !isHovered ? "opacity-30" : "opacity-100"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="absolute top-0 left-0 w-full h-px bg-foreground/20" />
            <a
              href={experiment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
              aria-label={experiment.name}
            />

            {/* Text content */}
            <div className="flex-1 py-6 px-6 flex flex-col gap-2 min-w-0">
              <h3 className="font-serif text-4xl xl:text-5xl leading-tight">
                {experiment.name}
              </h3>
              <p className="font-serif text-sm text-foreground/60 leading-snug">
                {experiment.description}
              </p>
              <div className="mt-auto pt-3">
                <span className="font-sans text-xs tracking-widest uppercase text-foreground/40">
                  {experiment.tagsLabel}
                </span>
              </div>
            </div>

            {/* Inline preview image */}
            <div className="relative w-48 xl:w-64 flex-shrink-0 self-stretch">
              {experiment.preview ? (
                <Image
                  src={experiment.preview}
                  alt={experiment.name}
                  fill
                  sizes="(max-width: 1280px) 192px, 256px"
                  className="object-cover"
                />
              ) : (
                <PreviewFallback label={experiment.name} />
              )}
            </div>
          </div>
        );
      })}

      {/* See more row */}
      <div
        className={cn(
          "relative flex items-center overflow-hidden min-h-[88px] transition-opacity duration-300",
          hoveredIndex !== null && hoveredIndex !== -1
            ? "opacity-30"
            : "opacity-100"
        )}
        onMouseEnter={() => setHoveredIndex(-1)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div className="absolute top-0 left-0 w-full h-px bg-foreground/20" />
        <Link
          href="/experiments"
          className="absolute inset-0 z-10"
          aria-label="See all experiments"
        />
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="font-serif text-2xl xl:text-3xl leading-tight">
            See more
          </span>
          <span className="font-sans text-foreground/40">→</span>
        </div>
      </div>

      {/* Bottom border */}
      <div className="relative h-px">
        <div className="absolute top-0 left-0 w-full h-px bg-foreground/20" />
      </div>
    </>
  );
}
