import { type Mesh, ShaderMaterial, DoubleSide } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three-stdlib";
import { useMemo } from "react";
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

  const [_, setControls] = useControls(
    "ShaderParams",
    () => ({
      // ShaderParams: folder({}),
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
        value: 1.0,
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
        value: 0.02,
        min: 0.01,
        max: 0.4,
        onChange: (v) => {
          updateLogoUniforms({
            noiseSize: v,
          });
        },
      },
    }),
    {
      collapsed: true,
    }
  );

  useControls("Presets", {
    disolve: button(() => {
      setControls({
        noiseSize: 0.02,
        offsetDistance: 0.24,
        transitionSize: 1.0,
      });
    }),
    bubbles: button(() => {
      setControls({
        noiseSize: 0.17,
        offsetDistance: 0.22,
        transitionSize: 0.44,
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
    const mainNode = logoModel.nodes["logo-mesh"].clone(true);

    mainNode.material = new ShaderMaterial({
      vertexShader: logoVertexShader,
      fragmentShader: logoFragmentShader,
      uniforms: logoUniforms,
      transparent: true,
      side: DoubleSide,
    });

    return {
      mainNode,
    };
  }, [logoModel, logoUniforms]);

  return <primitive object={mainNode} />;
};
