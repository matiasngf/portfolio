"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute, Vector2 } from "three";
import {
  generateTrianglePoints,
  createEquilateralTriangle,
} from "@/lib/utils/generate-triangle-points";
import { useFluid } from "./fluid-sim";
import { velocity } from "three/tsl";

interface TrianglePointsProps {
  vertices?: [Vector2, Vector2, Vector2];
  spacing?: number;
  size?: number;
  color?: string;
}

function TrianglePoints({
  vertices,
  spacing = 0.05,
  size = 0.02,
  color = "#ffffff",
}: TrianglePointsProps) {
  const geometry = useMemo(() => {
    const triangleVertices = vertices ?? createEquilateralTriangle(2);
    const positions = generateTrianglePoints(triangleVertices, spacing);

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));

    return geo;
  }, [vertices, spacing]);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={size} color={color} sizeAttenuation={true} />
    </points>
  );
}

export default function Home() {
  return (
    <div className="w-full h-screen relative bg-black">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

function Scene() {
  const { velocity } = useFluid();

  return <TrianglePoints spacing={0.05} size={0.03} color="#00ffcc" />;
}
