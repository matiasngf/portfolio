export const atmosphereVertexShader = /*glsl*/ `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

void main() {
  vUv = uv;
  vNormal = normal;

  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const atmosphereFragmentShader = /*glsl*/ `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

uniform vec3 lightDirection;

float valueRemap(float value, float min, float max, float newMin, float newMax) {
  return newMin + (newMax - newMin) * (value - min) / (max - min);
}

float autoClamp(float value) {
  return clamp(value, 0.0, 1.0);
}

void main() {

  //setup
  vec3 vLightDirection = normalize(lightDirection);
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(cameraPosition - wPos);
  vec3 lightColor = vec3(1.0, 1.0, 1.0);
  vec3 athmosphereColor = vec3(0.51,0.714,1.);
  vec3 sunsetColor = vec3(1.0, 0.373, 0.349);

  //lambert
  float rawLambert = dot(normal, vLightDirection);
  float lambert = clamp(rawLambert, 0.0, 1.0);

  // sun light
  float rawSunLight = valueRemap(rawLambert, 0.0, 0.2, 0.0, 1.0);
  float sunLight = clamp(rawSunLight, 0.0, 1.0);

  // athmosphere
  float fresnel = dot(-normal, viewDirection);
  fresnel = clamp(valueRemap(fresnel, 0.0, 0.25, 0.0, 1.0), 0.0, 1.0);
  fresnel = pow(fresnel, 4.0);

  // calculate sunset using dot product of sun direction and view direction
  float sunsetFactor = dot(-vLightDirection, viewDirection);
  sunsetFactor = valueRemap(sunsetFactor, 0.97, 1.0, 0.0, 1.0);
  sunsetFactor = autoClamp(sunsetFactor);

  vec3 result = mix(athmosphereColor, sunsetColor, sunsetFactor);

  gl_FragColor = vec4(vec3(result), 1.0);
  gl_FragColor.a = fresnel * sunLight;
}
`