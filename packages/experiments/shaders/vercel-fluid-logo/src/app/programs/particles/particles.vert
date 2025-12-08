precision highp float;

attribute vec3 position;
attribute vec2 particleUv;

uniform sampler2D uOffsetTexture;
uniform float uPointSize;
uniform float uScreenAspect;
uniform vec2 uResolution;
uniform float uTransitionStart;
uniform float uTransitionDistance;

varying vec2 vParticleUv;
varying vec2 vOriginalPosition;
varying float vPointSizeWorld;
varying vec2 vOffset;
varying float vTransitionFactor;

void main() {
  vParticleUv = particleUv;
  vOriginalPosition = position.xy;

  // Sample offset from texture
  vec2 offset = texture2D(uOffsetTexture, particleUv).xy;
  vOffset = offset;

  // Calculate transition factor based on offset distance
  float offsetDistance = length(offset);
  vTransitionFactor = smoothstep(
    uTransitionStart,
    uTransitionStart + uTransitionDistance,
    offsetDistance
  );

  // Scale particle size: 1x at origin, 2x when fully transitioned
  float scaledPointSize = uPointSize * (1.0 + vTransitionFactor * 2.0);

  // Calculate point size in world units (NDC space is -1 to 1, so multiply by 2)
  vPointSizeWorld = scaledPointSize / uResolution.y * 2.0;

  // Apply offset to position
  vec3 displaced = position + vec3(offset, 0.0);

  // Correct for screen aspect ratio to maintain equilateral shape
  gl_Position = vec4(
    displaced.x / uScreenAspect,
    displaced.y,
    displaced.z,
    1.0
  );
  gl_PointSize = scaledPointSize;
}

