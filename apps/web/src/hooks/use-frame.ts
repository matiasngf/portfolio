import { createTimer, Timer } from "animejs";
import { useEffect } from "react";

export function useFrame(
  callback: (timer: Timer) => void,
  deps: any[] = [],
  frameRate: number = 30
) {
  useEffect(() => {
    const timer = createTimer({
      frameRate
    })
    timer.onUpdate = callback;
    return () => {
      timer.cancel();
    };
  }, deps);
};
