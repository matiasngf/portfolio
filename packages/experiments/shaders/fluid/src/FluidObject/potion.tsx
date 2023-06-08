import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Group, Mesh, MeshBasicMaterial, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import type { GLTF } from "three-stdlib";
import { useBackgroundStore } from "../PrimaryScene/background";

export interface PotionBottleGLTF extends GLTF {
  nodes: {
    Cap: Mesh;
    Fluid: Mesh;
    Glass_Outer: Mesh;
  };
  materials: {};
}

export const Potion = () => {
  // const envTexture = useLoader(
  //   TextureLoader,
  //   "/experiment-shaders-fluid-assets/woods_4k.jpg"
  // );

  const [currentGalss, setCurrentGlass] = useState<MeshBasicMaterial | null>();

  const envTexture = useBackgroundStore((s) => s.texture);

  // load model

  const bottleModel = useLoader(
    GLTFLoader,
    "/experiment-shaders-fluid-assets/potion-bottle.glb"
  ) as unknown as PotionBottleGLTF;

  const ModelNode = useMemo(() => {
    const result = new Group();

    const cap = bottleModel.nodes.Cap.clone();

    cap.rotateZ(Math.PI * 1.2);
    result.add(cap);

    const glass = bottleModel.nodes.Glass_Outer.clone();
    glass.renderOrder = 1;
    glass.material = new MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.2,
      transparent: true,
      envMap: envTexture,
      reflectivity: 1,
    });

    result.add(glass);

    setCurrentGlass(glass.material as MeshBasicMaterial);

    return result;
  }, [bottleModel]);

  useEffect(() => {
    if (currentGalss) {
      currentGalss.envMap = envTexture;
    }
  }, [currentGalss, envTexture]);

  return <primitive object={ModelNode} />;
};
