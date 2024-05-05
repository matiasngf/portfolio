import {
  LineSegments,
  MirroredRepeatWrapping,
  RepeatWrapping,
  Texture,
} from "three";
import { BranchUniforms } from "./branches";
import { useMemo } from "react";
import { getBranchMesh } from "./helpers/get-branch-mesh";
import { Branchlet } from "./branchlet";
import { useTexture } from "@react-three/drei";
import { DebugLine } from "./debug-line";
import { useConfig } from "../utils/use-config";

export interface BranchProps {
  segments: LineSegments;
  uniforms: BranchUniforms;
  branchlets: number;
}

export const Branch = ({ segments, uniforms, branchlets }: BranchProps) => {
  const { debugBranches, renderBranches } = useConfig();

  const branchMap = useTexture(
    "/experiment-shaders-plants-assets/branch-texture.jpg",
    (t: any) => {
      const tex = t as Texture;
      tex.wrapT = RepeatWrapping;
      tex.wrapS = MirroredRepeatWrapping;
    }
  );

  const { branchMesh, branchPath, position, rotation } = useMemo(() => {
    return getBranchMesh(segments.clone(true), uniforms, branchMap);
  }, [segments, uniforms, branchMap]);

  const branchletsArr = useMemo(() => {
    const ts = Array.from(Array(branchlets).keys()).map(() =>
      Math.min(Math.random(), 0.9)
    );
    // add a final branchlet at the end
    ts.push(0.9);
    return ts;
  }, [branchlets]);

  return (
    <>
      {debugBranches && <DebugLine segments={segments} />}
      <group position={position} rotation={rotation}>
        {renderBranches && <primitive object={branchMesh} />}
        {branchletsArr.map((t, i) => (
          <Branchlet
            pathVertices={branchPath.pathVertices}
            uniforms={uniforms}
            texture={branchMap}
            t={t}
            key={i}
          />
        ))}
      </group>
    </>
  );
};
