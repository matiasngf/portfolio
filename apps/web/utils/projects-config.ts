import { loadDynamicProject, DynamicProjectLoader } from './load-dynamic-project';
import { TagKey } from './tags';

export interface ProjectConfig {
  name: string;
  description: string;
  load: DynamicProjectLoader
  source: string;
  tags: TagKey[]
}

const baseExperiment = 'https://github.com/matiasngf/portfolio/tree/main/packages/experiments'

export interface Projects {
  [key: string]: ProjectConfig;
}

export const projectsConfig: Projects = {
  'simple-scene': {
    name: 'ThreeJS simple scene',
    description: 'A simple scene with vanilla three.js.',
    load: loadDynamicProject(() => import('experiments-simple-scene')),
    source: `${baseExperiment}/simple-scene`,
    tags: ['open-gl']
  },
  'ray-marching-simple': {
    name: 'Ray-marching renderer',
    description: 'Base setup for a ray marching renderer.',
    load: loadDynamicProject(() => import('experiments-ray-marching-simple')),
    source: `${baseExperiment}/ray-marching/simple`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-boolean-opeartions': {
    name: 'Boolean operations',
    description: 'Operations with objetcs in a ray-marching renderer.',
    load: loadDynamicProject(() => import('experiments-ray-marching-boolean-opeartions')),
    source: `${baseExperiment}/ray-marching/boolean-operations`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-reflections': {
    name: 'Real time reflections',
    description: 'Reflections calculated using ray-marching on real time.',
    load: loadDynamicProject(() => import('experiments-ray-marching-reflections')),
    source: `${baseExperiment}/ray-marching/reflections`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-voxels': {
    name: 'Voxels',
    description: 'Voxels renderer made with ray-marching.',
    load: loadDynamicProject(() => import('experiments-ray-marching-voxels')),
    source: `${baseExperiment}/ray-marching/voxels`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-voxels-campfire': {
    name: 'Voxels campfire',
    description: 'Dynamic voxel size and render optimizations. (Better to open on desktop)',
    load: loadDynamicProject(() => import('experiments-ray-marching-voxels-campfire')),
    source: `${baseExperiment}/ray-marching/voxels-campfire`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  }
}
