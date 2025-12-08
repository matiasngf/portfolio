import type { RootState } from "@react-three/fiber";
import { Color, Vector4 } from "three";

export function saveGlState(state: RootState) {
  const prevTarget = state.gl.getRenderTarget();
  const prevClearColor = new Color();
  state.gl.getClearColor(prevClearColor);
  const prevClearAlpha = state.gl.getClearAlpha();
  const prevViewport = new Vector4();
  state.gl.getViewport(prevViewport);
  const prevAutoClear = state.gl.autoClear;
  const prevOutputColorSpace = state.gl.outputColorSpace;

  const restore = () => {
    state.gl.setRenderTarget(prevTarget);
    state.gl.setClearColor(prevClearColor, prevClearAlpha);
    state.gl.setViewport(prevViewport);
    state.gl.autoClear = prevAutoClear;
    state.gl.outputColorSpace = prevOutputColorSpace;
  };

  return restore;
}
