import { ProjectLoader } from "../../components/project-loader";

import { useRouter } from 'next/router'


export default function Page() {
  const router = useRouter()
  const projectKey = router.query['project-key'] as string;

  return <ProjectLoader projectKey={projectKey} />;
}

