import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./PrimaryScene";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { useConfigControls, useConfigStore } from "./utils/use-config";

function Loading() {
  return (
    <Html
      fullscreen
      style={{
        backgroundColor: "black",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Loading</h2>
    </Html>
  );
}

const ThreeApp = () => {
  useConfigControls();

  const debugGrid = useConfigStore((state) => state.debugGrid);

  return (
    <>
      {debugGrid && (
        <>
          <gridHelper renderOrder={1} args={[2, 20, "#000", "#333"]} />
          <gridHelper
            renderOrder={1}
            rotation={[Math.PI / 2, 0, 0]}
            args={[2, 20, "#000", "#333"]}
          />
          <axesHelper
            renderOrder={2}
            args={[1]}
            position={[0.001, 0.001, 0.001]}
          />
        </>
      )}
      <PrimaryScene />
    </>
  );
};

const App = () => {
  return (
    <Canvas
      onCreated={(state) => {
        state.camera.lookAt(0, 2, 0);
      }}
      camera={{ fov: 40, position: [2, 2, 2], near: 0.01, far: 20 }}
    >
      <ThreeApp />
      <OrbitControls />
    </Canvas>
  );
};

export default App;