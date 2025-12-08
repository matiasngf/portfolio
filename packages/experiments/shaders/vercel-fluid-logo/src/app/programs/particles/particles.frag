precision highp float;

uniform vec3 uColor;
uniform float uTriangleRadius;

varying vec2 vParticleUv;
varying vec2 vOriginalPosition;
varying float vPointSizeWorld;
varying vec2 vOffset;
varying float vTransitionFactor;

float sdEquilateralTriangle(vec2 p, float r) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}

void main() {
  // Calculate pixel offset from particle center in world space
  // Note: gl_PointCoord.y is inverted (0 at top, 1 at bottom), so flip it
  vec2 pointCoordOffset = gl_PointCoord - vec2(0.5);
  pointCoordOffset.y = -pointCoordOffset.y;

  // Distance from particle center (0 at center, 0.5 at edge)
  float distFromCenter = length(pointCoordOffset);

  // Discard pixels outside the circle shape of the point
  if (distFromCenter > 0.5) discard;

  // Convert to world space offset
  vec2 worldOffset = pointCoordOffset * vPointSizeWorld;

  // Calculate world position of this pixel relative to original particle position
  vec2 pixelWorldPos = vOriginalPosition + worldOffset;

  // Calculate SDF for triangle at this pixel's world position
  float sdf = sdEquilateralTriangle(pixelWorldPos, uTriangleRadius);

  // Red channel: outside triangle (sdf >= 0)
  // Green channel: inside triangle (sdf < 0)
  float red = sdf >= 0.0 ? 1.0 : 0.0;
  float green = sdf < 0.0 ? 1.0 : 0.0;

  // Blue channel: mixed SDF based on displacement (transition factor from vertex shader)
  // - When close to origin: 1.0 (won't get blobbed)
  // - When displaced: radial gradient from 2.0 at center to 0.0 at edge
  // Circular gradient: 2.0 at center (distFromCenter=0), 0.0 at edge (distFromCenter=0.5)
  float circularGradient = 1.0 - 2.0 * distFromCenter;
  circularGradient = clamp(circularGradient, 0.0, 1.0);

  // Mix between 1.0 (triangle mode) and circular gradient (blob mode)
  float blue = mix(green * 2.0, circularGradient, vTransitionFactor);

  gl_FragColor = vec4(red, green, blue, 1.0);
}

