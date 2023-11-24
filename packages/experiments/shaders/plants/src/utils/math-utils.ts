import { Color, Vector3 } from "three";

export const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
}

export const hexToVec3 = (hex: string) => {
  const color = new Color(hex)
  return new Vector3(color.r, color.g, color.b)
}

export const valueRemap = (value: number, min: number, max: number, newMin: number, newMax: number) =>
  newMin + (newMax - newMin) * (value - min) / (max - min)

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)