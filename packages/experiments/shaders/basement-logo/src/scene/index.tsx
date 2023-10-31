import { Float } from "@react-three/drei";
import { Logo } from "./logo";
import { PlaneRaycast } from "./plane-raycast";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "three";

export const Scene = () => {
  useFrame(({ gl, camera }) => {
    const defaultFov = 40;

    const aspectRatio = gl.domElement.width / gl.domElement.height;

    const fovMultiplyer = aspectRatio * 0.5;

    const fov = defaultFov / fovMultiplyer;
    // console.log(fov);

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
