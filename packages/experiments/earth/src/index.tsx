import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Earth } from "./Earth";

const Scene = () => {
  return (
    <>
      <Earth />
      <ambientLight />
    </>
  );
};

const App = () => {
  return (
    <Canvas camera={{ fov: 70, position: [0, 0, 3] }}>
      <OrbitControls />
      <Scene />
    </Canvas>
  );
};

export default App;
