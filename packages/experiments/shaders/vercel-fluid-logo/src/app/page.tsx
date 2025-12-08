/* eslint-disable react-hooks/immutability */
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useEffect } from "react";
import * as THREE from "three";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Vector2,
  Color,
  RawShaderMaterial,
  WebGLRenderTarget,
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
import { FboDebug } from "@/lib/gl/fbo-debug";

import particlesVertexShader from "./programs/particles/particles.vert";
import particlesFragmentShader from "./programs/particles/particles.frag";

interface ParticleGeometryData {
  geometry: BufferGeometry;
  positions: Float32Array;
  textureSize: number;
  positionsTexture: THREE.DataTexture;
}

function useParticleGeometry(
  vertices?: [Vector2, Vector2, Vector2],
  spacing = 0.05,
): ParticleGeometryData {
  return useMemo(() => {
    const triangleVertices = vertices ?? createEquilateralTriangle(1);
    const positionsArray = generateTrianglePoints(triangleVertices, spacing);
    const count = positionsArray.length / 3;
    const texSize = computeTextureSize(count);

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positionsArray, 3));

    // Add particle UVs for offset texture lookup
    const uvs = createParticleUVs(count, texSize);
    geo.setAttribute("particleUv", new Float32BufferAttribute(uvs, 2));

    // Create positions texture for the offset shader
    const positionsTex = createPositionsTexture(positionsArray, texSize);

    return {
      geometry: geo,
      positions: positionsArray,
      textureSize: texSize,
      positionsTexture: positionsTex,
    };
  }, [vertices, spacing]);
}

interface TrianglePointsProps {
  geometry: BufferGeometry;
  offsetTexture: THREE.Texture;
  screenFbo: WebGLRenderTarget;
  size?: number;
  color?: string;
  triangleRadius?: number;
}

function TrianglePoints({
  geometry,
  offsetTexture,
  screenFbo,
  size = 0.02,
  color = "#ffffff",
  triangleRadius = Math.sqrt(3.5) / 3.5, // Match createEquilateralTriangle(1)
}: TrianglePointsProps) {
  const { gl, camera } = useThree();

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
        uTriangleRadius: { value: triangleRadius },
        uResolution: { value: new Vector2(1, 1) },
      },
      transparent: true,
      depthWrite: false,
    });
  }, [size, color, triangleRadius]);

  // Create points mesh
  const points = useMemo(
    () => new THREE.Points(geometry, material),
    [geometry, material],
  );

  // Update each frame
  useFrame((state) => {
    // Update particle material with latest offset texture
    material.uniforms.uOffsetTexture.value = offsetTexture;

    // Update screen aspect ratio and resolution
    const { width, height } = state.size;
    material.uniforms.uScreenAspect.value = width / height;
    material.uniforms.uResolution.value.set(width, height);

    // Render particles to screenFbo
    gl.setRenderTarget(screenFbo);
    gl.setClearColor(0x000000, 1);
    gl.clear();
    gl.render(points, camera);
    gl.setRenderTarget(null);
  });

  return <primitive object={points} />;
}

export default function Home() {
  return (
    <div className="w-full h-screen relative bg-black">
      <Leva collapsed={false} hidden={false} />
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

function Scene() {
  const { size } = useThree();

  // Fluid simulation
  const { velocity } = useFluid({
    radius: 0.05,
    velocityDissipation: 0.99,
    curlStrength: 2,
  });

  // Generate particle geometry at Scene level
  const { geometry, textureSize, positionsTexture } = useParticleGeometry(
    undefined,
    0.03,
  );

  // Setup particle offsets system at Scene level
  const particleOffsets = useParticleOffsets({
    textureSize,
    strength: 0.005,
    friction: 0.2,
    offsetDecay: 0.05,
  });

  // Set positions texture in uniforms
  useEffect(() => {
    particleOffsets.uniforms.uPositions.value = positionsTexture;
  }, [particleOffsets.uniforms, positionsTexture]);

  // Create screen FBO for rendering particles
  const screenFbo = useMemo(() => {
    return new WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });
  }, [size.width, size.height]);

  // Run particle physics each frame
  useFrame((state) => {
    particleOffsets.render(state, velocity.read.texture);
  });

  return (
    <>
      <TrianglePoints
        geometry={geometry}
        offsetTexture={particleOffsets.texture}
        screenFbo={screenFbo}
        size={0.2}
        color="#00ffcc"
      />
      <FboDebug
        defaultTexture="screen"
        textures={{
          screen: screenFbo,
          fluidVelocity: velocity.read,
          particleOffsets: particleOffsets.fbo,
        }}
      />
    </>
  );
}
