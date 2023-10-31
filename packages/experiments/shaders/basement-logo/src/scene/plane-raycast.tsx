import { useMemo } from "react";
import { useLogoStore } from "../utils/use-logo";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useConfigStore } from "../utils/use-config";
import { lerp } from "three/src/math/MathUtils";

export const PlaneRaycast = () => {
  // Config state
  const mousePosition = useLogoStore((s) => s.mousePosition);
  const followMouse = useConfigStore((s) => s.followMouse);

  // Vectors
  const realMousePos = useMemo(() => new Vector3(0), []);
  const simulatedMousePos = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    if (followMouse) {
      mousePosition.lerp(realMousePos, 0.03);
    } else {
      const time = clock.elapsedTime * 0.6;
      // x
      const xStart = -Math.PI / 2;
      const xTime = xStart + time;
      const xSize = 5.5;
      const xSin = Math.sin(xTime);
      let smoothCurve = Math.pow(xSin, 3);
      smoothCurve = lerp(smoothCurve, xSin, 0.3);

      // y
      const yTime = time * 0.4189;
      const ySize = 1.0;

      simulatedMousePos.set(smoothCurve * xSize, Math.cos(yTime) * ySize, 0);
      mousePosition.copy(simulatedMousePos);
    }
  });

  return (
    <>
      <mesh
        onPointerMove={(e) => {
          realMousePos.copy(e.point);
        }}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color="white"
          opacity={0}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </>
  );
};
