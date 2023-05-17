import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./components/PrimaryScene";
import { Html } from "@react-three/drei";
import { Suspense } from "react";
import "./styles.css";
import { Content } from "./components/Content";
import { ThreeImageContextProvider } from "./components/ThreeImage/Context";

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
      <ThreeImageContextProvider>
        <Canvas className="!fixed !w-full !h-screen">
          <Suspense fallback={<Loading />}>
            <PrimaryScene />
          </Suspense>
        </Canvas>
        <div className="relative container w-full min-h-screen">
          <Content />
        </div>
      </ThreeImageContextProvider>
    </>
  );
};

export default App;
