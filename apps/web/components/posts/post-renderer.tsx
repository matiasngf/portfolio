import { PostContainer } from "./post-container";
import { MDXComponent } from "./types";

export interface PostRendererProps {
  post: MDXComponent;
}

export const PostRenderer = ({ post }: PostRendererProps) => {
  const PostContent = post
  return (
    <PostContainer>
      <PostContent />
    </PostContainer>
  )
}