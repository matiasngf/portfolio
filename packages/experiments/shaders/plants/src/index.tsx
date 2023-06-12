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
          <gridHelper args={[10, 10]} />
          <axesHelper args={[10]} />
        </>
      )}
      <PrimaryScene />
    </>
  );
};

const App = () => {
  return (
    <Canvas
      onCreated={(state) => (state.gl.localClippingEnabled = true)}
      camera={{ fov: 40, position: [0, 0.5, 5] }}
    >
      <ThreeApp />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
