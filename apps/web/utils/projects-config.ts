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
    load: loadDynamicProject(() => import('simple-scene')),
    tags: ['open-gl', 'shaders']
  },
  'another-scene': {
    name: 'Another Scene',
    description: 'A simple scene renderer',
    load: loadDynamicProject(() => import('simple-scene')),
    tags: ['open-gl']
  },
  '1another-scene': {
    name: 'Another Scene',
    description: 'A simple scene renderer',
    load: loadDynamicProject(() => import('simple-scene')),
    tags: ['open-gl']
  },
}
