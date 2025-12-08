precision highp float;

uniform sampler2D uPrevOffsets; // RG = offset, BA = particle velocity
uniform sampler2D uPrevVelocity; // Same texture, used for clarity
uniform sampler2D uFluidVelocity; // Fluid simulation velocity field
uniform sampler2D uPositions; // Original particle positions
uniform float uStrength; // Fluid velocity influence multiplier
uniform float uFriction; // Particle velocity decay (drag)
uniform float uOffsetDecay; // Return-to-origin force
uniform float uSnapDistance; // Distance threshold for snap behavior
uniform float uSnapVelocityThreshold; // Velocity threshold for snap behavior
uniform float uSnapLerpStrength; // Lerp strength when snapping
uniform float uMinVelocity; // Minimum fluid velocity to respond to
uniform float uScreenAspect;

const float MAX_VELOCITY = 0.03;

varying vec2 vUv;

void main() {
  // Read previous state: offset in RG, particle velocity in BA
  vec4 prevState = texture2D(uPrevOffsets, vUv);
  vec2 prevOffset = prevState.xy;
  vec2 prevParticleVel = prevState.zw;

  // Get original particle position
  vec2 originalPos = texture2D(uPositions, vUv).xy;

  // Calculate displaced position with aspect correction (matching particles.vert)
  vec2 displacedPos = originalPos + prevOffset;
  vec2 screenPos = vec2(displacedPos.x / uScreenAspect, displacedPos.y);

  // Convert from clip space (-1 to 1) to UV space (0 to 1)
  vec2 samplePos = screenPos * 0.5 + 0.5;
  samplePos = clamp(samplePos, 0.0, 1.0);

  // Sample fluid velocity at particle's screen position
  vec2 fluidVel = texture2D(uFluidVelocity, samplePos).xy;

  // Apply minimum velocity threshold - ignore tiny fluid movements
  float fluidVelLength = length(fluidVel);
  if (fluidVelLength < uMinVelocity) {
    fluidVel = vec2(0.0);
  }

  // Update particle velocity: add fluid influence and apply friction (drag)
  vec2 newParticleVel = (prevParticleVel + fluidVel * uStrength) * uFriction;

  // Clamp particle velocity to prevent excessive movement
  float velLength = length(newParticleVel);
  if (velLength > MAX_VELOCITY) {
    newParticleVel = newParticleVel * (MAX_VELOCITY / velLength);
  }

  // Update offset: apply particle velocity and gentle return-to-origin force
  vec2 newOffset = prevOffset + newParticleVel - prevOffset * uOffsetDecay;

  // Snap-to-origin behavior when particle is close and slow
  float offsetDist = length(newOffset);
  float particleVelLength = length(newParticleVel);

  if (
    offsetDist < uSnapDistance &&
    particleVelLength < uSnapVelocityThreshold
  ) {
    // Apply stronger lerp towards origin
    newOffset = mix(newOffset, vec2(0.0), uSnapLerpStrength);
    // Zero out velocity for clean stop
    newParticleVel = vec2(0.0);
  }

  // Output: RG = new offset, BA = new particle velocity
  gl_FragColor = vec4(newOffset, newParticleVel);
}

