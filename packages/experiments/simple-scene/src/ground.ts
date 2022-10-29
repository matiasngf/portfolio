import { Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry } from "three";

export const ground = new Mesh( new PlaneGeometry( 100, 100 ), new MeshBasicMaterial( { color: 0xcccccc } ) );
ground.rotation.x = - Math.PI / 2;