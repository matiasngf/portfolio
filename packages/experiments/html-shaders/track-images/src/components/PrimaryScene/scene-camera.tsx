import { OrthographicCameraProps } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useCanvasSize } from "../../utils/use-canvas-size";
import { useThreeScroll } from "../../utils/use-three-scroll";
import { OrthographicCamera } from "@react-three/drei";

export const SceneCamera = () => {
  const cameraRef = useRef<OrthographicCameraProps>();
  const { width, height } = useCanvasSize();
  const { y } = useThreeScroll();

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.left = -width / 2;
      cameraRef.current.right = width / 2;
      cameraRef.current.top = height / 2;
      cameraRef.current.bottom = -height / 2;
      cameraRef.current.updateProjectionMatrix?.();
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
