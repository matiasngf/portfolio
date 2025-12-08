import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { folder as levaFolder, useControls } from "leva";
import { useEffect, useMemo } from "react";
import { Group, OrthographicCamera, Texture, WebGLRenderTarget } from "three";
import * as THREE from "three";

import fragmentShader from "./shader/index.frag";
import vertexShader from "./shader/index.vert";
import { saveGlState } from "../save-gl-state";
import { DoubleFbo } from "../fbo/double-fbo";
import { useRawShader } from "../program/use-shader";
import { useUniforms } from "../program/use-uniforms";

export interface FboDebugProps {
  hitConfig?: {
    scale: number;
  };
  textures: Record<string, Texture | WebGLRenderTarget | DoubleFbo | null>;
  defaultTexture?: string;
}

function getInitialSelectedTexture(defaultTexture: string, textures: string[]) {
  const query =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("debugTarget") ||
        defaultTexture
      : defaultTexture;

  if (textures.includes(query)) {
    return query;
  }

  return defaultTexture;
}

function getTexture(
  value: Texture | WebGLRenderTarget | DoubleFbo | null
): Texture | null {
  if (!value) return null;
  if ("texture" in value && typeof value.texture !== "undefined") {
    // DoubleFbo or WebGLRenderTarget
    return value.texture as Texture;
  }
  // Already a Texture
  return value as Texture;
}

export function FboDebug({
  hitConfig,
  textures,
  defaultTexture = "screen",
}: FboDebugProps) {
  const camera = useMemo(() => new OrthographicCamera(), []);
  const numTextures = Object.keys(textures).length;

  const uniforms = useUniforms(() => ({
    uMap: {
      value: null as Texture | WebGLRenderTarget | DoubleFbo | null,
    },
  }));

  const debugTextureProgram = useRawShader(
    {
      name: "DebugShaderProgram",
      vertexShader,
      fragmentShader,
      glslVersion: THREE.GLSL3,
      defines: {},
    },
    uniforms
  );

  const grid = useMemo(() => {
    const sqrt = Math.sqrt(numTextures);
    const columns = Math.ceil(sqrt);
    const rows = Math.ceil(sqrt);
    const total = columns * rows;

    return {
      columns,
      rows,
      total,
    };
  }, [numTextures]);

  const debugScene = useMemo(() => new Group(), []);

  const { debugTarget } = useControls({
    DebugTextures: levaFolder({
      debugTarget: {
        value: getInitialSelectedTexture(defaultTexture, Object.keys(textures)),
        options: Object.keys(textures).concat("all"),
        onChange: (value) => {
          if (typeof window !== "undefined") {
            window.history.pushState(
              {},
              "",
              window.location.pathname + "?debugTarget=" + value
            );
          }
        },
        transient: false,
      },
    }),
  });

  const size = useThree((state) => state.size);

  const DEFAULT_SCISSOR = {
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
  };

  useEffect(() => {
    return () => {
      if (!hitConfig) return;
      hitConfig.scale = 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    const { gl } = state;

    const resetGl = saveGlState(state);

    gl.autoClear = false;
    gl.setRenderTarget(null);

    gl.setViewport(
      DEFAULT_SCISSOR.x,
      DEFAULT_SCISSOR.y,
      DEFAULT_SCISSOR.width,
      DEFAULT_SCISSOR.height
    );

    gl.setScissor(
      DEFAULT_SCISSOR.x,
      DEFAULT_SCISSOR.y,
      DEFAULT_SCISSOR.width,
      DEFAULT_SCISSOR.height
    );

    const width = size.width;
    const height = size.height;

    const { columns, rows } = grid;

    if (debugTarget !== "all" && debugTarget in textures) {
      if (hitConfig) {
        hitConfig.scale = 1;
      }
      debugTextureProgram.uniforms.uMap.value = getTexture(
        textures[debugTarget]
      );
      gl.render(debugScene, camera);
      resetGl();
      return;
    }

    if (hitConfig) {
      hitConfig.scale = columns;
    }

    for (let i = 0; i < numTextures; i++) {
      const col = i % columns;
      const row = rows - Math.floor(i / columns) - 1;

      const w = width / columns;
      const h = height / rows;
      const x = col * w;
      const y = row * h;

      gl.setViewport(x, y, w, h);

      debugTextureProgram.uniforms.uMap.value = getTexture(
        textures[Object.keys(textures)[i]]
      );

      gl.render(debugScene, camera);
    }

    // reset

    gl.setViewport(
      DEFAULT_SCISSOR.x,
      DEFAULT_SCISSOR.y,
      DEFAULT_SCISSOR.width,
      DEFAULT_SCISSOR.height
    );

    gl.setScissor(
      DEFAULT_SCISSOR.x,
      DEFAULT_SCISSOR.y,
      DEFAULT_SCISSOR.width,
      DEFAULT_SCISSOR.height
    );
    resetGl();
  }, 1);

  return (
    <>
      {createPortal(
        <mesh>
          <planeGeometry args={[2, 2]} />
          <primitive object={debugTextureProgram} />
        </mesh>,
        debugScene
      )}
    </>
  );
}
