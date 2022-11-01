export const getSceneHit = `
vec3 getClosestVoxel(vec3 p) {
  return round(p / VOXEL_SIZE) * VOXEL_SIZE;
}

RayHit getScene(vec3 p) {
  vec3 pCenter = Translate(p, getClosestVoxel(vec3(0.0, 0.3, 0.0)));
  vec3 pBall = Translate(pCenter, (vec3(
    .0,
    sin(uTime / 10.0) * 10.0,
    .0
  )));

  RayHit FloorObject = FloorSurface(p);

  RayHit BallObject = BallSurface(pBall, 3.1);
  RayHit SceneObject = SmoothMin(
    BallObject,
    BallSurface(pCenter, 3.1),
    7.0
  );
  return SceneObject;
}

float getSafeDist() {
  float safeDist = length(vec3(VOXEL_SIZE));
  return safeDist;
}

float getQuadDist(vec3 p, vec3 quadCenter) {
  vec3 chunkP = quadCenter - p;
  if(getScene(quadCenter).dist > SURFACE_DIST) {
    return VOXEL_SIZE;
  } else {
    return sdCuboid(chunkP, vec3(VOXEL_SIZE));
  }
}

float getChunkDist(vec3 p, vec3 chunkCenter) {
  float minDist = VOXEL_SIZE;
  for(int x = -1; x <= 1; x += 1) {
    for(int y = -1; y <= 1; y += 1) {
      for(int z = -1; z <= 1; z += 1) {
        vec3 quadCenter = chunkCenter + vec3(float(x) * VOXEL_SIZE, float(y) * VOXEL_SIZE, float(z) * VOXEL_SIZE);
        minDist = min(minDist, getQuadDist(p, quadCenter));
      }
    }
  }
  return minDist;
}

RayHit getSceneHit(vec3 p) {
  RayHit Hit = getScene(p);
  // return Hit;
  RayHit SceneHit = Hit;
  float safeDist = getSafeDist();
  if(SceneHit.dist <= safeDist) {
    vec3 center = getClosestVoxel(p);
    SceneHit.dist = getChunkDist(p, center);
  } else {
    SceneHit.dist = max((SceneHit.dist - safeDist), SURFACE_DIST);
  }
  return SceneHit;
  return Union(SceneHit, Hit);
}
`;