import { LineSegments, Quaternion, Vector3 } from "three";

export interface PathVertex {
  // position of this point
  position: Vector3;
  // distance form this point to the previous one
  distance: number;
  // direction from this point to the next
  direction: Vector3;
  // rotation from the prev point to this one
  rotation: Quaternion;
  // rotation from the first point to this one
  addedQuaternion: Quaternion;
}

export interface PathVertices {
  pathVertices: PathVertex[];
  totalDistance: number;
  numVertices: number;
}

export const verticesFromLineSegment = (branch: LineSegments): PathVertices => {
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

  return vectorsToPathVertices(vertices);

}

export const vectorsToPathVertices = (vertices: Vector3[]): PathVertices => {
  const numVertices = vertices.length;

  let totalDistance = 0;

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

  return {
    pathVertices,
    totalDistance,
    numVertices,
  }
}

export const getPathVertex = (pathVertices: PathVertex[], percentage: number) => {
  const numVertices = pathVertices.length;
  let prevIndex: number, nextIndex: number;

  if (percentage === 1) {
    prevIndex = numVertices - 2;
    nextIndex = numVertices - 1;
  } else {
    prevIndex = Math.floor(percentage * numVertices);
    nextIndex = Math.min(prevIndex + 1, numVertices - 1);
  }

  const prevVertex = pathVertices[prevIndex];
  const nextVertex = pathVertices[nextIndex];

  // percentage of each segment
  const pSegment = 1 / numVertices;

  const lerpFactor = (percentage - prevIndex * pSegment) / pSegment;

  const position = new Vector3().lerpVectors(prevVertex.position, nextVertex.position, lerpFactor);
  const direction = new Vector3().lerpVectors(prevVertex.direction, nextVertex.direction, lerpFactor).normalize();
  const rotation = new Quaternion().slerpQuaternions(prevVertex.addedQuaternion, nextVertex.addedQuaternion, lerpFactor);

  return {
    position,
    direction,
    rotation,
  }
}