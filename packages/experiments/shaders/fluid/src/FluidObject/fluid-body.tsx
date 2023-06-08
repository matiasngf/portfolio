import { useFrame, useLoader } from "@react-three/fiber";
import { useUniforms } from "../utils/uniforms";
import { useConfig, useFluid } from "../utils/use-config";
import { fluidFragmentShader, fluidVertexShader } from "./fluid-shaders";
import { Bounds, useBounds, useFBO } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { Group, RGBAFormat, ShaderMaterial } from "three";
import { createDepthMaterial } from "./depth-material";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PotionBottleGLTF } from "./potion";

const devMode = true;

export const FluidBody = () => (
  <Bounds>
    <FluidBodyInner />
  </Bounds>
);

export const FluidBodyInner = () => {
  const {
    fluidNoise,
    fluidRotationForce,
    fluidColor,
    filledPercentage,
    fluidDensity,
    maxSteps,
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
    MAX_STEPS: maxSteps,
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
      MAX_STEPS: maxSteps,
    });
  }, [fluidColor, filledPercentage, fluidDensity, maxSteps]);

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

    const currentBackground = scene.background;

    // Render depth map of object only
    scene.overrideMaterial = depthMaterial;
    scene.background = null;
    gl.setRenderTarget(depthTargetMap);
    gl.render(scene, camera);
    // Reset
    scene.overrideMaterial = null;
    scene.background = currentBackground;
    gl.setRenderTarget(null);
  });

  // load model

  const bottleModel = useLoader(
    GLTFLoader,
    "/experiment-shaders-fluid-assets/potion-bottle.glb"
  ) as unknown as PotionBottleGLTF;

  const ModelNode = useMemo(() => {
    const result = new Group();

    const fluid = bottleModel.nodes.Fluid.clone();
    fluid.renderOrder = 0;
    fluid.material = new ShaderMaterial({
      uniforms,
      vertexShader: fluidVertexShader,
      fragmentShader: fluidFragmentShader,
      transparent: true,
    });
    result.add(fluid);

    return result;
  }, [bottleModel, fluidVertexShader, fluidFragmentShader, uniforms]);

  return (
    <group>
      <primitive object={ModelNode} />
    </group>
  );
};
