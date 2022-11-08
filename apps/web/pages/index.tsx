import { faVial } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { ProjectCard } from '../components/project-card';
import { RepoButton } from '../components/repo-button';
import { BaseLayout } from '../layouts/base-layout';
import { projectsConfig } from '../utils/projects-config';

import profileUrl from '../assets/fotito.jpg';
import clsx from 'clsx';
import { useScrollPosition } from '../utils/hooks/use-scroll-position';

export default function Web() {
  
  const scrollRef = React.useRef(null);
  const y = useScrollPosition();
  return (
    <BaseLayout>
      <div ref={scrollRef} className={clsx('cool-profile-pic', {'blurred': y > 50})}>
        <Image
          src={profileUrl}
          alt='Profile picture'
          className='grayscale'
          priority
        />
        <div className='absolute w-full top-0 h-full object-cover' style={{background: 'linear-gradient(rgb(255 255 255 / 6%) 5%, rgb(23 171 0 / 12%) 35%, rgb(0, 0, 0) 100%)'}}/>
      </div>
      <div className='absolute top-4 right-4'>
        <RepoButton />
      </div>
      <div className='container pb-32 space-y-8 max-w-4xl relative' style={{paddingTop: '70vw'}}>
        <h2 className='title'>
          <span>EXPERIMENTS</span>
        </h2>
        <div className='space-y-6 text-center'>
          <h3 className='text-2xl'>👋 hi</h3>
          <p>I{"'"}m matias, a front end dev with a background in graphic design and passionate about AI.</p>
          <p>This site contains some web experiments using OpenGl, Webpack, React, Compilers, etc.</p>
          <p>
            I{"'"}l keep adding projects to this site, if you want to see more, chech out my{' '}
            <Link href='https://github.com/matiasngf/' target='_blank'>
              <span className='text-blue-400'>GitHub</span>
            </Link>.
          </p>
        </div>
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
