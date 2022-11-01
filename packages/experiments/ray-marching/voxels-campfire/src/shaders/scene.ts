export const getScene = `
RayHit getScene(vec3 p) {
  RayHit SceneObject;
  RayHit Grass = GrassObject(p);
  SceneObject = Grass;
  RayHit Logs = CampLogs(p);
  SceneObject = Union(SceneObject, Logs);
  RayHit Fire = FireObject(p);
  SceneObject = Union(SceneObject, Fire);
  return SceneObject;
}
`;