import { valueRemap } from "../utils/shader-utils"

export const fluidVertexShader = /*glsl*/`

varying vec3 vNormal;
varying vec3 wPos;

void main() {
  vNormal = normal;

  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

`

export const fluidFragmentShader = /*glsl*/`

/** Percentage of container filled by water */
uniform float fFilled;
/** Intencity of general waves */
uniform float fFluidNoise;
/** Direction and intensity of waves */
uniform  vec2 vFluidRotationForce;

uniform vec3 vBoundsMin;
uniform vec3 vBoundsMax;

varying vec3 vNormal;
varying vec3 wPos;

${valueRemap}

void main() {

  float yFactor = valueRemap(wPos.y, vBoundsMin.y, vBoundsMax.y, 0.0, 1.0);

  gl_FragColor = vec4(0.0, yFactor, 0.0, 1.0);
}

`
