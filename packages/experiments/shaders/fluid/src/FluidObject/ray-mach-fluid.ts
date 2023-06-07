export const rayMarchFluid = /*glsl*/ `
// RAYMARCHING VARIABLES
#define MAX_STEPS 300
#define SURFACE_DIST 0.0002

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

float getWave(vec3 p) {
  // config
  float maxWaveHeight = 0.04;
  float waveLength = 0.1;

  // vec2 fluidDirection = vec2(0.5, 0.0);
  vec2 fluidDirection = vFluidRotationForce;
  float dist = length(
    fluidDirection - vec2(p.x, p.z)
  );

  float fluidNoise = min(fFluidNoise, 2.0);

  return sin(dist * 7.0) * 0.06 * fluidNoise;

  float waveHeight = maxWaveHeight * fFluidNoise;
  // calcualte wave height based on sin wave
  // return waveHeight * sin(p.x / waveLength);

  

  // from 0 to 1, how much the wave is visible
  float waveFactor = 0.3 - p.x; 
  // add the dinamic noise
  waveFactor = fluidNoise;

  vec3 translatedP = Translate(p, vec3(fTime, 0.0, 0.0));
  float waveP = translatedP.x / waveLength;

  return maxWaveHeight * sin(waveP) * waveFactor;
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

  for(int i = 0; i < MAX_STEPS; i++) {
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
    transparency = pow(transparency, 0.6);
    return vec4(vFluidColor, transparency);
  }

  return vec4(0.0, 0.0, 0.0, 0.0);

}

`