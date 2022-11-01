export const structs = `

struct Material {
  vec3 color;
  float glossiness;
  float reflectivity;
};

struct RayHit {
  float dist;
  Material material;
};

struct Portal {
  RayHit rayHit;
  vec3 portalCenter;
  vec3 portalTranslation;
  vec3 portalRotation;
};

struct RayResult {
  bool hit;
  vec3 position;
  RayHit rayHit;
  RayHit lowerHitPoint;
};

struct RayLightResult {
  vec3 color;
  float reflectFactor;
};

struct LightResult {
  vec3 color;
  vec3 normal;
  float reflectFactor;
};

struct RayConfig {
  float maxDistance;
  float surfaceDistance;
  int maxSteps;
};
`;

// https://www.shadertoy.com/view/3styDs
export const getNormal = `

// Normal calculation function (using gradient):
vec3 getNormal(in vec3 p) {
  vec3 GRADIENT_STEP = vec3(0.005, 0.0, 0.0);
  float gradientX = getSceneHit(p + GRADIENT_STEP.xyy).dist - getSceneHit(p - GRADIENT_STEP.xyy).dist;
  float gradientY = getSceneHit(p + GRADIENT_STEP.yxy).dist - getSceneHit(p - GRADIENT_STEP.yxy).dist;
  float gradientZ = getSceneHit(p + GRADIENT_STEP.yyx).dist - getSceneHit(p - GRADIENT_STEP.yyx).dist;
  return normalize(vec3(gradientX, gradientY, gradientZ));
}
`;

export const getLight = `
LightResult getLight(vec3 p, vec3 rd, RayHit hit) {
  vec3 viewDirection = -rd;
  Material hitMat = hit.material;
  vec3 normal = getNormal(p);
  
  // diffuse light
  float lambert = clamp(dot(normal, lightDirection), 0.0, 1.0);
  // global illumination
  lambert = clamp(lambert, 0.3, 1.0);
  vec3 vLambertLight = hitMat.color * lightColor * lambert;
  
  // specular light
  float specularExponent = pow(2.0, hitMat.glossiness * 10.0) + 20.0;
  vec3 halfVector = normalize(lightDirection + viewDirection);
  float specular = max(dot(halfVector, normal), 0.0);
  specular = pow(specular, specularExponent);
  specular = specular * smoothstep(0.0, 1.0, lambert * 2.0);
  specular = specular * hitMat.glossiness;
  vec3 vSpecularLight = lightColor * specular;

  // combining the two lights
  vec3 light = vLambertLight;

  return LightResult(
    light,
    normal,
    hitMat.reflectivity
  );
}
`;

export const distanceFunctions = `
vec3 getClosestVoxel(vec3 p) {
  return round(p / VOXEL_SIZE) * VOXEL_SIZE;
}

float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float sdPlane(vec3 p, vec3 normal) {
  return dot(normal, p);
}

// sdCuboid(), sdCone(), and sdCylinder() are taken from Inigo Quilez's 3D distance functions article (https://iquilezles.org/articles/distfunctions):
float sdCuboid(in vec3 p, in vec3 size) {
  float w = size.x;
  float h = size.y; 
  float d = size.z;
  vec3 q = abs(p) - 0.5 * vec3(w, h, d);
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdCone(in vec3 p, in float b, in float h) {
  p.y -= h;
  vec2 q = h * vec2(b / h * 2.0, -2.0);
  
  vec2 w = vec2( length(p.xz), p.y );
  vec2 a = w - q * clamp(dot(w, q) / dot(q, q), 0.0, 1.0);
  vec2 c = w - q * vec2(clamp(w.x / q.x, 0.0, 1.0), 1.0);
  float k = sign(q.y);
  float d = min(dot(a, a), dot(c, c));
  float s = max(k * (w.x * q.y - w.y * q.x), k * (w.y - q.y));
  return sqrt(d) * sign(s);
}

float sdCylinder(in vec3 p, in float h, in float r) {
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, 0.5 * h);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}


float sdCube2(in vec3 p, in vec3 a, in vec3 b) {
  vec3 maxA = vec3( max(a.x, b.x), max(a.y, b.y), max(a.z, b.z) );
  vec3 minB = vec3( min(a.x, b.x), min(a.y, b.y), min(a.z, b.z) );
  float w = maxA.x - minB.x;
  float h = maxA.y - minB.y;
  float d = maxA.z - minB.z;
  float offsetW = (maxA.x + minB.x) * 0.5;
  float offsetH = (maxA.y + minB.y) * 0.5;
  float offsetD = (maxA.z + minB.z) * 0.5;
  return sdCuboid(
    Translate(p, vec3(offsetW, offsetH, offsetD)),
    vec3(w, h, d));
}

`;

export const transformations = `
// From https://www.shadertoy.com/view/3styDs
vec3 Translate(in vec3 p, in vec3 t) {
  return p - t;
}
vec3 Rotate(in vec3 p, in vec3 r) {
  vec3 rad = radians(-r);
  vec3 cosRad = cos(rad);
  vec3 sinRad = sin(rad);

  mat3 xRotation = mat3(1.0,      0.0,       0.0,
                        0.0, cosRad.x, -sinRad.x,
                        0.0, sinRad.x,  cosRad.x);

  mat3 yRotation = mat3( cosRad.y, 0.0, sinRad.y,
                              0.0, 1.0,      0.0,
                        -sinRad.y, 0.0, cosRad.y);

  mat3 zRotation = mat3(cosRad.z, -sinRad.z, 0.0,
                        sinRad.z,  cosRad.z, 0.0,
                             0.0,       0.0, 1.0);

  return zRotation * yRotation * xRotation * p;
}

vec3 RotateArround(in vec3 p, in vec3 r, in vec3 center) {
  p = p - center;
  p = Rotate(p, r);
  p = p + center;
  return p; 
}

vec3 Scale(in vec3 p, in vec3 s) {
  return p / s;
}
`;

export const valueRemap = `
float valueRemap(float value, float min, float max, float newMin, float newMax) {
  return newMin + (newMax - newMin) * (value - min) / (max - min);
}
`