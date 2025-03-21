import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useConfigControls } from "./utils/use-config";
import { PerspectiveCamera } from "@react-three/drei";

const ThreeApp = () => {
  useConfigControls();
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const desiredSizeCm = [21, 29.7];

    const dpi = 72;

    const widthPx = desiredSizeCm[0] * dpi;
    const heightPx = desiredSizeCm[1] * dpi;

    gl.setSize(widthPx, heightPx);

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      console.log(screenWidth, screenHeight);

      // Calculate scale to fit the canvas in the viewport
      const scaleX = screenWidth / widthPx;
      const scaleY = screenHeight / heightPx;
      const scale = Math.min(scaleX, scaleY);

      // Apply the transform to the canvas element
      const canvas = gl.domElement;
      canvas.style.transform = `scale(${scale})`;
      canvas.style.transformOrigin = "top left";
      canvas.style.position = "absolute";
      canvas.style.left = `${(screenWidth - widthPx * scale) / 2}px`;
      canvas.style.top = `${(screenHeight - heightPx * scale) / 2}px`;

      gl.render(scene, camera);
    };

    handleResize();

    window.addEventListener("resize", handleResize, { signal });

    return () => controller.abort();
  }, []);

  return (
    <>
      <PerspectiveCamera fov={75} position={[0, 0, 10]} />
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </>
  );
};

const App = () => {
  return (
    <div id="canvas-container">
      <Canvas
        frameloop="never"
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
        camera={{ fov: 40, position: [0, 0.5, 5], far: 50 }}
      >
        <ThreeApp />
      </Canvas>
    </div>
  );
};

export default App;
