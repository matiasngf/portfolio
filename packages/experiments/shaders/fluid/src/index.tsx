import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./PrimaryScene";
import { Html } from "@react-three/drei";
import { Suspense } from "react";
import { useConfigControls } from "./utils/useConfig";

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
  return (
    <>
      <gridHelper args={[10, 10]} />
      <axesHelper args={[10]} />
      <Suspense fallback={<Loading />}>
        <PrimaryScene />
      </Suspense>
    </>
  );
};

const App = () => {
  return (
    <Canvas camera={{ fov: 40, position: [0, 0, 5] }}>
      <ThreeApp />
    </Canvas>
  );
};

export default App;
