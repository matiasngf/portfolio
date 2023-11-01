import { Backdrop, useTexture } from "@react-three/drei";

export const Stage = () => {
  const shadowTexture = useTexture(
    "/experiment-shaders-plants-assets/floor-ao.jpg"
  );

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 2, 2]} intensity={1} />
      <mesh
        position={[0, 0.001, 0]}
        rotation={[Math.PI * -0.5, 0, 1]}
        scale={[0.9, 0.9, 0.9]}
      >
        <planeBufferGeometry args={[1, 1]} />
        <meshBasicMaterial color="black" alphaMap={shadowTexture} transparent />
      </mesh>
      <group
        position={[-1, -0.01, -1]}
        scale={[30, 3, 2]}
        rotation={[0, 0.7, 0]}
      >
        <Backdrop receiveShadow={true} floor={3}>
          <meshPhysicalMaterial color="#FF9B9B" />
        </Backdrop>
      </group>
    </>
  );
};
