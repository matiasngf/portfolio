precision highp float;

uniform vec3 uColor;

varying vec2 vParticleUv;

void main() {
  // Create circular point shape
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Soft edge falloff
  float alpha = 1.0 - smoothstep(0.4, 0.5, dist);

  if (alpha < 0.01) discard;

  gl_FragColor = vec4(uColor, alpha);
}

