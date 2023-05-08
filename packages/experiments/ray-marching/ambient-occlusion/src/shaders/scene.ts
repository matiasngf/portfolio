export const getSceneHit = `
RayHit getSceneHit(vec3 p) {
  RayHit FloorObject = FloorSurface(p);
  vec3 pCenter = Translate(p, vec3(0.0, 0.0, 0.0));
  RayHit CenterObject = HouseSurface(
    pCenter
  );
  vec3 pBall = Translate(pCenter, vec3(
    .0,
    sin(uTime / 10.0) * 0.3 + 1.0,
    .0
  ));
  RayHit BallObject = BallSurface(pBall);
  RayHit SceneObject = Union(FloorObject, CenterObject);
  SceneObject = Union(SceneObject, BallObject);
  return SceneObject;
}
`;
