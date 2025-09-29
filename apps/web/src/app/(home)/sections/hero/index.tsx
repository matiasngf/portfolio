"use client";

import { animate, stagger } from "animejs";
import { useScope } from "@/hooks/use-scope";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import s from "./hero.module.css";
import * as THREE from "three";
import { useMouse } from "@/hooks/use-mouse";
import { rotateVector2 } from "@/lib/math/rotate-vec";
import { lerp } from "three/src/math/MathUtils.js";
import { useFrame } from "@/hooks/use-frame";

export function Hero() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-4 items-center w-full h-full text-center">
        <div className="flex-1" />
        <Name />
        <div className="flex-1">
          <p>Developer & designer</p>
        </div>
      </div>
    </div>
  );
}

const name = "Matias Gonzalez Fernandez";

function Name() {
  const [root] = useScope<HTMLHeadingElement>(() => {
    animate(".word-content", {
      y: ["140%", "0%"],
      ease: "inOutCirc",
      duration: 500,
      delay: stagger(100, {
        modifier: (v) => v + 100,
      }),
    });
  });

  return (
    <h1
      ref={root}
      className="flex-1 text-8xl tracking-wide leading-none font-display"
      style={
        {
          "font-variation-settings": '"wght" 663',
        } as React.CSSProperties
      }
    >
      {name.split(" ").map((word, index) => (
        <span
          key={index}
          className="overflow-hidden h-[1.2em] flex items-center justify-center -my-[.1em]"
        >
          <span className="block relative top-[.2em]">
            <span className="block relative word-content">
              {word.split("").map((letter, index) =>
                letter === "o" ? (
                  <Eye key={index}>{letter}</Eye>
                ) : (
                  <span
                    className="inline-block relative letter-content"
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
    </h1>
  );
}

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

function Eye({ children }: { children: React.ReactNode }) {
  const eyeOpenRef = useRef(0);
  const scope = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    animate(eyeOpenRef, {
      current: 1,
      delay: 700,
      duration: 300,
      easing: "easeInOutCubic",
      onUpdate: () => {
        if (!scope.current) return;
        console.log(eyeOpenRef.current);
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

  const {
    mouseVec,
    windowVec,
    centerVec,
    toMouseVec,
    toMouseDir,
    rotationAngle,
  } = useMemo(
    () => ({
      mouseVec: new THREE.Vector2(),
      windowVec: new THREE.Vector2(),
      centerVec: new THREE.Vector2(),
      toMouseVec: new THREE.Vector2(),
      toMouseDir: new THREE.Vector2(), // normalized direction to mouse
      rotationAngle: rotateVector2(new THREE.Vector2(0, 1), -33).normalize(), //33 deg vector
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

      //lerp current position to target position
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
          "--blink": 0, // 0 closed, 1 open
          "--weight": "calc(800 - var(--blink) * 200)", // font ranges from 400 to 800
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
