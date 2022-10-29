import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";

const size = 0.7;
const geometry = new BoxGeometry( size, size, size);
const material = new MeshBasicMaterial( { color: 0x0000ff } );
export const cube = new Mesh( geometry, material );

cube.position.set(0, -size, 0)