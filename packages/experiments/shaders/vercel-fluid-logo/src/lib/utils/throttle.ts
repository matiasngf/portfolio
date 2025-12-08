export interface ThrottleOptions {
  minInterval: number;
}

type ThrottledFunction = (callback: () => void) => void;

export const createThrottledFunction = ({
  minInterval,
}: ThrottleOptions): ThrottledFunction => {
  let lastCallTime = 0;
  const minIntervalMs = minInterval * 1000;

  return (callback: () => void) => {
    const now = Date.now();

    if (now - lastCallTime >= minIntervalMs) {
      lastCallTime = now;
      callback();
    }
  };
};
