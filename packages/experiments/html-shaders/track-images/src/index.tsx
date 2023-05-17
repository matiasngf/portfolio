import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./components/PrimaryScene";
import { Html } from "@react-three/drei";
import { Suspense } from "react";
import { Content } from "./components/Content";
import { ElementTrackerContextProvider } from "./components/ElementTracker";
import "./styles.css";

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
      <h2>Loading...</h2>
    </Html>
  );
}

const App = () => {
  return (
    <>
      <ElementTrackerContextProvider>
        <div className="relative container w-full min-h-screen z-10">
          <Content />
        </div>
        <Canvas className="top-0 left-0 z-20 !fixed !w-full !h-screen !pointer-events-none">
          <Suspense fallback={<Loading />}>
            <PrimaryScene />
          </Suspense>
        </Canvas>
      </ElementTrackerContextProvider>
    </>
  );
};

export default App;
