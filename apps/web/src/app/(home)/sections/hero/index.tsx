"use client";

import Image from "next/image";
import Link from "next/link";
import { Name } from "./name";

export function Hero() {
  return (
    <div className="relative flex items-center justify-center h-screen">
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
