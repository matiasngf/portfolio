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
varying float branchletProgress;

${rotate}
${getPositionOnPath}

${valueRemap}

float getGrowFactor(float bProgress) {
  float branchletGrowOffset = branchGrowOffset * 0.2;
  float totalLenght = totalDistance * bProgress;

  float currentLenght = localPos.y * totalLenght;
  float growEnd = totalLenght - branchletGrowOffset;

  float growFactor = (growEnd - currentLenght) / branchletGrowOffset + 1.;
  return growFactor;
}

void main() {
  localPos = position + vec3(0.0, 0.5, 0.0);
  targetFactor = localPos.y;
  
  //translate to path
  branchletProgress = valueRemap(progress, tStart, tEnd, 0.0, 1.0);
  branchletProgress = clamp(branchletProgress, 0.0, 1.0);
  PathPos pathPosition = getPositionOnPath(targetFactor * branchletProgress);

  // calculate grow factor
  growFactorRaw = getGrowFactor(branchletProgress);
  growFactor = clamp(growFactorRaw, branchletProgress > 0.1 ? 0.5 : 0., 1.0);
  float branchSize = branchRadius * 0.5 * growFactor;

  // move vertices to y = 0
  vec3 targetPos = position * vec3(branchSize, 0.0, branchSize);

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
varying float growFactor;
varying float branchletProgress;

uniform float totalDistance;
uniform float progress;
uniform sampler2D map;

void main() {
  vec2 mapUv = vec2(vUv.x * 2.0, localPos.y * branchletProgress * totalDistance * 4.);
  vec3 colorMap = texture2D(map, mapUv).rgb;

  fragColor = vec4(colorMap, 1.0);
}
`