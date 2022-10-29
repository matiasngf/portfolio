import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from "three";

const material = new LineBasicMaterial( { color: 0xf000f0 } );

const size = 1.7;

const points = []
points.push(new Vector3(-size, 0, 0));
points.push(new Vector3(0, size, 0));
points.push(new Vector3(size, 0, 0));
points.push(new Vector3(0, -size, 0));
points.push(new Vector3(-size, 0, 0));
const geometry = new BufferGeometry().setFromPoints(points);

export const line = new Line(geometry, material);