import { ProjectLoader } from "@/components/project-loader";
import { GetStaticPaths, GetStaticProps } from "next";
import { ExperimentConfig, projectsConfig } from "@/utils/projects-config";
import { NextSeo } from "next-seo";

interface PageProps {
  experimentKey: string;
  name: string;
  description: string;
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const experimentKey = context.params?.['post-key'] as string;
  const experiment = projectsConfig[experimentKey];

  if(!experiment || experiment.type !== 'experiment' || !experiment.load) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      experimentKey,
      name: experiment.name,
      description: experiment.description,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(projectsConfig)
    .filter((key) => projectsConfig[key].type === 'experiment' && (projectsConfig[key] as ExperimentConfig).load)
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

