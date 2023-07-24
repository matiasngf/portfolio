import { useMemo } from "react";
import {
  getBranchletMesh,
  getBranchletVertices,
} from "./helpers/branchlet-utils";
import { PathVertex } from "./helpers/path-vertex";
import { BranchUniforms } from "./branches";
import { Leaf } from "./leaf";

interface BranchletProps {
  pathVertices: PathVertex[];
  uniforms: BranchUniforms;
}

export const Branchlet = ({ pathVertices, uniforms }: BranchletProps) => {
  const { branchletMesh, branchletPath, t } = useMemo(() => {
    const t = 1 - Math.pow(Math.random(), 1.7);
    const branchletV = getBranchletVertices(pathVertices, t);
    const branchletMesh = getBranchletMesh(
      branchletV.pathVertices,
      t,
      uniforms
    );
    branchletMesh.position.copy(branchletV.position);
    return {
      branchletMesh,
      branchletPath: branchletV.pathVertices,
      t,
    };
  }, []);

  return (
    <primitive object={branchletMesh}>
      <Leaf t={t} branchletPath={branchletPath} uniforms={uniforms} />
    </primitive>
  );
};
