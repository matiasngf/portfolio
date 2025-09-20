import { Float } from "@react-three/drei";
import { Logo } from "./logo";
import { PlaneRaycast } from "./plane-raycast";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { valueRemap } from "../utils/math";

export const Scene = () => {
  useFrame(({ gl, camera }) => {
    const aspectRatio = gl.domElement.width / gl.domElement.height;

    const desktopFov = 40;
    const mobileFov = 100;

    const fov = valueRemap(aspectRatio, 1.99, 0.46, desktopFov, mobileFov);

    (camera as PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();
  });

  return (
    <group>
      <PlaneRaycast />
      <Float speed={1}>
        <Logo />
      </Float>
    </group>
  );
};
