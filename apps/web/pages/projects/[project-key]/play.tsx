import { ProjectLoader } from "../../../components/project-loader";

import { GetServerSideProps } from "next";
import { projectsConfig } from "../../../utils/projects-config";
import { NextSeo } from "next-seo";

interface PageProps {
  projectKey: string;
  name: string;
  description: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const projectKey = context.params?.['project-key'] as string;
  if(!(projectKey in projectsConfig)) {
    return {
      notFound: true,
    }
  }

  const config = projectsConfig[projectKey];

  if(!config.load) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      projectKey,
      name: config.name,
      description: config.description,
    }
  }
}

export default function Page({projectKey, name, description}: PageProps) {
  return (
    <>
      <NextSeo
        title={name}
        description={description}
      />
      <ProjectLoader projectKey={projectKey} />
    </>
  );
}

