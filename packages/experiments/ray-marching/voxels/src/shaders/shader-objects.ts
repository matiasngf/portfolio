export const shaderObjects = `

vec3 portal1Center = vec3(-4.0, 0.0, -8.0);
vec3 portal2Center = vec3(4.0, 0.0, -8.0);

vec3 pPortal1(vec3 p) {
  return Translate(p, portal1Center);
}

vec3 pPortal2(vec3 p) {
  return Translate(p, portal2Center);
}

Material DebugMaterial = Material(
  vec3(0.0, 0.0, 1.0),
  0.0, 0.0
);

Material PortalDebugMaterial = Material(
  vec3(0.0, 0.0, 1.0),
  0.0, 0.0
);

RayHit PortalSurfRay(vec3 p) {
  return RayHit(
    sdCube2(p, vec3(-1.0, 0.0, 0.0), vec3(1.0, 2.5, -0.22)),
    PortalDebugMaterial
  );
}

Portal PortalSurface(vec3 p, vec3 center, vec3 translation, vec3 rotation) {
  return Portal(
    PortalSurfRay(p),
    center,
    translation,
    rotation
  );
}

Portal Portal1(vec3 p) {
  return PortalSurface(pPortal1(p), portal1Center, portal2Center, vec3(0.0, 180.0, 0.0));
}

Portal Portal2(vec3 p) {
  return PortalSurface(pPortal2(p), portal2Center, portal1Center, vec3(0.0, 180.0, 0.0));
}

RayHit PortalPlatform(vec3 p) {
  Material PortalPlatformMaterial = Material(
    vec3(0.9, 0.9, 0.9),
    0.9, 0.2
  );
  RayHit BaseSurface = RayHit(
    sdCube2(p, vec3(-2.5, 0.0, -2.5), vec3(2.5, 0.05, 2.5)),
    PortalPlatformMaterial
  );
  RayHit FrameSurface = RayHit(
    sdCube2(p, vec3(-1.5, 0.0, 0.0), vec3(1.5, 3.0, -0.5)),
    PortalPlatformMaterial
  );
  return SmoothMin(BaseSurface, FrameSurface, 0.5);
}

Material WallMaterial = Material(
  vec3(1.0, 1.0, 1.0),
  0.9, 0.0
);

RayHit WallSurface(vec3 p) {
  return RayHit(
    sdCube2(p, vec3(-2.5, 0.0, -0.2), vec3(2.5, 3.0, 0.2)),
    WallMaterial
  );
}

RayHit HouseSurface(vec3 p) {
  RayHit r = Union(
    WallSurface(Translate(
      p, vec3(0.0, 0.0, -2.5)
    )),
    WallSurface(
      Translate((
        Rotate(p, vec3(0.0, 90.0, 0.0))
      ), vec3(0.0, 0.0, -2.5))
    )
  );
  r = Union(
    r,
    WallSurface(
      Translate((
        Rotate(p, vec3(0.0, 90.0, 0.0))
      ), vec3(0.0, 0.0, 2.5))
    )
  );
  return r;
}

RayHit FloorSurface(vec3 p) {
  Material FloorMaterial = Material(
    vec3(0.741,0.576,0.4),
    0.0,
    0.0
  );
  return RayHit(
    sdPlane(p, vec3(0.0, 1.0, 0.0)),
    WallMaterial
  );
}

RayHit BallSurface(vec3 p, float radius) {
  Material BallMaterial = Material(
    vec3(0.5, 0.9, 0.5),
    0.9, 0.6
  );
  return RayHit(
    sdSphere(p, radius),
    BallMaterial
  );
}
`;