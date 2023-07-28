import { useLoader } from "@react-three/fiber";
import { BranchUniforms } from "./branches";
import { PathVertices } from "./helpers/path-vertex";
import { GLTFLoader } from "three-stdlib";
import { PlantGLTF } from ".";
import { useEffect, useMemo } from "react";
import {
  CatmullRomCurve3,
  DoubleSide,
  GLSL3,
  MeshStandardMaterial,
  ShaderMaterial,
  Vector3,
} from "three";
import { leafFragmentShader, leafVertexShader } from "./shaders/leaf-shaders";
import { clamp, valueRemap } from "../utils/math-utils";
import { useUniforms } from "../utils/uniforms";

export interface LeafProps {
  branchletPath: PathVertices;
  uniforms: BranchUniforms;
  /** Where in the main branch the branchlet starts */
  t: number;
}

export const Leaf = ({ branchletPath, uniforms, t }: LeafProps) => {
  const plantModel = useLoader(
    GLTFLoader,
    "/experiment-shaders-plants-assets/plant.glb"
  ) as unknown as PlantGLTF;

  const [leafUniforms, setLeafUniforms] = useUniforms({
    leafProgress: 0,
  });

  const modelNode = useMemo(() => {
    const leaf = plantModel.nodes.leaf.clone();
    const leafMaterial = leaf.material as MeshStandardMaterial;
    const leafTexture = leafMaterial.map.clone();
    leafTexture.colorSpace = "srgb-linear";

    leaf.material = new ShaderMaterial({
      side: DoubleSide,
      transparent: true,
      vertexShader: leafVertexShader,
      fragmentShader: leafFragmentShader,
      glslVersion: GLSL3,
      uniforms: {
        ...leafUniforms,
        leafTexture: {
          value: leafTexture,
        },
      },
    });

    return leaf;
  }, [plantModel, branchletPath, uniforms, t]);

  useEffect(() => {
    if (!modelNode) return;

    const abortController = new AbortController();
    const signal = abortController.signal;
    const isCanceled = () => signal.aborted;

    const curve = new CatmullRomCurve3(
      branchletPath.pathVertices.map((v) => v.position)
    );

    let prevProgress: number | null = null;

    const raf = () => {
      if (isCanceled()) return;
      const currentProgress = uniforms.progress.value;
      if (prevProgress === currentProgress) {
        requestAnimationFrame(raf);
        return;
      }

      const tStart = t + 0.1;
      const tEnd = t + 0.3;
      let branchletProgress = valueRemap(currentProgress, tStart, tEnd, 0, 1);
      branchletProgress = clamp(branchletProgress, 0, 1);

      // move model along branchlet path
      const point = curve.getPointAt(branchletProgress);
      const startingDirection = curve.getTangentAt(0);
      const endDirection = curve.getTangentAt(1);
      const branchDirection = startingDirection.lerp(
        endDirection,
        branchletProgress
      );
      const branchCurrentDirection = curve.getTangentAt(branchletProgress);
      branchDirection.lerp(branchCurrentDirection, 0.2);
      modelNode.position.copy(point);

      // rotate model to face branch direction
      const leafDirection = new Vector3(1, 0, 0).normalize();
      const axis = new Vector3()
        .crossVectors(leafDirection, branchDirection)
        .normalize();
      const angle = Math.acos(leafDirection.dot(branchDirection));
      modelNode.quaternion.setFromAxisAngle(axis, angle);

      // scale
      modelNode.scale.setScalar(branchletProgress * 2);

      // update progress
      prevProgress = currentProgress;
      setLeafUniforms({ leafProgress: branchletProgress });

      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      abortController.abort();
    };
  }, [uniforms, branchletPath, t, modelNode]);

  return (
    <group>
      <primitive object={modelNode} />
    </group>
  );
};
