import { ProjectLoader } from "../../../components/project-loader";

import { GetServerSideProps } from "next";
import { projectsConfig } from "../../../utils/projects-config";
import { NextSeo } from "next-seo";
import { PostRenderer } from "../../../components/posts/PostRenderer";
import React from "react";

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

  if(!config.post) {
    return {
      redirect: {
        permanent: false,
        destination: `/projects/${projectKey}`,
      }
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
  const project = projectsConfig[projectKey];
  const { post } = project;
  return (
    <>
      <NextSeo
        title={name}
        description={description}
      />
      {post ? (
        <div className="container max-w-screen-md">
          <PostRenderer post={post} />
        </div>
      )
        :
        <ProjectLoader projectKey={projectKey} />
      }
    </>
  );
}

