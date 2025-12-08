/* eslint-disable react-hooks/immutability */

import { useCallback, useMemo } from "react";
import * as THREE from "three";
import type { RootState } from "@react-three/fiber";
import { useControls, folder } from "leva";

import { useDoubleFbo } from "@/lib/gl/fbo/use-double-fbo";
import { useRawShader } from "@/lib/gl/program/use-shader";
import { useUniforms } from "@/lib/gl/program/use-uniforms";
import {
  quadGeometry,
  quadCamera,
} from "@/lib/gl/render-texture/quad-primitives";
import { saveGlState } from "@/lib/gl/save-gl-state";

import vertexShader from "./particle-offsets.vert";
import fragmentShader from "./particle-offsets.frag";

export interface ParticleOffsetsUniforms extends Record<
  string,
  THREE.IUniform
> {
  uPrevOffsets: { value: THREE.Texture | null };
  uPrevVelocity: { value: THREE.Texture | null };
  uFluidVelocity: { value: THREE.Texture | null };
  uPositions: { value: THREE.DataTexture | null };
  uStrength: { value: number };
  uFriction: { value: number };
  uOffsetDecay: { value: number };
  uSnapDistance: { value: number };
  uSnapVelocityThreshold: { value: number };
  uSnapLerpStrength: { value: number };
  uMinVelocity: { value: number };
  uScreenAspect: { value: number };
}

interface UseParticleOffsetsOptions {
  textureSize: number;
  strength?: number;
  friction?: number;
  offsetDecay?: number;
}

export function useParticleOffsets({
  textureSize,
  strength: initialStrength = 0.005,
  friction: initialFriction = 0.98,
  offsetDecay: initialOffsetDecay = 0.002,
}: UseParticleOffsetsOptions) {
  // Leva controls for physics parameters
  const {
    strength,
    friction,
    offsetDecay,
    snapDistance,
    snapVelocityThreshold,
    snapLerpStrength,
    minVelocity,
  } = useControls("Particle Physics", {
    strength: { value: initialStrength, min: 0, max: 0.05, step: 0.001 },
    friction: { value: initialFriction, min: 0, max: 1, step: 0.01 },
    offsetDecay: { value: initialOffsetDecay, min: 0, max: 0.2, step: 0.001 },
    minVelocity: { value: 1.15, min: 0, max: 2, step: 0.01 },
    Snap: folder(
      {
        snapDistance: { value: 0.02, min: 0.001, max: 0.1, step: 0.001 },
        snapVelocityThreshold: {
          value: 0.004,
          min: 0.0001,
          max: 0.01,
          step: 0.0001,
        },
        snapLerpStrength: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
      },
      { collapsed: true },
    ),
  });

  // Double FBO for position offsets (RG) and particle velocity (BA)
  const offsetsFbo = useDoubleFbo(textureSize, textureSize, {
    type: THREE.FloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  });

  // Uniforms for the offset update shader
  const uniforms = useUniforms<ParticleOffsetsUniforms>(() => ({
    uPrevOffsets: { value: null },
    uPrevVelocity: { value: null },
    uFluidVelocity: { value: null },
    uPositions: { value: null },
    uStrength: { value: strength },
    uFriction: { value: friction },
    uOffsetDecay: { value: offsetDecay },
    uSnapDistance: { value: snapDistance },
    uSnapVelocityThreshold: { value: snapVelocityThreshold },
    uSnapLerpStrength: { value: snapLerpStrength },
    uMinVelocity: { value: minVelocity },
    uScreenAspect: { value: 1 },
  }));

  // Shader material for updating offsets
  const shader = useRawShader(
    {
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    },
    uniforms,
  );

  // Mesh for rendering
  const mesh = useMemo(() => new THREE.Mesh(quadGeometry, shader), [shader]);

  // Render function to update offsets and particle velocities
  const render = useCallback(
    (state: RootState, fluidVelocityTexture: THREE.Texture) => {
      const restore = saveGlState(state);
      const { gl, size } = state;

      // Update uniforms - texture stores offset in RG, particle velocity in BA
      uniforms.uPrevOffsets.value = offsetsFbo.read.texture;
      uniforms.uPrevVelocity.value = offsetsFbo.read.texture; // Same texture, different channels
      uniforms.uFluidVelocity.value = fluidVelocityTexture;
      uniforms.uScreenAspect.value = size.width / size.height;

      // Update Leva-controlled uniforms
      uniforms.uStrength.value = strength;
      uniforms.uFriction.value = friction;
      uniforms.uOffsetDecay.value = offsetDecay;
      uniforms.uSnapDistance.value = snapDistance;
      uniforms.uSnapVelocityThreshold.value = snapVelocityThreshold;
      uniforms.uSnapLerpStrength.value = snapLerpStrength;
      uniforms.uMinVelocity.value = minVelocity;

      // Render to write target
      gl.setRenderTarget(offsetsFbo.write);
      gl.render(mesh, quadCamera);

      // Swap buffers
      offsetsFbo.swap();

      restore();
    },
    [
      mesh,
      offsetsFbo,
      uniforms,
      strength,
      friction,
      offsetDecay,
      snapDistance,
      snapVelocityThreshold,
      snapLerpStrength,
      minVelocity,
    ],
  );

  return {
    render,
    uniforms,
    texture: offsetsFbo.texture,
    fbo: offsetsFbo,
  };
}

/**
 * Creates a DataTexture containing particle positions for lookup in the offset shader.
 * Each pixel stores the XY position of a particle.
 */
export function createPositionsTexture(
  positions: Float32Array,
  textureSize: number,
): THREE.DataTexture {
  const data = new Float32Array(textureSize * textureSize * 4);
  const particleCount = positions.length / 3;

  for (let i = 0; i < particleCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];

    data[i * 4] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = 0;
    data[i * 4 + 3] = 1;
  }

  const texture = new THREE.DataTexture(
    data,
    textureSize,
    textureSize,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  texture.needsUpdate = true;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  return texture;
}

/**
 * Computes the texture size needed to fit all particles (power of 2).
 */
export function computeTextureSize(particleCount: number): number {
  const size = Math.ceil(Math.sqrt(particleCount));
  // Round up to nearest power of 2
  return Math.pow(2, Math.ceil(Math.log2(size)));
}

/**
 * Creates UV coordinates for particles to sample from the offset texture.
 * Each particle gets a unique UV that maps to its pixel in the texture.
 */
export function createParticleUVs(
  particleCount: number,
  textureSize: number,
): Float32Array {
  const uvs = new Float32Array(particleCount * 2);

  for (let i = 0; i < particleCount; i++) {
    const u = ((i % textureSize) + 0.5) / textureSize;
    const v = (Math.floor(i / textureSize) + 0.5) / textureSize;

    uvs[i * 2] = u;
    uvs[i * 2 + 1] = v;
  }

  return uvs;
}
