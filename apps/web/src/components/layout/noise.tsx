"use client";

import { createTimer } from "animejs";
import { useEffect, useRef } from "react";

export function Noise() {
  const noiseRef = useRef<HTMLDivElement>(null);
  // Indicates flip direction
  // 0: false|false, 1: true|false, 2: false|true, 3: true|true
  const stateRef = useRef(0);
  // Indicates offset of the noise
  const offsetRef = useRef(0);

  useEffect(() => {
    const timer = createTimer({
      frameRate: 12,
    });
    timer.onUpdate = () => {
      const state = stateRef.current;
      console.log(state);

      const flipX = state === 1 || state === 3;
      const flipY = state === 2 || state === 3;
      const sizeX = flipX ? "-100%" : "100%";
      const sizeY = flipY ? "-100%" : "100%";
      if (noiseRef.current) {
        noiseRef.current.style.transform = `scale(${sizeX}, ${sizeY})`;
        noiseRef.current.style.backgroundPosition = `${offsetRef.current}px 0px`;
        console.log(noiseRef.current.style.transform);
      }

      offsetRef.current = (offsetRef.current + 100) % 1000;
      stateRef.current = (state + 1) % 4;
    };
    return () => {
      timer.cancel();
    };
  }, []);

  return (
    <div
      ref={noiseRef}
      className="fixed inset-0 w-full h-full mix-blend-hard-light opacity-[.17] z-[1000] pointer-events-none"
      style={{
        backgroundImage: "url(/textures/noise-overlay-300.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
      }}
    />
  );
}
