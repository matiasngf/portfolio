import { useEffect, useState } from 'react';
import { ExperimentConfig, projectsConfig } from '@/utils/projects-config';
import { RenderCanvas } from './render-canvas';
import { useMountedState } from 'react-use'
import { DynamicProject } from '../utils/load-dynamic-project';
import { ProjectLayout } from './project-layout';

export interface ProjectLoaderProps {
  projectKey: string;
}

export const ProjectLoader = ({ projectKey }: ProjectLoaderProps) => {
  const project = projectsConfig[projectKey] as any as ExperimentConfig;
  const [canvasEl , setCanvasEl] = useState<HTMLCanvasElement | null>(null)
  const [projectModule, setProjectModule] = useState<DynamicProject | null>(null)

  const isMounted = useMountedState();

  useEffect(() => {
    if(typeof window === "undefined")  return;
    if(!(isMounted())) return;

    if(project && project.load) {
      const loadModule = project.load();
      loadModule.then(module => {
        if(isMounted()) {
          setProjectModule(module)
        }
      })
    }
  }, [isMounted, projectKey, project])

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

  if(!project) return null;
  if(!projectModule || !canvasEl) return null;

  return (
    <ProjectLayout projectKey={projectKey} config={project} >
      <RenderCanvas canvas={canvasEl} />
    </ProjectLayout>
  );
}