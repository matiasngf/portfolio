import { useConfig } from "../utils/use-config";
import { Debug } from "./debug";
import { FluidBody } from "./fluid-body";
import { Potion } from "./potion";

export const FluidObject = () => {
  const { objectRotation } = useConfig();

  return (
    <>
      <Debug />
      <group rotation={objectRotation}>
        <group position={[0, -0.7, 0]} scale={0.5}>
          <Potion />
          <FluidBody />
        </group>
      </group>
    </>
  );
};
