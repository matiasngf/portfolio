import { useConfig } from "../utils/use-config";
import { Debug } from "./debug";
import { FluidBody } from "./fluid-body";

export const FluidObject = () => {
  const { objectRotation } = useConfig();

  return (
    <>
      <Debug />
      <FluidBody />
    </>
  );
};
