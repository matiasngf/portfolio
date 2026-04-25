"use client";

import { useScope } from "@/hooks/use-scope";
import { animate, onScroll, stagger } from "animejs";
import { useState, useRef, forwardRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

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
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    title: "Basement.studio",
    role: "Development",
    summary:
      "On 2025, I helped ship the new basement.studio website. Instanced meshes, advanced WebGL loading techniques and a lot of interactive things.",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
  },
  {
    title: "xmcp",
    role: "Development",
    summary:
      "Placeholder summary for xmcp — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  },
  {
    title: "Vercel ship 25",
    role: "Development",
    summary:
      "Placeholder summary for Vercel Ship 25 — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80",
  },
  {
    title: "Black Forest Lab",
    role: "Development",
    summary:
      "Placeholder summary for Black Forest Lab — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  },
  {
    title: "Daylight",
    role: "Development",
    summary:
      "Placeholder summary for Daylight — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80",
  },
  {
    title: "Nextjs conf 24",
    role: "Development",
    summary:
      "Placeholder summary for Next.js Conf 24 — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80",
  },
  {
    title: "Vercel ship 24",
    role: "Development",
    summary:
      "Placeholder summary for Vercel Ship 24 — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&q=80",
  },
  {
    title: "Vercel fluid",
    role: "Development",
    summary:
      "Placeholder summary for Vercel Fluid — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
  },
  {
    title: "Kidsuper world",
    role: "Development",
    summary:
      "Placeholder summary for Kidsuper World — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80",
  },
  {
    title: "Chronicles",
    role: "Development",
    summary:
      "Placeholder summary for Chronicles — replace this with a real description.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  },
];

export function Works() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageTop, setImageTop] = useState(0);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewColRef = useRef<HTMLDivElement | null>(null);

  const [root] = useScope<HTMLDivElement>(() => {
    animate(".line-divider", {
      width: ["0%", "100%"],
      ease: "inOutCirc",
      duration: 600,
      autoplay: onScroll({ debug: false, enter: "center top", sync: "play" }),
      delay: stagger(120),
    });

    animate(".work-title, .work-role", {
      opacity: ["0%", "100%"],
      ease: "inOutCirc",
      duration: 600,
      autoplay: onScroll({ enter: "center top", sync: "play" }),
      delay: stagger(60),
    });
  });

  const handleHover = (index: number) => {
    setHoveredIndex(index);
    const row = rowRefs.current[index];
    const col = previewColRef.current;
    if (row && col) {
      const rowTop =
        row.getBoundingClientRect().top - col.getBoundingClientRect().top;
      setImageTop(rowTop);
    }
  };

  const isVisible = hoveredIndex !== null;

  return (
    <div ref={root} className="relative flex gap-8 px-6 pb-24">
      {/* Project list */}
      <div className="flex flex-col flex-1 min-w-0 pt-4">
        <div className="flex items-center h-24">
          <p className="max-w-xs font-serif text-base italic leading-snug work-role text-foreground/60">
            From designer to developer, here are some works I&apos;m proud to
            share:
          </p>
        </div>

        {works.map((work, index) => (
          <WorkRow
            key={work.title}
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            work={work}
            isHovered={hoveredIndex === index}
            anyHovered={hoveredIndex !== null}
            onHover={() => handleHover(index)}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
        <Divider />
      </div>

      {/* Preview column */}
      <div
        ref={previewColRef}
        className="hidden lg:block w-[420px] xl:w-[500px] flex-shrink-0 relative"
      >
        {/* Image + description block — moves to align with hovered row */}
        <div
          className="absolute left-0 right-0 flex flex-col gap-4 transition-[top,opacity] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{
            top: imageTop,
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? "auto" : "none",
          }}
        >
          {/* Image */}
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "507 / 318" }}
          >
            {works.map((work, index) => (
              <img
                key={work.title}
                src={work.image}
                alt={work.title}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="relative min-h-[4em]">
            {works.map((work, index) => (
              <p
                key={work.title}
                className={cn(
                  "absolute inset-0 font-serif italic text-sm text-foreground/70 leading-snug transition-opacity duration-300",
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                )}
              >
                {work.summary}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type WorkRowProps = {
  work: Work;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
};

const WorkRow = forwardRef<HTMLDivElement, WorkRowProps>(function WorkRow(
  { work, isHovered, anyHovered, onHover, onLeave },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center gap-4 py-6 cursor-pointer transition-opacity duration-300",
        anyHovered && !isHovered ? "opacity-30" : "opacity-100"
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Divider />

      {/* Text */}
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <h3 className="font-serif text-4xl leading-tight work-title xl:text-5xl">
          {work.title}
        </h3>
        <span className="font-sans text-sm tracking-widest uppercase work-role text-foreground/40">
          {work.role}
        </span>
      </div>

      {/* Hand — reveals on hover */}
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
  );
});

function Divider() {
  return (
    <div className="absolute top-0 left-0 w-0 h-px bg-foreground/20 line-divider" />
  );
}
