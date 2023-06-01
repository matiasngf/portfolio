import { Html, useTrailTexture } from "@react-three/drei";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Color, DoubleSide } from "three";
import { perlinNoise } from "./shaders";
import { useFrame, useThree } from "@react-three/fiber";

const pi = Math.PI;

export function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}

export interface PrimarySceneProps {}

export const PrimaryScene = ({}: PropsWithChildren<PrimarySceneProps>) => {
  // https://codesandbox.io/s/fj1qlg?file=/src/App.js
  const [hoverTexture, onMove] = useTrailTexture({
    maxAge: 750,
    ease: sinInOut,
  });

  const uniformsRef = useRef({
    uTime: { value: 0 },
    hoverTexture: { value: hoverTexture },
  });

  useFrame((_, delta) => {
    uniformsRef.current.uTime.value += delta;
  });

  const { scene } = useThree();

  useEffect(() => {
    scene.background = new Color(0x000000);
  }, []);

  return (
    <>
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[0.5, 32, 32]} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[4.8, 2.7, 32, 32]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <Html
          onPointerMove={onMove}
          scale={[0.1, 0.1, 0.1]}
          style={{
            opacity: 1.0,
            backgroundColor: "black",
          }}
          transform
          occlude="blending"
          castShadow
          receiveShadow
          material={
            <shaderMaterial
              vertexShader={testVertex}
              fragmentShader={testFragment}
              uniforms={uniformsRef.current}
              side={DoubleSide}
            />
          }
        >
          <iframe
            style={{ border: "none" }}
            width={1920}
            height={1080}
            src="https://matiasgf.dev"
          />
        </Html>
      </mesh>
      <mesh position={[1, 0, 1]}>
        <sphereGeometry args={[0.2, 32, 32]} />
      </mesh>
      <ambientLight intensity={0.5} />
    </>
  );
};

const testVertex = /*glsl*/ `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

void main() {
  vUv = uv;
  vNormal = normal;

  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const testFragment = /*glsl*/ `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D hoverTexture;

${perlinNoise}

void main() {
  float hoverFactor = length(texture2D(hoverTexture, vUv).rgb);
  float noiseScale = 500.0;
  vec3 noiseParam = vec3(vUv.x * noiseScale, vUv.y * noiseScale, 0.0);
  float noiseFactor = pow(cnoise(noiseParam), 1.0);
  // vec3 noiseColor = vec3(0.255,0.31,0.961);
  vec3 noiseColor = vec3(0.2);
  gl_FragColor = vec4(noiseColor * noiseFactor, noiseFactor);

  // gl_FragColor = vec4(vec3(hoverFactor), 1.0);

}
`;
