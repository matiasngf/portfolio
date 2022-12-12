import { Group, Mesh, MeshPhongMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { LavaMaterial } from './lava-shader';

const loader = new GLTFLoader();
const metalMaterial = new MeshPhongMaterial( { color: '#c5f' } )

export const lavaGroup = new Group();
lavaGroup.name = 'lavaGroup';
loader.load('/models/groovy_lava_lamp/scene.gltf', (gltf) => {
  Object.values(gltf.scene.children[0].children[0].children).forEach( (obj) => {
    if(!obj.name.includes('glob') && !obj.name.includes('glass')) {
      const mesh = obj.children[0] as Mesh;
      mesh.material = metalMaterial;
      lavaGroup.add(obj);
      return;
    }
    if(obj.name.includes('glass')) {
      const mesh = obj.children[0] as Mesh;
      mesh.material = LavaMaterial;
      lavaGroup.add(obj);
      return;
    }
  })
})
export const editLavaUniform = (uniformName: string, value: any) => {
  if(LavaMaterial.uniforms[uniformName]) {
    LavaMaterial.uniforms[uniformName].value = value;
  }
}