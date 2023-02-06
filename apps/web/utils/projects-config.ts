import { loadDynamicProject, DynamicProjectLoader } from './load-dynamic-project';
import { TagKey } from './tags';

import RayMarchingSimple from "@/posts/ray-marching-simple/ray-marching-simple.mdx";
import { MDXComponent } from '@/components/posts/types';

type PreviewFormats = typeof import("*.jpg") | typeof import("*.png")

export interface ProjectConfig {
  name: string;
  description: string;
  load: DynamicProjectLoader
  source: string;
  tags: TagKey[]
  post?: MDXComponent;
  preview?: () => Promise<PreviewFormats>;
}

const baseExperiment = 'https://github.com/matiasngf/portfolio/tree/main/packages/experiments'

export interface Projects {
  [key: string]: ProjectConfig;
}

export const projectsConfig: Projects = {
  'experiments-ray-marching-voxels-lava-lamp': {
    name: 'Voxels Lava lamp',
    description: 'Lava lamp with voxels made with ray-marching in a ShaderMaterial.',
    load: loadDynamicProject(() => import('experiments-ray-marching-voxels-lava-lamp')),
    source: `${baseExperiment}/ray-marching/voxels-lava-lamp`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'experiments-ray-marching-ambient-occlusion': {
    name: 'Ambient occlusion',
    description: 'Real time ambient-occlusion with ray-marching.',
    load: loadDynamicProject(() => import('experiments-ray-marching-ambient-occlusion')),
    source: `${baseExperiment}/ray-marching/ambient-occlusion`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-voxels': {
    name: 'Voxels',
    description: 'Voxels renderer made with ray-marching.',
    load: loadDynamicProject(() => import('experiments-ray-marching-voxels')),
    source: `${baseExperiment}/ray-marching/voxels`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-reflections': {
    name: 'Real time reflections',
    description: 'Reflections calculated using ray-marching on real time.',
    load: loadDynamicProject(() => import('experiments-ray-marching-reflections')),
    source: `${baseExperiment}/ray-marching/reflections`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-boolean-opeartions': {
    name: 'Boolean operations',
    description: 'Operations with objetcs in a ray-marching renderer.',
    load: loadDynamicProject(() => import('experiments-ray-marching-boolean-opeartions')),
    source: `${baseExperiment}/ray-marching/boolean-operations`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-simple': {
    name: 'Ray-marching renderer',
    description: 'Base setup for a ray marching renderer.',
    preview: () => import("../posts/ray-marching-simple/preview.png"),
    post: RayMarchingSimple,
    load: loadDynamicProject(() => import('experiments-ray-marching-simple')),
    source: `${baseExperiment}/ray-marching/simple`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'simple-scene': {
    name: 'ThreeJS simple scene',
    description: 'A simple scene with vanilla three.js.',
    load: loadDynamicProject(() => import('experiments-simple-scene')),
    source: `${baseExperiment}/simple-scene`,
    tags: ['open-gl']
  },
  // 'ray-marching-voxels-campfire': {
  //   name: 'Voxels campfire',
  //   description: 'Dynamic voxel size and render optimizations. (Better to open on desktop)',
  //   load: loadDynamicProject(() => import('experiments-ray-marching-voxels-campfire')),
  //   source: `${baseExperiment}/ray-marching/voxels-campfire`,
  //   tags: ['open-gl', 'shaders', 'ray-marching']
  // }
}
