import { valueRemap } from "../utils/shader-utils"
import { rayMarchFluid } from "./ray-mach-fluid"

export const fluidVertexShader = /*glsl*/`

varying vec3 vNormal;
varying vec3 wPos;
varying vec2 screenSpaceUV;

void main() {
  vNormal = normal;

  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  screenSpaceUV = (vec2(gl_Position.xy / gl_Position.w) + 1.0) / 2.0;
}

`

export const fluidFragmentShader = /*glsl*/`

/** Percentage of container filled by water from 0 to 1 */
uniform float fFilled;
/** Intencity of general waves */
uniform float fFluidNoise;
/** Direction and intensity of waves */
uniform  vec2 vFluidRotationForce;
uniform float fTime;

uniform vec3 vBoundsMin;
uniform vec3 vBoundsMax;

uniform float nearPlane;
uniform float farPlane;

uniform vec3 vFluidColor;
uniform float fFluidDensity;
uniform sampler2D depthTexture;

varying vec3 vNormal;
varying vec3 wPos;
varying vec2 screenSpaceUV;

${valueRemap}

${rayMarchFluid}

void main() {
  // setup
  vec3 result = vFluidColor;
  float resultAlpha = 1.0;

  // depth
  vec3 viewDirection = normalize(cameraPosition - wPos);
  float distanceToCamera = length(cameraPosition - wPos);
  float sceneDepth = texture2D(depthTexture, screenSpaceUV).r;
  float linearDepth = valueRemap(sceneDepth, 0.0, 1.0, nearPlane, farPlane);
  // distance from the current face to the next face
  float objectDepth = linearDepth - distanceToCamera;

  // discard the pixel if the depth is negative
  // if (objectDepth < 0.0) {
  //   discard;
  // }

  gl_FragColor = rayMarchFluid(objectDepth, viewDirection);

  // gl_FragColor = vec4(vec3(objectDepth), 1.0);

}

`
