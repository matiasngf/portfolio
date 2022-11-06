import { faVial } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { ProjectCard } from '../components/project-card';
import { RepoButton } from '../components/repo-button';
import { BaseLayout } from '../layouts/base-layout';
import { projectsConfig } from '../utils/projects-config';

export default function Web() {
  return (
    <BaseLayout>
      <div className='absolute top-4 right-4'>
        <RepoButton />
      </div>
      <div className='container py-32 space-y-8 max-w-4xl'>
        <h2 className='text-4xl space-x-4'>
          <span>Experiments</span>
          <FontAwesomeIcon icon={faVial} />
        </h2>
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
