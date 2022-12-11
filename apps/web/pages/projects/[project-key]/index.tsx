import { GetServerSideProps } from "next";
import { projectsConfig } from "../../../utils/projects-config";
import { NextSeo } from "next-seo";
import { BaseLayout } from "../../../layouts/base-layout";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

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

  return {
    props: {
      projectKey,
      name: config.name,
      description: config.description,
    }
  }
}

export default function Page({projectKey, name, description}: PageProps) {
  const projectConfig = projectsConfig[projectKey];
  return (
    <BaseLayout>
      <NextSeo
        title={name}
        description={description}
      />
      <div className="container max-w-2xl py-32">
        <div className="space-y-6">
          <h2 className="text-4xl">{name}</h2>
          <p>{description}</p>
          {typeof projectConfig.load === 'function' && (
            <div>
              <Link href={`/projects/${projectKey}/play`}>
                <button className="bg-green-600 px-6 py-2 space-x-2 flex items-center">
                  <span>
                    Play
                  </span>
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}

