import { Sphere } from "@react-three/drei";
import { SRGBColorSpace, Vector3 } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useLoader } from "@react-three/fiber";

import earthDayMapUrl from "./textures/8k_earth_daymap.jpg";
import nightMapUrl from "./textures/8k_earth_nightmap.jpg";
import cloudMapUrl from "./textures/8k_earth_clouds.jpg";

import { earthFragmentShader, earthVertexShader } from "./shaders";

export const lightDirectionRaw = new Vector3(1, 0, 0);
export const lightDirection = lightDirectionRaw;
// .applyAxisAngle(new Vector3(0, 0, 1), Math.PI * (13 / 180));

const verteces = Math.pow(2, 9);

export const Earth = () => {
  const [earthDayTexture, nightTexture, cloudTexture] = useLoader(
    TextureLoader,
    [earthDayMapUrl, nightMapUrl, cloudMapUrl]
  );

  earthDayTexture.colorSpace =
    nightTexture.colorSpace =
    cloudTexture.colorSpace =
      SRGBColorSpace;

  return (
    <Sphere args={[1, verteces, verteces]}>
      <shaderMaterial
        vertexShader={earthVertexShader}
        fragmentShader={earthFragmentShader}
        uniforms={{
          dayMap: { value: earthDayTexture },
          nightMap: { value: nightTexture },
          cloudMap: { value: cloudTexture },
          lightDirection: { value: lightDirection },
        }}
      />
    </Sphere>
  );
};
