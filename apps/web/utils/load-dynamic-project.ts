export type DynamicReactProjectLoader = () => Promise<DynamicReactProject>;

export interface DynamicReactProject {
  default: React.ComponentType<any>;
}

export type LoadReactProject = (
  loader: () => Promise<any>
) => DynamicReactProjectLoader;

export const loadReactProject: LoadReactProject = (importFunction) => {
  return importFunction;
};

export type DynamicProjectLoader = () => Promise<DynamicProject>;

export type StartProject = () => {
  canvas: HTMLCanvasElement;
  stop: () => void;
};

export interface DynamicProject {
  start?: StartProject;
}

export type LoadDynamicProject = (
  loader: () => Promise<any>
) => DynamicProjectLoader;

export const loadDynamicProject: LoadDynamicProject = (importFunction) => {
  return importFunction;
};
