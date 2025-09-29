"use client"

import { useEffect, useRef } from 'react';
import { lerp } from 'three/src/math/MathUtils.js';
import { createTimer, Timer } from 'animejs';


export interface UseMouseParams {
  lerp?: number;
  onStart?: () => void;
}

export const useMouse = ({ lerp: lerpValue = 1, onStart }: UseMouseParams) => {
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  const isFirstRef = useRef(true);

  useEffect(() => {
    const timer = createTimer({
      frameRate: 30
    })
    const onMouseMove = (e: MouseEvent): void => {
      if (isFirstRef.current) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
        isFirstRef.current = false;
        if (onStart) {
          onStart();
        }
      }
      mouseTargetRef.current = { x: e.clientX, y: e.clientY };

      if (lerpValue === 1) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    const frameHandler = (timer: Timer): void => {

      const relativeLerp = Math.min(1, (lerpValue * timer.deltaTime * 10));

      mouseRef.current.x = lerp(
        mouseRef.current.x,
        mouseTargetRef.current.x,
        relativeLerp,
      );
      mouseRef.current.y = lerp(
        mouseRef.current.y,
        mouseTargetRef.current.y,
        relativeLerp,
      );
    };

    if (lerpValue !== 1) {
      timer.onUpdate = frameHandler;
    }

    window.addEventListener('mousemove', onMouseMove);

    return (): void => {
      timer.cancel();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [mouseRef, mouseTargetRef, lerpValue]);

  return mouseRef;
};
