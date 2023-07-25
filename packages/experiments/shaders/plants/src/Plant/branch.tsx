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
    const ts = Array.from(Array(branchletsNumber).keys()).map(() =>
      Math.min(Math.random(), 0.8)
    );
    // add a branchlet at the end
    ts.push(0.8);
    return ts;
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
      {branchletsArr.map((t, i) => (
        <Branchlet
          pathVertices={branchPath.pathVertices}
          uniforms={uniforms}
          t={t}
          key={i}
        />
      ))}
    </primitive>
  );
};
