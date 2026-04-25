import { TagKey } from "./tags";

import { Posts, Previews } from "@/content";
import { MDXComponent } from "@/components/posts/types";
import { StaticImageData } from "next/image";

export interface PostConfig {
  name: string;
  description: string;
  tags: TagKey[];
  post: MDXComponent;
  preview: StaticImageData;
  noIdex?: boolean;
}

export type ProjectConfig = PostConfig;

export interface Projects {
  [key: string]: ProjectConfig;
}

export const projectsConfig: Projects = {
  'shaders-plants': {
    name: "Growing plants with code",
    description: "Exploring the art of digital gardening in Three.js. Grow branches along paths using vertex shaders, and generate procedural branchlets along the way.",
    preview: Previews.ShadersPlants,
    post: Posts.ShadersPlants,
    tags: ["shaders", "rtf", "procedural"],
  },
  'shaders-basement-logo': {
    name: "Dissolve effect",
    description: "Dissolve effect with shaders.",
    preview: Previews.ShadersBasementLogo,
    post: Posts.ShadersBasementLogo,
    tags: ["shaders", "rtf"],
  },
  earth: {
    name: "Earth with react-three-fiber",
    description:
      "3D Earth composed with shaders created with @three/fiber and @react-three/drei.",
    preview: Previews.Earth,
    post: Posts.Earth,
    tags: ["shaders", "rtf"],
  },
  "creating-ray-marching-renderer": {
    name: "Creating a ray-marching renderer in Three.js",
    description:
      "How to create a ray-marching renderer from scratch using ThreeJs.",
    preview: Previews.CreatingRayMarchingRenderer,
    post: Posts.CreatingRayMarchingRenderer,
    tags: ["shaders", "ray-marching"],
  },
  "ray-marching-voxels": {
    name: "Voxels",
    description: "Voxels renderer made with ray-marching.",
    preview: Previews.RayMarchingVoxels,
    post: Posts.RayMarchingVoxels,
    tags: ["shaders", "ray-marching"],
  },
};
