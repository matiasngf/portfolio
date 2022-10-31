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
    name: 'ThreeJS Simple Scene',
    description: 'A simple scene renderer with vanilla threeJs.',
    load: loadDynamicProject(() => import('experiments-simple-scene')),
    source: `${baseExperiment}/simple-scene`,
    tags: ['open-gl']
  },
  'ray-marching-simple': {
    name: 'Ray Marching Basic',
    description: 'Base setup for ray marching renderer.',
    load: loadDynamicProject(() => import('experiments-ray-marching-simple')),
    source: `${baseExperiment}/ray-marching/simple`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-boolean-opeartions': {
    name: 'Boolean operaions',
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
}
