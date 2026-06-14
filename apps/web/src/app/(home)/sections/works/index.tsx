"use client";

import { useState, useRef } from "react";
import { ListRow, Divider, PreviewColumn } from "@/components/list-row";

interface Work {
  title: string;
  role: string;
  summary: string;
  image: string;
}

const works: Work[] = [
  {
    title: "Nextjs conf 25",
    role: "Development",
    summary:
      "Placeholder summary for Next.js Conf 25 — replace this with a real description.",
    image: "/work-previews/placeholder-black.png",
  },
  {
    title: "Basement.studio",
    role: "Development",
    summary:
      "On 2025, I helped ship the new basement.studio website. Instanced meshes, advanced WebGL loading techniques and a lot of interactive things.",
    image: "/work-previews/basement-studio-2025.jpg",
  },
  {
    title: "xmcp",
    role: "Development",
    summary:
      "Placeholder summary for xmcp — replace this with a real description.",
    image: "/work-previews/placeholder-black.png",
  },
  {
    title: "Vercel ship 25",
    role: "Development",
    summary:
      "Placeholder summary for Vercel Ship 25 — replace this with a real description.",
    image: "/work-previews/vercel-ship-25.jpg",
  },
  {
    title: "Black Forest Lab",
    role: "Development",
    summary:
      "Placeholder summary for Black Forest Lab — replace this with a real description.",
    image: "/work-previews/placeholder-black.png",
  },
  {
    title: "Daylight",
    role: "Development",
    summary:
      "Placeholder summary for Daylight — replace this with a real description.",
    image: "/work-previews/daylight.jpg",
  },
  {
    title: "Nextjs conf 24",
    role: "Development",
    summary:
      "Placeholder summary for Next.js Conf 24 — replace this with a real description.",
    image: "/work-previews/nextjs-conf-24.png",
  },
  {
    title: "Vercel ship 24",
    role: "Development",
    summary:
      "Placeholder summary for Vercel Ship 24 — replace this with a real description.",
    image: "/work-previews/vercel-ship-24.jpg",
  },
  {
    title: "Vercel fluid",
    role: "Development",
    summary:
      "Placeholder summary for Vercel Fluid — replace this with a real description.",
    image: "/work-previews/placeholder-black.png",
  },
  {
    title: "Kidsuper world",
    role: "Development",
    summary:
      "Placeholder summary for Kidsuper World — replace this with a real description.",
    image: "/work-previews/kidsuper-world.jpg",
  },
  {
    title: "Chronicles",
    role: "Development",
    summary:
      "Placeholder summary for Chronicles — replace this with a real description.",
    image: "/work-previews/basement-chronicles.png",
  },
];

export function Works() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageTop, setImageTop] = useState(0);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewColRef = useRef<HTMLDivElement | null>(null);

  const handleHover = (index: number) => {
    setHoveredIndex(index);
    const row = rowRefs.current[index];
    const col = previewColRef.current;
    if (row && col) {
      setImageTop(
        row.getBoundingClientRect().top - col.getBoundingClientRect().top
      );
    }
  };

  return (
    <section id="works" className="pb-32 pt-24">
      {/* Section header */}
      <div className="px-6">
        <h2
          className="font-display leading-none tracking-wide text-[7.5rem]"
          style={{ fontVariationSettings: '"wght" 663' } as React.CSSProperties}
        >
          Works
        </h2>
        <p className="mt-2 mb-12 font-serif text-base italic text-foreground/60">
          From designer to developer, here are some works I&apos;m proud to share:
        </p>
      </div>

      {/* List + preview */}
      <div className="relative lg:grid lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_500px]">
        {/* Project list */}
        <div className="flex min-w-0 flex-col">
          {works.map((work, index) => (
            <ListRow
              key={work.title}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              title={work.title}
              role={work.role}
              isHovered={hoveredIndex === index}
              anyHovered={hoveredIndex !== null}
              onHover={() => handleHover(index)}
              onLeave={() => setHoveredIndex(null)}
              showDivider={index !== 0}
            />
          ))}
          <Divider />
        </div>

        {/* Preview column */}
        <div
          ref={previewColRef}
          className="relative hidden border-l border-foreground/20 pl-8 lg:block"
        >
          <PreviewColumn
            items={works.map((w) => ({ imageSrc: w.image, summary: w.summary }))}
            hoveredIndex={hoveredIndex}
            imageTop={imageTop}
          />
        </div>
      </div>
    </section>
  );
}
