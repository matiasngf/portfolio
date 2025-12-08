/* eslint-disable react-hooks/immutability */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useEffect } from "react";
import * as THREE from "three";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Vector2,
  Color,
  RawShaderMaterial,
} from "three";
import { Leva } from "leva";
import {
  generateTrianglePoints,
  createEquilateralTriangle,
} from "@/lib/utils/generate-triangle-points";
import { useFluid } from "./fluid-sim";
import {
  useParticleOffsets,
  createPositionsTexture,
  createParticleUVs,
  computeTextureSize,
} from "./programs/particle-offsets/use-particle-offsets";

import particlesVertexShader from "./programs/particles/particles.vert";
import particlesFragmentShader from "./programs/particles/particles.frag";

interface TrianglePointsProps {
  vertices?: [Vector2, Vector2, Vector2];
  spacing?: number;
  size?: number;
  color?: string;
  velocityTexture: THREE.Texture;
}

function TrianglePoints({
  vertices,
  spacing = 0.05,
  size = 0.02,
  color = "#ffffff",
  velocityTexture,
}: TrianglePointsProps) {
  // Generate particle positions
  const { geometry, positions, textureSize } = useMemo(() => {
    const triangleVertices = vertices ?? createEquilateralTriangle(1);
    const positionsArray = generateTrianglePoints(triangleVertices, spacing);
    const count = positionsArray.length / 3;
    const texSize = computeTextureSize(count);

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positionsArray, 3));

    // Add particle UVs for offset texture lookup
    const uvs = createParticleUVs(count, texSize);
    geo.setAttribute("particleUv", new Float32BufferAttribute(uvs, 2));

    return {
      geometry: geo,
      positions: positionsArray,
      textureSize: texSize,
    };
  }, [vertices, spacing]);

  // Setup particle offsets system
  const particleOffsets = useParticleOffsets({
    textureSize,
    strength: 0.005,
    friction: 0.2,
    offsetDecay: 0.05,
  });

  // Create positions texture for the offset shader
  const positionsTexture = useMemo(() => {
    return createPositionsTexture(positions, textureSize);
  }, [positions, textureSize]);

  // Set positions texture in uniforms
  useEffect(() => {
    particleOffsets.uniforms.uPositions.value = positionsTexture;
  }, [particleOffsets.uniforms, positionsTexture]);

  // Create particle material
  const material = useMemo(() => {
    return new RawShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uOffsetTexture: { value: null },
        uPointSize: { value: size * 100 },
        uColor: { value: new Color(color) },
        uScreenAspect: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
    });
  }, [size, color]);

  // Update each frame
  useFrame((state) => {
    // Render offset update pass
    particleOffsets.render(state, velocityTexture);

    // Update particle material with latest offset texture
    material.uniforms.uOffsetTexture.value = particleOffsets.texture;

    // Update screen aspect ratio
    const { width, height } = state.size;
    material.uniforms.uScreenAspect.value = width / height;
  });

  return <points geometry={geometry} material={material} />;
}

export default function Home() {
  return (
    <div className="w-full h-screen relative bg-black">
      <Leva collapsed={false} />
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

function Scene() {
  const { velocity } = useFluid({
    radius: 0.05,
    velocityDissipation: 0.99,
  });

  return (
    <TrianglePoints
      spacing={0.03}
      size={0.2}
      color="#00ffcc"
      velocityTexture={velocity.read.texture}
    />
  );
}
