import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { Group, LineSegments, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import type { GLTF } from "three-stdlib";
import { Branches } from "./branches";

export interface PlantGLTF extends GLTF {
  nodes: {
    POT_WOOD_LEGS_WOODEN_LEGS_POT_0: Mesh;
    Branch: LineSegments;
    Branch2: LineSegments;
  };
  materials: {};
}

export const Plant = () => {
  return (
    <group position={[0, 0, 0]}>
      <Branches />
      <Pot />
    </group>
  );
};

const Pot = () => {
  const plantModel = useLoader(
    GLTFLoader,
    "experiment-shaders-plants-assets/plant.glb"
  ) as unknown as PlantGLTF;

  const ModelNode = useMemo(() => {
    const result = new Group();

    const pot = plantModel.nodes.POT_WOOD_LEGS_WOODEN_LEGS_POT_0.clone();
    result.add(pot);

    return result;
  }, [plantModel]);

  return <primitive object={ModelNode} />;
};
