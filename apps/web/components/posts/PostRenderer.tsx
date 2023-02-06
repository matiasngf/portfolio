import { PostContainer } from "./PostContainer";
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