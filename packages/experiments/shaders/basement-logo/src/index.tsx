import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene";
import { useConfig } from "./utils/use-config";
import { HelperGrid } from "./scene/helper-grid";
import { Leva } from "leva";

const ThreeApp = () => {
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
    <>
      <Leva oneLineLabels />
      <Canvas camera={{ fov: 40, position: [0, 0.5, 5], far: 20, near: 1 }}>
        <color attach="background" args={["black"]} />
        <ThreeApp />
      </Canvas>
    </>
  );
};

export default App;
