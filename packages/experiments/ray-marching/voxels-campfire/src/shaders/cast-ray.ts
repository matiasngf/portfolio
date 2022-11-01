export const castRay = `
RayResult castRay(
  vec3 ro,
  vec3 rd,
  float maxDistance,
  float surfaceDistance,
  int maxSteps
) {
  float d0 = 0.0;
  RayHit hitPoint = getSceneHit(ro);
  RayHit lowerHitPoint = hitPoint;
  for(int i = 0; i < maxSteps; i++) {
    vec3 p = ro + d0 * rd;
    hitPoint = getSceneHit(p);
    d0 += hitPoint.dist;
    if(hitPoint.dist < lowerHitPoint.dist) {
      lowerHitPoint = hitPoint;
    }
    if(hitPoint.dist < surfaceDistance || d0 > maxDistance) {
      break;
    };
  }
  bool isHit = hitPoint.dist < surfaceDistance;
  vec3 p = ro + d0 * rd;
  return RayResult(isHit, p, hitPoint, lowerHitPoint);
}`;