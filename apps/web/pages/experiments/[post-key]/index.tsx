import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { projectsConfig } from "@/utils/projects-config";
import { PostRenderer } from "@/components/posts/post-renderer";
import { PostHeader } from "@/components/posts/post-header";

interface PageProps {
  experimentKey: string;
  name: string;
  description: string;
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const experimentKey = context.params?.['post-key'] as string;
  const experiment = projectsConfig[experimentKey];

  if(!experiment || experiment.type !== 'experiment') {
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
    .filter((key) => projectsConfig[key].type === 'experiment')
    .map((key) => ({params: { 'post-key': key }}));

  return {
    paths,
    fallback: false,
  }
}

export default function Page({experimentKey, name, description}: PageProps) {
  const project = projectsConfig[experimentKey];
  const { post } = project;
  return (
    <div className="">
      <NextSeo
        title={name}
        description={description}
      />
      <PostHeader projectKey={experimentKey} project={project} />
      <div className="container max-w-screen-md">
        {post && <PostRenderer post={post} />}
      </div>
    </div>
  );
}

