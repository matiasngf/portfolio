"use client";

import Image from "next/image";
import Link from "next/link";
import { Name } from "./name";

export function Hero() {
  return (
    <div className="sticky top-0 flex items-center justify-center h-screen overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1728 940"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="864"
          cy="470"
          r="542"
          fill="none"
          stroke="rgba(216,216,216,0.2)"
          strokeWidth="1"
        />
        <g>
          <circle
            cx="1240.1844"
            cy="79.8087"
            r="5"
            fill="black"
            stroke="rgba(216,216,216,0.2)"
            strokeWidth="1"
          />
          <circle
            cx="401.3728"
            cy="752.3828"
            r="5"
            fill="black"
            stroke="rgba(216,216,216,0.2)"
            strokeWidth="1"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 864 470"
            to="360 864 470"
            dur="300s"
            repeatCount="indefinite"
          />
        </g>
      </svg>
      <div className="flex flex-col items-center w-full h-full gap-4 px-6 text-center">
        <div className="flex-1" />
        <Name />
        <div className="flex flex-col items-center justify-center flex-1 gap-8">
          <p className="font-serif italic font-bold text-center text-md">
            developer & designer
          </p>
          <Link
            href="#articles"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#articles")
                ?.scrollIntoView({ behavior: "smooth" });
              history.replaceState(null, "", "#articles");
            }}
          >
            <Image src="/hand-dec-2 1.png" alt="hand" width={29} height={57} />
          </Link>
        </div>
        <div className="h-12 shrink-0 md:h-16" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 48%, rgba(255,255,255,0.05) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
