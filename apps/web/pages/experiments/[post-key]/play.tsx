import { ProjectLoader } from "@/components/project-loader";

import { GetStaticPaths, GetStaticProps } from "next";
import { projectsConfig } from "@/utils/projects-config";
import { NextSeo } from "next-seo";

interface PageProps {
  experimentKey: string;
  name: string;
  description: string;
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const experimentKey = context.params?.['post-key'] as string;
  if(!(experimentKey in projectsConfig)) {
    return {
      notFound: true,
    }
  }

  if(projectsConfig[experimentKey].type !== 'experiment') {
    return {
      notFound: true,
    }
  }

  const config = projectsConfig[experimentKey];

  return {
    props: {
      experimentKey,
      name: config.name,
      description: config.description,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(projectsConfig)
    .filter((key) => projectsConfig[key].type === 'experiment')
    .map((key) => ({params: { 'post-key': key }}));

  return {
    paths,
    fallback: false,
  }
}

export default function Page({experimentKey, name, description}: PageProps) {
  return (
    <>
      <NextSeo
        title={name}
        description={description}
      />
      <ProjectLoader projectKey={experimentKey} />
    </>
  );
}

