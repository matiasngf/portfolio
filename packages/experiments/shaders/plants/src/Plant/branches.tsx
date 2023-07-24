import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { PlantGLTF } from ".";
import { useEffect, useMemo } from "react";
import { LineSegments } from "three";
import { Uniforms, useUniforms } from "../utils/uniforms";
import { useConfig } from "../utils/use-config";
import { getBranchMesh } from "./helpers/get-branch-mesh";
import { Branch } from "./branch";

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

  const branches = useMemo(() => {
    const branches = Object.values(plantModel.nodes).filter(
      (node) => node.name.startsWith("Branch") && node.type === "LineSegments"
    ) as LineSegments[];

    return branches;
  }, [plantModel]);

  return (
    <group>
      {branches.map((branch, i) => (
        <Branch uniforms={uniforms} segments={branch} key={i} />
      ))}
    </group>
  );
};

// https://sketchfab.com/3d-models/free-pothos-potted-plant-money-plant-e9832f38484f4f85b3f9081b51fa3799
