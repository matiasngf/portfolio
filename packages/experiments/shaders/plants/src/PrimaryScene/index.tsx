import { PropsWithChildren } from "react";
import { Plant } from "../Plant";
import { Backdrop } from "@react-three/drei";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  return (
    <>
      {children}
      <Plant />
      <ambientLight intensity={0.1} />
      <pointLight position={[2, 3, 0]} intensity={0.7} />
      <group position={[-2, 0, -2]} scale={[10, 4, 4]} rotation={[0, 1, 0]}>
        <Backdrop receiveShadow={false} floor={1}>
          <meshPhysicalMaterial color="#FF9B9B" />
        </Backdrop>
      </group>
    </>
  );
};
