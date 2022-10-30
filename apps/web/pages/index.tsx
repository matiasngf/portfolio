import Link from 'next/link';
import React from 'react';
import { ProjectConfig, projectsConfig } from '../utils/projects-config';
import { TagKey, tags } from '../utils/tags';


const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div className='bg-black min-h-screen text-white'>
      {children}
    </div>
  )
}

interface TagProps {
  tag: TagKey;
}
const Tag = ({tag}:TagProps) => (
  <div className='text-xs p-1 rounded-md border border-slate-50 transition-all hover:bg-slate-800'>
    {tags[tag]}
  </div>
)

interface ProjectItemProps {
  projectKey: string;
  project: ProjectConfig
}
const ProjectItem = ({
  projectKey,
  project
}: ProjectItemProps) => (
  <Link href={`/projects/${projectKey}`}>
    <div className=' space-y-1 text-slate-300 p-4 rounded-md border border-slate-600 hover:scale-105 transition-all'>
      <h2 className='text-lg'>{project.name}</h2>
      <p>{project.description}</p>
      <div className='pt-4 flex flex-wrap space-x-4'>
        {project.tags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
    </div>
  </Link>
)

export default function Web() {
  return (
    <Layout>
      <div className='container py-40 space-y-8 max-w-4xl'>
        <h2 className='text-3xl'>Experiments</h2>
        <div className='space-y-4'>
          {Object.entries(projectsConfig).map(([key, config]) => {
            return(
              <div className='' key={key}>
                <ProjectItem
                  projectKey={key}
                  project={config}
                />
              </div>
            )
          }) }
        </div>
      </div>
   </Layout>
  )
}

