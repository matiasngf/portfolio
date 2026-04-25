"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

interface BackdropBlurProps {
  className?: string;
  blurResolution?: number;
  minBlur?: number;
  maxBlur?: number;
  animateOut?: boolean;
  animateOutDelay?: number;
  animateOutDuration?: number;
}

export function BackdropBlur({
  className,
  blurResolution = 4,
  minBlur = 0.5,
  maxBlur = 1,
  animateOut = false,
  animateOutDelay = 0,
  animateOutDuration = 2000,
}: BackdropBlurProps) {
  const [blurScale, setBlurScale] = useState(1);

  useEffect(() => {
    if (!animateOut) return;
    const timer = setTimeout(() => setBlurScale(0), animateOutDelay);
    return () => clearTimeout(timer);
  }, [animateOut, animateOutDelay]);

  const blurSteps = Array.from({ length: blurResolution }, (_, index) => {
    const progress = index / (blurResolution - 1);
    return (minBlur + (maxBlur - minBlur) * progress) * blurScale;
  });

  const generateMask = (index: number) => {
    const stepSize = 100 / blurResolution;
    const start = stepSize * index - stepSize / 2;
    const end = stepSize * (index + 1) - stepSize / 2;
    const fadeSize = stepSize / 4;
    const isLastLayer = index === blurResolution - 1;
    const endPosition = isLastLayer ? 100 : Math.min(100, end);
    const fadeEndPosition = isLastLayer ? 100 : Math.min(100, end + fadeSize);

    return `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) ${Math.max(0, start - fadeSize)}%,
      rgba(0, 0, 0, 1) ${Math.max(0, start)}%,
      rgba(0, 0, 0, 1) ${endPosition}%,
      rgba(0, 0, 0, 0) ${fadeEndPosition}%
    )`;
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {blurSteps.map((blurValue, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blurValue}px)`,
            WebkitBackdropFilter: `blur(${blurValue}px)`,
            mask: generateMask(index),
            WebkitMask: generateMask(index),
            transition: `backdrop-filter ${animateOutDuration}ms linear, -webkit-backdrop-filter ${animateOutDuration}ms linear`,
          }}
        />
      ))}
    </div>
  );
}
