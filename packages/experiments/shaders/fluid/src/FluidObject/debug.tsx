import { Html, Wireframe } from "@react-three/drei";
import { useConfig } from "../utils/use-config";
import { Vector3 } from "three";

export const Debug = () => {
  const {
    objectRotation,
    objectRotationDirection,
    objectRotationAxis,
    objectNewUp,
    objectPrevUp,
    debug,
  } = useConfig();

  if (!debug) return null;

  return (
    <>
      <mesh
        position={
          new Vector3(objectRotationDirection.x, 0, objectRotationDirection.y)
        }
      >
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="blue" />
        <Html center>
          <p>Rotation Direction</p>
        </Html>
      </mesh>
      <mesh position={objectRotationAxis}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="red" />
        <Html center>
          <p>Rotation Axis</p>
        </Html>
      </mesh>
      <mesh position={objectNewUp}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="green" />
        <Html center>
          <p>Rotation New Up</p>
        </Html>
      </mesh>
      <mesh position={objectPrevUp.multiplyScalar(0.5)}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="yellow" />
        <Html center>
          <p>Element Prev Up</p>
        </Html>
      </mesh>
      <group rotation={objectRotation}>
        <group position={new Vector3(0, 0.6, 0)}>
          <mesh>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="hotpink" />
            <Html center>
              <p>Element UP</p>
            </Html>
          </mesh>
        </group>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <Wireframe transparent />
          <meshStandardMaterial transparent opacity={0.5} color="hotpink" />
        </mesh>
      </group>
    </>
  );
};
