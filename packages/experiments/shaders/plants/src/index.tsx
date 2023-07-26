import { Canvas } from "@react-three/fiber";
import { PrimaryScene } from "./PrimaryScene";
import { useConfigControls, useConfigStore } from "./utils/use-config";

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
  return (
    <Canvas
      onCreated={(state) => {
        state.camera.lookAt(0, 2, 0);
      }}
      camera={{ fov: 40, position: [2, 2, 2], near: 0.01, far: 20 }}
    >
      <ThreeApp />
    </Canvas>
  );
};

export default App;
