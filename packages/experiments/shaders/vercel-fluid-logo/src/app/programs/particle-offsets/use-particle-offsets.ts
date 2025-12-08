/* eslint-disable react-hooks/immutability */

import { useCallback, useMemo } from "react";
import * as THREE from "three";
import type { RootState } from "@react-three/fiber";

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
  uVelocity: { value: THREE.Texture | null };
  uPositions: { value: THREE.DataTexture | null };
  uDecay: { value: number };
  uStrength: { value: number };
  uScreenAspect: { value: number };
}

interface UseParticleOffsetsOptions {
  textureSize: number;
  decay?: number;
  strength?: number;
}

export function useParticleOffsets({
  textureSize,
  decay = 0.98,
  strength = 0.002,
}: UseParticleOffsetsOptions) {
  // Double FBO for ping-pong rendering
  const offsetsFbo = useDoubleFbo(textureSize, textureSize, {
    type: THREE.FloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  });

  // Uniforms for the offset update shader
  const uniforms = useUniforms<ParticleOffsetsUniforms>(() => ({
    uPrevOffsets: { value: null },
    uVelocity: { value: null },
    uPositions: { value: null },
    uDecay: { value: decay },
    uStrength: { value: strength },
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

  // Render function to update offsets
  const render = useCallback(
    (state: RootState, velocityTexture: THREE.Texture) => {
      const restore = saveGlState(state);
      const { gl, size } = state;

      // Update uniforms
      uniforms.uPrevOffsets.value = offsetsFbo.read.texture;
      uniforms.uVelocity.value = velocityTexture;
      uniforms.uScreenAspect.value = size.width / size.height;

      // Render to write target
      gl.setRenderTarget(offsetsFbo.write);
      gl.render(mesh, quadCamera);

      // Swap buffers
      offsetsFbo.swap();

      restore();
    },
    [mesh, offsetsFbo, uniforms],
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
