

export const getAmbientOcclusion = `

vec3 getTangent(vec3 v) {
  vec3 forward = vec3(0.0, 0.0, 1.0);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 tangent = cross(v, forward);
  if(length(tangent) < 0.01) {
    tangent = cross(v, up);
  }
  return tangent;
}

#define AO_SAMPLES 3

// TODO: refactor
float getAmbientOcclusion(vec3 p, vec3 normal) {
  return 1.0;
  vec3 t = getTangent(normal);

  float sampleAngle = PI / 10.0;
  vec3 normal2 = rotate(normal, t, sampleAngle);
  float distToSurface = cos(sampleAngle);

  float aoM = float(AO_SAMPLES);

  float vecDistance = 0.5;

  for (int i = 0; i < AO_SAMPLES; i++) {
    float angle = float(i) * (PI * 2.0 / float(AO_SAMPLES));
    vec3 sampleVector = normalize(rotate(normal2, normal, angle));
    vec3 samplePoint = p + sampleVector * vecDistance;
    float d = getSceneHit(samplePoint).dist;
    d = valueRemap(d, 0.0, distToSurface * vecDistance, 0.3, 1.0);
    d = clamp(d, 0.0, 1.0);
    d = pow(d, 0.5);
    float sampleFactor = 1.0 - d;
    aoM -= sampleFactor / 4.0;
    // aoM = min(aoM , clamp(d, 0.4, 1.0));
  }
  return aoM / float(AO_SAMPLES);

  RayHit hit = getSceneHit(p + normal);
  float ao = hit.dist;
  ao = valueRemap(ao, 0.0, 1.0, 0.0, 1.0);
  return ao;
}
`;