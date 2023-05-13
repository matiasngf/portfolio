import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ProjectCard } from "../../components/project-card";
import { BaseLayout } from "../../layouts/base-layout";
import { projectsConfig } from "../../utils/projects-config";
import { tags, TagKey } from "../../utils/tags";

interface PageProps {
  tagKey: TagKey;
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const tagKey = context.params?.tag as TagKey;
  if (!(tagKey in tags)) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      tagKey,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(tags).map((key) => ({ params: { tag: key } }));

  return {
    paths,
    fallback: false,
  };
};

export default function Page({ tagKey }: PageProps) {
  const tagName = tags[tagKey];

  return (
    <BaseLayout>
      <div className="container py-40 space-y-8 max-w-4xl">
        <h2 className="text-3xl space-x-4">
          <Link href="/">
            <FontAwesomeIcon icon={faChevronLeft} />
          </Link>
          <span>{tagName}</span>
        </h2>
        <div className="space-y-4">
          {Object.entries(projectsConfig)
            .filter(([_k, c]) => c.tags.includes(tagKey))
            .map(([key, config]) => {
              return (
                <div key={key}>
                  <ProjectCard projectKey={key} project={config} />
                </div>
              );
            })}
        </div>
      </div>
    </BaseLayout>
  );
}
