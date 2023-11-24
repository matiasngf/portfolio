import { Line, LineSegments } from "three";

export interface DebugLineProps {
  segments: Line | LineSegments;
  color?: string;
}

export const DebugLine = ({ segments, color = "red" }: DebugLineProps) => {
  return (
    <primitive object={segments}>
      <lineBasicMaterial depthTest={false} color={color} linewidth={2} />
    </primitive>
  );
};
