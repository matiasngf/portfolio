import React from "react";
import { ExperimentConfig } from "../utils/projects-config";
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { IconButton } from "./icon-button";

interface ProjectLayoutProps {
  projectKey: string;
  config: ExperimentConfig;
}

export const ProjectLayout = ({
  projectKey,
  config,
  children,
}: React.PropsWithChildren<ProjectLayoutProps>) => {
  return (
    <div>
      <IconButton
        icon={faHome}
        href='/'
        className='absolute top-4 left-4'
      />
      <IconButton
        icon={faGithub}
        href={ config.source}
        target='_blank'
        className='absolute bottom-4 left-4'
      />
      {children}
    </div>
  )
}