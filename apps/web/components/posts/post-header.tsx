import { ProjectConfig } from "@/utils/projects-config"
import Image from "next/image"
import Link from "next/link"

export interface PostHeaderProps {
  projectKey: string
  project: ProjectConfig
}

export const PostHeader = ({ projectKey, project }: PostHeaderProps) => {
  const { name, preview } = project
  const hasLoad = project.type === 'experiment' && (project.load || project.component)

  return (
    <div className="flex min-h-[400px] items-end relative py-20 text-center">
      {preview && (
        <div className="absolute inset-0">
          <Image
            className="object-cover"
            src={preview}
            fill
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
      )}
      <div className="flex flex-col items-center container relative space-y-7">
        <h1 className="text-4xl font-bold">{name}</h1>
        <div className="flex space-x-7">
          {hasLoad && (
            <div>
              <Link href={`/experiments/${projectKey}/play`}>
                <button>Play project</button>
              </Link>
            </div>
          )}
          {(project.type === 'experiment' && project.source) && (
            <div>
              <Link target="_blank" href={project.source}>
                <button>View source</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )

}