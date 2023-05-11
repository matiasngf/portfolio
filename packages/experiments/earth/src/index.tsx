import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./PrimaryScene";
import { Effects } from "./Effects";

const App = () => {
  return (
    <>
      <Canvas camera={{ fov: 40, position: [0, 0, 8] }}>
        <Effects />
        <PrimaryScene />
      </Canvas>
    </>
  );
};

export default App;
