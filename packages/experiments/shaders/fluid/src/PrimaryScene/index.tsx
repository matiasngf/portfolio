import { useFrame, useThree } from "@react-three/fiber";
import { PropsWithChildren, useEffect, useState } from "react";
import {
  Color,
  Euler,
  SRGBColorSpace,
  TextureLoader,
  WebGLCubeRenderTarget,
} from "three";
import { FluidObject } from "../FluidObject";
import { useConfigStore } from "../utils/use-config";
import { useDrag } from "../utils/use-drag";
import { Bounds, Environment } from "@react-three/drei";
import { useBackgroundStore } from "./background";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  const setObjectRotation = useConfigStore((state) => state.setObjectRotation);

  const dragPos = useDrag({
    sensitivity: 0.3,
  });

  useFrame(() => {
    setObjectRotation(new Euler(dragPos[1], 0, dragPos[0], "XZY"));
  });

  // global texture

  const cubeTexture = useBackgroundStore((s) => s.texture);
  const setTexture = useBackgroundStore((s) => s.setTexture);

  // const [cubeTexture, setCubeTexture] = useState(null);

  const { gl, scene } = useThree();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("/experiment-shaders-fluid-assets/woods_4k.jpg", (texture) => {
      texture.colorSpace = SRGBColorSpace;
      const cubeRenderTarget = new WebGLCubeRenderTarget(texture.image.height);
      cubeRenderTarget.fromEquirectangularTexture(gl, texture);
      setTexture(cubeRenderTarget.texture);
    });
  }, []);

  useEffect(() => {
    if (cubeTexture) {
      scene.background = cubeTexture;
    }
  }, [cubeTexture]);

  return (
    <Bounds fit margin={2}>
      {children}
      <FluidObject />
      <ambientLight />
    </Bounds>
  );
};
