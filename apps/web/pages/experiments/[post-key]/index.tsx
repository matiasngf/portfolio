import { GetServerSideProps } from "next";
import { projectsConfig } from "../../../utils/projects-config";
import { NextSeo } from "next-seo";
import { PostRenderer } from "../../../components/posts/post-renderer";
import React from "react";
import { PostHeader } from "@/components/posts/post-header";

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

  if(projectsConfig[projectKey].type !== 'experiment') {
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

