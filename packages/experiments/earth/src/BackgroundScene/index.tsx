import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { TextureLoader, WebGLCubeRenderTarget } from "three";
import startsTextureUrl from "./2k_stars_milky_way.jpg";
import { Sun } from "../Sun";
import { lightDirection } from "../Earth";

export const BackgroundScene = () => {
  const [cubeTexture, setCubeTexture] = useState(null);

  const { gl, scene } = useThree();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(startsTextureUrl, (texture) => {
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
      <Sun position={lightDirection.clone().multiplyScalar(10)} />
    </>
  );
};
