precision highp float;

attribute vec3 position;
attribute vec2 particleUv;

uniform sampler2D uOffsetTexture;
uniform float uPointSize;
uniform float uScreenAspect;

varying vec2 vParticleUv;

void main() {
  vParticleUv = particleUv;

  // Sample offset from texture
  vec2 offset = texture2D(uOffsetTexture, particleUv).xy;

  // Apply offset to position
  vec3 displaced = position + vec3(offset, 0.0);

  // Correct for screen aspect ratio to maintain equilateral shape
  gl_Position = vec4(
    displaced.x / uScreenAspect,
    displaced.y,
    displaced.z,
    1.0
  );
  gl_PointSize = uPointSize;
}

