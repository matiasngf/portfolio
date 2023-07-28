import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { PlantGLTF } from ".";
import { useEffect, useMemo } from "react";
import { LineSegments } from "three";
import { Uniforms, useUniforms } from "../utils/uniforms";
import { useConfig } from "../utils/use-config";
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
    "/experiment-shaders-plants-assets/plant.glb"
  ) as unknown as PlantGLTF;

  const branches = useMemo(() => {
    return Object.values(plantModel.nodes).filter(
      (node) => node.name.startsWith("Branch") && node.type === "LineSegments"
    ) as LineSegments[];
  }, [plantModel]);

  const [uniforms, setUniforms] = useUniforms(branchUniforms);

  const { grow } = useConfig();

  useEffect(() => {
    setUniforms({
      progress: grow,
    });
  }, [grow]);

  return (
    <group>
      {branches.map((branch, i) => (
        <Branch uniforms={uniforms} segments={branch} key={i} branchlets={15} />
      ))}
    </group>
  );
};
