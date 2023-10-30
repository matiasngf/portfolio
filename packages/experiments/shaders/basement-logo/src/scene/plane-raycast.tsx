import { useMemo } from "react";
import { useLogoStore } from "../utils/use-logo";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export const PlaneRaycast = () => {
  const mousePosition = useLogoStore((s) => s.mousePosition);

  const realMousePos = useMemo(() => new Vector3(), []);

  useFrame(() => {
    mousePosition.lerp(realMousePos, 0.03);
  });

  return (
    <>
      <mesh
        onPointerMove={(e) => {
          realMousePos.copy(e.point);
        }}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="white" opacity={0} transparent />
      </mesh>
    </>
  );
};
