import { LineSegments, Mesh } from "three";
import type { GLTF } from "three-stdlib";
import { Branches } from "./branches";
import { Pot } from "./pot";

export interface PlantGLTF extends GLTF {
  nodes: {
    pot: Mesh;
    stick: Mesh;
    Branch: LineSegments;
    leaf: Mesh;
  };
}

export const Plant = () => {
  return (
    <group position={[0, 0, 0]}>
      <Branches />
      <Pot />
    </group>
  );
};
