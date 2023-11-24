export const leafVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}

`

export const leafFragmentShader = /* glsl */ `
out vec4 fragColor;

uniform sampler2D leafTexture;
uniform float leafProgress;

varying vec2 vUv;

void main() {
  vec4 colorMap = texture2D(leafTexture, vUv).rgba;
  if (colorMap.a < 0.6) discard;
  
  vec3 result = colorMap.rgb;
  vec3 green = vec3(0.2, 0.5, 0.2);

  result = mix(green, result, leafProgress);

  fragColor = vec4(result, colorMap.a);
}

`