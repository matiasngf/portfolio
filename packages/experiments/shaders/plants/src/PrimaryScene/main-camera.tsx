import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import { useEffect, useRef } from "react";
import {
  CameraHelper,
  Group,
  PerspectiveCamera as PerspectiveCameraType,
  Vector3,
} from "three";
import { useConfig } from "../utils/use-config";
import { useFrame } from "@react-three/fiber";
import { useDrag } from "../utils/use-drag";

const startingPos = new Vector3(0.3, 0.7, 0.1);
const startingTarget = new Vector3(0, 0.5, -0.05);

const endPosition = new Vector3(1, 1, 1);
const endTarget = new Vector3(0, 0.25, 0);

export const MainCamera = () => {
  const { debug, grow } = useConfig();

  const cameraRef = useRef<PerspectiveCameraType>(null);
  const camera = cameraRef.current;

  useHelper(debug && cameraRef, CameraHelper);

  useFrame(() => {
    if (!camera) return;
    camera.lookAt(startingTarget);

    const growFactor = grow / 1.3;
    // calculate new positions
    const newPos = startingPos.clone().lerp(endPosition, growFactor);
    const newTarget = startingTarget.clone().lerp(endTarget, growFactor);
    // set new positions
    camera.position.copy(newPos);
    camera.lookAt(newTarget);
  });

  return (
    <group>
      {debug && (
        <>
          {/* <OrbitControls enabled={debug} /> */}
          <axesHelper position={startingPos} args={[0.2]} />
          <axesHelper position={startingTarget} args={[0.2]} />
          <axesHelper position={endPosition} args={[0.2]} />
        </>
      )}
      <PerspectiveCamera
        ref={cameraRef}
        position={startingPos}
        makeDefault={!debug}
      />
      <DebugCamera isActive={debug} />
    </group>
  );
};

interface DebugCameraProps {
  isActive: boolean;
}

const DebugCamera = ({ isActive }: DebugCameraProps) => {
  const groupRef = useRef<Group>(null);

  const debugCameraRef = useRef<PerspectiveCameraType>(null);
  const debugCamera = debugCameraRef.current;

  const [xPos] = useDrag({ preventDefault: false });

  useEffect(() => {
    if (!debugCamera) return;
    debugCamera.lookAt(endTarget);
  }, [debugCamera]);

  useEffect(() => {
    if (!groupRef.current) return;
    console.log(xPos);

    groupRef.current.rotation.y = xPos;
  }, [xPos, groupRef.current]);

  return (
    <group ref={groupRef}>
      <PerspectiveCamera
        ref={debugCameraRef}
        position={[2, 2, 2]}
        makeDefault={isActive}
      />
    </group>
  );
};
