import { useFrame } from "@react-three/fiber";
import { useUniforms } from "../utils/uniforms";
import { useConfig, useFluid } from "../utils/use-config";
import { fluidFragmentShader, fluidVertexShader } from "./fluid-shaders";
import { Bounds, useBounds, useFBO } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { RGBAFormat } from "three";
import { createDepthMaterial } from "./depth-material";

const devMode = true;

export const FluidBody = () => (
  <Bounds>
    <FluidBodyInner key={devMode ? Math.random() : ""} />
  </Bounds>
);

// const depthMaterial = new MeshDepthMaterial({
//   side: FrontSide,
//   depthWrite: true,
// });

export const FluidBodyInner = () => {
  // const groupRef = useRef<Scene>(null);
  const { objectRotation } = useConfig();
  const {
    fluidNoise,
    fluidRotationForce,
    fluidColor,
    filledPercentage,
    fluidDensity,
  } = useFluid();

  const bounds = useBounds();

  const depthTargetMap = useFBO({
    samples: 1,
    stencilBuffer: false,
    format: RGBAFormat,
  });

  const [uniforms, setUniforms] = useUniforms({
    fFilled: filledPercentage,
    fFluidNoise: fluidNoise,
    fFluidDensity: fluidDensity,
    fTime: 0,
    vFluidRotationForce: fluidRotationForce,
    vBoundsMin: bounds.getSize().box.min,
    vBoundsMax: bounds.getSize().box.max,
    vFluidColor: fluidColor,
    depthTexture: depthTargetMap.texture,
    nearPlane: 0.1,
    farPlane: 100,
  });

  const [depthUniforms, setDepthUniforms] = useUniforms({
    nearPlane: 0.1,
    farPlane: 100,
  });

  const depthMaterial = useMemo(
    () => createDepthMaterial(depthUniforms),
    [depthUniforms]
  );

  useEffect(() => {
    uniforms.vFluidColor.value.copy(fluidColor);
    setUniforms({
      fFilled: filledPercentage,
      fFluidDensity: fluidDensity,
    });
  }, [fluidColor, filledPercentage, fluidDensity]);

  useFrame(({ gl, camera, scene, clock }) => {
    bounds.refresh();

    const boundsSize = bounds.getSize();

    // TODO: edit the near and far to fit only the desired object

    uniforms.vBoundsMin.value.copy(boundsSize.box.min);
    uniforms.vBoundsMax.value.copy(boundsSize.box.max);
    uniforms.vFluidRotationForce.value.copy(fluidRotationForce);
    setUniforms({
      fFluidNoise: fluidNoise,
      nearPlane: camera.near,
      farPlane: camera.far,
      fTime: clock.getElapsedTime(),
    });

    setDepthUniforms({
      nearPlane: camera.near,
      farPlane: camera.far,
    });

    // Render depth map of object only
    scene.overrideMaterial = depthMaterial;
    gl.setRenderTarget(depthTargetMap);
    gl.render(scene, camera);
    // Reset
    scene.overrideMaterial = null;
    gl.setRenderTarget(null);
  });

  return (
    <group rotation={objectRotation}>
      <mesh renderOrder={0}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32, 32]} />
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
