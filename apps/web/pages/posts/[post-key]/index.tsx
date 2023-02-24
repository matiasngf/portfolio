import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { projectsConfig } from "@/utils/projects-config";
import { PostRenderer } from "@/components/posts/post-renderer";
import { PostHeader } from "@/components/posts/post-header";

interface PageProps {
  projectKey: string;
  name: string;
  description: string;
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const projectKey = context.params?.['post-key'] as string;
  const project = projectsConfig[projectKey];

  if(!project || project.type !== 'post') {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      projectKey,
      name: project.name,
      description: project.description,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(projectsConfig)
    .filter((key) => projectsConfig[key].type === 'post')
    .map((key) => ({params: { 'post-key': key }}));

  return {
    paths,
    fallback: false,
  }
}

export default function Page({projectKey, name, description}: PageProps) {
  const project = projectsConfig[projectKey];
  const { post } = project;
  return (
    <div className="bg-slate-900 text-white">
      <NextSeo
        title={name}
        description={description}
      />
      <PostHeader projectKey={projectKey} project={project} />
      <div className="container max-w-screen-md">
        {post && <PostRenderer post={post} />}
      </div>
    </div>
  );
}

