export const tags = {
  'open-gl': 'OpenGL',
  'shaders': 'Shaders',
  'ray-marching': 'Ray Marching',
} as const;

export type TagKey = keyof typeof tags;
export type TagName = typeof tags[TagKey];
export const isTag = (tagKey: string): tagKey is TagKey => {
  return tagKey in tags;
}
