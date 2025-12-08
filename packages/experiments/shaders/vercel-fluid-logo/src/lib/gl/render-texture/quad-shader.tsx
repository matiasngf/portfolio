import type { RefObject } from "react";
import { useMemo } from "react";
import { createPortal, useFrame } from "@react-three/fiber";
import type { RenderCallback } from "@react-three/fiber";
import type { ShaderMaterial, WebGLRenderTarget } from "three";
import { Scene } from "three";
import { quadCamera, quadGeometry } from "./quad-primitives";

export interface QuadShaderProps {
  program: ShaderMaterial;
  renderTarget: WebGLRenderTarget | RefObject<WebGLRenderTarget> | null;
  beforeRender?: RenderCallback;
  afterRender?: RenderCallback;
  autoRender?: boolean;
  priority?: number;
}

export function QuadShader({
  program,
  renderTarget,
  beforeRender,
  afterRender,
  autoRender = true,
  priority = 0,
}: QuadShaderProps) {
  const containerScene = useMemo(() => new Scene(), []);

  useFrame((state, delta) => {
    if (beforeRender) {
      beforeRender(state, delta);
    }
    if (autoRender) {
      if (!renderTarget) {
        // render to screen
        state.gl.setRenderTarget(null);

        state.gl.render(containerScene, quadCamera);
      } else {
        // render target set
        if ("current" in renderTarget) {
          state.gl.setRenderTarget(renderTarget.current);
        } else {
          state.gl.setRenderTarget(renderTarget);
        }
      }

      state.gl.render(containerScene, quadCamera);
      state.gl.setRenderTarget(null);
    }

    if (afterRender) {
      afterRender(state, delta);
    }
  }, priority);

  return (
    <>
      {createPortal(
        <mesh geometry={quadGeometry}>
          <primitive object={program} />
        </mesh>,

        containerScene
      )}
    </>
  );
}

export function QuadMesh({ children }: { children: React.ReactNode }) {
  return <mesh geometry={quadGeometry}>{children}</mesh>;
}
