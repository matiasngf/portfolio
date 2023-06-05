import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useFBO } from "@react-three/drei";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { Scene, RGBAFormat, Camera } from "three";
import { FluidObject } from "../FluidObject";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  const { scene } = useThree();

  return (
    <>
      {children}
      <FluidObject />
      <OrbitControls />
      <ambientLight />
    </>
  );
};
