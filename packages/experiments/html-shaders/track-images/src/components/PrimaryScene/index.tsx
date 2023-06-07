import { PropsWithChildren } from "react";
import { Color } from "three";
import { ShaderImageMesh } from "../ThreeImage/ShaderImage";
import { SceneCamera } from "./scene-camera";
import { useCanvasSize } from "../../utils/use-canvas-size";
import { TrackedImage, useElementTracker } from "../ElementTracker";
import { useControls } from "leva";

const pi = Math.PI;

export function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}

export interface PrimarySceneProps {}

export const PrimaryScene = ({}: PropsWithChildren<PrimarySceneProps>) => {
  const config = useControls({
    debug: {
      value: false,
    },
  });

  const { trackedElements } = useElementTracker();

  const autoAddImages = trackedElements.filter(
    (element) => element.type === "image" && element.autoAdd
  ) as TrackedImage[];

  return (
    <>
      <SceneCamera />
      {config.debug && <DebugElements />}
      {autoAddImages.map((image) => {
        return <ShaderImageMesh key={image.id} image={image} />;
      })}
    </>
  );
};

const DebugElements = () => {
  const { width, height } = useCanvasSize();

  return (
    <>
      <gridHelper
        position={[width / 2, -height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        args={[width, 10]}
      />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color={new Color(0xff0000)} />
      </mesh>
      <mesh position={[width, -height, 0]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color={new Color(0xff0000)} />
      </mesh>
    </>
  );
};
