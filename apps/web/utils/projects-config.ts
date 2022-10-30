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
  '1another-scene': {
    name: 'Another Scene',
    description: 'A simple scene renderer',
    load: loadDynamicProject(() => import('experiments-simple-scene')),
    tags: ['open-gl']
  },
}
