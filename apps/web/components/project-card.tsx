import { ProjectConfig } from '../utils/projects-config';
import Link from "next/link";
import { Tag } from './tag';

export interface ProjectCardProps {
  projectKey: string;
  project: ProjectConfig
}
export const ProjectCard = ({
  projectKey,
  project
}: ProjectCardProps) => (
  <Link href={`/projects/${projectKey}`}>
    <div className=' space-y-1 text-slate-300 p-4 rounded-md border border-slate-800 md:hover:scale-105 transition-all'>
      <h2 className='text-lg font-semibold'>{project.name}</h2>
      <p className='text-slate-400'>{project.description}</p>
      <div className='pt-4 flex flex-wrap space-x-4'>
        {project.tags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
    </div>
  </Link>
)