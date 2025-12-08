"use client";

import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <div className="w-full h-screen relative">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

function Scene() {
  return null;
}
