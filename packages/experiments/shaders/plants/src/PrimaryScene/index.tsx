import { PropsWithChildren } from "react";
import { Plant } from "../Plant";
import { MainCamera } from "./main-camera";
import { Stage } from "./stage";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  return (
    <>
      <MainCamera />
      {children}
      <Plant />
      <Stage />
    </>
  );
};
