import { useLoader } from "@react-three/fiber";
import { BranchUniforms } from "./branches";
import { PathVertices } from "./helpers/path-vertex";
import { GLTFLoader } from "three-stdlib";
import { PlantGLTF } from ".";
import { useMemo } from "react";
import { DoubleSide, GLSL3, MeshStandardMaterial, ShaderMaterial } from "three";
import { leafFragmentShader, leafVertexShader } from "./shaders/leaf-shaders";

export interface LeafProps {
  branchletPath: PathVertices;
  uniforms: BranchUniforms;
  /** Where in the main branch the branchlet starts */
  t: number;
}

export const Leaf = ({ branchletPath, uniforms, t }: LeafProps) => {
  const plantModel = useLoader(
    GLTFLoader,
    "experiment-shaders-plants-assets/plant.glb"
  ) as unknown as PlantGLTF;

  const modelNode = useMemo(() => {
    const leaf = plantModel.nodes.leaf.clone();
    const originalMat = (leaf.material as MeshStandardMaterial).clone();

    leaf.material = new ShaderMaterial({
      side: DoubleSide,
      vertexShader: leafVertexShader,
      fragmentShader: leafFragmentShader,
      glslVersion: GLSL3,
      defines: {
        NUM_VERTICES: branchletPath.numVertices,
      },
      uniforms: {
        ...uniforms,
        leafTexture: {
          value: originalMat.map.clone(),
        },
        pathVertices: {
          value: branchletPath.pathVertices,
        },
        tStart: { value: t + 0.1 },
        tEnd: { value: t + 0.3 },
        totalDistance: { value: branchletPath.totalDistance },
      },
    });

    return leaf;
  }, [plantModel, branchletPath, uniforms, t]);

  return <primitive object={modelNode} />;
};
