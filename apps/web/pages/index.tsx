import React from 'react';
import { ProjectCard } from '../components/project-card';
import { projectsConfig } from '../utils/projects-config';

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div className='bg-black min-h-screen text-white'>
      {children}
    </div>
  )
}

export default function Web() {
  return (
    <Layout>
      <div className='container py-40 space-y-8 max-w-4xl'>
        <h2 className='text-3xl'>Experiments</h2>
        <div className='space-y-4'>
          {Object.entries(projectsConfig).map(([key, config]) => {
            return(
              <div className='' key={key}>
                <ProjectCard
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
