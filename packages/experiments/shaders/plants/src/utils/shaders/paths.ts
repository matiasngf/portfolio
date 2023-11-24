export const pathStructs = /* glsl */ `
struct PathVertex {
  vec3 position;
  float distance;
  vec3 direction;
  // quaternion rotation
  vec4 rotation;
  vec4 addedQuaternion;
};

struct PathPos {
  vec3 position;
  vec3 direction;
  vec4 rotation;
};
`

export const pathUniforms = /* glsl */ `
uniform PathVertex pathVertices[NUM_VERTICES];
uniform float totalDistance;
uniform float progress;
uniform float branchRadius;
uniform float branchGrowOffset;
`

export const getPositionOnPath = /* glsl */ `
PathPos getPositionOnPath(float percentage) {

  percentage = clamp(percentage, 0.0, 1.0);

  // Calculate the target distance along the path
  float targetDistance = percentage * totalDistance;
  
  // Find the index of the vertices
  // indexPrev ------> iNext
  int iNext = 1;
  float traveledDistance = pathVertices[1].distance;
  while (traveledDistance < targetDistance) {
    if (iNext == NUM_VERTICES - 1) {
      // reached the end of the path
      break;
    }
    iNext++;
    traveledDistance += pathVertices[iNext].distance;
  }
  int iPrev = max(0, iNext - 1);

  // Get the two adjacent vertices
  vec3 posPrev = pathVertices[iPrev].position;
  vec3 posNext = pathVertices[iNext].position;

  float distancePrevToNext = pathVertices[iNext].distance;

  // Calculate the interpolation factor based on distances
  // 0 ------ tDist ------ offsetDist
  float offsetDist = traveledDistance - distancePrevToNext;
  float tDist = targetDistance - offsetDist;
  float t = tDist / distancePrevToNext;

  // Interpolate the position
  vec3 position = mix(posPrev, posNext, t);

  // Calculate the direction as the normalized direction between the two vertices
  vec3 direction = mix(pathVertices[iPrev].direction, pathVertices[iNext].direction, t);

  //mix quaterions
  vec4 rotation = mix(pathVertices[iPrev].addedQuaternion, pathVertices[iNext].addedQuaternion, t);

  return PathPos(
    position,
    direction,
    rotation
  );
}
`