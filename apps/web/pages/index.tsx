import Link from 'next/link';
import React from 'react';
import { ProjectCard } from '../components/project-card';
import { BaseLayout } from '../layouts/base-layout';
import { projectsConfig } from '../utils/projects-config';

export default function Web() {
  return (
    <BaseLayout>
      <div className='container py-40 space-y-8 max-w-4xl'>
        <h2 className='text-3xl'>Experiments</h2>
        <p>
          Site under construction. I{"'"}m migrating my projects from{' '}
          <Link href='https://github.com/matiasngf/experiment-3d' target='_blank'>
            <span className='text-blue-400'>this repository</span>
          </Link>.
        </p>
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
   </BaseLayout>
  )
}
