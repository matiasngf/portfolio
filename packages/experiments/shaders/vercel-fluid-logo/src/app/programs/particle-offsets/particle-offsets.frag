precision highp float;

uniform sampler2D uPrevOffsets;
uniform sampler2D uVelocity;
uniform sampler2D uPositions;
uniform float uDecay;
uniform float uStrength;
uniform float uScreenAspect;

varying vec2 vUv;

void main() {
  // Get previous offset for this particle
  vec2 prevOffset = texture2D(uPrevOffsets, vUv).xy;

  // Get original particle position
  vec2 originalPos = texture2D(uPositions, vUv).xy;

  // Calculate displaced position with aspect correction (matching particles.vert)
  vec2 displacedPos = originalPos + prevOffset;
  vec2 screenPos = vec2(displacedPos.x / uScreenAspect, displacedPos.y);

  // Convert from clip space (-1 to 1) to UV space (0 to 1)
  vec2 samplePos = screenPos * 0.5 + 0.5;
  samplePos = clamp(samplePos, 0.0, 1.0);

  vec2 velocity = texture2D(uVelocity, samplePos).xy;

  // Accumulate velocity and apply decay to return to origin
  vec2 newOffset = (prevOffset + velocity * uStrength) * uDecay;

  gl_FragColor = vec4(newOffset, 0.0, 1.0);
}

