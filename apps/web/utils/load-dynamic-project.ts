export type DynamicProjectLoader = () => Promise<DynamicProject>;

export type StartProject = () => {
  canvas: HTMLCanvasElement
  stop: () => void
}

export interface DynamicProject {
  start?: StartProject;
}

export type LoadDynamicProject = (loader: () => Promise<any>) => DynamicProjectLoader;

export const loadDynamicProject: LoadDynamicProject = (importFunction) => {
  return importFunction;
}