import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { PlantGLTF } from ".";
import { useMemo } from "react";
import { MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { useTexture } from "@react-three/drei";

export const Pot = () => {
  const plantModel = useLoader(
    GLTFLoader,
    "/experiment-shaders-plants-assets/plant.glb"
  ) as unknown as PlantGLTF;

  const labelTexture = useTexture(
    "/experiment-shaders-plants-assets/label.jpg"
  );

  const { pot, stick } = useMemo(() => {
    const pot = plantModel.nodes.pot.clone();

    const potPrevMaterial = (pot.material as MeshStandardMaterial).clone();
    const potMaterial = new MeshPhysicalMaterial({
      map: potPrevMaterial.map,
      metalness: 0.0,
      roughness: 1.0,
    });

    pot.material = potMaterial;

    const stick = plantModel.nodes.stick.clone();

    return { pot, stick };
  }, [plantModel]);

  return (
    <group>
      <primitive object={pot} />
      <group position={[0.05, 0.46, -0.03]} rotation={[-0.2, 1, 0]}>
        <primitive object={stick} />
        <mesh position={[0, 0.12, 0]}>
          <planeGeometry args={[0.1, 0.06]} />
          <meshBasicMaterial map={labelTexture} />
        </mesh>
      </group>
    </group>
  );
};
