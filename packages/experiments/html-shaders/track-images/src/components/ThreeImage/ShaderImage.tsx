import { PropsWithChildren, useRef } from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useFrame, useLoader } from "@react-three/fiber";
import { TrackedImage } from "../ElementTracker";

export interface ShaderImageMeshProps {
  image: TrackedImage;
}

export const ShaderImageMesh = ({
  image,
}: PropsWithChildren<ShaderImageMeshProps>) => {
  const { id, rect, source, vertexShader, fragmentShader } = image;
  const [imageTexture] = useLoader(TextureLoader, [source]);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    imageTexture: { value: imageTexture },
  });

  useFrame((_, delta) => {
    uniformsRef.current.uTime.value += delta;
  });

  return (
    <mesh
      key={id}
      position={[
        rect.absoluteLeft + rect.width / 2,
        -rect.absoluteTop - rect.height / 2,
        1,
      ]}
    >
      <planeGeometry args={[rect.width, rect.height, 126, 126]} />
      <shaderMaterial
        vertexShader={vertexShader || defaultVertexShader}
        fragmentShader={fragmentShader || defaultFragmentShader}
        uniforms={uniformsRef.current}
      />
    </mesh>
  );
};

const defaultVertexShader = /* glsl */ `

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const defaultFragmentShader = /* glsl */ `
  
  varying vec2 vUv;

  uniform float uTime;
  uniform sampler2D imageTexture;

  void main() {
    vec3 textureColor = texture2D(imageTexture, vUv).rgb;
    gl_FragColor = vec4(textureColor, 1.0);
  }
`;
