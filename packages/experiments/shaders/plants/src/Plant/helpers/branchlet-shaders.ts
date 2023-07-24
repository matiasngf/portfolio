import { rotate, valueRemap } from "../../utils/shader-utils";
import { getPositionOnPath, pathStructs, pathUniforms } from "../../utils/shaders/paths";

export const branchletVertexShader = /* glsl */ `

${pathStructs}

${pathUniforms}

uniform float tStart;
uniform float tEnd;

varying vec2 vUv;
varying vec3 worldPos;
varying vec3 localPos;
varying float targetFactor;
varying float growFactorRaw;
varying float growFactor; // clamped

${rotate}
${getPositionOnPath}

${valueRemap}

float getGrowFactor() {
  float branchletProgress = valueRemap(progress, tStart, tEnd, 0.0, 1.0);
  float branchletGrowOffset = branchGrowOffset * 0.2;
  branchletProgress = clamp(branchletProgress, 0.0, 1.0);
  float totalLenght = totalDistance * branchletProgress;

  float currentLenght = localPos.y * totalLenght;
  float growEnd = totalLenght - branchletGrowOffset;

  float growFactor = (growEnd - currentLenght) / branchletGrowOffset + 1.;
  return growFactor;
}

void main() {
  localPos = position + vec3(0.0, 0.5, 0.0);
  targetFactor = localPos.y;

  // calculate grow factor
  growFactorRaw = getGrowFactor();
  growFactor = clamp(growFactorRaw, 0.0, 1.0);
  float branchSize = branchRadius * 0.3 * growFactor;

  // move vertices to y = 0
  vec3 targetPos = position * vec3(branchSize, 0.0, branchSize);
  
  //translate to path
  float branchletProgress = valueRemap(progress, tStart, tEnd, 0.0, 1.0);
  branchletProgress = clamp(branchletProgress, 0.0, 1.0);
  PathPos pathPosition = getPositionOnPath(targetFactor * branchletProgress);

  // rotate the Y axis to the direction
  targetPos = qtransform(pathPosition.rotation, targetPos);

  // move to pos
  targetPos += pathPosition.position;


  vUv = uv;
  worldPos = (modelMatrix * vec4(targetPos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(targetPos, 1.0);
}

`


export const branchletFragmentShader = /* glsl */ `
out vec4 fragColor;

varying vec3 worldPos;
varying vec2 vUv;
varying float targetFactor;
varying vec3 localPos;

uniform float totalDistance;
uniform float progress;
varying float growFactor;


void main() {
  vec3 result = vec3(0.0);

  vec3 green = vec3(0.0, 1.0, 0.0);

  result = green;

  result.y = growFactor;

  fragColor = vec4(result, 1.0);
}
`