export const rayHit = `
struct RayHit {
  float dist;
  vec3 color;
};
`;

export const booleanFunctions = `
RayHit Union(RayHit hit1, RayHit hit2) {
  if (hit1.dist < hit2.dist) {
      return hit1;
  } else {
      return hit2;
  }
}

RayHit Intersection(RayHit hit1, RayHit hit2) {
  if (hit1.dist > hit2.dist) {
      return hit1;
  } else {
      return hit2;
  }
}

RayHit Difference(RayHit hit1, RayHit hit2) {
  return Intersection(hit1, RayHit(-hit2.dist, hit2.color));
}

// Function by Sebastian Lague https://www.youtube.com/watch?v=Cp5WWtMoeKg&ab_channel=SebastianLague
RayHit SmoothMin (RayHit hit1, RayHit hit2, float k) {
  // distance mix
  float d1 = hit1.dist;
  float d2 = hit2.dist;
  float h = max(k - abs(d1-d2), 0.0) / k;
  float d = min(d1, d2) - h*h*h*k*1.0/6.0;

  // color mix
  float d3 = d1 + d2;
  float cMix = d1 / d3;
  vec3 c = mix(hit1.color, hit2.color, cMix);
  
  return RayHit(d, c);
}
`;

export const distanceFunctions = `
float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float sdPlane(vec3 p, vec3 normal) {
  return dot(normal, p);
}

// sdCuboid(), sdCone(), and sdCylinder() are taken from Inigo Quilez's 3D distance functions article (https://iquilezles.org/articles/distfunctions):
float sdCuboid(in vec3 p, in vec3 size) {
    float h = size.x; 
    float w = size.y;
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

vec3 Scale(in vec3 p, in vec3 s) {
  return p / s;
}
`;