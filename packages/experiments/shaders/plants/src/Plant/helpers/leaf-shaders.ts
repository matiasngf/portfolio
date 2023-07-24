import { rotate, valueRemap } from "../../utils/shader-utils";
import { getPositionOnPath, pathStructs, pathUniforms } from "../../utils/shaders/paths";

export const leafVertexShader = /* glsl */ `

${pathStructs}
${pathUniforms}

uniform float tStart;
uniform float tEnd;

${rotate}
${getPositionOnPath}
${valueRemap}

void main() {

  float branchletProgress = valueRemap(progress, tStart, tEnd, 0.0, 1.0);
  float branchletGrowOffset = branchGrowOffset * 0.2;
  branchletProgress = clamp(branchletProgress, 0.0, 1.0);
  float currentGrow = totalDistance * branchletProgress;

  // scale the leaf
  vec3 targetPos = position * branchletProgress * 1.5;
  PathPos pathPosition = getPositionOnPath(branchletProgress);

  // rotate the Y axis to the direction
  vec4 rotation = getQuaternionFromVectors(pathPosition.direction, vec3(1.0, 0.0, 0.0));
  targetPos = qtransform(rotation, targetPos);

  // move to pos
  targetPos += pathPosition.position;

  vec3 worldPos = (modelMatrix * vec4(targetPos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(targetPos, 1.0);

}

`

export const leafFragmentShader = /* glsl */ `
out vec4 fragColor;

void main() {
  vec3 result = vec3(0.0, 0.5, 0.0);
  fragColor = vec4(result, 1.0);
}

`