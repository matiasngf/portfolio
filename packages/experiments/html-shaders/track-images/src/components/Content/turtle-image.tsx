import { bubble, voronoi } from "../../utils/shader-utils";
import { ThreeImage } from "../ThreeImage";

// https://pixabay.com/photos/sea-turtle-diving-animal-2361247/
import seaTurtle from "./sea-turtle.jpg";

export const TurtleImage = () => {
  return <ThreeImage fragmentShader={fragmentShader} src={seaTurtle} />;
};

const fragmentShader = /* glsl */ `

varying vec2 vUv;

uniform float uTime;
uniform sampler2D imageTexture;

const float PI = 3.1415926535897932384626433832795;


${bubble}
${voronoi}

void main() {

  float noiseScale = 5.0;
  float timeScale = 0.3;

  float displacementFactorX = voronoise(vec3(vUv * noiseScale, uTime * timeScale), 0.1);
  float displacementFactorY = voronoise(vec3(vUv * noiseScale, uTime * timeScale + 50.0), 0.1);

  float distanceToEdgeX = abs(vUv.x - 0.5) * 2.0;
  distanceToEdgeX = 1.0 - pow(distanceToEdgeX, 2.0);
  float distanceToEdgeY = abs(vUv.y - 0.5) * 2.0;
  distanceToEdgeY = 1.0 - pow(distanceToEdgeY, 2.0);

  float edgeFactor = distanceToEdgeX * distanceToEdgeY;

  float mirrorFactorX = edgeFactor * displacementFactorX;
  float mirrorFactorY = edgeFactor * displacementFactorY;

  vec3 waterColor = vec3(0.129,0.569,0.882);
  float waterFactor = max(mirrorFactorX, mirrorFactorY);
  waterFactor = clamp(waterFactor, 0.3, 0.8);

  vec2 mirrorUv = vec2(
    vUv.x + pow(mirrorFactorX, 2.0) * 0.05,
    vUv.y + pow(mirrorFactorY, 2.0) * 0.05
  );
  vec3 displacedTexture = texture2D(imageTexture, mirrorUv).rgb;
  vec3 texture = texture2D(imageTexture, vUv).rgb;
  
  vec3 result = displacedTexture;
  result = mix(result, waterColor, waterFactor);

  gl_FragColor = vec4(vec3(result), 1.0);
}

`;
