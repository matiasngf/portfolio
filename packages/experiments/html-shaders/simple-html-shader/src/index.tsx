import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./PrimaryScene";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Effects } from "./Effects";

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
      <h2>Loading textures</h2>
    </Html>
  );
}

const App = () => {
  return (
    <>
      <Canvas camera={{ fov: 40, position: [0, 0, 8] }}>
        <Suspense fallback={<Loading />}>
          <PrimaryScene />
          <Effects />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default App;
