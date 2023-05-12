import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import {
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLCubeRenderTarget,
} from "three";
import startsTextureUrl from "./starmap_g4k.jpg";
import { Sun } from "../Sun";

interface BackgroundSceneProps {
  lightDirection: Vector3;
}

export const BackgroundScene = ({ lightDirection }: BackgroundSceneProps) => {
  const [cubeTexture, setCubeTexture] = useState(null);

  const { gl, scene } = useThree();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(startsTextureUrl, (texture) => {
      texture.colorSpace = SRGBColorSpace;
      const cubeRenderTarget = new WebGLCubeRenderTarget(texture.image.height);
      cubeRenderTarget.fromEquirectangularTexture(gl, texture);
      setCubeTexture(cubeRenderTarget.texture);
    });
  }, [gl]);

  useEffect(() => {
    if (cubeTexture) {
      scene.background = cubeTexture;
    }
  }, [cubeTexture]);

  return (
    <>
      <Sun position={lightDirection.clone().multiplyScalar(15)} />
    </>
  );
};
