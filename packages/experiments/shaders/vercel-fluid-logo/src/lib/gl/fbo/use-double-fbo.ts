import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { RenderTargetOptions } from "three";
import { DoubleFbo } from "./double-fbo";

/**
 * React hook for managing a DoubleFbo lifecycle.
 *
 * @param width Width of FBOs
 * @param height Height of FBOs
 * @param options Render target options
 */
export function useDoubleFbo<
  TTexture extends THREE.Texture | THREE.Texture[] = THREE.Texture,
>(
  width: number,
  height: number,
  options: RenderTargetOptions = {}
): DoubleFbo<TTexture> {
  const doubleFbo = useMemo(() => {
    return new DoubleFbo<TTexture>(width, height, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    doubleFbo.setSize(width, height);
  }, [width, height, doubleFbo]);

  useEffect(() => {
    // Dispose on unmount
    return () => {
      doubleFbo.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return doubleFbo;
}
