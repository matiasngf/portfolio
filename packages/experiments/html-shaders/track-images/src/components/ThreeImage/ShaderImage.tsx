import { PropsWithChildren, useRef } from "react";
import { ShaderImage } from "./Context";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useLoader } from "@react-three/fiber";

export interface ShaderImageMeshProps {
  image: ShaderImage;
}

export const ShaderImageMesh = ({
  image,
}: PropsWithChildren<ShaderImageMeshProps>) => {
  const [imageTexture] = useLoader(TextureLoader, [image.source]);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    imageTexture: { value: imageTexture },
  });

  return (
    <mesh
      key={image.id}
      position={[
        image.rect.absoluteLeft + image.rect.width / 2,
        -image.rect.absoluteTop - image.rect.height / 2,
        0,
      ]}
    >
      <planeGeometry args={[image.rect.width, image.rect.height]} />
      <shaderMaterial
        vertexShader={defaultVertexShader}
        fragmentShader={defaultFragmentShader}
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
  uniform float uTime;
  varying vec2 vUv;
  uniform sampler2D imageTexture;

  void main() {
    vec3 textureColor = texture2D(imageTexture, vUv).rgb;
    gl_FragColor = vec4(textureColor, 1.0);
  }
`;
