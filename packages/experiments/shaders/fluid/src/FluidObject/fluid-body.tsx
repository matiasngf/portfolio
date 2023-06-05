import { useFrame } from "@react-three/fiber";
import { useUniforms } from "../utils/uniforms";
import { useConfig, useFluid } from "../utils/useConfig";
import { fluidFragmentShader, fluidVertexShader } from "./fluid-shaders";
import { Bounds, BoundsApi, useBounds } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";

export const FluidBody = () => (
  <Bounds>
    <FluidBodyInner />
  </Bounds>
);

export const FluidBodyInner = () => {
  const { objectRotation } = useConfig();
  const { fluidNoise, fluidRotationForce } = useFluid();
  // create a cilinder with a shader material

  const bounds = useBounds();

  const [uniforms, setUniforms] = useUniforms({
    fFilled: 0.9,
    fFluidNoise: fluidNoise,
    vFluidRotationForce: fluidRotationForce,
    vBoundsMin: bounds.getSize().box.min,
    vBoundsMax: bounds.getSize().box.max,
  });

  useEffect(() => {}, []);

  useFrame(({ clock }) => {
    bounds.refresh();
    uniforms.vBoundsMin.value.copy(bounds.getSize().box.min);
    uniforms.vBoundsMax.value.copy(bounds.getSize().box.max);
    uniforms.vFluidRotationForce.value.copy(fluidRotationForce);
    setUniforms({
      fFluidNoise: fluidNoise,
    });
  });

  return (
    <group rotation={objectRotation}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 1, 32, 32]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={fluidVertexShader}
          fragmentShader={fluidFragmentShader}
          transparent
        />
      </mesh>
    </group>
  );
};
