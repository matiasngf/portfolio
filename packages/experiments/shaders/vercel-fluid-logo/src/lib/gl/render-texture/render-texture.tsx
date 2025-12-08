/* eslint-disable react-hooks/refs */
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import type { RenderCallback, ComputeFunction } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import type { RefObject, PropsWithChildren } from "react";
import { saveGlState } from "../save-gl-state";
import * as THREE from "three";

interface R3FObject {
  __r3f?: {
    parent: R3FObject | THREE.Object3D | null;
  };
}

function isR3FObject(obj: unknown): obj is R3FObject {
  return obj !== null && typeof obj === "object" && "__r3f" in obj;
}

export interface RenderTextureProps {
  renderTarget:
    | THREE.WebGLRenderTarget
    | RefObject<THREE.WebGLRenderTarget>
    | null;
  beforeRender?: RenderCallback;
  afterRender?: RenderCallback;
  autoRender?: boolean;
  camera?: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  /**
   * Priority of the render texture
   */
  priority?: number;
  /**
   * Mesh to use for raycasting
   */
  raycasterMesh?: THREE.Mesh;
  /**
   * Use global mouse coordinate to calculate raycast
   * @default true
   */
  useGlobalPointer?: boolean;
}

function RenderTextureWrapper({
  renderTarget,
  beforeRender,
  afterRender,
  autoRender = true,
  camera,
  priority,
  children,
}: PropsWithChildren<RenderTextureProps>) {
  useFrame((state, delta) => {
    const restore = saveGlState(state);
    if (beforeRender) {
      beforeRender(state, delta);
    }

    if (autoRender) {
      if (renderTarget && "current" in renderTarget) {
        state.gl.setRenderTarget(renderTarget.current);
      } else {
        state.gl.setRenderTarget(renderTarget);
      }

      state.gl.render(state.scene, camera ?? state.camera);
    }

    if (afterRender) {
      afterRender(state, delta);
    }
    restore();
  }, priority);

  return children;
}

export function RenderTexture({
  useGlobalPointer = true,
  ...props
}: PropsWithChildren<RenderTextureProps>) {
  const { renderTarget, raycasterMesh } = props;

  const containerScene = useMemo(() => new THREE.Scene(), []);

  const viewportSize = useThree((state) => state.size);
  const viewportSizeRef = useRef(viewportSize);
  viewportSizeRef.current = viewportSize;

  /** UV compute function relative to the viewport */
  const viewportUvCompute = useCallback<ComputeFunction>(
    (event, state) => {
      if (!viewportSizeRef.current) return;
      const { width, height, left, top } = viewportSizeRef.current;
      const x = event.clientX - left;
      const y = event.clientY - top;
      state.pointer.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
      state.raycaster.setFromCamera(state.pointer, state.camera);
    },
    [viewportSizeRef],
  );

  /** UV compute relative to the parent mesh UV */
  const uvCompute = useCallback<ComputeFunction>(
    (event, state, previous) => {
      if (!previous) return false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let parent: any = raycasterMesh;

      if (!parent) {
        if (isR3FObject(renderTarget) && renderTarget.__r3f?.parent) {
          parent = renderTarget.__r3f.parent as THREE.Mesh;
        }
      }

      while (parent && !(parent instanceof THREE.Object3D)) {
        if (isR3FObject(parent)) {
          parent = parent.__r3f?.parent as THREE.Mesh;
        }
      }
      if (!parent) return false;
      // First we call the previous state-onion-layers compute, this is what makes it possible to nest portals
      if (!previous.raycaster.camera) {
        previous.events.compute?.(
          event,
          previous,
          previous.previousRoot?.getState(),
        );
      }
      // We run a quick check against the parent, if it isn't hit there's no need to raycast at all
      const [intersection] = previous.raycaster.intersectObject(parent);

      if (!intersection) return false;
      // We take that hits uv coords, set up this layers raycaster, et voilà, we have raycasting on arbitrary surfaces
      const uv = intersection.uv;
      if (!uv) return false;
      state.raycaster.setFromCamera(
        state.pointer.set(uv.x * 2 - 1, uv.y * 2 - 1),
        state.camera,
      );
    },
    [renderTarget, raycasterMesh],
  );

  return (
    <>
      {createPortal(
        <RenderTextureWrapper {...props} useGlobalPointer={useGlobalPointer}>
          <>
            {props.children}
            <group onPointerOver={() => null} />
          </>
        </RenderTextureWrapper>,
        containerScene,
        {
          events: {
            compute: useGlobalPointer ? viewportUvCompute : uvCompute,
            priority: 0,
          },
        },
      )}
    </>
  );
}
