import Link from 'next/link';
import React from 'react';
import { ProjectCard } from '../components/project-card';
import { RepoButton } from '../components/repo-button';
import { BaseLayout } from '../layouts/base-layout';
import { projectsConfig } from '../utils/projects-config';

export default function Web() {
  return (
    <BaseLayout>
      <div className='index-container'>
        <p className='text-primary'>Test</p>
        <h2 className='font-display text-center text-black text-[6rem] tracking-wide text-shadow-line shadow-primary cursor-default'>
          EXPERIMENTS
        </h2>
        <div className='space-y-4 text-center'>
          <h3 className='text-2xl'>👋 hi</h3>
          <p>I{"'"}m matias, a front end dev with a background in graphic design and passionate about AI.</p>
          <p>This site contains web experiments using OpenGl, Webpack, React, Compilers, etc.</p>
          <p>
            I{"'"}ll keep adding projects here, if you want to see more, check out my{' '}
            <Link href='https://github.com/matiasngf/' target='_blank'>
              <span className='text-blue-400'>GitHub</span>
            </Link>.
          </p>
        </div>
        <div className='space-y-4 pt-8'>
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
      <div className='absolute top-4 right-4'>
        <RepoButton />
      </div>
   </BaseLayout>
  )
}
