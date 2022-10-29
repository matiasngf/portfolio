import Link from 'next/link';
import { projectsConfig } from '../utils/projects-config';


export default function Web() {
  return <div>
    {Object.entries(projectsConfig).map(([key, config]) => {
      return(
        <div key={key}>
          <Link href={`/projects/${key}`}>
            <h2>{config.name}</h2>
            <p>{config.description}</p>
          </Link>
        </div>
      )
    }) }
  </div>;
}

