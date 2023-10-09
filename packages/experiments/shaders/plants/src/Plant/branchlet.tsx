import { useMemo } from "react";
import {
  getBranchletMesh,
  getBranchletVertices,
} from "./helpers/branchlet-utils";
import { PathVertex } from "./helpers/path-vertex";
import { BranchUniforms } from "./branches";
import { Leaf } from "./leaf";
import { BufferGeometry, Line, LineBasicMaterial, Texture } from "three";
import { DebugLine } from "./debug-line";
import { useConfig } from "../utils/use-config";

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
  const { debugBranchlets, renderBranchlets } = useConfig();

  const { branchletMesh, branchletPath, position } = useMemo(() => {
    const branchletV = getBranchletVertices(pathVertices, t);
    const branchletMesh = getBranchletMesh(
      branchletV.pathVertices,
      t,
      uniforms,
      texture
    );
    // branchletMesh.position.copy(branchletV.position);
    return {
      branchletMesh,
      branchletPath: branchletV.pathVertices,
      position: branchletV.position,
    };
  }, [t, texture]);

  const branchletLineSegments = useMemo(() => {
    const branchletLineSegments = new Line(
      new BufferGeometry().setFromPoints(
        branchletPath.pathVertices.map((v) => v.position)
      ),

      new LineBasicMaterial({
        color: "blue",
        linewidth: 1,
        depthTest: false,
      })
    );
    return branchletLineSegments;
  }, [branchletPath]);

  return (
    <>
      <group position={position}>
        {debugBranchlets && (
          <DebugLine color="blue" segments={branchletLineSegments} />
        )}
        {renderBranchlets && <primitive object={branchletMesh} />}
        <Leaf t={t} branchletPath={branchletPath} uniforms={uniforms} />
      </group>
    </>
  );
};
