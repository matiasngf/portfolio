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
import { BackdropBlur } from "@/components/backdrop-blur";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative flex items-center justify-center h-screen">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)",
        }}
      />
      <div className="flex flex-col items-center w-full h-full gap-4 text-center">
        <div className="flex-1" />
        <Name />
        <div className="flex flex-col items-center justify-center flex-1 gap-8">
          <p className="font-serif italic font-bold text-center text-md">
            developer & designer
          </p>
          <Link href="/">
            <Image src="/hand-dec-2 1.png" alt="hand" width={29} height={57} />
          </Link>
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
