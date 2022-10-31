import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProjectCard } from "../../components/project-card";
import { BaseLayout } from "../../layouts/base-layout"
import { projectsConfig } from "../../utils/projects-config";
import { tags, isTag } from "../../utils/tags";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tagKey = context.params?.tag as string;
  if(!(tagKey in tags)) {
    return {
      notFound: true,
    }
  }
  return {
    props: {}
  }
}


export default function Page() {

  const router = useRouter()
  const tagKey = router.query['tag'] as string;
  if(!isTag(tagKey)) {
    return null
  }

  const tagName = tags[tagKey];

  return (
    <BaseLayout>
      <div className='container py-40 space-y-8 max-w-4xl'>
        <h2 className='text-3xl space-x-4'>
          <Link href='/'>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Link>
          <span>{tagName}</span>
        </h2>
        <div className='space-y-4'>
          {Object.entries(projectsConfig).filter(([k,c]) => c.tags.includes(tagKey)).map(([key, config]) => {
            return(
              <div key={key}>
                <ProjectCard
                  projectKey={key}
                  project={config}
                />
              </div>
            )
          }) }
        </div>
      </div>
   </BaseLayout>
  )
}