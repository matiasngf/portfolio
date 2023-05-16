import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./components/PrimaryScene";
import { Html, OrbitControls, Scroll, ScrollControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import "./styles.css";
import { Content } from "./components/Content";
import { useWindowSize } from "react-use";
import { useBodyScrollHeight } from "./utils/use-body-scroll-height";
import { useThreeScroll } from "./utils/use-three-scroll";

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
      <Canvas className="!fixed !w-full !h-screen">
        <Suspense fallback={<Loading />}>
          <PrimaryScene />
        </Suspense>
      </Canvas>
      <div className="relative container w-full min-h-screen">
        <Content />
      </div>
    </>
  );
};

export default App;
