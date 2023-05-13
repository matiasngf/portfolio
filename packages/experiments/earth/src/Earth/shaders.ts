import {
  curveUp,
  perturbNormalArb,
  simplexNoise,
  valueRemap,
} from "../utils/shader-utils";

export const earthVertexShader = /*glsl*/ `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

void main() {
  vUv = uv;
  vNormal = normal;

  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const earthFragmentShader = /*glsl*/ `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;
uniform vec3 lightDirection;

const float PI = 3.141592653;

uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform sampler2D cloudMap;
uniform float uTime;

${valueRemap}
${perturbNormalArb}
${curveUp}
${simplexNoise}

float autoClamp(float value) {
  return clamp(value, 0.0, 1.0);
}

void main() {

  //setup
  vec3 vLightDirection = normalize(lightDirection);
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(cameraPosition - wPos);
  float distanceToCamera = length(cameraPosition - wPos);

  vec3 result = vec3(0.0);

  // diffuse color
  vec3 dayColor = texture2D(dayMap, vUv).rgb;
  float rawLambertFactor = dot(normal, vLightDirection);
  float lambertFactor = autoClamp(rawLambertFactor);

  // sun light
  float rawSunLightFactor = valueRemap(rawLambertFactor, -0.1, 0.1, 0.0, 1.0);
  float sunLightFactor = autoClamp(rawSunLightFactor);

  result = dayColor * sunLightFactor;

  // night map
  vec3 nightColor = texture2D(nightMap, vUv).rgb;
  float nightLightsFactor = autoClamp(valueRemap(rawSunLightFactor, 0.0, 0.15, 0.0, 1.0));
  nightColor = nightColor * (1.0 - nightLightsFactor); // lights only at night

  result += nightColor;

  // noise
  float rotation = uTime * 0.005;
  vec3 wPosOffset = wPos * mat3( cos(rotation), 0, sin(rotation), 0, 1, 0, -sin(rotation), 0, cos(rotation) );
  float noiseFactor = valueRemap(simplex3d_fractal(wPosOffset * 100.0), -1.0, 1.0, 0.0, 1.0);
  float distanceFactor = autoClamp(
    - distanceToCamera + 1.0
  );
  noiseFactor = noiseFactor * 0.5 * distanceFactor;

  // clouds
  float cloudFactor = length(texture2D(cloudMap, vUv).rgb);
  float cloudNoiseFactor = clamp(valueRemap(cloudFactor, 0.0, 0.5, 0.5, 1.0) * noiseFactor, 0.0, 1.0);
  cloudFactor = clamp(cloudFactor - cloudNoiseFactor, 0.0, 1.0);
  vec3 cloudColor = vec3(0.9);

  // clouds normals
  float cloudNormalScale = 0.01;
  vec3 cloudNormal = perturbNormalArb( wPos, normal, dHdxy_fwd(vUv, cloudMap, cloudNormalScale) );
  float cloudNormalFactor = dot(cloudNormal, vLightDirection);
  float cloudShadowFactor = clamp(
    valueRemap(cloudNormalFactor, 0.0, 0.3, 0.3, 1.0),
    0.3, 1.0
  );
  cloudShadowFactor = curveUp(cloudShadowFactor, 0.5);

  // clouds with shadows
  cloudColor *= cloudShadowFactor;

  // sunset
  float sunsetFactor = clamp(valueRemap(rawSunLightFactor, -0.1, 0.85, -1.0, 1.0), -1.0, 1.0);
  sunsetFactor = cos(sunsetFactor * PI) * 0.5 + 0.5;
  vec3 sunsetColor = vec3(0.525, 0.273, 0.249);

  // clouds with sunset
  float sunsetCloudFactor = pow(cloudFactor, 1.5) * sunsetFactor;
  cloudColor *= clamp(sunLightFactor, 0.1, 1.0);
  cloudColor = mix(cloudColor, sunsetColor, sunsetCloudFactor);

  // clouds on earth
  result = mix(result, cloudColor, cloudFactor);

  // fresnel
  float fresnelBias = 0.1;
  float fresnelScale = 0.5;
  float fresnelFactor = fresnelBias + fresnelScale * pow(1.0 - dot(normal, normalize(viewDirection)), 3.0);
  vec3 athmosphereColor = vec3(0.51,0.714,1.);

  // fresnel sunset
  vec3 athmosphereSunsetColor = vec3(1.0, 0.373, 0.349);
  float fresnelSunsetFactor = dot(-vLightDirection, viewDirection);
  fresnelSunsetFactor = valueRemap(fresnelSunsetFactor, 0.97, 1.0, 0.0, 1.0);
  fresnelSunsetFactor = autoClamp(fresnelSunsetFactor);
  athmosphereColor = mix(athmosphereColor, athmosphereSunsetColor, fresnelSunsetFactor);

  result = mix(result, athmosphereColor, fresnelFactor * sunLightFactor);

  result = clamp(result * 0.9, 0.0, 0.7);
  gl_FragColor = vec4(vec3(result), 1.0);
}

`;
