import { rotate, valueRemap } from "../utils/shader-utils";
import { getPositionOnPath, pathStructs, pathUniforms } from "../utils/shaders/paths";

export const branchVertexShader = /*glsl*/ `

${pathStructs}

${pathUniforms}

varying vec2 vUv;
varying vec3 worldPos;
varying vec3 localPos;
varying float targetFactor;
varying float growFactorRaw;
varying float growFactor; // clamped

${rotate}
${getPositionOnPath}

float getGrowFactor() {
  float totalLenght = totalDistance * progress;
  float currentLenght = localPos.y * totalLenght;
  float growEnd = totalLenght - branchGrowOffset;

  float growFactor = (growEnd - currentLenght) / branchGrowOffset + 1.;
  return growFactor;
}

void main() {
  localPos = position + vec3(0.0, 0.5, 0.0);
  targetFactor = localPos.y;

  // calculate grow factor
  growFactorRaw = getGrowFactor();
  growFactor = clamp(growFactorRaw, 0.0, 1.0);
  float branchSize = branchRadius * growFactor;

  // move vertices to y = 0
  vec3 targetPos = position * vec3(branchSize, 0.0, branchSize);
  
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
varying float growFactor;

${valueRemap}

void main() {
  vec3 result = vec3(0.0);

  vec3 green = vec3(0.0, 1.0, 0.0);

  result = green;

  result.y = growFactor;

  fragColor = vec4(result, 1.0);
}
`;