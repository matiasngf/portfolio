import { useMemo } from "react";
import {
  getBranchletMesh,
  getBranchletVertices,
} from "./helpers/branchlet-utils";
import { PathVertex } from "./helpers/path-vertex";
import { BranchUniforms } from "./branches";

interface BranchletProps {
  pathVertices: PathVertex[];
  uniforms: BranchUniforms;
}

export const Branchlet = ({ pathVertices, uniforms }: BranchletProps) => {
  const { branchletMesh } = useMemo(() => {
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
    };
  }, []);

  return <primitive object={branchletMesh} />;
};
