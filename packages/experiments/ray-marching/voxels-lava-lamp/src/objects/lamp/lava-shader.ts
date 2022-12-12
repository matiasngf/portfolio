import { ShaderMaterial } from "three";

const LavaVertexShader = /*glsl*/`
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;
varying vec3 viewDirection;

void main() {
  vUv = uv;
  vNormal = normal;

  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  viewDirection = normalize(cameraPosition - wPos);
}
`;

const LavaFragmentShader = /*glsl*/`

// UNIFORMS
uniform float uTime;
uniform float uVoxelSize;
uniform bool uVoxels;

// RAYMARCHING STRUCTS
struct RayHit {
  float dist;
};
struct RayResult {
  bool hit;
  vec3 position;
  RayHit rayHit;
  // TODO: delete, this is only needed for soft shadows
  RayHit lowerHitPoint;
};

// RAYMARCHING VARIABLES
#define MAX_BOUNCES 5
#define MAX_STEPS 300
#define SURFACE_DIST 0.0002
#define MAX_DISTANCE 5.0

// VARYING VARIABLES
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;
varying vec3 viewDirection;

// RAYMARCHING DIST FUNCTIONS
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

// TRASNFORMATIONS
vec3 Translate(in vec3 p, in vec3 t) {
  return p - t;
}

// BOOLEAN FUNCTIONS
RayHit SmoothMin (RayHit hit1, RayHit hit2, float k) {
  // distance mix
  float d1 = hit1.dist;
  float d2 = hit2.dist;
  float h = max(k - abs(d1-d2), 0.0) / k;
  float d = min(d1, d2) - h*h*h*k*1.0/6.0;
  return RayHit(d);
}

// SCENE

RayHit BallSurface(vec3 p, float radius) {
  return RayHit(
    sdSphere(p, radius)
  );
}

float MIX_FACTOR = 0.2;

float getBounce(float fact) {
  return (cos(uTime / fact) - 0.5) * 2.0;
}

// This function will return the closest point in the scene for any given point p
RayHit getScene(vec3 p) {

  // Timings
  float cT1 = getBounce(5003.0);
  float cT2  = getBounce(9052.0);
  float cT3  = getBounce(15062.0);

  // Glboal deformation
  p = p + vec3(1.0, 0.0, 1.0) * cos((p.y + uTime / 30000.0) * 30.0) * 0.007;
  p = p + vec3(1.0, 0.0, 1.0) * cos(p.y * 20.0) * 0.01;
  p = p + vec3(0.0, 0.0, 1.0) * cos(p.x * 20.0) * 0.03;

  RayHit Scene;
  p = Translate(p, vec3(.0, 1.0, .0));
  RayHit BallObject_1 = BallSurface(Translate(p, vec3(cT1 / 60.0, cT2 / -5.0, 0.0)), 0.15);
  RayHit BallObject_2 = BallSurface(Translate(p, vec3(.1,.2 + cT1 / 5.0,.0)), 0.15);
  Scene = SmoothMin(BallObject_1, BallObject_2, MIX_FACTOR);
  
  RayHit BallObject_3 = BallSurface(Translate(p, vec3(.1,.5,.0)), 0.12);
  Scene = SmoothMin(Scene, BallObject_3, MIX_FACTOR);
  
  RayHit BallObject_4 = BallSurface(Translate(p, vec3(-.2,-.23 + cT2 / 20.0,.0)), 0.17);
  Scene = SmoothMin(Scene, BallObject_4, MIX_FACTOR);
  
  RayHit BaseBallObject = BallSurface(Translate(p, vec3(0.0, -0.75, 0.0)), 0.5);
  Scene = SmoothMin(Scene, BaseBallObject, MIX_FACTOR);
  return Scene;
}

// VOXEL FUNCTIONS


vec3 getClosestVoxel(vec3 p) {
  return round(p / uVoxelSize) * uVoxelSize;
}

float getSafeDist() {
  float safeDist = length(vec3(uVoxelSize));
  return safeDist;
}

float getQuadDist(vec3 p, vec3 quadCenter) {
  vec3 chunkP = quadCenter - p;
  if(getScene(quadCenter).dist > SURFACE_DIST) {
    return uVoxelSize;
  } else {
    return sdCuboid(chunkP, vec3(uVoxelSize));
  }
}

float getChunkDist(vec3 p, vec3 chunkCenter) {
  float minDist = uVoxelSize;
  for(int x = -1; x <= 1; x += 1) {
    for(int y = -1; y <= 1; y += 1) {
      for(int z = -1; z <= 1; z += 1) {
        vec3 quadCenter = chunkCenter + vec3(float(x) * uVoxelSize, float(y) * uVoxelSize, float(z) * uVoxelSize);
        minDist = min(minDist, getQuadDist(p, quadCenter));
      }
    }
  }
  return minDist;
}


// returns the closest hit to a voxel
RayHit getSceneHit(vec3 p) {
  RayHit Hit = getScene(p);
  if(!uVoxels) {
    return Hit;
  }
  RayHit SceneHit = Hit;
  float safeDist = getSafeDist();
  if(SceneHit.dist <= safeDist) {
    vec3 center = getClosestVoxel(p);
    SceneHit.dist = getChunkDist(p, center);
  } else {
    SceneHit.dist = max((SceneHit.dist - safeDist), SURFACE_DIST);
  }
  return SceneHit;
  // return Union(SceneHit, Hit);
}

// Runs after rayMarch
// The main rayMarching function, it will get the closest point in the scene
// then move the ray origin to that point and repeat until it hits something
// or it reaches the max distance
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
}

float distToVoxelEdge(vec3 p) {
  float dist = length(p) / uVoxelSize;
  dist = clamp(dist, 0.0, 1.0);
  dist = pow(dist, 2.0);
  return dist;
}

float isEdge(vec3 p) {
  float edgeLimit = 0.9;
  float zEdge = float(abs(p.z) / uVoxelSize * 2.0 > edgeLimit);
  float yEdge = float(abs(p.y) / uVoxelSize * 2.0 > edgeLimit);
  float xEdge = float(abs(p.x) / uVoxelSize * 2.0 > edgeLimit);
  float totalEdge = zEdge + yEdge + xEdge;
  return totalEdge > 1.0 ? 1.0 : 0.0;
}

// Calculate color of the material
vec3 getLight(vec3 p, vec3 rd, RayHit hit) {
  vec3 voxelCenter = getClosestVoxel(p);
  vec3 relativeP = p - voxelCenter;
  float distToEdge = distToVoxelEdge(relativeP);
  float pIsEdge = isEdge(relativeP);

  // colors
  vec3 topColor = vec3(1.0, 0.3, 0.3);
  vec3 topEdgeColor = vec3(.7, .0, .6);
  vec3 topColorResult = mix(topColor, topEdgeColor, distToEdge);

  vec3 bottomColor = vec3(1.0, 0.3, 0.9);
  vec3 bottomEdgeColor = bottomColor * 0.7;
  vec3 bottomColorResult = mix(bottomColor, bottomEdgeColor, distToEdge);

  vec3 edgeColor = mix(bottomColor, topColor, 0.5);

  float verticalFactor = 1.0 - pow((p.y - 0.5) * 2.0, 2.0);
  verticalFactor = clamp(verticalFactor, 0.0, 1.0);
  vec3 color = mix(topColorResult, bottomColorResult, verticalFactor);
  color = mix(color, edgeColor, pIsEdge);

  return color;
}

// Runs after main
// This function will use castRay to get a point in the scene where the ray hits
vec4 rayMarch() {
  vec3 rayPosition = wPos;
  vec3 rayDirection = -viewDirection;
  vec4 result = vec4(0.2);

  RayResult hit = castRay(
    rayPosition,
    rayDirection,
    MAX_DISTANCE,
    SURFACE_DIST,
    MAX_STEPS
  );

  if(hit.hit) {
    vec3 light = getLight(hit.position, rayDirection, hit.rayHit);
    result = vec4(light, 1.0);
  }

  return result;
}

// RUNS FIRST
void main() {
  vec4 color = rayMarch();
  gl_FragColor = vec4(color.xyz, 1.0);
  gl_FragColor.a = color.a;
}
`;

export const LavaMaterial = new ShaderMaterial({
  uniforms: {
    uTime: {value: 0},
    uVoxelSize: {value: 0.04},
    uVoxels: {value: true},
  },
  vertexShader: LavaVertexShader,
  fragmentShader: LavaFragmentShader,
  transparent: true,
});