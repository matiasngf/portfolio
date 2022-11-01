export const shaderObjects = `
Material DebugMaterial = Material(
  vec3(0.0, 0.0, 1.0),
  0.0, 0.0
);

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

Material GrassMaterial = Material(
  vec3(0.2, 0.5, 0.2),
  0.2, 0.0
);

RayHit GrassObject(vec3 p) {
  float grassHeight = 2.0;
  float grassWidth = 10.0;
  return RayHit(
    sdCube2(
      p,
      vec3(-grassWidth, -grassHeight, -grassWidth),
      vec3(grassWidth, 0.0, grassWidth)
    ),
    GrassMaterial
  );
}

Material WoodMaterial = Material(
  vec3(0.5, 0.3, 0.1),
  0.9, 0.0
);

RayHit LogObject(vec3 p) {
  float logRadius = 0.9;
  float logHeight = 10.0;
  float d = sdCylinder(p, logHeight, logRadius);
  return RayHit(d, WoodMaterial);
}

RayHit CampLogs(vec3 p) {
  RayHit Logs;
  int numLogs = 4;
  p = Translate(p, getClosestVoxel(vec3(0.0, 1.2, 0.0)));
  for(int i = 0; i < numLogs; i++) {
    float logPercentage = float(i) / float(numLogs);
    float angle = logPercentage * 180.0;
    vec3 pRotated = p;
    pRotated = Rotate(pRotated, vec3(0.0, angle, 0.0));
    pRotated = Rotate(pRotated, vec3(0.0, 0.0, 90.0));
    RayHit NewLog = LogObject(pRotated);
    if (i == 0) {
      Logs = NewLog;
    } else {
      Logs = Union(Logs, NewLog);
    }
  }
  return Logs;
}

Material FireMaterial = Material(
  vec3(0.9, 0.2, 0.1),
  0.9, 0.0
);

Material FireMaterialB = Material(
  vec3(0.9, 0.5, 0.0),
  0.9, 0.0
);

RayHit FlameObject(vec3 p, float flRadius) {
  p = Translate(p, getClosestVoxel(vec3(0.0, flRadius, 0.0)));
  RayHit Flame;
  Flame = RayHit(
    sdSphere(p, flRadius),
    FireMaterial
  );
  Flame = SmoothMin(Flame, RayHit(
    sdSphere(Translate(p, vec3(0.0, flRadius * 1.3, 0.0)), flRadius / 2.0),
    FireMaterialB
  ), 2.0);
  Flame = opDisplace(Flame, p, 0.3, 2.0);
  return Flame;
}

RayHit FireObject(vec3 p) {
  float fireRadius = 2.0;
  p = Translate(p, getClosestVoxel(vec3(0.0, 1.2, 0.0)));
  RayHit Fire;
  Fire = FlameObject(p, fireRadius);
  return Fire;
}

`;