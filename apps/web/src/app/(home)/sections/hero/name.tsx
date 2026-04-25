"use client";

import { animate, stagger } from "animejs";
import { useScope } from "@/hooks/use-scope";
import { BackdropBlur } from "@/components/backdrop-blur";
import { Eye } from "./eye";

const name = "Matias Gonzalez Fernandez";

export function Name() {
  const [root] = useScope<HTMLHeadingElement>(() => {
    animate(".word-content", {
      y: ["140%", "0%"],
      ease: "inOutCirc",
      duration: 600,
      delay: stagger(120, {
        modifier: (v) => v + 100,
      }),
    });
  });

  return (
    <h1
      ref={root}
      className="relative flex-1 leading-none tracking-wide text-7xl font-display"
      style={
        {
          "font-variation-settings": '"wght" 663',
        } as React.CSSProperties
      }
    >
      <span className="relative block">
        {name.split(" ").map((word, index) => (
          <span
            key={index}
            className="overflow-hidden h-[1.2em] flex items-center justify-center -my-[.1em]"
          >
            <span className="block relative top-[.2em]">
              <span className="block relative word-content will-change-transform [transform:translateY(140%)]">
                {word.split("").map((letter, index) =>
                  letter === "o" ? (
                    <Eye key={index}>{letter}</Eye>
                  ) : (
                    <span
                      className="relative inline-block letter-content"
                      key={index}
                    >
                      {letter}
                    </span>
                  )
                )}
              </span>
            </span>
          </span>
        ))}
        <BackdropBlur className="top-[1.2em] left-[-1em] w-[calc(100%+2em)]" />
        <div className="absolute top-[2em] inset-0 bg-gradient-to-b pointer-events-none from-black/0 to-black/20" />
      </span>
    </h1>
  );
}
