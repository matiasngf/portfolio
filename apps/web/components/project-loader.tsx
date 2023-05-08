import { useEffect, useState } from "react";
import { ExperimentConfig, projectsConfig } from "@/utils/projects-config";
import { RenderCanvas } from "./render-canvas";
import { useMountedState } from "react-use";
import { ProjectLayout } from "./project-layout";

export interface ProjectLoaderProps {
  projectKey: string;
}

export const ProjectLoader = ({ projectKey }: ProjectLoaderProps) => {
  const project = projectsConfig[projectKey] as ExperimentConfig | undefined;

  if (!project) return null;

  return (
    <ProjectLayout projectKey={projectKey} config={project}>
      {project.load && <VanillaProjectLoader projectConfig={project as any} />}
      {project.component && (
        <ReactProjectLoader projectConfig={project as any} />
      )}
    </ProjectLayout>
  );
};

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

interface ReactProjectLoader {
  projectConfig: WithRequiredProperty<ExperimentConfig, "component">;
}

const ReactProjectLoader = ({ projectConfig }: ReactProjectLoader) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    projectConfig.component().then((module) => {
      setComponent(() => module.default);
    });
  }, [projectConfig]);

  if (!Component) return null;

  return (
    <div className="h-screen">
      <Component />
    </div>
  );
};

interface VanillaProjectLoaderProps {
  projectConfig: WithRequiredProperty<ExperimentConfig, "load">;
}

const VanillaProjectLoader = ({ projectConfig }: VanillaProjectLoaderProps) => {
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const isMounted = useMountedState();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMounted()) return;
    projectConfig.load().then((module) => {
      if (isMounted() && module.start) {
        const { canvas, stop } = module.start();
        setCanvasEl(canvas);
        return () => {
          stop();
        };
      }
    });
  }, [isMounted, projectConfig]);

  return <RenderCanvas canvas={canvasEl} />;
};
