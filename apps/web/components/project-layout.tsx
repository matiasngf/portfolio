import React from "react";
import { ExperimentConfig } from "../utils/projects-config";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { IconButton } from "./icon-button";

interface ProjectLayoutProps {
  projectKey: string;
  config: ExperimentConfig;
}

export const ProjectLayout = ({
  config,
  children,
}: React.PropsWithChildren<ProjectLayoutProps>) => {
  return (
    <div>
      {children}
      <IconButton icon={faHome} href="/" className="fixed top-4 left-4" />
      <IconButton
        icon={faGithub}
        href={config.source}
        target="_blank"
        className="fixed bottom-4 left-4"
      />
    </div>
  );
};
