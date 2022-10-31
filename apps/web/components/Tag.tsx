import { TagKey, tags } from "../utils/tags";

export interface TagProps {
  tag: TagKey;
}
export const Tag = ({tag}:TagProps) => (
  <div className='text-xs p-1 rounded-md border border-slate-50 transition-all hover:bg-slate-800'>
    {tags[tag]}
  </div>
)