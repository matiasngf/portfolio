import { CylinderGeometry, GLSL3, LineSegments, Mesh, Quaternion, ShaderMaterial, Vector3 } from "three";
import { branchFragmentShader, branchVertexShader } from "./plant-shaders";
import { Uniforms } from "../utils/uniforms";
import { verticesFromLineSegment } from "./path-vertex";

// transform a lineSegment into a branch mesh
export const pathToBranch = (branch: LineSegments, uniforms: Uniforms, branchlets: number): Mesh<CylinderGeometry, ShaderMaterial> => {

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

  return branchMesh;
}
