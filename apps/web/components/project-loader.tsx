import { useEffect, useState } from 'react';
import { projectsConfig } from '../utils/projects-config';
import { RenderCanvas } from './render-canvas';
import { useMountedState } from 'react-use'
import { DynamicProject } from '../utils/load-dynamic-project';
import { ProjectLayout } from './project-layout';

export interface ProjectLoaderProps {
  projectKey: string;
}

export const ProjectLoader = ({ projectKey }: ProjectLoaderProps) => {
  const [canvasEl , setCanvasEl] = useState<HTMLCanvasElement | null>(null)
  const [projectModule, setProjectModule] = useState<DynamicProject | null>(null)

  const isMounted = useMountedState();

  useEffect(() => {
    if(typeof window === "undefined")  return;
    if(!(isMounted())) return;

    if(projectKey in projectsConfig) {
      const loadModule = projectsConfig[projectKey].load();
      loadModule.then(module => {
        if(isMounted()) {
          setProjectModule(module)
        }
      })
    }
  }, [isMounted, projectKey])

  useEffect(() => {
    if(!projectModule) return;
    if(projectModule.start) {
      const {canvas, stop} = projectModule.start();
      setCanvasEl(canvas)
      return () => {
        stop();
      }
    }
  }, [projectModule])

  if(!projectsConfig[projectKey]) return null;
  if(!projectModule || !canvasEl) return null;

  return (
    <ProjectLayout projectKey={projectKey} config={projectsConfig[projectKey]} >
      <RenderCanvas canvas={canvasEl} />
    </ProjectLayout>
  );
}