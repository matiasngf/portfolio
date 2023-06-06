import { BackSide, ShaderMaterial } from "three";
import { Uniforms } from "../utils/uniforms";
import { valueRemap } from "../utils/shader-utils";

export interface DepthMaterialUniforms {
  nearPlane: number
  farPlane: number
}

export const createDepthMaterial = (uniforms: Uniforms<DepthMaterialUniforms>) => new ShaderMaterial({
  uniforms,
  vertexShader: depthMaterialVertexShader,
  fragmentShader: depthMaterialFragmentShader,
  side: BackSide,
});

const depthMaterialVertexShader = /*glsl*/`
${valueRemap}

uniform float nearPlane;
uniform float farPlane;

varying vec3 wPos;
varying highp float depth;
// varying highp float depth2;
// varying highp float depth3;

void main() {
  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  float distanceToCamera = length(cameraPosition - wPos);
  depth = valueRemap(distanceToCamera, nearPlane, farPlane, 0.0, 1.0);

}
`

const depthMaterialFragmentShader = /*glsl*/`
varying highp float depth;

void main() {
  gl_FragColor = vec4(vec3(depth), 1.0);
}
`
