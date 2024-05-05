import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./components/PrimaryScene";
import { Html } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { Content } from "./components/Content";
import { ElementTrackerContextProvider } from "./components/ElementTracker";
import "./styles.css";
import { SmoothScroll } from "./utils/smooth-scroll";

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
  useEffect(() => {
    SmoothScroll(document, 50, 12);
  }, []);
  return (
    <>
      <ElementTrackerContextProvider>
        <div className="container relative z-10 w-full min-h-screen">
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
