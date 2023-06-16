import { useThree } from "@react-three/fiber";
import { PropsWithChildren, useEffect, useState } from "react";
import { SRGBColorSpace, TextureLoader, WebGLCubeRenderTarget } from "three";
import { Bounds } from "@react-three/drei";
import { useBackgroundStore } from "./background";
import { Plant } from "../Plant";

export interface PrimarySceneProps {}

export const PrimaryScene = ({
  children,
}: PropsWithChildren<PrimarySceneProps>) => {
  // global texture

  const cubeTexture = useBackgroundStore((s) => s.texture);
  const setTexture = useBackgroundStore((s) => s.setTexture);

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
    <>
      {children}
      <Plant />
      <ambientLight />
    </>
  );
};
