import { LoadDynamicProject, loadDynamicProject } from './load-dynamic-project';

export interface ProjectConfig {
  name: string;
  description: string;
  load: LoadDynamicProject
}

export const projectsConfig = {
  'simple-scene': {
    name: 'Simple Scene',
    description: 'A simple scene renderer',
    load: loadDynamicProject(() => import('simple-scene')),
  }
}
