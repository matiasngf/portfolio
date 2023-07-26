import { PropsWithChildren } from "react";
import { Plant } from "../Plant";
import { Backdrop } from "@react-three/drei";
import { MainCamera } from "./main-camera";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  return (
    <>
      <MainCamera />
      {children}
      <Plant />
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 2, 2]} intensity={1} />
      <group
        position={[-1, -0.01, -1]}
        scale={[30, 3, 2]}
        rotation={[0, 0.7, 0]}
      >
        <Backdrop receiveShadow={true} floor={3}>
          <meshPhysicalMaterial color="#FF9B9B" />
        </Backdrop>
      </group>
    </>
  );
};
