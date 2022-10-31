import Link from "next/link";
import React from "react";
import { ProjectConfig } from "../utils/projects-config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faHome } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

interface ProjectLayoutProps {
  projectKey: string;
  config: ProjectConfig;
}

const BackButton = () => (
  <Link href='/'>
    <div className="top-4 left-4 rounded-md bg-zinc-800 text-white absolute w-10 h-10 flex items-center justify-center">
      <FontAwesomeIcon size="1x" icon={faHome} />
    </div>
  </Link>
)

const GitHubButton = ({ href }: React.PropsWithChildren<{ href: string }>) => (
  <Link href={href} target='_blank'>
    <div className="bottom-4 left-4 rounded-md bg-zinc-800 text-white absolute w-10 h-10 flex items-center justify-center">
      <FontAwesomeIcon size='xl' icon={faGithub} />
    </div>
  </Link>
)

export const ProjectLayout = ({
  projectKey,
  config,
  children,
}: React.PropsWithChildren<ProjectLayoutProps>) => {
  return (
    <div>
      <BackButton />
      <GitHubButton href={config.source} />
      {children}
    </div>
  )
}