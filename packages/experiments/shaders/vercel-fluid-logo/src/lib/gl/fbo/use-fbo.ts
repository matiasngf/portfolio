import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { RenderTargetOptions } from "three";

export interface FboOptions extends RenderTargetOptions {
  width?: number;
  height?: number;
}

export function useFBO<
  TTexture extends THREE.Texture | THREE.Texture[] = THREE.Texture,
>(fboParams: FboOptions): THREE.WebGLRenderTarget<TTexture> {
  const { width, height, ...options } = fboParams;

  const w = useThree((s) => (typeof width === "number" ? width : s.size.width));
  const h = useThree((s) =>
    typeof height === "number" ? height : s.size.height
  );

  const target = useMemo(() => {
    const fbo = new THREE.WebGLRenderTarget<TTexture>(w, h, options);
    return fbo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    target.setSize(w, h);
  }, [w, h, target]);

  useEffect(() => {
    // dispose on unmount
    return () => {
      target.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return target;
}
