import { MeshProps } from "@react-three/fiber";

export const Sun = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="orange"
        emissiveIntensity={10}
        toneMapped={false}
      />
    </mesh>
  );
};
