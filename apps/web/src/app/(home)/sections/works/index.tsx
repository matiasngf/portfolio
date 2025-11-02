"use client";

import { useScope } from "@/hooks/use-scope";
import { animate, onScroll, stagger, utils } from "animejs";

interface Work {
  title: string;
  description: string;
}

const works: Work[] = [
  {
    title: "Work 1",
    description: "Description 1",
  },
  {
    title: "Work 2",
    description: "Description 2",
  },
  {
    title: "Work 3",
    description: "Description 3",
  },
  {
    title: "Work 4",
    description: "Description 4",
  },
  {
    title: "Work 5",
    description: "Description 5",
  },
  {
    title: "Work 6",
    description: "Description 6",
  },
  {
    title: "Work 7",
    description: "Description 7",
  },
];

export function Works() {
  const [root] = useScope<HTMLDivElement>(() => {
    animate(".line-divider", {
      width: ["0%", "100%"],
      ease: "inOutCirc",
      duration: 600,
      autoplay: onScroll({ debug: false, enter: "center top", sync: "play" }),
      delay: stagger(120),
    });

    animate("h3, p", {
      opacity: ["0%", "100%"],
      ease: "inOutCirc",
      duration: 600,
      autoplay: onScroll({ enter: "center top", sync: "play" }),
      delay: stagger(120),
    });
  });
  return (
    <div ref={root} className="work-container">
      {works.map((work) => (
        <Work key={work.title} work={work} />
      ))}
      <Divider />
    </div>
  );
}

function Work({ work }: { work: Work }) {
  return (
    <div className="flex relative flex-col gap-6 p-6">
      <Divider />
      <h3 className="font-serif text-5xl">{work.title}</h3>
      <p className="font-sans text-md">{work.description}</p>
    </div>
  );
}

function Divider() {
  return (
    <div className="absolute top-0 left-0 w-0 h-px bg-foreground/20 line-divider"></div>
  );
}
