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

export interface BranchProps {
  segments: LineSegments;
  uniforms: BranchUniforms;
}

export const Branch = ({ segments, uniforms }: BranchProps) => {
  const branchMap = useTexture(
    "/experiment-shaders-plants-assets/branch-texture.jpg",
    (t: Texture) => {
      t.wrapT = RepeatWrapping;
      t.wrapS = MirroredRepeatWrapping;
    }
  );

  const branchletsNumber = 15;
  const branchletsArr = useMemo(() => {
    const ts = Array.from(Array(branchletsNumber).keys()).map(() =>
      Math.min(Math.random(), 0.9)
    );
    // add a branchlet at the end
    ts.push(0.9);
    return ts;
  }, [branchletsNumber]);

  const { branchMesh, branchPath } = useMemo(() => {
    const { branchMesh, branchPath } = getBranchMesh(
      segments.clone(true),
      uniforms,
      branchMap
    );

    return { branchMesh, branchPath };
  }, [segments, uniforms, branchMap]);

  return (
    <primitive object={branchMesh}>
      {branchletsArr.map((t, i) => (
        <Branchlet
          pathVertices={branchPath.pathVertices}
          uniforms={uniforms}
          texture={branchMap}
          t={t}
          key={i}
        />
      ))}
    </primitive>
  );
};