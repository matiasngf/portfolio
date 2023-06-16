import { Color, Vector3 } from "three";

export const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
}

export const hexToVec3 = (hex: string) => {
  const color = new Color(hex)
  return new Vector3(color.r, color.g, color.b)
}