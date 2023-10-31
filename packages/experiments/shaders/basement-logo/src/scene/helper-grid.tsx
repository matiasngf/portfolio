import { useConfigStore } from "../utils/use-config";

export const HelperGrid = () => {
  const showGrid = useConfigStore((state) => state.showGrid);

  if (!showGrid) return null;

  return (
    <>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <gridHelper args={[10, 10]} renderOrder={2} />
        <gridHelper scale={0.1} args={[100, 100]} renderOrder={1}>
          <lineBasicMaterial
            opacity={0.2}
            transparent
            depthTest={false}
            depthWrite={false}
          />
        </gridHelper>
      </group>
      <axesHelper args={[10]} />
    </>
  );
};
