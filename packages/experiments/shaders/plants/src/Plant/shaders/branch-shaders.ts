import { rotate, valueRemap } from "../../utils/shader-utils";
import { getPositionOnPath, pathStructs, pathUniforms } from "../../utils/shaders/paths";

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

float getGrowFactor(float p) {
  float totalLenght = totalDistance * p;
  float currentLenght = localPos.y * totalLenght;
  float growEnd = totalLenght - branchGrowOffset;

  float growFactor = (growEnd - currentLenght) / branchGrowOffset + 1.;
  return growFactor;
}

void main() {
  float clampedProgress = clamp(progress, 0.0, 1.0);
  localPos = position + vec3(0.0, 0.5, 0.0);
  targetFactor = localPos.y;

  // calculate grow factor
  growFactorRaw = getGrowFactor(clampedProgress);
  growFactor = clamp(growFactorRaw, 0.0, 1.0);
  float branchSize = branchRadius * growFactor;

  // move vertices to y = 0
  vec3 targetPos = position * vec3(branchSize, 0.0, branchSize);
  
  //translate to path
  PathPos pathPosition = getPositionOnPath(targetFactor * clampedProgress);

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
uniform sampler2D map;

${valueRemap}

void main() {
  float clampedProgress = clamp(progress, 0.0, 1.0);

  vec2 mapUv = vec2(vUv.x * 2.0, localPos.y * clampedProgress * totalDistance * 4.);
  vec3 colorMap = texture2D(map, mapUv).rgb;

  // result.y = growFactor;

  fragColor = vec4(colorMap, 1.0);
}
`;