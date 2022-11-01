export const distortions = `
float simpleDisplacement(vec3 p, float amplitude, float frequency) {
  return (
    sin(frequency * (p.x + uTime / 20.0)) *
    sin(frequency * (p.y - uTime / 3.0)) *
    sin(frequency * p.z) * amplitude
  );
}

RayHit opDisplace( RayHit primitive, vec3 p, float amplitude, float frequency ) {
    float d1 = primitive.dist;
    float d2 = simpleDisplacement(p, amplitude, frequency);
    return RayHit(d1+d2, primitive.material);
}
`;