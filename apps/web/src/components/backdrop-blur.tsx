import { cn } from "@/lib/utils/cn";

interface BackdropBlurProps {
  className?: string;
  blurResolution?: number;
  minBlur?: number;
  maxBlur?: number;
  mask?: string;
  z?: number;
}

export function BackdropBlur({
  className,
  blurResolution = 4,
  minBlur = 0.5,
  maxBlur = 1,
  z = 0,
}: BackdropBlurProps) {
  const blurSteps = Array.from({ length: blurResolution }, (_, index) => {
    const progress = index / (blurResolution - 1);
    const blurValue = minBlur + (maxBlur - minBlur) * progress;
    return blurValue;
  });

  const generateMask = (index: number) => {
    const stepSize = 100 / blurResolution;
    const start = stepSize * index - stepSize / 2;
    const end = stepSize * (index + 1) - stepSize / 2;
    const fadeSize = stepSize / 4;

    // For the last layer, ensure it reaches 100%
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
      {blurSteps.map((blurValue, index) => {
        const zIndex = z + index + 1;
        const layerMask = generateMask(index);

        return (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              zIndex,
              backdropFilter: `blur(${blurValue}px)`,
              WebkitBackdropFilter: `blur(${blurValue}px)`,
              mask: layerMask,
              WebkitMask: layerMask,
            }}
          />
        );
      })}
    </div>
  );
}
