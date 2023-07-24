import { CylinderGeometry, Euler, GLSL3, Mesh, MeshBasicMaterial, Quaternion, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import { PathVertex, PathVertices, getPathVertex, vectorsToPathVertices } from "./path-vertex";
import { branchletFragmentShader, branchletVertexShader } from "./branchlet-shaders";
import { BranchUniforms } from "../branches";

// TODO: material, leaves
export const getBranchletMesh = (path: PathVertices, t: number, uniforms: BranchUniforms): Mesh => {


  console.log(uniforms);


  const branchletGeometry = new CylinderGeometry(1, 1, 1, 10, path.numVertices * 2);
  const branchletMaterial = new ShaderMaterial({
    vertexShader: branchletVertexShader,
    fragmentShader: branchletFragmentShader,
    glslVersion: GLSL3,
    defines: {
      NUM_VERTICES: path.numVertices,
    },
    uniforms: {
      ...uniforms,
      pathVertices: {
        value: path.pathVertices,
      },
      tStart: { value: t + 0.1 },
      tEnd: { value: t + 0.3 },
      totalDistance: { value: path.totalDistance },
    },
  });
  const branchletMesh = new Mesh(branchletGeometry, branchletMaterial);

  return branchletMesh;
}

/** Generates a branchlet that will start at the same direction/position of the branch at t */
export const getBranchletVertices = (pathVertices: PathVertex[], t: number) => {

  const branchletVertices: Vector3[] = [];

  const {
    direction,
    position
  } = getPathVertex(pathVertices, t);

  const currentDireciton = direction.clone();
  const currentPosition = new Vector3(0, 0, 0);
  const randomRotation = new Quaternion();

  // first vertex
  branchletVertices.push(currentPosition.clone());

  const randomFactor = 0.1;
  const numVertices = 20;
  const edgeLength = 0.01;

  for (let i = 0; i < numVertices - 1; i++) {

    // rotate direction
    randomRotation.setFromEuler(new Euler(
      (Math.random() - 0.5) * 2 * Math.PI * randomFactor,
      (Math.random() - 0.5) * 2 * Math.PI * randomFactor,
      (Math.random() - 0.5) * 2 * Math.PI * randomFactor,
    ));

    currentDireciton.applyQuaternion(randomRotation);

    // smoot Y over time
    const branchProgress = (i + 1) / numVertices;
    const growOffset = 0.7;
    const cap = 0.2;
    const yFactor = Math.cos(branchProgress * Math.PI * growOffset) * cap + (1 - cap);
    currentDireciton.y = currentDireciton.y * yFactor;
    currentDireciton.normalize();

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