export const bubble = /* glsl */ `
float bubble(float x, float k) {
  return pow(cos((x-0.5) * PI), 1.0 / k );
}
`

export const voronoi = /* glsl */ `
vec3 hash3(in vec3 p) {
  vec3 q = vec3(dot(p, vec3(127.1, 311.7, 189.2)),
                dot(p, vec3(269.5, 183.3, 324.7)),
                dot(p, vec3(419.2, 371.9, 128.5)));
  return fract(sin(q) * 43758.5453);
}

float voronoise(in vec3 x, float v) {
  // adapted from IQ's 2d voronoise:
  // https://iquilezles.org/articles/voronoise
  vec3 p = floor(x);
  vec3 f = fract(x);

  float s = 1.0 + 31.0 * v;
  float va = 0.0;
  float wt = 0.0;
  for (int k=-2; k<=1; k++)
  for (int j=-2; j<=1; j++)
  for (int i=-2; i<=1; i++) {
      vec3 g = vec3(float(i), float(j), float(k));
      vec3 o = hash3(p + g);
      vec3 r = g - f + o + 0.5;
      float d = dot(r, r);
      float w = pow(1.0 - smoothstep(0.0, 1.414, sqrt(d)), s);
      va += o.z * w;
      wt += w;
   }
   return va / wt;
}
`

export const valueRemap = /* glsl */`
float valueRemap(float value, float min, float max, float newMin, float newMax) {
  return newMin + (newMax - newMin) * (value - min) / (max - min);
}
`;

export const perturbNormalArb = /* glsl */`
vec2 dHdxy_fwd(vec2 uv, sampler2D map, float scale) {

  float scaledBumpScale = scale / 10.0;

  vec2 dSTdx = dFdx( uv );
  vec2 dSTdy = dFdy( uv );

  float Hll = scaledBumpScale * texture2D( map, uv ).x;
  float dBx = scaledBumpScale * texture2D( map, uv + dSTdx ).x - Hll;
  float dBy = scaledBumpScale * texture2D( map, uv + dSTdy ).x - Hll;

  return vec2( dBx, dBy );

}

vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {

  vec3 vSigmaX = dFdx( surf_pos );
  vec3 vSigmaY = dFdy( surf_pos );
  vec3 vN = surf_norm;		// normalized

  vec3 R1 = cross( vSigmaY, vN );
  vec3 R2 = cross( vN, vSigmaX );

  float fDet = dot( vSigmaX, R1 );

  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
  return normalize( abs( fDet ) * surf_norm - vGrad );

}
`;

export const curveUp = /* glsl */`
float curveUp( float x, float factor ) {
  return ( 1.0 - factor / (x + factor) ) * (factor + 1.0);
}
`;

export const simpleNoise1 = /* glsl */`
/* https://www.shadertoy.com/view/XsX3zB */

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float SIMPLEX_NOISE_F3 =  0.3333333;
const float SIMPLEX_NOISE_G3 =  0.1666667;

/* 3d simplex noise */
float simpleNoise1(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(SIMPLEX_NOISE_F3)));
	 vec3 x = p - s + dot(s, vec3(SIMPLEX_NOISE_G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + SIMPLEX_NOISE_G3;
	 vec3 x2 = x - i2 + 2.0*SIMPLEX_NOISE_G3;
	 vec3 x3 = x - 1.0 + 3.0*SIMPLEX_NOISE_G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

/* const matrices for 3d rotation */
const mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
const mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
const mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);

/* directional artifacts can be reduced by rotating each octave */
float simplex3d_fractal(vec3 m) {
    return   0.5333333*simplex3d(m*rot1)
			+0.2666667*simplex3d(2.0*m*rot2)
			+0.1333333*simplex3d(4.0*m*rot3)
			+0.0666667*simplex3d(8.0*m);
}
`;

export const simpleNoise2 = /* glsl */ `
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float simpleNoise2(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}
`