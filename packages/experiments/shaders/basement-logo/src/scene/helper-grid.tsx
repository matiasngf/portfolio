import { useConfigStore } from "../utils/use-config";

export const HelperGrid = () => {
  const showGrid = useConfigStore((state) => state.showGrid);

  if (!showGrid) return null;

  return (
    <>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <gridHelper args={[10, 10]} />
        <gridHelper scale={0.1} args={[100, 100]}>
          <lineBasicMaterial opacity={0.2} transparent />
        </gridHelper>
      </group>
      <axesHelper args={[10]} />
    </>
  );
};
