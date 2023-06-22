import { Euler, Quaternion, Vector3 } from "three";
import { PathVertex, getPathVertex, vectorsToPathVertices } from "./path-vertex";

// TODO: use this function to generate mesh and material
export const getBranchletVertices = (pathVertices: PathVertex[], t: number) => {

  const branchletVertices: Vector3[] = [];

  const {
    direction,
    position
  } = getPathVertex(pathVertices, t);

  const randomFactor = 0.2;

  const currentDireciton = direction.clone();
  const currentPosition = new Vector3(0, 0, 0);
  const randomRotation = new Quaternion();

  // first vertex
  branchletVertices.push(currentPosition.clone());

  const numVertices = 5;
  const edgeLength = 0.1;

  for (let i = 0; i < numVertices - 1; i++) {

    // rotate direction
    randomRotation.setFromEuler(new Euler(
      Math.random() * Math.PI * randomFactor,
      Math.random() * Math.PI * randomFactor,
      Math.random() * Math.PI * randomFactor,
    ));
    currentDireciton.applyQuaternion(randomRotation);

    // move vertex
    currentPosition.add(currentDireciton.clone().multiplyScalar(edgeLength));

    // add vertex
    branchletVertices.push(currentPosition.clone());

  }

  return {
    pathVertices: vectorsToPathVertices(branchletVertices),
    position,
  }

}