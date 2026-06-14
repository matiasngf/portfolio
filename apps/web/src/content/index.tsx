import ShadersBasementLogo, {
  tableOfContents as ShadersBasementLogoToc,
} from "./shaders-basement-logo/shaders-basement-logo.mdx";
import ShadersBasementLogoPreview from "./shaders-basement-logo/preview.png";
import ShadersPlants, {
  tableOfContents as ShadersPlantsToc,
} from "./shaders-plants/shaders-plants.mdx";
import ShadersPlantsPreview from "./shaders-plants/preview.png";
import Earth, { tableOfContents as EarthToc } from "./earth/earth.mdx";
import EarthPreview from "./earth/preview.png";
import RayMarchingVoxels, {
  tableOfContents as RayMarchingVoxelsToc,
} from "./ray-marching-voxels/ray-marching-voxels.mdx";
import RayMarchingVoxelsPreview from "./ray-marching-voxels/preview.png";
import CreatingRayMarchingRenderer, {
  tableOfContents as CreatingRayMarchingRendererToc,
} from "./creating-ray-marching-renderer/creating-ray-marching-renderer.mdx";
import CreatingRayMarchingRendererPreview from "./creating-ray-marching-renderer/preview.png";

export interface Heading {
  depth: number;
  value: string;
  id: string;
}

export const Posts = {
  ShadersBasementLogo,
  ShadersPlants,
  Earth,
  RayMarchingVoxels,
  CreatingRayMarchingRenderer,
};

export const Tocs: Record<string, Heading[]> = {
  ShadersBasementLogo: ShadersBasementLogoToc,
  ShadersPlants: ShadersPlantsToc,
  Earth: EarthToc,
  RayMarchingVoxels: RayMarchingVoxelsToc,
  CreatingRayMarchingRenderer: CreatingRayMarchingRendererToc,
};

export const Previews = {
  // posts
  ShadersBasementLogo: ShadersBasementLogoPreview,
  ShadersPlants: ShadersPlantsPreview,
  Earth: EarthPreview,
  CreatingRayMarchingRenderer: CreatingRayMarchingRendererPreview,
  RayMarchingVoxels: RayMarchingVoxelsPreview,
};
