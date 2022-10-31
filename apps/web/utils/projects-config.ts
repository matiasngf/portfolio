import { loadDynamicProject, DynamicProjectLoader } from './load-dynamic-project';
import { TagKey } from './tags';

export interface ProjectConfig {
  name: string;
  description: string;
  load: DynamicProjectLoader
  tags: TagKey[]
}

export interface Projects {
  [key: string]: ProjectConfig;
}

export const projectsConfig: Projects = {
  'simple-scene': {
    name: 'ThreeJS Simple Scene',
    description: 'A simple scene renderer with vanilla threeJs.',
    load: loadDynamicProject(() => import('experiments-simple-scene')),
    tags: ['open-gl', 'shaders']
  },
  'ray-marching-simple': {
    name: 'Ray Marching Basic',
    description: 'Base ray marching renderer.',
    load: loadDynamicProject(() => import('experiments-ray-marching-simple')),
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-boolean-opeartions': {
    name: 'Boolean operaions',
    description: 'Operations with objetcs in a ray-marching renderer.',
    load: loadDynamicProject(() => import('experiments-ray-marching-boolean-opeartions')),
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-reflections': {
    name: 'Real time reflections',
    description: 'Reflections calculated using ray-marching on real-time.',
    load: loadDynamicProject(() => import('experiments-ray-marching-reflections')),
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
}
