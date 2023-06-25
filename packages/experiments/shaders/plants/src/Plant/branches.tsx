import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { PlantGLTF } from ".";
import { useEffect, useMemo } from "react";
import { Group, LineSegments } from "three";
import { Uniforms, useUniforms } from "../utils/uniforms";
import { useConfig } from "../utils/use-config";
import { pathToBranch } from "./path-to-branch";

const branchUniforms = {
  progress: 0,
  branchRadius: 0.005,
  branchGrowOffset: 0.1,
};

export type BranchUniforms = Uniforms<typeof branchUniforms>;

export const Branches = () => {
  const plantModel = useLoader(
    GLTFLoader,
    "experiment-shaders-plants-assets/plant.glb"
  ) as unknown as PlantGLTF;

  const [uniforms, setUniforms] = useUniforms(branchUniforms);

  const { grow } = useConfig();

  useEffect(() => {
    setUniforms({
      progress: grow,
    });
  }, [grow]);

  const ModelNode = useMemo(() => {
    const result = new Group();

    const branches = Object.values(plantModel.nodes).filter(
      (node) => node.name.startsWith("Branch") && node.type === "LineSegments"
    ) as LineSegments[];

    branches.forEach((branchPath) => {
      const branchMesh = pathToBranch(branchPath.clone(true), uniforms, 15);
      result.add(branchMesh);
    });

    return result;
  }, [plantModel]);

  return <primitive object={ModelNode} />;
};

// https://sketchfab.com/3d-models/free-pothos-potted-plant-money-plant-e9832f38484f4f85b3f9081b51fa3799
