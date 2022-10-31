import Link from "next/link";
import React from "react";
import { ProjectConfig } from "../utils/projects-config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faHome } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { IconButton } from "./icon-button";

interface ProjectLayoutProps {
  projectKey: string;
  config: ProjectConfig;
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
        iconSize='1x'
        href='/'
        className='absolute top-4 left-4'
      />
      <IconButton
        icon={faGithub}
        iconSize='xl'
        href={config.source}
        target='_blank'
        className='absolute bottom-4 left-4'
      />
      {children}
    </div>
  )
}