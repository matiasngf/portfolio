import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./PrimaryScene";
import { Effects } from "./Effects";
import { Html } from "@react-three/drei";
import { Suspense } from "react";

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
        <Effects />
        <Suspense fallback={<Loading />}>
          <PrimaryScene />
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
