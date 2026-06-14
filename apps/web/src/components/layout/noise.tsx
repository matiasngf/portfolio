"use client";

import { createTimer } from "animejs";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function Noise() {
  const pathname = usePathname();
  const noiseRef = useRef<HTMLDivElement>(null);
  // Indicates flip direction
  // 0: false|false, 1: true|false, 2: false|true, 3: true|true
  const stateRef = useRef(0);
  // Indicates offset of the noise
  const offsetRef = useRef(0);

  // The animated noise hurts readability on long-form posts.
  const disabled = pathname?.startsWith("/posts") ?? false;

  useEffect(() => {
    if (disabled) return;
    const timer = createTimer({
      frameRate: 12,
    });
    timer.onUpdate = () => {
      const state = stateRef.current;

      const flipX = state === 1 || state === 3;
      const flipY = state === 2 || state === 3;
      const sizeX = flipX ? "-100%" : "100%";
      const sizeY = flipY ? "-100%" : "100%";
      if (noiseRef.current) {
        noiseRef.current.style.transform = `scale(${sizeX}, ${sizeY})`;
        noiseRef.current.style.backgroundPosition = `${offsetRef.current}px 0px`;
      }

      offsetRef.current = (offsetRef.current + 100) % 1000;
      stateRef.current = (state + 1) % 4;
    };
    return () => {
      timer.cancel();
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      ref={noiseRef}
      className="fixed inset-0 z-[1000] h-full w-full pointer-events-none mix-blend-hard-light opacity-[.085]"
      style={{
        backgroundImage: "url(/textures/noise-overlay-300.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
      }}
    />
  );
}
