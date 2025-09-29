import type { Vector2 } from "three";


export const rotateVector2 = (vec: Vector2, angle: number) => {
  const radians = angle * (Math.PI / 180);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const x = vec.x * cos - vec.y * sin;
  const y = vec.x * sin + vec.y * cos;
  vec.set(x, y);
  return vec;
}
