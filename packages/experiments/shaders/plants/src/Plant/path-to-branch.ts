import { CylinderGeometry, GLSL3, LineSegments, Mesh, Quaternion, ShaderMaterial, Vector3 } from "three";
import { branchFragmentShader, branchVertexShader } from "./plant-shaders";
import { Uniforms } from "../utils/uniforms";

interface PathVertex {
  position: Vector3;
  distance: number;
  // direction from this point to the next
  direction: Vector3;
  // rotation from the prev point to this one
  rotation: Quaternion;
  // rotation from the first point to this one
  addedQuaternion: Quaternion;
}

const getRandomId = () => Math.random().toString(36).substring(7);

// transform a lineSegment into a branch mesh
export const pathToBranch = (branch: LineSegments, uniforms: Uniforms): Mesh<CylinderGeometry, ShaderMaterial> => {

  const branchId = getRandomId();

  const positions = branch.geometry.attributes.position.array;
  const index = branch.geometry.index;
  const vertices: Vector3[] = [];

  const useIndexes = new Set<number>();


  // build vertices using index
  for (let i = 0; i < index.array.length; i++) {
    const vertexIndex = index.array[i];
    if (useIndexes.has(vertexIndex)) continue;
    useIndexes.add(vertexIndex);

    vertices.push(
      new Vector3(
        positions[vertexIndex * 3],
        positions[vertexIndex * 3 + 1],
        positions[vertexIndex * 3 + 2]
      )
    );
  }

  const numVertices = vertices.length;

  let totalDistance = 0;

  // TODO remove distances, the vertices are spaced evenly, maybe add as an optional parameter
  const distances = vertices.map((v, i) => {
    if (i === 0) return 0;
    const dist = v.distanceTo(vertices[i - 1]);
    totalDistance += dist;
    return dist;
  });

  let prevDirection = new Vector3(0, 1, 0);

  const addedQuaternions = new Quaternion(0, 0, 0, 1);

  const pathVertices: PathVertex[] = vertices.map((v, i) => {
    const direction = new Vector3();
    if (i < vertices.length - 1) {
      direction
        .copy(vertices[i + 1])
        .sub(v)
        .normalize();
    } else {
      // final vertex
      direction.copy(prevDirection);
    }
    const rotation = new Quaternion().setFromUnitVectors(
      direction,
      prevDirection,
    );

    if (i === 0) {
      addedQuaternions.copy(rotation);
    } else {
      addedQuaternions.multiplyQuaternions(addedQuaternions, rotation);
    }

    prevDirection.copy(direction);


    return {
      position: v,
      distance: distances[i],
      direction,
      rotation,
      addedQuaternion: addedQuaternions.clone(),
    };
  });

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

  branchMaterial.customProgramCacheKey = () => branchId;
  branchMaterial.needsUpdate = true;

  // normalized cilinder
  const cylinder = new CylinderGeometry(1, 1, 1, 20, numVertices * 2);
  const branchMesh = new Mesh(cylinder, branchMaterial);

  branchMesh.position.copy(branch.position);
  branchMesh.rotation.copy(branch.rotation);

  return branchMesh;
}
