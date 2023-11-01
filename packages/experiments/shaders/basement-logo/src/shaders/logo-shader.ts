import { Vector3 } from "three"
import { noise4d1 } from "./noise"
import { rgb, valueRemap } from "./utils"

export type LogoUniforms = {
  mousePosition: Vector3
  time: number
  transitionSize: number
  radius: number
  offsetDistance: number
  noiseSize: number
}

/** Utils */
const getOffsetFactor = /*glsl*/ `
float getOffsetFactor(vec3 pos) {
  float x = length(pos - mousePosition) - radius;
  x = x / transitionSize;
  x = clamp(x, 0.0, 1.0);

  return x;
}
`
/** Vertex shader */
export const logoVertexShader = /*glsl*/ `

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

uniform vec3 mousePosition;
uniform float transitionSize;
uniform float radius;
uniform float offsetDistance;

${getOffsetFactor}

void main() {
  vUv = uv;
  vNormal = normal;
  
  // calcualte world position
  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  
  // calculate offset
  float offsetFactor = getOffsetFactor(wPos);
  vec3 offsetDirection = normalize(position - mousePosition);
  vec3 offset = normal * offsetFactor * offsetDistance;

  // transform pos with offset
  vec3 pos = position;
  pos += offset;

  // recalculate world pos after transform
  wPos = (modelMatrix * vec4(pos, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

`
/** Fragment shader */
export const logoFragmentShader = /*glsl*/ `

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

uniform float time;
uniform vec3 mousePosition;
uniform float transitionSize;
uniform float radius;
uniform float noiseSize;

${noise4d1}
${rgb}
${valueRemap}
${getOffsetFactor}

void main() {
  // Recalculate offset factor with new world position
  float offsetFactor = pow(getOffsetFactor(wPos), 0.4);

  // generate 4D vector for noise, use time as 4th dimension
  vec4 noiseParam = vec4(wPos / noiseSize, time * 0.5);

  // Calculate noise and remap it from -1, 1 to 0, 1
  float noiseFactor = noise4d1(noiseParam);
  noiseFactor = noiseFactor * 0.5 + 0.5;

  // Create mask
  float maskFactor = valueRemap(offsetFactor, 0.0, 1.0, -0.01, 1.01);
  float noiseMask = smoothstep(maskFactor, maskFactor + 0.3, noiseFactor);
  noiseMask = clamp(noiseMask / (fwidth(noiseFactor) * 2.0), 0., 1.);
  noiseMask = offsetFactor > 0.99 ? 0.0 : noiseMask;
  noiseMask = offsetFactor < 0.1 ? 1.0 : noiseMask;
  
  // Discard pixel if noiseMask is too low
  if (noiseMask < 0.1) {
    discard;
  }
  noiseMask = clamp(noiseMask, 0.2, 1.0);

  // Border
  float borderSize = 0.2;
  float borderMask = noiseFactor - borderSize > maskFactor ? 1.0 : 0.0;
  borderMask = smoothstep(maskFactor, maskFactor + 0.01, noiseFactor - borderSize);
  borderMask = offsetFactor < 0.01 ? 1.0 : borderMask;
  
  // Color transition
  vec3 orange = rgb(255.0, 77.0, 0.0);
  vec3 white = vec3(0.95);
  vec3 result = mix(orange, white, borderMask);

  gl_FragColor = vec4(result, noiseMask);
}

`