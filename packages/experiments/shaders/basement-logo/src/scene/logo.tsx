import { MeshBasicMaterial, type Mesh, ShaderMaterial } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three-stdlib";
import { useEffect, useMemo } from "react";
import {
  LogoUniforms,
  logoFragmentShader,
  logoVertexShader,
} from "../shaders/logo-shader";
import { useUniforms } from "../utils/use-uniforms";
import { useLogoStore } from "../utils/use-logo";
import { button, useControls } from "leva";

export interface LogoGLTF extends GLTF {
  nodes: {
    "logo-mesh": Mesh;
  };
}

export const Logo = () => {
  const logoModel = useLoader(
    GLTFLoader,
    "/experiment-shaders-basement-logo-assets/basement-logo.glb"
  ) as unknown as LogoGLTF;

  const mousePosition = useLogoStore((s) => s.mousePosition);

  const [logoUniforms, updateLogoUniforms] = useUniforms<LogoUniforms>({
    time: 0,
    mousePosition,
    transitionSize: 0.3,
    radius: 1.5,
    offsetDistance: 0.24,
    noiseSize: 20,
  });

  const [_, setControls] = useControls("ShaderParams", () => ({
    radius: {
      value: 1.7,
      min: 0.2,
      max: 2,
      onChange: (v) => {
        updateLogoUniforms({
          radius: v,
        });
      },
    },
    transitionSize: {
      value: 0.48,
      min: 0.2,
      max: 1,
      onChange: (v) => {
        updateLogoUniforms({
          transitionSize: v,
        });
      },
    },
    offsetDistance: {
      value: 0.24,
      min: 0,
      max: 0.4,
      onChange: (v) => {
        updateLogoUniforms({
          offsetDistance: v,
        });
      },
    },
    noiseSize: {
      value: 0.01,
      min: 0.01,
      max: 0.4,
      onChange: (v) => {
        updateLogoUniforms({
          noiseSize: v,
        });
      },
    },
  }));

  useControls("Presets", {
    explosion: button(() => {
      setControls({
        noiseSize: 0.01,
        offsetDistance: 0.24,
        transitionSize: 0.52,
      });
    }),
    bubbles: button(() => {
      setControls({
        noiseSize: 0.17,
        offsetDistance: 0.24,
        transitionSize: 0.8,
      });
    }),
    spot: button(() => {
      setControls({
        noiseSize: 0.4,
        offsetDistance: 0.05,
        transitionSize: 0.2,
      });
    }),
  });

  useFrame((state) => {
    updateLogoUniforms({
      time: state.clock.getElapsedTime(),
    });
  });

  const { mainNode } = useMemo(() => {
    const randomId = Math.random().toString(36).substring(7);

    const mainNode = logoModel.nodes["logo-mesh"].clone(true);

    mainNode.material = new ShaderMaterial({
      vertexShader: logoVertexShader,
      fragmentShader: logoFragmentShader,
      uniforms: logoUniforms,
    });

    return {
      mainNode,
    };
  }, [logoModel, logoUniforms]);

  return <primitive object={mainNode} />;
};
