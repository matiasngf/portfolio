import { useMemo } from "react";
import {
  getBranchletMesh,
  getBranchletVertices,
} from "./helpers/branchlet-utils";
import { PathVertex } from "./helpers/path-vertex";
import { BranchUniforms } from "./branches";
import { Leaf } from "./leaf";
import { Texture } from "three";

interface BranchletProps {
  pathVertices: PathVertex[];
  uniforms: BranchUniforms;
  t: number;
  texture: Texture;
}

export const Branchlet = ({
  pathVertices,
  uniforms,
  t,
  texture,
}: BranchletProps) => {
  const { branchletMesh, branchletPath } = useMemo(() => {
    const branchletV = getBranchletVertices(pathVertices, t);
    const branchletMesh = getBranchletMesh(
      branchletV.pathVertices,
      t,
      uniforms,
      texture
    );
    branchletMesh.position.copy(branchletV.position);
    return {
      branchletMesh,
      branchletPath: branchletV.pathVertices,
    };
  }, [t, texture]);

  return (
    <primitive object={branchletMesh}>
      <Leaf t={t} branchletPath={branchletPath} uniforms={uniforms} />
    </primitive>
  );
};
