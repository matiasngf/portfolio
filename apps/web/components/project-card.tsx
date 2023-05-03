import { ProjectConfig } from '../utils/projects-config';
import Link from "next/link";
import { Tag } from './tag';
import Image from 'next/image';

const getLink = (project: ProjectConfig, projectKey: string) => (
  project.type === 'experiment' ? `/experiments/${projectKey}` : `/posts/${projectKey}`
)

export interface ProjectCardProps {
  projectKey: string;
  project: ProjectConfig
}

export const ProjectCard = ({
  projectKey,
  project
}: ProjectCardProps) => (
  <Link href={getLink(project, projectKey)}>
    <div className='bg-black space-y-1 text-slate-300 rounded-md border border-slate-800 transition-all md:hover:border-[#FF00B8] overflow-hidden'>
      <div className='flex flex-col items-stretch md:flex-row'>
        <div className='aspect-video relative shrink-0 mb-2 md:w-40 md:aspect-auto md:h-auto md:mb-0 md:ml-4 md:order-2'>
          <Image
            fill
            style={{objectFit: 'cover'}}
            src={project.preview}
            alt={project.name}
          />
        </div>
        <div className='p-6 grow'>
          <h2 className='text-2xl font-normal'>{project.name}</h2>
          <p className='text-slate-400'>{project.description}</p>
          <div className='pt-4 flex flex-wrap space-x-4'>
            {project.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </Link>
)