import { CylinderGeometry, GLSL3, LineSegments, Mesh, Quaternion, ShaderMaterial, Vector3 } from "three";
import { branchFragmentShader, branchVertexShader } from "./plant-shaders";
import { verticesFromLineSegment } from "./path-vertex";
import { getBranchletMesh, getBranchletVertices } from "./branchlet";
import { BranchUniforms } from "./branches";

// transform a lineSegment into a branch mesh
export const pathToBranch = (branch: LineSegments, uniforms: BranchUniforms, branchlets: number): Mesh<CylinderGeometry, ShaderMaterial> => {

  const {
    pathVertices,
    totalDistance,
    numVertices,
  } = verticesFromLineSegment(branch);

  const branchMaterial = new ShaderMaterial({
    name: branch.name + 'material',
    vertexShader: branchVertexShader,
    fragmentShader: branchFragmentShader,
    glslVersion: GLSL3,
    defines: {
      NUM_VERTICES: numVertices,
    },
    uniforms: {
      pathVertices: {
        value: pathVertices,
      },
      totalDistance: { value: totalDistance },
      ...uniforms,
    },
  });

  // normalized cilinder
  const cylinder = new CylinderGeometry(1, 1, 1, 20, numVertices * 2);
  const branchMesh = new Mesh(cylinder, branchMaterial);

  branchMesh.position.copy(branch.position);
  branchMesh.rotation.copy(branch.rotation);

  for (let i = 0; i < branchlets; i++) {
    const t = 1 - Math.pow(Math.random(), 1.7);
    const branchletV = getBranchletVertices(pathVertices, t);
    const branchletMesh = getBranchletMesh(branchletV.pathVertices, t, uniforms);
    branchletMesh.position.copy(branchletV.position);
    branchMesh.add(branchletMesh);
  }

  return branchMesh;
}
