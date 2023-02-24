import { loadDynamicProject, DynamicProjectLoader } from './load-dynamic-project';
import { TagKey } from './tags';

import { Posts, Previews } from "@/content";
import { MDXComponent } from '@/components/posts/types';
import { StaticImageData } from 'next/image';

export interface ProjectBaseConfig {
  name: string;
  description: string;
  tags: TagKey[]
  post: MDXComponent;
  preview: StaticImageData;
}

export interface PostConfig extends ProjectBaseConfig {
  type: 'post';
}

export interface ExperimentConfig extends ProjectBaseConfig {
  type: 'experiment';
  load?: DynamicProjectLoader
  source?: string;
}

export type ProjectConfig = PostConfig | ExperimentConfig;

const baseExperiment = 'https://github.com/matiasngf/portfolio/tree/main/packages/experiments'

export interface Projects {
  [key: string]: ProjectConfig;
}

export const projectsConfig: Projects = {
  'experiments-ray-marching-voxels-lava-lamp': {
    type: 'experiment',
    name: 'Voxels Lava lamp',
    description: 'Lava lamp with voxels made with ray-marching in a ShaderMaterial.',
    preview: Previews.RayMarchingVoxelsLavaLamp,
    post: Posts.RayMarchingVoxelsLavaLamp,
    load: loadDynamicProject(() => import('experiments-ray-marching-voxels-lava-lamp')),
    source: `${baseExperiment}/ray-marching/voxels-lava-lamp`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'experiments-ray-marching-ambient-occlusion': {
    type: 'experiment',
    name: 'Ambient occlusion',
    description: 'Real time ambient-occlusion with ray-marching.',
    preview: Previews.RayMarchingAmbientOcclusion,
    post: Posts.RayMarchingAmbientOcclusion,
    load: loadDynamicProject(() => import('experiments-ray-marching-ambient-occlusion')),
    source: `${baseExperiment}/ray-marching/ambient-occlusion`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-voxels': {
    type: 'experiment',
    name: 'Voxels',
    description: 'Voxels renderer made with ray-marching.',
    preview: Previews.RayMarchingVoxels,
    post: Posts.RayMarchingVoxels,
    load: loadDynamicProject(() => import('experiments-ray-marching-voxels')),
    source: `${baseExperiment}/ray-marching/voxels`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-reflections': {
    type: 'experiment',
    name: 'Real time reflections',
    description: 'Reflections calculated using ray-marching on real time.',
    preview: Previews.RayMarchingReflections,
    post: Posts.RayMarchingReflections,
    load: loadDynamicProject(() => import('experiments-ray-marching-reflections')),
    source: `${baseExperiment}/ray-marching/reflections`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-boolean-opeartions': {
    type: 'experiment',
    name: 'Boolean operations',
    description: 'Operations with objetcs in a ray-marching renderer.',
    preview: Previews.RayMarchingBooleanOperations,
    post: Posts.RayMarchingBooleanOperations,
    load: loadDynamicProject(() => import('experiments-ray-marching-boolean-opeartions')),
    source: `${baseExperiment}/ray-marching/boolean-operations`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'ray-marching-simple': {
    type: 'experiment',
    name: 'Ray-marching renderer',
    description: 'Base setup for a ray marching renderer.',
    preview: Previews.RayMarchingSimple,
    post: Posts.RayMarchingSimple,
    load: loadDynamicProject(() => import('experiments-ray-marching-simple')),
    source: `${baseExperiment}/ray-marching/simple`,
    tags: ['open-gl', 'shaders', 'ray-marching']
  },
  'simple-scene': {
    type: 'experiment',
    name: 'ThreeJS simple scene',
    description: 'A simple scene with vanilla three.js.',
    preview: Previews.SimpleScene,
    post: Posts.SimpleScene,
    load: loadDynamicProject(() => import('experiments-simple-scene')),
    source: `${baseExperiment}/simple-scene`,
    tags: ['open-gl']
  },
  // 'ray-marching-voxels-campfire': {
  // type: 'experiment',
  //   name: 'Voxels campfire',
  //   description: 'Dynamic voxel size and render optimizations. (Better to open on desktop)',
  //   load: loadDynamicProject(() => import('experiments-ray-marching-voxels-campfire')),
  //   source: `${baseExperiment}/ray-marching/voxels-campfire`,
  //   tags: ['open-gl', 'shaders', 'ray-marching']
  // }
}
