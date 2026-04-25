"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/utils/cn";
import s from "./hero.module.css";
import * as THREE from "three";
import { useMouse } from "@/hooks/use-mouse";
import { rotateVector2 } from "@/lib/math/rotate-vec";
import { lerp } from "three/src/math/MathUtils.js";
import { useFrame } from "@/hooks/use-frame";

const getEllipseBoundry = (xScale: number, direction: THREE.Vector2) => {
  const theta = Math.atan2(direction.y, direction.x);
  const r =
    xScale / Math.sqrt(Math.cos(theta) ** 2 + (xScale * Math.sin(theta)) ** 2);
  return r;
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const eyeAngle = -33;
const eyeAngleRadians = degToRad(eyeAngle);
const center = new THREE.Vector2(0, 0);

export function Eye({ children }: { children: React.ReactNode }) {
  const eyeOpenRef = useRef(0);
  const scope = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    animate(eyeOpenRef, {
      current: 1,
      delay: 900,
      duration: 300,
      easing: "easeInOutCubic",
      onUpdate: () => {
        if (!scope.current) return;
        scope.current.style.setProperty("--blink", `${eyeOpenRef.current}`);
      },
    });
  }, []);

  const eyePosTarget = useRef({ x: 0, y: 0 });
  const eyePos = useRef({ x: 0, y: 0 });

  const mouseStartedRef = useRef(false);

  const dotContainerRef = useRef<HTMLSpanElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);

  const mouseRef = useMouse({
    lerp: 1,
    onStart: () => (mouseStartedRef.current = true),
  });

  const { mouseVec, windowVec, centerVec, toMouseVec, toMouseDir } = useMemo(
    () => ({
      mouseVec: new THREE.Vector2(),
      windowVec: new THREE.Vector2(),
      centerVec: new THREE.Vector2(),
      toMouseVec: new THREE.Vector2(),
      toMouseDir: new THREE.Vector2(),
      rotationAngle: rotateVector2(new THREE.Vector2(0, 1), -33).normalize(),
    }),
    []
  );

  useFrame(
    () => {
      const dotContainer = dotContainerRef.current;
      const dot = dotRef.current;

      if (!dotContainer || !dot || !mouseStartedRef.current) return;
      mouseVec.set(mouseRef.current.x, mouseRef.current.y);
      windowVec.set(window.innerWidth, window.innerHeight);
      const rect = dotContainer.getBoundingClientRect();
      centerVec.set(rect.left + rect.width / 2, rect.top + rect.height / 2);

      toMouseVec.copy(
        mouseVec.sub(centerVec).divideScalar(window.innerWidth).divideScalar(4)
      );
      toMouseDir.copy(toMouseVec).normalize();

      // modify length
      const length = toMouseVec.length();
      const newL = Math.pow(length, 0.5);
      toMouseVec.normalize().multiplyScalar(newL);

      // limit the eye into an oval shape
      const ovalLimit =
        getEllipseBoundry(
          0.6,
          toMouseDir.rotateAround(center, -eyeAngleRadians)
        ) * 0.13;
      toMouseVec.clampLength(0, ovalLimit);

      eyePosTarget.current.x = toMouseVec.x;
      eyePosTarget.current.y = toMouseVec.y;

      eyePos.current.x = lerp(eyePos.current.x, eyePosTarget.current.x, 0.1);
      eyePos.current.y = lerp(eyePos.current.y, eyePosTarget.current.y, 0.1);

      dot.style.setProperty("--translate-x", `${eyePos.current.x}em`);
      dot.style.setProperty("--translate-y", `${eyePos.current.y}em`);
    },
    [],
    120
  );

  return (
    <span
      ref={scope}
      className={cn(
        "inline-block relative letter-content w-[0.72em]",
        s["letter-container"]
      )}
      style={
        {
          "--blink": 0,
          "--weight": "calc(800 - var(--blink) * 200)",
          fontVariationSettings: '"wght" var(--weight)',
        } as unknown as React.CSSProperties
      }
    >
      <span>{children}</span>
      <span
        ref={dotContainerRef}
        className="block absolute w-[0.7em] h-[0.68em] top-[0.08em] left-0"
      >
        <span ref={dotRef} className={s.dot}>
          <span
            className={cn(s["dot-shape"], "dot-shape bg-foreground")}
          ></span>
        </span>
      </span>
    </span>
  );
}
