import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ProjectCard } from '../components/project-card';
import { RepoButton } from '../components/repo-button';
import { BaseLayout } from '../layouts/base-layout';
import { projectsConfig } from '../utils/projects-config';

import profileUrl from '../assets/edited-fotito.jpg';
import clsx from 'clsx';
import { useScrollPosition } from '../utils/hooks/use-scroll-position';

export default function Web() {
  
  const scrollRef = React.useRef(null);
  const y = useScrollPosition();
  return (
    <BaseLayout>
      {/* <div ref={scrollRef} className={clsx('cool-profile-pic', {'blurred': y > 120})}>
        <Image
          src={profileUrl}
          alt='Profile picture'
          priority
        />
        <div className='absolute w-full top-0 h-full object-cover' style={{background: 'linear-gradient(rgb(255 255 255 / 6%) 5%, rgb(23 171 0 / 12%) 35%, rgb(0, 0, 0) 100%)'}}/>
      </div> */}
      <div className='index-container'>
        <h2 className='app-title'>
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
