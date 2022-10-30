export const tags = {
  'open-gl': 'OpenGL',
  'shaders': 'Shaders',
  'ray-marching': 'Ray Marching',
} as const;

export type TagKey = keyof typeof tags;
export type TagName = typeof tags[TagKey];