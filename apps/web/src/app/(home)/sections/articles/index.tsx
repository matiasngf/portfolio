"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { projectsConfig } from "@/app/posts/[post-key]/posts-config";

const articles = Object.entries(projectsConfig).map(([slug, config]) => ({
  slug,
  title: config.name,
  tags: config.tags.join(" · "),
  description: config.description,
  preview: config.preview,
}));

export function Articles() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="articles" className="border-t border-foreground/20 pb-32 pt-24">
      {/* Section header */}
      <div className="px-6">
        <h2
          className="font-display leading-none tracking-wide text-[7.5rem]"
          style={{ fontVariationSettings: '"wght" 663' } as React.CSSProperties}
        >
          Articles
        </h2>
        <p className="mt-2 mb-12 font-serif text-base italic text-foreground/60">
          Sometimes I do write down my thoughts.
        </p>
      </div>

      {/* Article rows — full bleed so dividers reach page edges */}
      {articles.map((article, index) => {
        const isHovered = hoveredIndex === index;
        const anyHovered = hoveredIndex !== null;
        return (
          <div
            key={article.slug}
            className={cn(
              "relative flex overflow-hidden min-h-[150px] transition-opacity duration-300",
              anyHovered && !isHovered ? "opacity-30" : "opacity-100"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="absolute top-0 left-0 w-full h-px bg-foreground/20" />
            <Link
              href={`/posts/${article.slug}`}
              className="absolute inset-0 z-10"
              aria-label={article.title}
            />

            {/* Text content */}
            <div className="flex-1 py-6 px-6 flex flex-col gap-2 min-w-0">
              <h3 className="font-serif text-4xl xl:text-5xl leading-tight article-title">
                {article.title}
              </h3>
              <p className="font-serif text-sm text-foreground/60 leading-snug article-meta">
                {article.description}
              </p>
              <div className="mt-auto pt-3">
                <span className="font-sans text-xs tracking-widest uppercase text-foreground/40 article-meta">
                  {article.tags}
                </span>
              </div>
            </div>

            {/* Inline preview image */}
            <div className="relative w-48 xl:w-64 flex-shrink-0 self-stretch">
              <Image
                src={article.preview}
                alt={article.title}
                fill
                sizes="(max-width: 1280px) 192px, 256px"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}

      {/* Bottom border */}
      <div className="relative h-px">
        <div className="absolute top-0 left-0 w-full h-px bg-foreground/20" />
      </div>
    </section>
  );
}
