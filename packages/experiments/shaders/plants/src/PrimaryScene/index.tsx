import { PropsWithChildren } from "react";
import { Plant } from "../Plant";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  return (
    <>
      {children}
      <Plant />
      <ambientLight />
      <color attach="background" args={["#111"]} />
    </>
  );
};
