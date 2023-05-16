import {
  OrthographicCamera,
  useScroll,
  useTrailTexture,
} from "@react-three/drei";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Color } from "three";
import { OrthographicCameraProps, useFrame } from "@react-three/fiber";
import { useWindowSize } from "react-use";
import { useThreeScroll } from "../../utils/use-three-scroll";

const pi = Math.PI;

export function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}

const useViewportPosition = () => {
  const { delta, fixed } = useScroll();
  const { width, height } = useWindowSize();
  // console.log(el);

  useEffect(() => {
    console.log(fixed.offsetHeight);
  }, [delta, width, height]);
};

export interface PrimarySceneProps {}

export const PrimaryScene = ({}: PropsWithChildren<PrimarySceneProps>) => {
  // https://codesandbox.io/s/fj1qlg?file=/src/App.js
  const [hoverTexture, onMove] = useTrailTexture({
    maxAge: 750,
    ease: sinInOut,
  });

  const [uTime, setUTime] = useState(0);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    hoverTexture: { value: hoverTexture },
  });

  useFrame((_, delta) => {
    setUTime((uTime) => uTime + delta);
    uniformsRef.current.uTime.value += delta;
  });

  const { width, height } = useWindowSize();

  return (
    <>
      <SceneCamera />
      <gridHelper
        position={[width / 2, -height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        args={[width, 10]}
      />
      <mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color={new Color(0xff0000)} />
        </mesh>
        <mesh position={[width, -height, 0]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color={new Color(0xff0000)} />
        </mesh>
      </mesh>
    </>
  );
};

const SceneCamera = () => {
  const cameraRef = useRef<OrthographicCameraProps>();

  const { width, height } = useWindowSize();
  const { y } = useThreeScroll();

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.left = -width / 2;
      cameraRef.current.right = width / 2;
      cameraRef.current.top = height / 2;
      cameraRef.current.bottom = -height / 2;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [width, height]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      near={0.0}
      far={3000}
      position={[width / 2, -y - height / 2, 2000]}
      makeDefault
    />
  );
};
