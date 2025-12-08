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
  Mesh,
} from "three";
import { Leva, useControls } from "leva";
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
import {
  quadGeometry,
  quadCamera,
} from "@/lib/gl/render-texture/quad-primitives";

import particlesVertexShader from "./programs/particles/particles.vert";
import particlesFragmentShader from "./programs/particles/particles.frag";
import blobPostVertexShader from "./programs/blob-post/blob-post.vert";
import blobPostFragmentShader from "./programs/blob-post/blob-post.frag";

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
  particlesSdfFbo: WebGLRenderTarget;
  size?: number;
  color?: string;
  triangleRadius?: number;
  transitionStart?: number;
  transitionDistance?: number;
}

function TrianglePoints({
  geometry,
  offsetTexture,
  particlesSdfFbo,
  size = 0.02,
  color = "#ffffff",
  triangleRadius = Math.sqrt(3.5) / 3.5, // Match createEquilateralTriangle(1)
  transitionStart = 0.01,
  transitionDistance = 0.1,
}: TrianglePointsProps) {
  const { gl, camera } = useThree();

  // Create particle material with additive blending for blob effect
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
        uTransitionStart: { value: transitionStart },
        uTransitionDistance: { value: transitionDistance },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [size, color, triangleRadius, transitionStart, transitionDistance]);

  // Create points mesh
  const points = useMemo(
    () => new THREE.Points(geometry, material),
    [geometry, material],
  );

  // Update each frame
  useFrame((state) => {
    // Update particle material with latest offset texture
    material.uniforms.uOffsetTexture.value = offsetTexture;
    material.uniforms.uTransitionStart.value = transitionStart;
    material.uniforms.uTransitionDistance.value = transitionDistance;

    // Update screen aspect ratio and resolution
    const { width, height } = state.size;
    material.uniforms.uScreenAspect.value = width / height;
    material.uniforms.uResolution.value.set(width, height);

    // Render particles to particlesSdfFbo with additive blending
    gl.setRenderTarget(particlesSdfFbo);
    gl.setClearColor(0x000000, 0);
    gl.clear();
    gl.render(points, camera);
    gl.setRenderTarget(null);
  });

  return <primitive object={points} />;
}

interface BlobPostProcessProps {
  particlesSdfFbo: WebGLRenderTarget;
  screenFbo: WebGLRenderTarget;
  blobThreshold?: number;
}

function BlobPostProcess({
  particlesSdfFbo,
  screenFbo,
  blobThreshold = 1.0,
}: BlobPostProcessProps) {
  const { gl } = useThree();

  // Create blob post-process material
  const material = useMemo(() => {
    return new RawShaderMaterial({
      vertexShader: blobPostVertexShader,
      fragmentShader: blobPostFragmentShader,
      uniforms: {
        uParticlesSdf: { value: null },
        uThreshold: { value: blobThreshold },
      },
      transparent: true,
      depthWrite: false,
    });
  }, [blobThreshold]);

  // Create fullscreen quad mesh
  const quad = useMemo(() => new Mesh(quadGeometry, material), [material]);

  // Render post-process pass
  useFrame(() => {
    material.uniforms.uParticlesSdf.value = particlesSdfFbo.texture;
    material.uniforms.uThreshold.value = blobThreshold;

    gl.setRenderTarget(screenFbo);
    gl.setClearColor(0x000000, 1);
    gl.clear();
    gl.render(quad, quadCamera);
    gl.setRenderTarget(null);
  });

  return null;
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

  // Leva controls for blob effect
  const { transitionStart, transitionDistance, blobThreshold } = useControls(
    "Blob Effect",
    {
      transitionStart: {
        value: 0.04,
        min: 0.0,
        max: 0.2,
        step: 0.001,
        label: "Transition Start",
      },
      transitionDistance: {
        value: 0.05,
        min: 0.001,
        max: 0.5,
        step: 0.001,
        label: "Transition Distance",
      },
      blobThreshold: {
        value: 1.0,
        min: 0.1,
        max: 3.0,
        step: 0.01,
        label: "Blob Threshold",
      },
    },
  );

  // Fluid simulation
  const { velocity } = useFluid({
    radius: 0.2,
    velocityDissipation: 0.99,
    pressureDissipation: 0.8,
    curlStrength: 1,
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

  // Create particles SDF FBO (FloatType for additive accumulation)
  const particlesSdfFbo = useMemo(() => {
    return new WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    });
  }, [size.width, size.height]);

  // Create screen FBO for final output
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
        particlesSdfFbo={particlesSdfFbo}
        size={0.2}
        color="#00ffcc"
        transitionStart={transitionStart}
        transitionDistance={transitionDistance}
      />
      <BlobPostProcess
        particlesSdfFbo={particlesSdfFbo}
        screenFbo={screenFbo}
        blobThreshold={blobThreshold}
      />
      <FboDebug
        defaultTexture="screen"
        textures={{
          screen: screenFbo,
          particlesSdf: particlesSdfFbo,
          fluidVelocity: velocity.read,
          particleOffsets: particleOffsets.fbo,
        }}
      />
    </>
  );
}
