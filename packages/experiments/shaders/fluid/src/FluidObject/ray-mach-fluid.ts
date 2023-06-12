export const rayMarchFluid = /*glsl*/ `

// RAYMARCHING VARIABLES
#define SURFACE_DIST 0.05

// STRUCTS
struct RayHit {
  float dist;
};

struct RayResult {
  bool hit;
  vec3 position;
  float distance;
  RayHit rayHit;
};

// RAYMARCHING DIST FUNCTIONS
float sdPlane(vec3 p, vec3 normal) {
  return dot(normal, p);
}

// TRASNFORMATIONS
vec3 Translate(in vec3 p, in vec3 t) {
  return p - t;
}

vec3 getObjectSize() {
  return vec3(
    vBoundsMax.x - vBoundsMin.x,
    vBoundsMax.y - vBoundsMin.y,
    vBoundsMax.z - vBoundsMin.z
  );
}

vec3 getObjectCenter () {
  return vec3(
    (vBoundsMax.x + vBoundsMin.x) / 2.0,
    (vBoundsMax.y + vBoundsMin.y) / 2.0,
    (vBoundsMax.z + vBoundsMin.z) / 2.0
  );
}

float cutOnPi(float value) {
  return mod(value + PI, PI * 2.0) - PI;
}

float getWave(vec3 p) {

  vec2 fluidRotationForce = vFluidRotationForce; // xz
  // fluidRotationForce = vec2(0.5, 0.0); // debug

  vec3 objectSize = getObjectSize();
  float XZLength = length(vec2(objectSize.x, objectSize.z));
  float maxLenght = max(objectSize.x, objectSize.z);
  vec3 objectCenter = getObjectCenter();

  float forceLength = length(fluidRotationForce);

  if(forceLength < 0.001) {
    return 0.0;
  }

  vec2 forceDirection = normalize(fluidRotationForce);

  vec2 waveOrigin = objectCenter.xz + forceDirection * maxLenght / 2.0;

  // angle between the force direction and the x axis
  float angle = atan(forceDirection.y, forceDirection.x);

  mat3 rotationMatrix = mat3(
    cos(angle), 0.0, -sin(angle),
    0.0, 1.0, 0.0,
    sin(angle), 0.0, cos(angle)
  );

  // Apply the rotation to p
  vec3 rotatedP = rotationMatrix * p;
  // This can be optimized, feel free to open a PR, I just wont
  vec2 rotatedWaveOrigin = (rotationMatrix * vec3(waveOrigin.x, 0.0, waveOrigin.y)).xz;

  float distToWave = maxLenght / 2.0 - rotatedP.x;

  float vaweHeight = 0.1 * forceLength;
  float waveAmplitude = 0.5;
  float wavePow = pow(distToWave, 0.5) * waveAmplitude;
  float wavePos = wavePow * 10.0;
  float waveOffset = cutOnPi(fFluidNoise);
  float wave = sin(wavePos + waveOffset) * vaweHeight;

  return wave;
}

// This function will return the closest point in the scene for any given point p
RayHit getScene(vec3 p) {

  float waterYPos = valueRemap(fFilled, 0.0, 1.0, vBoundsMin.y, vBoundsMax.y);
  
  vec3 waterP = Translate(p, vec3(0.0, waterYPos, 0.0));
  waterP = Translate(waterP, vec3(0.0, getWave(waterP), 0.0));
  RayHit floorSurace = RayHit(sdPlane(waterP, vec3(0.0, 1.0, 0.0)));

  return floorSurace;
}

RayResult castRay(
  vec3 origin,
  vec3 direction,
  float maxDistance
) {
  vec3 p = origin;
  float totalDistance = 0.0;
  bool isHit = false;
  RayHit hitPoint;

  for(int i = 0; i < iMaxSteps; i++) {
    hitPoint = getScene(p);
    float distToEdge = maxDistance - totalDistance;

    if(distToEdge < SURFACE_DIST) {
      break;
    }

    float distToSurface = min(hitPoint.dist, distToEdge);
    if(distToSurface < SURFACE_DIST) {
      isHit = true;
      break;
    };

    totalDistance += distToSurface;
    p = origin + totalDistance * direction;
  }
  return RayResult(isHit, p, totalDistance, hitPoint);
}

vec4 rayMarchFluid(float maxDistance, vec3 viewDirection) {
  vec3 rayPosition = wPos;
  vec3 rayDirection = -viewDirection;

  RayResult hit = castRay(
    rayPosition,
    rayDirection,
    maxDistance
  );

  if (hit.hit) {
    // calculate color
    float traveledInLiquid = maxDistance - hit.distance;
    float transparency = (traveledInLiquid / (0.5 / fFluidDensity));
    transparency = clamp(transparency, 0.0, 1.0);
    transparency = pow(transparency, 1.0);
    return vec4(vFluidColor, transparency);
  }

  return vec4(0.0, 0.0, 0.0, 0.0);

}

`