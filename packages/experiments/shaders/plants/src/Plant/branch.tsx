import { LineSegments } from "three";
import { BranchUniforms } from "./branches";
import { useMemo } from "react";
import { getBranchMesh } from "./helpers/get-branch-mesh";
import { Branchlet } from "./branchlet";

export interface BranchProps {
  segments: LineSegments;
  uniforms: BranchUniforms;
}

export const Branch = ({ segments, uniforms }: BranchProps) => {
  const branchletsNumber = 15;
  const branchletsArr = useMemo(() => {
    return Array.from(Array(branchletsNumber).keys());
  }, [branchletsNumber]);

  const { branchMesh, branchPath } = useMemo(() => {
    const { branchMesh, branchPath } = getBranchMesh(
      segments.clone(true),
      uniforms
    );

    return { branchMesh, branchPath };
  }, [segments, uniforms]);

  return (
    <primitive object={branchMesh}>
      {branchletsArr.map((i) => (
        <Branchlet
          pathVertices={branchPath.pathVertices}
          uniforms={uniforms}
          key={i}
        />
      ))}
    </primitive>
  );
};
