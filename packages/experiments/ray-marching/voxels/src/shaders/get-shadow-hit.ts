export const getShadowHit = `
// TODO: refactor
float getShadowHit(vec3 origin, vec3 normal, RayConfig rayConfig) {
  return 1.0;
  if(dot(lightDirection, normal) < 0.5) {
    return 1.0;
  }
  origin = origin + lightDirection * 0.05;
  RayResult hit = castRay(
    origin,
    lightDirection,
    rayConfig.maxDistance,
    rayConfig.surfaceDistance,
    rayConfig.maxSteps
  );

  // float distanceBias = 0.5;
  // float lowerFactor = clamp(hit.lowerHitPoint.dist, 0.0, distanceBias);
  // return valueRemap(lowerFactor, 0.0, distanceBias, 0.0, 1.0);

  if(hit.hit) {
    float hitDistance = length(origin - hit.position);
    float shadowFactor = clamp(hitDistance / 10.0, 0.0, 1.0);
    return pow(shadowFactor, 0.2);
  } else {
    return 1.0;
  }
}
`;