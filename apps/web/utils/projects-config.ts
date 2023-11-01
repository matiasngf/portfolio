import {
  loadDynamicProject,
  DynamicProjectLoader,
  DynamicReactProjectLoader,
  loadReactProject,
} from "./load-dynamic-project";
import { TagKey } from "./tags";

import { Posts, Previews } from "@/content";
import { MDXComponent } from "@/components/posts/types";
import { StaticImageData } from "next/image";

export interface ProjectBaseConfig {
  name: string;
  description: string;
  tags: TagKey[];
  post: MDXComponent;
  preview: StaticImageData;
  noIdex?: boolean;
}

export interface PostConfig extends ProjectBaseConfig {
  type: "post";
}

export interface ExperimentConfig extends ProjectBaseConfig {
  type: "experiment";
  load?: DynamicProjectLoader;
  source?: string;
  component?: DynamicReactProjectLoader;
}

export type ProjectConfig = PostConfig | ExperimentConfig;

const baseExperiment =
  "https://github.com/matiasngf/portfolio/tree/main/packages/experiments";

export interface Projects {
  [key: string]: ProjectConfig;
}

export const projectsConfig: Projects = {
  'shaders-plants': {
    type: "experiment",
    name: "Procedural plants",
    description: "Creating procedural plants with shaders.",
    component: loadReactProject(() => import("experiments-shaders-plants")),
    preview: Previews.ShadersPlants,
    post: Posts.ShadersPlants,
    source: `${baseExperiment}/shaders/plants`,
    tags: ["shaders", "rtf", "procedural"],
    noIdex: true,
  },
  'shaders-basement-logo': {
    type: "experiment",
    name: "Dissolve effect",
    description: "Dissolve effect with shaders.",
    component: loadReactProject(() => import("experiments-shaders-basement-logo")),
    preview: Previews.ShadersBasementLogo,
    post: Posts.ShadersBasementLogo,
    source: `${baseExperiment}/shaders/basement-logo`,
    tags: ["shaders", "rtf"],
    noIdex: true,
  },
  'shaders-fluid': {
    type: "experiment",
    name: "3D fluid shader",
    description: "Ray marching fluid simulation with shaders.",
    component: loadReactProject(() => import("experiments-shaders-fluid")),
    preview: Previews.ShadersFluid,
    post: Posts.ShadersFluid,
    source: `${baseExperiment}/shaders/fluid`,
    tags: ["shaders", "rtf", "ray-marching"],
  },
  'html-shaders-track-images': {
    type: "experiment",
    name: "HTML images to shaders",
    description: "Track an image element and use it as a texture in a Canvas with ThreeJs.",
    component: loadReactProject(() => import("experiments-html-shaders-track-images")),
    preview: Previews.HtmlShadersTrackImages,
    post: Posts.HtmlShadersTrackImages,
    source: `${baseExperiment}/html-shaders/track-images`,
    noIdex: true,
    tags: ["shaders", "rtf"],
  },
  earth: {
    type: "experiment",
    name: "Earth with react-three-fiber",
    description:
      "3D Earth composed with shaders created with @three/fiber and @react-three/drei.",
    component: loadReactProject(() => import("experiments-earth")),
    preview: Previews.Earth,
    post: Posts.Earth,
    source: `${baseExperiment}/earth`,
    tags: ["shaders", "rtf"],
  },
  "creating-ray-marching-renderer": {
    type: "post",
    name: "Creating a ray-marching renderer in Three.js",
    description:
      "How to create a ray-marching renderer from scratch using ThreeJs.",
    preview: Previews.CreatingRayMarchingRenderer,
    post: Posts.CreatingRayMarchingRenderer,
    tags: ["shaders", "ray-marching"],
  },
  "experiments-ray-marching-voxels-lava-lamp": {
    type: "experiment",
    name: "Voxels Lava lamp",
    description:
      "Lava lamp with voxels made with ray-marching in a ShaderMaterial.",
    preview: Previews.RayMarchingVoxelsLavaLamp,
    post: Posts.RayMarchingVoxelsLavaLamp,
    load: loadDynamicProject(
      () => import("experiments-ray-marching-voxels-lava-lamp")
    ),
    source: `${baseExperiment}/ray-marching/voxels-lava-lamp`,
    tags: ["shaders", "ray-marching"],
  },
  "experiments-ray-marching-ambient-occlusion": {
    type: "experiment",
    name: "Ambient occlusion",
    description: "Real time ambient-occlusion with ray-marching.",
    preview: Previews.RayMarchingAmbientOcclusion,
    post: Posts.RayMarchingAmbientOcclusion,
    load: loadDynamicProject(
      () => import("experiments-ray-marching-ambient-occlusion")
    ),
    source: `${baseExperiment}/ray-marching/ambient-occlusion`,
    tags: ["shaders", "ray-marching"],
  },
  "ray-marching-voxels": {
    type: "experiment",
    name: "Voxels",
    description: "Voxels renderer made with ray-marching.",
    preview: Previews.RayMarchingVoxels,
    post: Posts.RayMarchingVoxels,
    load: loadDynamicProject(() => import("experiments-ray-marching-voxels")),
    source: `${baseExperiment}/ray-marching/voxels`,
    tags: ["shaders", "ray-marching"],
  },
  "ray-marching-reflections": {
    type: "experiment",
    name: "Real time reflections",
    description: "Reflections calculated using ray-marching on real time.",
    preview: Previews.RayMarchingReflections,
    post: Posts.RayMarchingReflections,
    load: loadDynamicProject(
      () => import("experiments-ray-marching-reflections")
    ),
    source: `${baseExperiment}/ray-marching/reflections`,
    tags: ["shaders", "ray-marching"],
  },
  "ray-marching-boolean-opeartions": {
    type: "experiment",
    name: "Boolean operations",
    description: "Operations with objetcs in a ray-marching renderer.",
    preview: Previews.RayMarchingBooleanOperations,
    post: Posts.RayMarchingBooleanOperations,
    load: loadDynamicProject(
      () => import("experiments-ray-marching-boolean-opeartions")
    ),
    source: `${baseExperiment}/ray-marching/boolean-operations`,
    tags: ["shaders", "ray-marching"],
  },
  "ray-marching-simple": {
    type: "experiment",
    name: "Ray-marching renderer",
    description: "Base setup for a ray marching renderer.",
    preview: Previews.RayMarchingSimple,
    post: Posts.RayMarchingSimple,
    load: loadDynamicProject(() => import("experiments-ray-marching-simple")),
    source: `${baseExperiment}/ray-marching/simple`,
    tags: ["shaders", "ray-marching"],
  },
  "simple-scene": {
    type: "experiment",
    name: "ThreeJS simple scene",
    description: "A simple scene with vanilla three.js.",
    preview: Previews.SimpleScene,
    post: Posts.SimpleScene,
    load: loadDynamicProject(() => import("experiments-simple-scene")),
    source: `${baseExperiment}/simple-scene`,
    tags: [],
  },
  // 'ray-marching-voxels-campfire': {
  // type: 'experiment',
  //   name: 'Voxels campfire',
  //   description: 'Dynamic voxel size and render optimizations. (Better to open on desktop)',
  //   load: loadDynamicProject(() => import('experiments-ray-marching-voxels-campfire')),
  //   source: `${baseExperiment}/ray-marching/voxels-campfire`,
  //   tags: ['shaders', 'ray-marching']
  // }
};
