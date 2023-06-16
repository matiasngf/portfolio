import { rotate, valueRemap } from "../utils/shader-utils";

export const branchVertexShader = /*glsl*/ `

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

uniform PathVertex pathVertices[NUM_VERTICES];
uniform float totalDistance;
uniform float progress;

varying vec2 vUv;
varying vec3 worldPos;
varying vec3 localPos;
varying float targetFactor;

${rotate}

// TODO: split this into two function
PathPos getPositionOnPath(float percentage) {
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

  // vec4 rotation = getQuaternionFromVectors(direction, vec3(0.0, 1.0, 0.0));
  // vec4 rotation = pathVertices[iPrev].addedQuaternion;

  //mix quaterions
  vec4 rotation = mix(pathVertices[iPrev].addedQuaternion, pathVertices[iNext].addedQuaternion, t);

  return PathPos(
    position,
    direction,
    rotation
  );
}

void main() {
  localPos = position + vec3(0.0, 0.5, 0.0);
  targetFactor = localPos.y;

  // move vertices to y = 0
  vec3 targetPos = position * vec3(0.02, 0.0, 0.02);
  
  //translate to path
  PathPos pathPosition = getPositionOnPath(targetFactor * progress);

  // rotate the Y axis to the direction
  targetPos = qtransform(pathPosition.rotation, targetPos);

  // move to pos
  targetPos += pathPosition.position;


  vUv = uv;
  worldPos = (modelMatrix * vec4(targetPos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(targetPos, 1.0);
}

`;

export const branchFragmentShader = /*glsl*/ `

out vec4 fragColor;

varying vec3 worldPos;
varying vec2 vUv;
varying float targetFactor;
varying vec3 localPos;

uniform float totalDistance;
uniform float progress;

${valueRemap}

void main() {
  vec3 result = vec3(0.0);

  vec3 green = vec3(0.0, 1.0, 0.0);

  result = green;

  float totalLenght = totalDistance * progress;
  float currentLenght = localPos.y * totalLenght;
  float growOffset = 0.1;
  float growEnd = totalLenght - growOffset;

  float growFactor = clamp((1. - localPos.y) * 3., 0., 1.);

  result.y = growFactor;

  fragColor = vec4(result, 1.0);
}
`;