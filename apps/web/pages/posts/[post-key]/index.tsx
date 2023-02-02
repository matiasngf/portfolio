import { ProjectLoader } from "../../../components/project-loader";

import { GetServerSideProps } from "next";
import { projectsConfig } from "../../../utils/projects-config";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

interface PageProps {
  projectKey: string;
  name: string;
  description: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const projectKey = context.params?.['post-key'] as string;
  if(!(projectKey in projectsConfig)) {
    return {
      notFound: true,
    }
  }

  const config = projectsConfig[projectKey];

  return {
    props: {
      projectKey,
      name: config.name,
      description: config.description,
    }
  }
}

interface PostRendererProps {
  post: () => Promise<typeof import("*.mdx")>;
}

const PostRenderer = ({ post }: PostRendererProps) => {
  const DynamicComponent = dynamic(post);
  return <DynamicComponent priority={"eager"} />;
}

export default function Page({projectKey, name, description}: PageProps) {
  const { post } = projectsConfig[projectKey];
  return (
    <>
      <NextSeo
        title={name}
        description={description}
      />
      {post ? 
        <PostRenderer post={post} />
        :
        <ProjectLoader projectKey={projectKey} />
      }
    </>
  );
}

