import { createPortal, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  OrbitControlsChangeEvent,
  useFBO,
} from "@react-three/drei";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import {
  Scene,
  RGBAFormat,
  Camera,
  Color,
  PerspectiveCamera,
  Euler,
} from "three";
import { FluidObject } from "../FluidObject";
import { useConfigStore } from "../utils/use-config";
import { useDrag } from "../utils/use-drag";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  const { scene } = useThree();

  const setObjectRotation = useConfigStore((state) => state.setObjectRotation);

  const dragPos = useDrag({
    sensitivity: 0.3,
  });

  useEffect(() => {
    scene.background = new Color(0x000000);
  }, []);

  const dummyCamera = useMemo(() => {
    const c = new PerspectiveCamera();
    c.position.set(1, 0, 0);
    return c;
  }, []);

  useFrame(() => {
    setObjectRotation(new Euler(dragPos[1], 0, dragPos[0], "XZY"));
  });

  return (
    <>
      {children}
      <FluidObject />
      <OrbitControls
        reverseOrbit
        enableZoom={false}
        enablePan={false}
        camera={dummyCamera}
      />
      {/* <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial transparent opacity={0.5} color="red" />
      </mesh> */}
      <ambientLight />
    </>
  );
};
