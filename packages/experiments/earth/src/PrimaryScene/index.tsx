import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useFBO } from "@react-three/drei";
import { Earth } from "../Earth";
import { BackgroundScene } from "../BackgroundScene";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { Scene, RGBAFormat } from "three";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";
import { useLightDirection } from "./useLightDirection";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  const { scene } = useThree();

  const lightDirection = useLightDirection();

  const cam = useRef<PerspectiveCameraType | null>(null);

  const target = useFBO({
    samples: 8,
    stencilBuffer: false,
    format: RGBAFormat,
  });

  const backgroundScene = useMemo(() => {
    const bgScene = new Scene();
    return bgScene;
  }, []);

  useFrame((state) => {
    if (!cam.current) return;
    cam.current.rotation.copy(state.camera.rotation);
    state.gl.setRenderTarget(target);
    state.gl.render(backgroundScene, cam.current);
    state.gl.setRenderTarget(null);
  });

  useEffect(() => {
    scene.background = target.texture;
  }, [target.texture]);

  return (
    <>
      <PerspectiveCamera fov={40} ref={cam} />
      {createPortal(
        <BackgroundScene lightDirection={lightDirection} />,
        backgroundScene as any
      )}
      {children}
      <Earth lightDirection={lightDirection} />
      <OrbitControls />
      <ambientLight />
    </>
  );
};
