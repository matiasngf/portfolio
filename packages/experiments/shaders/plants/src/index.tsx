import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./PrimaryScene";
import { useConfigControls, useConfigStore } from "./utils/use-config";
import Lenis from "@studio-freight/lenis";
import { useEffect, useMemo } from "react";

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
  useEffect(() => {
    if (typeof window === "undefined") return;

    const abortController = new AbortController();
    const signal = abortController.signal;
    const isCanceled = () => signal.aborted;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      normalizeWheel: true,
    } as any);

    lenis.on("scroll", (e: any) => {
      const scroll = e.animatedScroll;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.clientHeight;
      const scrollPercent = (scroll / (bodyHeight - windowHeight)) * 1.3;
      useConfigStore.setState({ grow: scrollPercent });
    });

    function raf(time: number) {
      if (isCanceled()) return;
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      abortController.abort();
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ height: "300vh", width: "100%" }}>
      <Canvas
        style={{ height: "100vh", position: "sticky", top: "0" }}
        onCreated={(state) => {
          state.camera.lookAt(0, 2, 0);
        }}
        camera={{ fov: 40, position: [2, 2, 2], near: 0.01, far: 20 }}
      >
        <ThreeApp />
      </Canvas>
    </div>
  );
};

export default App;
