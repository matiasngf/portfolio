import { Logo } from "./logo";
import { PlaneRaycast } from "./plane-raycast";

export const Scene = () => {
  return (
    <group>
      <PlaneRaycast />
      <Logo />
    </group>
  );
};
