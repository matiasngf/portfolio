import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene";
import { useConfig, useConfigStore } from "./utils/use-config";
import { HelperGrid } from "./scene/helper-grid";

const ThreeApp = () => {
  const showGrid = useConfigStore((state) => state.showGrid);

  return (
    <>
      <HelperGrid />
      <Scene />
    </>
  );
};

const App = () => {
  useConfig();
  return (
    <Canvas camera={{ fov: 40, position: [0, 0.5, 5], far: 50 }}>
      <color attach="background" args={["black"]} />
      <ThreeApp />
    </Canvas>
  );
};

export default App;
