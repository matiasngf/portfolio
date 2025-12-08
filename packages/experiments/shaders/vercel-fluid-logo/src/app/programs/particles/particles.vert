precision highp float;

attribute vec3 position;
attribute vec2 particleUv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform sampler2D uOffsetTexture;
uniform float uPointSize;

varying vec2 vParticleUv;

void main() {
  vParticleUv = particleUv;

  // Sample offset from texture
  vec2 offset = texture2D(uOffsetTexture, particleUv).xy;

  // Apply offset to position
  vec3 displaced = position + vec3(offset, 0.0);

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation
  gl_PointSize = uPointSize * (10.0 / -mvPosition.z);
}

