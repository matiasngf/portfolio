import { BackSide, Vector3 } from "three";
import { atmosphereFragmentShader, atmosphereVertexShader } from "./shaders";
import { useEffect, useRef } from "react";

const verteces = Math.pow(2, 9);

interface AtmosphereProps {
  lightDirection: Vector3;
}

export const Atmosphere = ({ lightDirection }: AtmosphereProps) => {
  const lightDirectionRef = useRef<Vector3>(lightDirection.clone());
  useEffect(() => {
    lightDirectionRef.current.copy(lightDirection);
  }, [lightDirection]);

  return (
    <mesh>
      <sphereGeometry args={[1.02, verteces, verteces]} />
      <shaderMaterial
        side={BackSide}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        transparent
        uniforms={{
          lightDirection: { value: lightDirectionRef.current },
        }}
      />
    </mesh>
  );
};
