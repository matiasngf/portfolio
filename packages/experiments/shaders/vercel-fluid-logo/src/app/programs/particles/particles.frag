precision highp float;

uniform vec3 uColor;
uniform float uTriangleRadius;

varying vec2 vParticleUv;
varying vec2 vOriginalPosition;
varying float vPointSizeWorld;

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

  // Convert to world space offset
  // The aspect ratio corrections cancel out: NDC_x * aspect = world_x
  // Since vPointSizeWorld is based on Y resolution, and screen pixels are square,
  // both X and Y use the same scale factor
  vec2 worldOffset = pointCoordOffset * vPointSizeWorld;

  // Calculate world position of this pixel relative to original particle position
  vec2 pixelWorldPos = vOriginalPosition + worldOffset;

  // Calculate SDF for triangle at this pixel's world position
  float sdf = sdEquilateralTriangle(pixelWorldPos, uTriangleRadius);

  // Debug colors: green inside triangle, red outside
  vec3 color = sdf < 0.0 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);

  // Discard pixels outside the circle shape of the point
  float dist = length(pointCoordOffset);
  if (dist > 0.5) discard;

  gl_FragColor = vec4(color, 1.0);
}

