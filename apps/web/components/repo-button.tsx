import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export const RepoButton = () => (
  <Link href='https://github.com/matiasngf/portfolio' target='_blank'>
    <div className="flex space-x-2 items-center">
      <FontAwesomeIcon icon={faGithub} size='lg' />
      <span>
        matiasngf/portfolio
      </span>
    </div>
  </Link>
)