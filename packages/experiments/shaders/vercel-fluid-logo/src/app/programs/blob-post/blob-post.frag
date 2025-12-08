precision highp float;

uniform sampler2D uParticlesSdf;
uniform float uThreshold;

varying vec2 vUv;

void main() {
  vec4 sdfData = texture2D(uParticlesSdf, vUv);

  float blue = sdfData.b; // Mixed SDF (1.0 for triangle, gradient for blob)

  // Apply threshold to create blob cutoff
  float blobMask = step(uThreshold, blue);

  // Discard pixels outside the blob
  if (blobMask < 0.5) discard;

  // Output white where blob is visible
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}

